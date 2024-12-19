import sql from "mssql";

const settingsData = {
    user: "sa",
    password: "admin",
    server: "localhost",
    database: "ph16596582676_icalp",
    // database: "icalp",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}
const settingsUser = {
    user: "sa",
    password: "admin",
    server: "localhost",
    database: "ph16596582676_icalp",
    // database: "icalp",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}

export const conexionData = async () => {
    try {
        const db = await sql.connect(settingsData)
        return db
    } catch (error) {
        console.error("No se conecto a la base de datos: " + error)
    }
}
export const conexionUser = async () => {
    try {
        const db = await sql.connect(settingsUser)
        return db
    } catch (error) {
        console.error("No se conecto a la base de datos: " + error)
    }
}