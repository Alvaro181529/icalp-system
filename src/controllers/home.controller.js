import { ColegiadoModel } from "../models/colegiado.model.js"

const colegiado = new ColegiadoModel()
export class HomeController {
    home = async (req, res) => {
        const { user } = req.session

        res.render('index', { title: "ICALP", user })
    }
    search = async (req, res) => {
        try {
            const result = await colegiado.getUsers(req.query)
            res.json({ result})
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios', error })
        }
    }
}