import pool from "../../config/db.connect.js";
export class PagesModel {
  vistas = async () => {
    const groupedResult = [];
    let currentMenu = null;
    const result = await pool.query(
      `SELECT m.MenuId, m.MenuNameEnglish, m.SortNumber AS MenuSort, 
              p.PageId, p.TitleEnglish AS PageTitle, p.SortNumber AS PageSort
       FROM menus m 
       LEFT JOIN pages p ON p.MenuId = m.MenuId
       ORDER BY m.SortNumber, p.SortNumber;`
    );
    for (const row of result) {
      if (currentMenu && currentMenu.MenuId !== row.MenuId) {
        groupedResult.push(currentMenu);
        currentMenu = null;
      }
      if (!currentMenu) {
        currentMenu = {
          MenuId: row.MenuId,
          MenuNameEnglish: row.MenuNameEnglish,
          MenuSort: row.MenuSort,
          pages: [],
        };
      }
      currentMenu.pages.push({
        PageId: row.PageId,
        PageTitle: row.PageTitle,
        PageSort: row.PageSort,
      });
    }
    if (currentMenu) {
      groupedResult.push(currentMenu);
    }
    return groupedResult;
  };

  menu = async () => {
    return await pool.query(`SELECT * FROM menus ORDER BY SortNumber`);
  }

  menuUpdate = async (id, menuName) => {
    console.log(id, menuName)
    try {
      // Realizar la actualización de `MenuNameEnglish` para el `MenuId` proporcionado
      const result = await pool.query(`
            UPDATE menus
            SET MenuNameEnglish = ?
            WHERE MenuId = ?
        `, [menuName, id]);

      // Verificar si se actualizó alguna fila
      if (result.affectedRows > 0) {
        console.log(`Menú con ID ${id} actualizado correctamente`);
      } else {
        console.log(`No se encontró el menú con ID ${id}`);
      }
      return result
    } catch (error) {
      console.error("Error al actualizar el menú:", error);
      throw error;
    }
  };
  option = async (query) => {
    const { search, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;
    let baseQuery = `
    SELECT p.PageId,p.MenuId, m.MenuNameEnglish, p.SortNumber, p.TitleEnglish
    FROM pages p
    INNER JOIN menus m ON p.MenuId = m.MenuId
  `;
  
  let queryParams = [];
  if (search) {
    baseQuery += `
      WHERE m.MenuNameEnglish LIKE ?
    `;
    queryParams.push(`%${search}%`);
  }
    let countQuery = `
    SELECT COUNT(*) as total
    FROM pages p
    INNER JOIN menus m ON p.MenuId = m.MenuId
  `;
  let countParams = [...queryParams];
  if (search) {
    countQuery += `
      WHERE m.MenuNameEnglish LIKE ?
    `;
  }
    baseQuery += `
    ORDER BY p.MenuId ASC, p.SortNumber ASC
    LIMIT ? OFFSET ?
  `;
  queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);
      const total = countResult[0].total;
      return {
        option: rows,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los usuarios");
    }
  }

}
