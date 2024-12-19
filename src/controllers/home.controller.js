import { ColegiadoModel } from "../models/colegiado.model.js"

export class HomeController {
    home = async (req, res) => {
        const query = req.query.query
        const page = parseInt(req.query.page) || 1;  
        const size = parseInt(req.query.size) || 10; 
        const colegiado = new ColegiadoModel(query,page,size)
        const result = await colegiado.getUser()
        res.json(result)
    }
}