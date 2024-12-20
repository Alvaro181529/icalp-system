import pool from "../../config/db.connect.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto'; 
import jwt from "jsonwebtoken";
export class AuthModel {
    signIn = async (body) => {
        const { email, password } = body;
        try {
            const result = await pool.query("SELECT * FROM aspnetusers WHERE Email = ?", [email]);
            if (result.length === 0) {
                return { message: 'Usuario no encontrado.' };
            }
            const user = result[0];
            const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
            if (!isValidPassword) {
                return { message: 'Contraseña incorrecta.' };
            }
            const token= jwt.sign({userId: user.UserId, correo: user.Email}, process.env.SECRET_KEY, { expiresIn: '1d' });
            
            return { message: 'Inicio de sesión exitoso.', correo: user.Email , token   };
        } catch (error) {
            console.error(error);
            
            return { message: 'Error al intentar iniciar sesión.' };
        }
    }
    signUp = async (body) => {
        const { email, password, confirmedPassword } = body;
        const validationError = validate(email, password, confirmedPassword);
        if (validationError) {
            return validationError; // Return error from validation
        }
        try {
            const find = await pool.query("SELECT Email FROM aspnetusers WHERE Email = ?", [email]);
            if (find.length > 0) {
                return { message: 'El correo electrónico ya está registrado.' };
            }
            if (password !== confirmedPassword) {
                return { message: 'Las contraseñas no coinciden.' };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const createQuery = `
                INSERT INTO aspnetusers (UserId, PasswordHash, PasswordSalt, Email, LoweredEmail, IsApproved, IsLockedOut, CreateDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
                createDate
            ]);

            return { message: 'Usuario registrado exitosamente.' };
        } catch (error) {
            console.error(error);
            return { message: 'Error al registrar el usuario.' };
        }
    }
}
function validate(email, password, confirmedPassword) {
    if (!email) return { message: "El email no puede estar vacío." };
    if (!password) return { message: "La contraseña no puede estar vacía." };
    if (!confirmedPassword) return { message: "La confirmación de la contraseña no puede estar vacía." };
    return null;
}
