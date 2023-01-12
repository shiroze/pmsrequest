import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery, ExecuteMultiQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const localDataUpdate = ({data, table, column}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let qArr = [];

    // await ExecuteQuery(`DELETE FROM ${table};`);
    qArr.push(`DELETE FROM ${table};`);

    /**
     * Data column
     */
    for(let i = 0; i < data.length; i++) {
      let scQuery = `INSERT INTO ${table}(`;
      for(let i = 0; i < column.length; i++) {
        scQuery += `${column[i]}`;
        if(i < column.length - 1) {
          scQuery += `,`;
        }
      }
      scQuery += ') VALUES';
      scQuery += '(';
      for(let j = 0; j < column.length; j++) {
        let val = data[i][column[j]];
        if(val == null) {
          val = '';
        } else {
          val = val.toString().replace(/'/g, "''");
        }
        scQuery += `'${val}'`;
        // scQuery += `'${val.replace(/'/g, "''")}'`;
        if(j < column.length - 1) {
          scQuery += `,`;
        }
      }
      scQuery += ')';
      // if(i < data.length - 1) {
      //   scQuery += `,`;
      // }

      scQuery += ';';
      qArr.push(scQuery);
    }

    await ExecuteMultiQuery(qArr);

    resolve({data: result});
  })
}

export const getLocalDataTable = ({table, condition = ''}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let q = `SELECT * FROM ${table} ${condition};`;

    let resp = await ExecuteQuery(q);

    resp.forEach(element => {
      result.data.push(element);
    });

    resolve({data: result});
  });
}

export const updatePostedDate = ({noOrder}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUEST SET POSTED_DATE=DATETIME('now') WHERE NO_ORDER='${noOrder}';`);

    resolve({data: result});
  });
}