import pool from "../../config/db.connect.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
export class UsersModel {
  getUsers = async (query) => {
    const { search, page = 1, size = 10 } = query;
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
  patchUsers = async (body,userId) => {
    const {  user, email, password, confirmedPassword } = body;
    console.log(body);
    const saltRounds = 10;
    const validationError = validate(email, password, confirmedPassword, user);
    if (validationError) {
      return validationError; // Retorna error de validación
    }

    try {
      // Si se proporcionó una nueva contraseña, validarla
      if (password !== confirmedPassword) {
        return { message: "Las contraseñas no coinciden." };
      }

      let hashedPassword;
      if (password) {
        console.log(userId);
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      // Fecha de actualización
      const updateDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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
      const salt = bcrypt.genSaltSync(saltRounds);

      // Si no se proporciona una nueva contraseña, solo actualizamos los otros campos
      if (!hashedPassword) {
        await pool.query(updateQuery, [
          user,
          email,
          email.toLowerCase(),
          null, // Sin cambio en la contraseña
          null, // Sin cambio en la sal de la contraseña
          updateDate,
          userId,
        ]);
      } else {
        console.log(hashedPassword);
        console.log(salt);
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
      console.error(error);
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
