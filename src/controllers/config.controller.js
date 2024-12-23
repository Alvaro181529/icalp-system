export class ConfigController {
    getConfig = async (req, res) => {
        const {user} = req.session
        res.render('config/index',{title: "Configuración", user})
    }
}