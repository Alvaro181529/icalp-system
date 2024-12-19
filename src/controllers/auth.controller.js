import { AuthModel } from "../models/auth.model.js"

export class AuthController {
    login = (req, res) => { 
        const auth = new AuthModel()
        const result = auth.validateUser("adrian12", "1234")
        console.log(result)
        res.json(result)
    }
    register = (req, res) => { }
    logout = (req, res) => { }
}