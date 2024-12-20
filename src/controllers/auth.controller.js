import { AuthModel } from "../models/auth.model.js"

const auth = new AuthModel()
export class AuthController {
    login= async(req, res)=>{
        res.render('auth/login')
    }
    resgister= async(req,res)=>{
        res.render('auth/register')
    }
    signIn = async (req, res) => {
        const result = await auth.signIn(req.body)
        if (result.token) {
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',  
                maxAge: 24 * 60 * 60 * 1000,  
            });
        }

        res.render("inicio",result);
    }
    signUp = async (req, res) => {
        const result = await auth.signUp(req.body)
        res.render("index",result)
    }
    logout = (req, res) => { }
}