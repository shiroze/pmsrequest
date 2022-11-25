import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

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
      await ExecuteQuery(`
      INSERT INTO REQUEST(NO_ORDER, TGL_REQUEST, REQUEST_BY) VALUES(?, strftime('%m/%d/%Y','now'), ?)
      `, [no_order,username]);

      // var scQuery = 'INSERT INTO REQUESTDETAIL(NO_ORDER,STOCKCODE,QTY,KETERANGAN) VALUES';
      await cart.forEach(element => {
        // rowItem.push([
        //   no_order,element.itemCode, element.qty, element.keterangan
        // ]);
        reactotron.log(no_order, element.itemCode, element.qty, element.keterangan);

        ExecuteQuery(`
          INSERT INTO REQUESTDETAIL(NO_ORDER,STOCKCODE,QTY,KETERANGAN) VALUES(?, ?, ?, ?)
        `, [no_order, element.itemCode, element.qty, element.keterangan]);
      });

      result.message = no_order + " Sukses";
    } catch (e) {
      result.error = true;
      result.message = e.message;
    }

    resolve({data: result});

  });
}

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