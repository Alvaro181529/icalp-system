import { Router } from "express";
import { ColegiadoController } from "../controllers/colegiado.controller.js";
export const router = Router();
const colegiado = new ColegiadoController();
// rutas para la pagina de colegiado
router.get("/colegiados", colegiado.getColegiados);
router.get("/colegiado/:id", colegiado.getColegiado);
// rutas para la api de colegiado
router.get("/collegiate", colegiado.getCollegiates);
router.get("/collegiate/:id", colegiado.getCollegiate);
router.post("/collegiate", colegiado.postCollegiate);
router.patch("/collegiate/:id", colegiado.patchCollegiate);
router.delete("/collegiate/:id", colegiado.deleteCollegiate);
