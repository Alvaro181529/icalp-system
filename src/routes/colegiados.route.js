import { Router } from "express";
import { ColegiadoController } from "../controllers/colegiado.controller.js";
import { upload } from "../utils/multier.utils.js";
import { checkRole } from "../utils/checkRoles.utils.js";
export const router = Router();
const colegiado = new ColegiadoController();
// rutas para la pagina de colegiado
router.get("/colegiados", checkRole(["Administrador","Cobrador"]), colegiado.getColegiados);
router.get("/colegiado/dia", checkRole(["Administrador","Cobrador"]), colegiado.getColegiadosAlDia);
router.get("/colegiado/gestion",checkRole(["Administrador"]), colegiado.getColegiadosGestion);
router.get("/colegiado/provicion", checkRole(["Administrador"]),colegiado.getColegiadosProvicion);
router.get("/colegiado/:id", checkRole(["Administrador","Cobrador"]),colegiado.getColegiado);
// rutas para la api de colegiado
router.get("/collegiate", checkRole(["Administrador","Cobrador"]),colegiado.getCollegiates);
router.get("/collegiate/:id/pdf",checkRole(["Administrador","Cobrador"]), colegiado.getCollegiatesPdf);
router.get("/collegiate/day", checkRole(["Administrador","Cobrador"]),colegiado.getCollegiateByDay);
router.get("/collegiate/years", checkRole(["Administrador"]),colegiado.getCollegiateByYears);
router.get("/collegiate/provition",checkRole(["Administrador"]), colegiado.getCollegiateByProvition);
router.get("/collegiate/:id", checkRole(["Administrador","Cobrador","Colegiados"]),colegiado.getCollegiate);
router.post("/collegiate", checkRole(["Administrador","Cobrador"]),colegiado.postCollegiate);
router.patch("/collegiate/:id", checkRole(["Administrador","Cobrador"]),colegiado.patchCollegiate);
router.patch("/collegiate/upload/:id",checkRole(["Administrador","Cobrador"]),upload.single('file'), colegiado.patchUploads);
router.delete("/collegiate/:id", checkRole(["Administrador","Cobrador"]),colegiado.deleteCollegiate);
