import { ColegiadoModel } from "../models/colegiado.model.js";

const colegiado = new ColegiadoModel()
export class HomeController {
    home = async (req, res) => {
        const { user } = req.session
        res.render('index', { user })

    }
    search = async (req, res) => {
        try {
            // Llamamos a la función getUsers y le pasamos los parámetros de la query string
            const result = await colegiado.getUsers(req.query);

            res.json({ result});
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios', error });
        }
    }
}