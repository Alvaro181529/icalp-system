const dotenv = require("dotenv");
const { text } = require("express");
dotenv.config();

const fetch = require("node-fetch");  // Usar node-fetch

class ChatController {
  async chatbot(req, res) {
    try {
      const userMessage = req.body.message; // El mensaje enviado por el usuario

      if (!userMessage) {
        return res.status(400).json({ error: "Mensaje vacío" });
      }

      // Crear el cuerpo de la solicitud para la API de Gemini
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text:'Eres ICA, una asistente de inteligencia artificial siempre amable, respetuosa, clara y servicial. Siempre saluda antes de responder y siempre responde en español.'
              },
              {
                text: userMessage,  // El texto del mensaje del usuario
              }
            ],
          },
        ],
      };

      // Realizar la solicitud a la API de Gemini usando fetch
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),  // Convertir el cuerpo a JSON
        }
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al llamar a la API de Gemini: ${errorText}`);
      }

      // Obtener la respuesta en formato JSON
      const data = await response.json();

      // Ahora la respuesta correcta está en `candidates[0].content`
      const botMessage = data.candidates[0].content.parts[0].text;

      // Retornar la respuesta al frontend
      return res.json({ message: botMessage });

    } catch (error) {
      console.error("Error al interactuar con Gemini:", error);
      return res.status(500).json({ error: "Hubo un error al procesar el mensaje." });
    }
  }
}

module.exports = { ChatController };
