import pool from "../../config/db.connect.js";

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
  patchUsers = async (query) => {};
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
