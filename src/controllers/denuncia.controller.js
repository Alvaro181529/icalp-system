// const DenunciaModel = require("../models/denuncia.model.js");

// const denuncia = new DenunciaModel();

// class DenunciaController {
//   async getDenunciaPage(req, res) {
//     const { user } = req.session;
//     if (user) {
//       res.render("config/denuncias", { title: "Denuncias", user });
//       return;
//     }
//     res.render("auth/login", { title: "Login", user });
//   }
//   async getDenuncia(req, res) {
//     const { page, size, query } = req.query;
//     const result = await denuncia.getDenuncia(page, size, query);
//     res.json(result);
//   }
//   async postDenuncia(req, res) {
//     const result = await denuncia.postDenuncia(req.body, req.file.filename);
//     res.json(result);
//   }
//   async patchDenuncia(req, res) {
//     const { id } = req.params;
//     const result = await denuncia.patchDenuncia(req.body, id);
//     res.json(result);
//   }
// }
// module.exports = { DenunciaController };

const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
const DenunciaModel = require("../models/denuncia.model.js");
const denuncia = new DenunciaModel();
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

class DenunciaController {
  constructor() {
    this.postDenuncia = this.postDenuncia.bind(this);
    this.extractTextFromImage = this.extractTextFromImage.bind(this);
    this.extractTextFromPDF = this.extractTextFromPDF.bind(this);
  }

  getDenunciaPage(req, res) {
    const { user } = req.session;
    if (user) {
      res.render("config/denuncias", { title: "Denuncias", user });
      return;
    }
    res.render("auth/login", { title: "Login", user });
  }

  getDenuncia(req, res) {
    const { page, size, query } = req.query;
    denuncia.getDenuncia(page, size, query).then(result => {
      res.json(result);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  }

  async postDenuncia(req, res) {
    const filePath = path.join(__dirname, "../uploads/denuncias", req.file.filename);
    const fileExt = path.extname(filePath).toLowerCase();

    try {
      let text = '';
      if (fileExt === '.pdf') {
        text = await this.extractTextFromPDF(filePath);
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
        text = await this.extractTextFromImage(filePath);
      } else {
        return res.status(400).json({ message: "Solo se permiten archivos PDF o de imagen" });
      }

      // Llamada a la IA para validar si el contenido es relevante
      const isDenuncia = await chatbot(text);

      if (isDenuncia === 'true') {
        // Guardar la denuncia en la base de datos si el contenido es relevante
        const result = await denuncia.postDenuncia(req.body, req.file.filename);
        res.json(result);
      } else {
        res.json({ message: isDenuncia });
      }
    } catch (err) {
      console.error("Error al procesar el archivo:", err);
      res.status(500).json({ error: "Error al procesar el archivo", details: err.message });
    }
  }

  extractTextFromImage(imagePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(imagePath)) {
        return reject(new Error("La imagen no existe"));
      }

      const stats = fs.statSync(imagePath);
      if (stats.size === 0) {
        return reject(new Error("El archivo de imagen está vacío"));
      }

      Tesseract.recognize(
        imagePath,
        'spa',
        // { logger: (m) => console.log(m) }
      )
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  extractTextFromPDF(pdfPath) {
    return new Promise((resolve, reject) => {
      const convert = fromPath(pdfPath, {
        density: 100,
        saveFilename: 'denuncia',
        savePath: path.join(__dirname, "../uploads/denuncias")
      });

      convert(1).then((resolvePath) => {
        if (!fs.existsSync(resolvePath.path)) {
          return reject(new Error("La imagen generada no existe"));
        }

        // Procesar la imagen con Tesseract
        this.extractTextFromImage(resolvePath.path)
          .then(resolve)
          .catch(reject);
      })
      .catch((err) => {
        reject("Error al convertir el PDF a imagen: " + err);
      });
    });
  }

  patchDenuncia(req, res) {
    const { id } = req.params;
    denuncia.patchDenuncia(req.body, id).then(result => {
      res.json(result);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  }
}

// Mover chatbot fuera de la clase
async function chatbot(userMessage) {
  try {
    if (!userMessage) {
      throw new Error("Mensaje vacío");
    }

    console.log("userMessage:", userMessage);  // Mostrar el mensaje correctamente

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `De acuerdo con el siguiente mensaje, analiza el contenido si el documento tiene palabras de términos legales, nombres o que mencione un posible delito (agresión física y robo) o algun tipo de delito en su mayoria, etc dame un true, solo usa la palabra true si es correcto y si es no es dime el porque no puede ser considerado un documento valido de manera sencilla: ${userMessage}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al llamar a la API de Gemini: ${errorText}`);
    }

    const data = await response.json();

    // Validación de la estructura de la respuesta
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("No se pudo procesar la respuesta correctamente.");
    }

    const botMessage = data.candidates[0].content.parts[0].text;
    console.log("Respuesta del bot:", botMessage);  // Para ver lo que respondió Gemini

    // Verificar si la respuesta contiene "true" o "false"
    if (botMessage.toLowerCase().includes('true')) {
      return 'true';
    } else {
      return botMessage;
    }
    
  } catch (error) {
    console.error("Error al interactuar con Gemini:", error);
    throw new Error("Hubo un error al procesar el mensaje.");
  }
}

module.exports = { DenunciaController };
