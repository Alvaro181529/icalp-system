const pool = require("../../config/db.connect"); // Cambiado de import a require
const bcrypt = require('bcryptjs');
class UsersModel {
  getUsers = async (query) => {
    const { search, page = 1, size = 1000 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;
    let baseQuery = `
          SELECT u.UserId, u.Email, u.User, u.IsApproved, GROUP_CONCAT(r.Name SEPARATOR ', ') AS Roles
          FROM aspnetusers u
          LEFT JOIN aspnetuserroles ur ON ur.UserId = u.UserId
          LEFT JOIN aspnetroles r ON r.RoleId = ur.RoleId
          WHERE 1 = 1
        `;
    let queryParams = [];

    if (search) {
      baseQuery += `
                AND (User LIKE ? 
                OR Email LIKE ? )
            `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    let countQuery = `
        SELECT COUNT(*) as total FROM aspnetusers
        WHERE 1 = 1
    `;
    let countParams = [...queryParams];
    if (search) {
      countQuery += `
                 AND (User LIKE ? 
                OR Email LIKE ? )
            `;
    }
    baseQuery += `
    GROUP BY u.Email, u.User, u.IsApproved
    LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams), // Obtener los usuarios con paginación
        pool.query(countQuery, countParams), // Obtener el total de registros
      ]);
      const total = countResult[0].total;
      return {
        users: rows,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los usuarios");
    }
  };
  getUserCobradores = async (query) => {
    const result = pool.query(
      `SELECT u.Email, u.User, u.IsApproved, GROUP_CONCAT(r.Name SEPARATOR ', ') AS Roles FROM aspnetusers u LEFT JOIN aspnetuserroles ur ON ur.UserId = u.UserId LEFT JOIN aspnetroles r ON r.RoleId = ur.RoleId WHERE r.RoleId = 'c1103424-be2e-11ef-828b-f80dacf23b8a' GROUP BY u.Email, u.User, u.IsApproved`
    );
    return result;
  };
  getRols = async (query) => {
    const result = await pool.query(`SELECT * FROM aspnetroles`);
    return result;
  };
  postUsers = async (query) => {};
  patchRols = async (id, rols) => {
    const result = await pool.query(
      `DELETE FROM aspnetuserroles WHERE UserId = ?`,
      [id]
    );
    for (let i = 0; i < rols.length; i++) {
      await pool.query(
        `INSERT INTO aspnetuserroles SET UserId = ?, RoleId = ?`,
        [id, rols[i]]
      );
    }
    return { result, message: "Roles actualizados" };
  };
  patchUsers = async (body, userId) => {
    const { user, email, password, confirmedPassword } = body;
    console.log(body);

    // Validación de los datos de entrada
    const validationError = validate(email, password, confirmedPassword, user);
    if (validationError) {
      return validationError; // Retorna error de validación
    }

    try {
      // Si se proporcionó una nueva contraseña, validarla
      if (password && password !== confirmedPassword) {
        return { message: "Las contraseñas no coinciden." };
      }

      // Preparar la nueva contraseña (si es proporcionada)
      let hashedPassword = null;
      let salt = null;

      if (password) {
        // Si se proporciona una nueva contraseña, la hasheamos
        hashedPassword = await bcrypt.hash(password, 10);  // Salt de 10 por defecto
        salt = bcrypt.genSaltSync(10);  // Generamos la sal para bcryptjs
      }

      // Fecha de actualización
      const updateDate = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Actualización de los datos del usuario
      const updateQuery = `
        UPDATE aspnetusers 
        SET 
          User = ?, 
          Email = ?, 
          LoweredEmail = ?, 
          PasswordHash = ?, 
          PasswordSalt = ?, 
          CreateDate = ?
        WHERE UserId = ?
      `;

      // Si no se proporciona una nueva contraseña, no actualizamos los campos relacionados con la contraseña
      if (!hashedPassword) {
        await pool.query(updateQuery, [
          user,
          email,
          email.toLowerCase(),
          null,   // No actualizamos la contraseña
          null,   // No actualizamos la sal
          updateDate,
          userId,
        ]);
      } else {
        // Si se proporciona una nueva contraseña, la actualizamos junto con la sal
        await pool.query(updateQuery, [
          user,
          email,
          email.toLowerCase(),
          hashedPassword,
          salt,
          updateDate,
          userId,
        ]);
      }

      return { message: "Usuario actualizado exitosamente.", correo: email };
    } catch (error) {
      console.error("Error al actualizar el usuario: ", error);
      return { message: "Error al actualizar el usuario." };
    }
  };


  removeUsers = async (query) => {
    const result = await pool.query(
      `DELETE FROM aspnetusers WHERE UserId = ?`,
      [query]
    );
    return { result, message: "Usuario eliminado" };
  };
  deleteUsers = async (query) => {
    const result = await pool.query(
      `UPDATE aspnetusers SET IsLockedOut = 1 WHERE Id = ?`,
      [query]
    );
    return result;
  };
  getConsulta = async () => {
    const query = await pool.query();
    return query;
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
module.exports = UsersModel