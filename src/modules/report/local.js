import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const loadCardStock = async ({itemCode, page}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var resp = await ExecuteQuery(`SELECT R.TGL_REQUEST,R.RELEASED_DATE,R.NO_ORDER,R.REQUEST_BY,RD.QTY_BEFORE,RD.QTY,RD.QTY_AFTER,P.UOMCODE 
      FROM REQUESTDETAIL RD
      LEFT JOIN REQUEST R ON RD.NO_ORDER=R.NO_ORDER
      INNER JOIN PURCHASEITEM P ON RD.STOCKCODE=P.ITEMCODE
      WHERE RD.STOCKCODE LIKE '%'
      ORDER BY R.TGL_REQUEST DESC
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);
    // Filter data yang sudah di release

    resp.forEach(element => {
      result.data.push({
        dtrans: element.TGL_REQUEST,
        no_order: element.NO_ORDER,
        requestBy: element.REQUEST_BY,
        qty_before: element.QTY_BEFORE,
        qty: element.QTY,
        qty_after: element.QTY_AFTER,
        uom: element.UOMCODE
      });
    });

    resolve({data: result});
  });
}