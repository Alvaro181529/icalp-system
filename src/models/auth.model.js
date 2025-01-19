const pool = require("../../config/db.connect.js");  // Cambiar import a require
const bcrypt = require("bcryptjs");  // Cambiar import a require
const crypto = require("crypto");  // Cambiar import a require
const jwt = require("jsonwebtoken");  // Cambiar import a require

 class AuthModel {
  signIn = async (body) => {
    const { email, password } = body;

    try {
      const result = await pool.query(
        `SELECT u.UserId, u.Email, u.User, u.IsApproved, 
                GROUP_CONCAT(r.Name SEPARATOR ', ') AS Roles, u.PasswordHash
         FROM aspnetusers u
         LEFT JOIN aspnetuserroles ur ON ur.UserId = u.UserId
         LEFT JOIN aspnetroles r ON r.RoleId = ur.RoleId 
         WHERE u.Email = ?
         GROUP BY u.Email, u.User, u.IsApproved, u.PasswordHash`,
        [email]
      );

      if (result.length === 0) {
        return { message: "Usuario no encontrado." };
      }

      const user = result[0];

      if (!user.PasswordHash) {
        return {
          message: "Error interno: El usuario no tiene una contraseña válida.",
        };
      }

      if (!password) {
        return { message: "Contraseña no proporcionada." };
      }

      // Compara la contraseña proporcionada con la contraseña almacenada (PasswordHash)
      const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
      if (!isValidPassword) {
        return { message: "Contraseña incorrecta." };
      }

      // Si es un login exitoso, generamos el token JWT
      const token = jwt.sign(
        {
          userId: user.UserId,
          correo: user.Email,
          roles: user.Roles ? user.Roles.split(", ") : [], // Los roles estarán en el JWT como una lista
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      return {
        message: "Inicio de sesión exitoso.",
        correo: user.Email,
        token,
      };
    } catch (error) {
      console.error("Error en signIn: ", error);
      return { message: "Error al intentar iniciar sesión." };
    }
  };

  signUp = async (body) => {
    const { user, email, password, confirmedPassword } = body;
    const validationError = validate(email, password, confirmedPassword, user);
    if (validationError) {
      return validationError; // Return error from validation
    }
    try {
      const find = await pool.query(
        "SELECT Email FROM aspnetusers WHERE Email = ?",
        [email]
      );
      if (find.length > 0) {
        return { message: "El correo electrónico ya está registrado." };
      }
      if (password !== confirmedPassword) {
        return { message: "Las contraseñas no coinciden." };
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const createDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const createQuery = `
                INSERT INTO aspnetusers (UserId, PasswordHash, PasswordSalt, Email, LoweredEmail, IsApproved, IsLockedOut, CreateDate, User)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
      const userId = crypto.randomUUID();
      const salt = bcrypt.genSaltSync(saltRounds);

      await pool.query(createQuery, [
        userId,
        hashedPassword,
        salt,
        email,
        email.toLowerCase(),
        1,
        0,
        createDate,
        user,
      ]);

      return { message: "Usuario registrado exitosamente.", correo: email };
    } catch (error) {
      console.error("Error en signUp: ", error);
      return { message: "Error al registrar el usuario." };
    }
  };
}

function validate(email, password, confirmedPassword, user) {
  if (!email) return { message: "El email no puede estar vacío." };
  if (!password) return { message: "La contraseña no puede estar vacía." };
  if (!confirmedPassword)
    return {
      message: "La confirmación de la contraseña no puede estar vacía.",
    };
  if (!user) return { message: "El usuario no puede estar vacio" };
  return null;
}
module.exports = AuthModel