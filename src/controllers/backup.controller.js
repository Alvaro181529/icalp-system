const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os"); // Módulo para detectar el sistema operativo
require("dotenv").config(); // Asegúrate de cargar las variables de entorno
const getBackup = (req, res) => {
  const { user } = req.session;
  console.log(user);
  if (!user) return res.redirect("/");
  res.render("config/backup", { title: "Cursos", user });
};
const getBackups = (req, res) => {
  const backupDir = path.join(__dirname, "..", "backups");

  // Verificamos si la carpeta existe
  if (!fs.existsSync(backupDir)) {
    return res.status(404).json({ message: "No se encontraron backups" });
  }

  // Leer los archivos de la carpeta
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Hubo un error al leer los archivos de backup",
          error: err,
        });
    }

    // Filtrar los archivos para solo obtener los archivos .sql
    const sqlFiles = files.filter((file) => file.endsWith(".sql"));

    // Si no hay archivos .sql, respondemos que no hay backups
    if (sqlFiles.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron archivos de backup" });
    }

    // Obtener la información del archivo: nombre y fecha de creación
    const backupsInfo = sqlFiles.map((file) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath); // Obtener metadatos del archivo
      return {
        name: file,
        createdAt: stats.mtime, // Fecha de última modificación
        filePath: filePath, // Ruta completa del archivo
      };
    });

    // Ordenar los archivos por fecha de creación (de más reciente a más antiguo)
    backupsInfo.sort((a, b) => b.createdAt - a.createdAt);

    // Enviar la lista de backups con sus fechas de creación
    res.status(200).json({ backups: backupsInfo });
  });
};

// Función para realizar el backup de la base de datos
const backupDatabase = (req, res) => {
  // Recuperar las variables de entorno
  const dbUser = process.env.USER_DATABASE || "root"; // El usuario es root por defecto en XAMPP
  const dbPassword = process.env.PASSWORD || ""; // Si no tienes contraseña, lo dejamos vacío
  const dbHost = process.env.HOST || "localhost"; // Asumiendo que usas localhost
  const dbPort = process.env.PORT_DB || "3306"; // El puerto por defecto de MySQL
  const dbName = process.env.DATABASE; // El nombre de la base de datos

  // Carpeta para guardar el backup
  const backupDir = path.join(__dirname, "..", "backups");

  // Asegurándonos de que la carpeta de backups exista
  const fs = require("fs");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // Nombre dinámico del archivo de backup con timestamp
  const backupFile = path.join(backupDir, `backup_${Date.now()}.sql`);

  // Determinar el sistema operativo
  const platform = os.platform(); // Puede ser 'win32' para Windows o 'linux' para Linux
  const isMariaDB = process.env.DATABASE_TYPE === "mariadb"; // Verifica si se está usando MariaDB

  let command;

  // Si es Windows (win32)
  if (platform === "win32") {
    const mysqldumpPath = "C:\\xampp\\mysql\\bin\\mysqldump.exe"; // Ruta de mysqldump en XAMPP en Windows
    command = `${mysqldumpPath} -h ${dbHost} -u ${dbUser}`;

    // Si hay una contraseña, se agrega al comando
    if (dbPassword) {
      command += ` -p${dbPassword}`;
    }

    command += ` --port=${dbPort} ${dbName} > ${backupFile}`;
  } else if (platform === "linux") {
    // Si es Linux, verificamos si usamos MariaDB
    if (isMariaDB) {
      // Si estamos usando MariaDB, usamos mariadb-dump en lugar de mysqldump
      command = `mariadb-dump -h ${dbHost} -u ${dbUser}`;
    } else {
      // Si usamos MySQL, usamos mysqldump
      command = `mysqldump -h ${dbHost} -u ${dbUser}`;
    }

    // Si hay una contraseña, se agrega al comando
    if (dbPassword) {
      command += ` -p${dbPassword}`;
    }

    command += ` --port=${dbPort} ${dbName} > ${backupFile}`;
  } else {
    return res.status(500).json({ message: "Sistema operativo no soportado." });
  }

  console.log(`Ejecutando comando: ${command}`);

  // Ejecutar el comando
  exec(command, (error, stdout, stderr) => {
    // if (error) {
    //   console.error(`Error al crear el backup: ${error.message}`);
    //   return res.status(500).json({ message: 'Hubo un error al crear el backup', error: error.message });
    // }
    // if (stderr) {
    //   console.error(`stderr: ${stderr}`);
    //   return res.status(500).json({ message: 'Hubo un error al crear el backup', stderr });
    // }

    // console.log(`Backup exitoso: ${stdout}`);
    // Responder con la ubicación del archivo generado
    res.json({
      message: "Backup realizado con éxito",
      backupFile: backupFile, // Ruta completa donde se guardó el backup
    });
  });
};

module.exports = { backupDatabase, getBackups,getBackup };
