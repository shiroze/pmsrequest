import SQLite from 'react-native-sqlite-storage';
import {db, ExecuteQuery, ExecuteManyQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const localSaveReq = ({branch_id,user,cart}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    /**
     * @FORMAT BRANCH/YEAR/MONTH/INC
     */
    let query1 = await ExecuteQuery(`SELECT NO_ORDER FROM REQUEST ORDER BY NO_ORDER DESC LIMIT 1`);

    /**
     * Generate No Order
     */
    let today = new Date();
    let year = today.getFullYear().toString();
    year = year.substring(2,year.length);
    let month = today.getMonth()+1;
    month = (month < 10 ? '0' : '') + month;
    let resNo = query1.length > 0 ? query1[0].NO_ORDER : '';
    let no = query1.length == 0 ? 1 : parseInt(resNo.split('/')[3])+parseInt(1);
    let frmt = '0000';
    let no_order = branch_id.toUpperCase()+"/"+year+"/"+month+"/"+frmt.slice(0, no.toString().length * -1) + no;
    let rowItem = [];
    
    let isApprove = user.accessRight.some(e => e.namaSubmodul == "APPROVE STAGE 1" && e.allow == "Y");

    try {
      let sp_query = `INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY,APPROVE_1,APPROVE_1_BY,APPROVE_1_DATE) VALUES('${no_order}', strftime('%m/%d/%Y','now'), '${user.userName}',${isApprove ? 1 : 0},'${user.userName}',${isApprove ? "strftime('%m/%d/%Y','now')" : 'NULL'})`;
      let scQuery = 'INSERT INTO REQUESTDETAIL(NO_ORDER,STOCKCODE,QTY_BEFORE,QTY,QTY_AFTER,KETERANGAN,LOCATIONTYPE,LOCATIONCODE,JOBCODE) VALUES';

      for(let element of cart) {
        let curStock = await ExecuteQuery(`SELECT QTYONHAND+QTYHOLD AS STOCK FROM STORESTOCK WHERE ITEMCODE='${element.itemCode}'`);

        /**
         * Check Stock apakah available
         */
        if(curStock[0].STOCK > element.qty) {
          scQuery += `('${no_order}', '${element.itemCode}', ${curStock[0].STOCK}, ${element.qty}, ${parseInt(curStock[0].STOCK) - parseInt(element.qty)}, '${element.keterangan}', '${element.location_type}', '${element.location_code}', '${element.job_code}'),`;
        } else {
          throw new Error(`Stock dengan kode ${element.itemCode} tidak cukup`);
        }
      }

      scQuery = scQuery.replace(/.$/,";");

      // reactotron.log(sp_query);
      // reactotron.log(scQuery);

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
//     let result = {
//       error: false,
//       data: [],
//       message: ""
//     };

//     let sp_query = '';

//     /**
//      * @FORMAT BRANCH/YEAR/MONTH/INC
//      */
//     let query1 = await ExecuteQuery(`SELECT NO_ORDER FROM REQUEST ORDER BY NO_ORDER DESC LIMIT 1`);

//     /**
//      * Generate No Order
//      */
//     let today = new Date();
//     let year = today.getFullYear().toString();
//     year = year.substring(2,year.length);
//     let month = today.getMonth()+1;
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
//             let curStock = tx.executeSql(`SELECT QTYONHAND+QTYHOLD AS STOCK FROM STORESTOCK WHERE ITEMCODE='${element.itemCode}'`, [], (tx2, results) => {
//               let resp = [];
//               return new Promise((resolve, reject) => {
//                 let len = results.rows.length;
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
    let result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUESTDETAIL SET QTY=?, KETERANGAN=?
    WHERE NO_ORDER=? AND STOCKCODE=?`, [qty, keterangan, id, itemCode]);

    resolve({data: result});
  })
}