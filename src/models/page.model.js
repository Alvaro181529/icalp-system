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
}
