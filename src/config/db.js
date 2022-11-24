import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG = true;
SQLite.enablePromise(false);

export var db = SQLite.openDatabase({name: 'db_pms.db'});

export const ExecuteQuery = (sql, params = []) => {
  /**
   * Create empty array
   */
  var resp = [];
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql,params, (trx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          /**
           * Push data to array
           */
          let row = results.rows.item(i);
          resp.push(row);
        }
        // return data is array
        resolve(resp);
      }, (err) => {
        reject(err);
      });
    });
  });
};