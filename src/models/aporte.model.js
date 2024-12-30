import { query } from "express";
import pool from "../../config/db.connect.js";

export class AporteModel {
  getAportes = () => {};
  getAportesMensual = async (query) => {
    const { year= new Date().getFullYear() } = query;
    const result = await pool.query(
      `SELECT 
    YEAR(aportes.FechaDeCobro) AS Ano, 
    MONTH(aportes.FechaDeCobro) AS Mes, 
    COUNT(1) AS Cobros, 
    SUM(aportes.Monto) AS Total
FROM 
    aportes
WHERE 
    YEAR(aportes.FechaDeCobro) =?
GROUP BY 
    YEAR(aportes.FechaDeCobro), 
    MONTH(aportes.FechaDeCobro)
ORDER BY 
    Ano DESC, Mes DESC, Cobros DESC;

`,[year]  
    );
    return result;
  };
  getAportesPorCobrador =async (query) => {
    const {year} = query;
    const result = await pool.query(`SELECT DISTINCT 
    YEAR(aportes.FechaDeCobro) AS Ano, 
    MONTH(aportes.FechaDeCobro) AS Mes, 
    aportes.Cobrador, 
    COUNT(1) AS Cobros, 
    SUM(aportes.Monto) AS Total
FROM 
    aportes
    WHERE 
    YEAR(aportes.FechaDeCobro) =?
GROUP BY 
    YEAR(aportes.FechaDeCobro), 
    MONTH(aportes.FechaDeCobro), 
    aportes.Cobrador
ORDER BY 
    Ano DESC, Mes DESC, Cobrador;`, [year])
    return result;
  };
  postAporte = () => {};
  patchAporte = () => {};
  deleteAporte = () => {};
}
