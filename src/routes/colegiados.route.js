import { Router } from "express";
import { ColegiadoController } from "../controllers/colegiado.controller.js";
import { upload } from "../utils/multier.utils.js";
export const router = Router();
const colegiado = new ColegiadoController();
// rutas para la pagina de colegiado
router.get("/colegiados", colegiado.getColegiados);
router.get("/colegiado/dia", colegiado.getColegiadosAlDia);
router.get("/colegiado/gestion", colegiado.getColegiadosGestion);
router.get("/colegiado/provicion", colegiado.getColegiadosProvicion);
router.get("/colegiado/:id", colegiado.getColegiado);
// rutas para la api de colegiado
router.get("/collegiate", colegiado.getCollegiates);
router.get("/collegiate/:id/pdf", colegiado.getCollegiatesPdf);
router.get("/collegiate/day", colegiado.getCollegiateByDay);
router.get("/collegiate/years", colegiado.getCollegiateByYears);
router.get("/collegiate/provition", colegiado.getCollegiateByProvition);
router.get("/collegiate/:id", colegiado.getCollegiate);
router.post("/collegiate", colegiado.postCollegiate);
router.patch("/collegiate/:id", colegiado.patchCollegiate);
router.patch("/collegiate/upload/:id",upload.single('file'), colegiado.patchUploads);
router.delete("/collegiate/:id", colegiado.deleteCollegiate);
