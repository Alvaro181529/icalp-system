export class HomeController {
    home = async (req, res)  => {
        res.render('index');
    }
}