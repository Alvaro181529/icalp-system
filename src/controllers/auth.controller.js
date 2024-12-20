import { AuthModel } from "../models/auth.model.js"

const auth = new AuthModel()
export class AuthController {
    login = async (req, res) => {
        res.render('auth/login')
    }
    resgister = async (req, res) => {
        res.render('auth/register')
    }
    signIn = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'El correo y la contraseña son requeridos.' });
        }
        const result = await auth.signIn(req.body)

        if (!result.correo) {
            return res.status(400).send({ message: result.message });
        }
        if (result.token) {
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            });
        }
        res.send(result);
    }
    signUp = async (req, res) => {
        const result = await auth.signUp(req.body)
        res.send(result)
    }
    logout = (req, res) => {
        res.clearCookie('access_token').json({ message: 'Sesion cerrada' })
    }
}