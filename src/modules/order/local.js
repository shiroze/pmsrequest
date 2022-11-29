import SQLite from 'react-native-sqlite-storage';
import {db, ExecuteQuery, ExecuteManyQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const localSaveReq = ({branch_id,username, cart}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    /**
     * @FORMAT BRANCH/YEAR/MONTH/INC
     */
    var query1 = await ExecuteQuery(`SELECT NO_ORDER FROM REQUEST ORDER BY NO_ORDER DESC LIMIT 1`);

    /**
     * Generate No Order
     */
    var today = new Date();
    var year = today.getFullYear().toString();
    year = year.substring(2,year.length);
    var month = today.getMonth()+1;
    month = (month < 10 ? '0' : '') + month;
    let resNo = query1.length > 0 ? query1[0].NO_ORDER : '';
    let no = query1.length == 0 ? 1 : parseInt(resNo.split('/')[3])+parseInt(1);
    let frmt = '0000';
    let no_order = branch_id.toUpperCase()+"/"+year+"/"+month+"/"+frmt.slice(0, no.toString().length * -1) + no;
    let rowItem = [];

    try {
      var sp_query = `INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY) VALUES('${no_order}', strftime('%m/%d/%Y','now'), '${username}')`;
      var scQuery = 'INSERT INTO REQUESTDETAIL(NO_ORDER,STOCKCODE,QTY_BEFORE,QTY,QTY_AFTER,KETERANGAN) VALUES';

      for(let element of cart) {
        var curStock = await ExecuteQuery(`SELECT QTYONHAND+QTYHOLD AS STOCK FROM STORESTOCK WHERE ITEMCODE='${element.itemCode}'`);

        /**
         * Check Stock apakah available
         */
        if(curStock[0].STOCK > element.qty) {
          scQuery += `('${no_order}', '${element.itemCode}', ${curStock[0].STOCK}, ${element.qty}, ${parseInt(curStock[0].STOCK) - parseInt(element.qty)}, '${element.keterangan}'),`;
        } else {
          throw new Error(`Stock dengan kode ${element.itemCode} tidak cukup`);
        }
      }

      scQuery = scQuery.replace(/.$/,";");

      reactotron.log(sp_query);
      reactotron.log(scQuery);

      await ExecuteQuery(sp_query);
      await ExecuteQuery(scQuery);

      result.message = no_order + " Sukses";
    } catch (e) {
      result.error = true;
      result.message = e.message;
    }

    resolve({data: result});

  });
}

// export const localSaveReq = ({branch_id,username, cart}) => {
//   return new Promise(async (resolve, reject) => {
//     var result = {
//       error: false,
//       data: [],
//       message: ""
//     };

//     var sp_query = '';

//     /**
//      * @FORMAT BRANCH/YEAR/MONTH/INC
//      */
//     var query1 = await ExecuteQuery(`SELECT NO_ORDER FROM REQUEST ORDER BY NO_ORDER DESC LIMIT 1`);

//     /**
//      * Generate No Order
//      */
//     var today = new Date();
//     var year = today.getFullYear().toString();
//     year = year.substring(2,year.length);
//     var month = today.getMonth()+1;
//     month = (month < 10 ? '0' : '') + month;
//     let resNo = query1.length > 0 ? query1[0].NO_ORDER : '';
//     let no = query1.length == 0 ? 1 : parseInt(resNo.split('/')[3])+parseInt(1);
//     let frmt = '0000';
//     let no_order = branch_id.toUpperCase()+"/"+year+"/"+month+"/"+frmt.slice(0, no.toString().length * -1) + no;
//     let rowItem = [];

//     try {
//       // await ExecuteQuery(`
//       // INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY) VALUES(?, strftime('%m/%d/%Y','now'), ?)
//       // `, [no_order,username]);
//       await db.transaction(async tx => {
//         tx.executeSql(`INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY) VALUES('${no_order}', strftime('%m/%d/%Y','now'), '${username}')`);

//         await db.transaction(tx => {
//           tx.executeSql(`INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY) VALUES('${no_order}', strftime('%m/%d/%Y','now'), '${username}')`);
//           for(let element of cart) {
//             /**
//              * Check Stock apakah available
//              */
//             var curStock = tx.executeSql(`SELECT QTYONHAND+QTYHOLD AS STOCK FROM STORESTOCK WHERE ITEMCODE='${element.itemCode}'`, [], (tx2, results) => {
//               var resp = [];
//               return new Promise((resolve, reject) => {
//                 var len = results.rows.length;
//                 if(len == 0) {
//                   resolve(resp);
//                 }

//                 /**
//                  * Push data to array
//                  */
//                 for (let i = 0; i < len; i++) resp.push(results.rows.item(i));
//                 // return data is array
//                 reactotron.log(resp);
//                 resolve(resp);
//               })
//             }, (error) => {
//               reactotron.log(error);
//             });
//             if(curStock[0].STOCK > element.qty) {
//               tx.executeSql(`INSERT INTO REQUESTDETAIL(NO_ORDER,STOCKCODE,QTY_BEFORE,QTY,QTY_AFTER,KETERANGAN) VALUES('${no_order}', '${element.itemCode}', ${curStock[0].STOCK}, ${element.qty}, ${parseInt(curStock[0].STOCK) - parseInt(element.qty)}, '${element.keterangan}')`);
//             } else {
//               throw new Error(`Stock dengan kode ${element.itemCode} tidak cukup`);
//             }
//           }
//         });
//       });

//       result.message = no_order + " Sukses";
//     } catch (e) {
//       result.error = true;
//       result.message = e.message;
//     }

//     resolve({data: result});

//   });
// }

export const localSaveItem = ({id, itemCode, qty, keterangan}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUESTDETAIL SET QTY=?, KETERANGAN=?
    WHERE NO_ORDER=? AND STOCKCODE=?`, [qty, keterangan, id, itemCode]);

    resolve({data: result});
  })
}