export function findChildren(tablename: string, id: number) {
    return `WITH RECURSIVE sub_tree AS (
            SELECT * FROM ${tablename} WHERE id = ${id}
            UNION ALL
            SELECT t.* FROM ${tablename} t JOIN sub_tree st ON t.pId = st.id
          )
        SELECT * FROM sub_tree;
      `
  }
  
  /**
   * @path: src\main\nest\utils\sql\re_to_re.ts
   * @functionName jsfn
   * @param {}
   * @description 删除子节点以及子孙节点
   * @author 谭人杰
   * @date 2024-09-02 22:38:38
   */
  export function delChildren(tablename, id) {
    return `WITH RECURSIVE cte(id, pId) AS (
                SELECT id, pId FROM ${tablename} WHERE id = ${id}
                UNION ALL
                SELECT t.id, t.pId FROM ${tablename} t INNER JOIN cte ON cte.id = t.pId
              )
              DELETE FROM ${tablename} WHERE id IN (SELECT id FROM cte);
      `
  }
  