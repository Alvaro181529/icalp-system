import { conexionData } from "../../config/db.js";

export class ColegiadoModel {
    getUser = async (query , page = 1, size = 10) => {
        const db = await conexionData();

        const result = await db.request().query("SELECT * FROM dbo.Colegiados");

        return result.recordset;
    };
}
