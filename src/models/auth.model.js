import { conexionUser } from "../../config/db.js";
import sql from "mssql";
import bcrypt from "bcrypt";

export class AuthModel {
    validateUser = async (username, plainPassword) => {
        try {
            const db = await conexionUser();

            const result = await db.request().input('username', sql.NVarChar, username)
                .query('SELECT * FROM vw_aspnet_MembershipUsers WHERE UserName = @username');
            const user = result.recordset[0];

            if (!user) {
                return { valid: false, message: 'Usuario no encontrado' };
            }

            const storedPassword = user.Password; // O el nombre correcto de la columna
            const match = await bcrypt.compare(plainPassword, storedPassword);

            if (match) {
                return { valid: true, message: 'Usuario autenticado' };
            } else {
                return { valid: false, message: 'Contraseña incorrecta' };
            }
        } catch (err) {
            console.error('Error al validar usuario:', err);
            return { valid: false, message: 'Error en la validación del usuario' };
        }
    };
}
