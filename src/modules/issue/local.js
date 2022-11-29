import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const getIssue = ({page}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var query = `SELECT NO_ORDER,TGL_REQUEST,REQUEST_BY,
    CASE WHEN APPROVE_1 IS NULL THEN 'pending'
    WHEN APPROVE_1=1 AND APPROVE_2 IS NULL THEN 'asisten'
    WHEN APPROVE_2=1 AND RELEASED_BY IS NULL THEN 'approved'
    WHEN RELEASED_BY IS NOT NULL THEN 'released' END order_status,
    RELEASED_BY
    FROM REQUEST`;

    var resp = await ExecuteQuery(`SELECT * FROM (${query})
      WHERE order_status IN ('approved', 'released')
      ORDER BY TGL_REQUEST
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);

    resp.forEach(element => {
      result.data.push({
        no_order: element.NO_ORDER,
        dtrans: element.TGL_REQUEST,
        requestBy: element.REQUEST_BY,
        order_status: element.order_status,
        released: element.RELEASED_BY
      });
    });

    resolve({data: result});
  })
}

export const getIssuebyID = ({id}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var resp = await ExecuteQuery(`SELECT B.STOCKCODE,
    C.ITEMDESCRIPTION,B.QTY,C.UOMCODE,B.KETERANGAN,B.REJECTED,B.REJECT_REASON
    FROM REQUESTDETAIL B
    LEFT JOIN PURCHASEITEM C ON B.STOCKCODE=C.ITEMCODE
    LEFT JOIN STOCKGROUP D ON C.STOCKGROUPCODE=D.GROUPCODE
    WHERE B.NO_ORDER=?`, [id]);

    resp.forEach(element => {
      result.data.push({
        itemCode: element.STOCKCODE,
        itemDescription: element.ITEMDESCRIPTION,
        qty: element.QTY,
        uomCode: element.UOMCODE,
        keterangan: element.KETERANGAN,
        rejected: element.REJECTED,
        reason: element.REJECT_REASON
      });
    });

    resolve({data: result});
  })
}

export const localIssueSV = ({id, username}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUEST SET RELEASED_BY=?, RELEASED_DATE=strftime('%m/%d/%Y','now')
    WHERE NO_ORDER=?`,[username,id]);

    resolve({data: result});
  })
}