import SQLite from "react-native-sqlite-storage";
import reactotron from "reactotron-react-native";

// SQLite.DEBUG = true;
// SQLite.enablePromise(false);

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
        if(len == 0) {
          resolve(resp);
        }

        /**
         * Push data to array
         */
        for (let i = 0; i < len; i++) resp.push(results.rows.item(i));
        // return data is array
        resolve(resp);
      }, (err) => {
        reactotron.log(err);
        reject(err);
      });
    });
  });
};

/**
 * This line just for multiple insert only
 * @param {*} sql 
 * @returns 
 */
export const ExecuteManyQuery = (sql = []) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      for (const element of sql) {
        tx.executeSql(element).then(`Success Insert Query : ` + element);
      }
    });
  });
};