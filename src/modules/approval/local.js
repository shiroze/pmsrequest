import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const getApproval = ({page}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var resp = await ExecuteQuery(`SELECT NO_ORDER,TGL_REQUEST,REQUEST_BY,
      CASE WHEN APPROVE_1 IS NULL THEN 'pending'
      WHEN APPROVE_1=1 AND APPROVE_2 IS NULL THEN 'asisten'
      WHEN APPROVE_1=1 AND APPROVE_2=1 THEN 'approved'
      WHEN RELEASED_BY IS NOT NULL THEN 'released' END order_status
      FROM REQUEST
      WHERE POSTED_DATE IS NULL
      ORDER BY TGL_REQUEST
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);

    resp.forEach(element => {
      result.data.push({
        no_order: element.NO_ORDER,
        dtrans: element.TGL_REQUEST,
        requestBy: element.REQUEST_BY,
        order_status: element.order_status
      });
    });

    resolve({data: result});
  })
}

export const getApprovalbyID = ({id}) => {
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

export const localApproveSV = ({id, username, stage}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    var query;

    if(stage == 1) {
      query = `APPROVE_1=1 AND APPROVE_1_BY='${username}'`;
    } else if(stage == 2) {
      query = `APPROVE_2=1 AND APPROVE_2_BY='${username}'`;
    }

    reactotron.log(query);
    data = await ExecuteQuery(`UPDATE REQUEST SET ${query}
    WHERE NO_ORDER=?`,[id]);

    // resp.forEach(element => {
    //   result.data.push({
    //     no_order: element.NO_ORDER,
    //     dtrans: element.TGL_REQUEST,
    //     requestBy: element.REQUEST_BY,
    //     order_status: element.order_status
    //   });
    // });

    resolve({data: result});
  })
}

export const localRejectSV = ({id, itemCode, alasan, username}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUESTDETAIL SET REJECTED=1, REJECT_REASON=?, REJECT_BY=?
    WHERE NO_ORDER=? AND STOCKCODE=?`,[alasan, username, id, itemCode]);

    // resp.forEach(element => {
    //   result.data.push({
    //     no_order: element.NO_ORDER,
    //     dtrans: element.TGL_REQUEST,
    //     requestBy: element.REQUEST_BY,
    //     order_status: element.order_status
    //   });
    // });

    resolve({data: result});
  })
}