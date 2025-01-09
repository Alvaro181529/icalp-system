import { Router } from "express";
import { NotaController } from "../controllers/nota.controller.js";
export const router = Router();
const nota = new NotaController();
// rutas de la pagina auth
router.get("/notas/:id", nota.getNota);
router.post("/notas/agenda/:id", nota.postAgenda);
router.post("/notas/diplomado/:id", nota.postDiplomado);
