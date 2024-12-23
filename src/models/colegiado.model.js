import pool from "../../config/db.connect.js";

export class ColegiadoModel {
    getUsers = async (query) => {
        const { search, page = 1, size = 10 } = query;
        const limit = parseInt(size);
        const offset = (page - 1) * size;
        let baseQuery = `
            SELECT * FROM Colegiados
            WHERE 1 = 1
        `;
        let queryParams = [];

        if (search) {
            baseQuery += `
                AND (Nombres LIKE ? 
                OR UsuarioRegistro LIKE ? 
                OR Matricula LIKE ? 
                OR Correo LIKE ?
                OR NumeroCI LIKE ?)
            `;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        let countQuery = `
        SELECT COUNT(*) as total FROM Colegiados
        WHERE 1 = 1
    `;
        let countParams = [...queryParams];
        if (search) {
            countQuery += `
                AND (Nombres LIKE ? 
                OR UsuarioRegistro LIKE ? 
                OR Matricula LIKE ? 
                OR Correo LIKE ?
                OR NumeroCI LIKE ?)
            `;
        }
        baseQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        try {
            const [rows, countResult] = await Promise.all([
                pool.query(baseQuery, queryParams),  // Obtener los usuarios con paginación
                pool.query(countQuery, countParams)  // Obtener el total de registros
            ]);
            const total = countResult[0].total;
            return {
                users: rows,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener los usuarios');
        }
    };
    getUser(query){

    }
    updateUser(query){

    }
    postUser(query){

    }
    deleteUser(query){

    }
}
