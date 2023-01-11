import SQLite from "react-native-sqlite-storage";
import reactotron from "reactotron-react-native";

// SQLite.DEBUG = true;
// SQLite.enablePromise(false);

export let db = SQLite.openDatabase({name: 'db_pms.db'});

export const ExecuteQuery = (sql, params = []) => {
  /**
   * Create empty array
   */
  let resp = [];
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql,params, (trx, results) => {
        let len = results.rows.length;
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

export const ExecuteMultiQuery = (qArr) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      qArr.forEach((qry) => {
        tx.executeSql(qry);
      });
    }, (err) => {
      reactotron.log(err);
      reject(err);
    }, () => {
      resolve(true);
    });
  });
}