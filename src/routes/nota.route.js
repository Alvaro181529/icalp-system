import { Router } from "express";
import { NotaController } from "../controllers/nota.controller.js";
import { checkRole } from "../utils/checkRoles.utils.js";
export const router = Router();
const nota = new NotaController();
// rutas de la pagina auth
router.get("/notas/:id",checkRole(["Administrador","Cobrador"]), nota.getNota);
router.post("/notas/agenda/:id", checkRole(["Administrador","Cobrador"]), nota.postAgenda);
router.post("/notas/diplomado/:id",checkRole(["Administrador","Cobrador"]),  nota.postDiplomado);
