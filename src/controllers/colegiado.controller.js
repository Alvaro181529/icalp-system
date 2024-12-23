import { ColegiadoModel } from "../models/colegiado.model.js";
const colegiado = new ColegiadoModel()

export class ColegiadoController {
    getPageColegiado = async (req, res) => {
        const { user } = req.session
        res.render('colegiado', { title: 'Colegiado', user })
    }
    getColegiados = async (req, res) => {
        const result = await colegiado.getUsers(req.query);
        try {
            res.json({ result })
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios', error });
        }
    }
    getColegiado = async (req, res) => {
        res.send("obtener un solo dato")

    }
    postColegiado = async (req, res) => {
        res.send("Agregar el nuevo colegiado")

    }
    patchColegiado = async (req, res) => {
        res.send("Actualizacion del colegiado")
    }
    deleteColegiado = async (req, res) => {
        res.send("eliminar del colegiado")
    }
}