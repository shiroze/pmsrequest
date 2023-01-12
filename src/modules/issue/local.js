import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const getIssue = ({page}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let query = `SELECT R.NO_ORDER,TGL_REQUEST,REQUEST_BY,
      CASE WHEN APPROVE_1 IS NULL AND RD.CREJECT < RD.CITEM THEN 0
      WHEN APPROVE_1=1 AND APPROVE_2 IS NULL AND RD.CREJECT < RD.CITEM THEN 1
      WHEN APPROVE_2=1 AND RELEASED_BY IS NULL AND RD.CREJECT < RD.CITEM THEN 2 
      WHEN RD.CREJECT = RD.CITEM THEN -1
      ELSE 3 END approve_stage,
      CASE WHEN APPROVE_1 IS NULL AND RD.CREJECT < RD.CITEM THEN 'Pending'
      WHEN APPROVE_1=1 AND APPROVE_2 IS NULL AND RD.CREJECT < RD.CITEM THEN 'Disetujui Asisten'
      WHEN APPROVE_2=1 AND RELEASED_BY IS NULL AND RD.CREJECT < RD.CITEM THEN 'Menunggu Keluar'
      WHEN RD.CREJECT = RD.CITEM THEN 'Ditolak'
      WHEN RELEASED_BY IS NOT NULL THEN 'Selesai' END order_status,
      RELEASED_BY
      FROM REQUEST R
      LEFT JOIN (SELECT NO_ORDER, COUNT(STOCKCODE) CITEM,COUNT(REJECTED) CREJECT FROM REQUESTDETAIL GROUP BY NO_ORDER) RD ON R.NO_ORDER=RD.NO_ORDER`;

    let resp = await ExecuteQuery(`SELECT * FROM (${query})
      WHERE approve_stage > 1
      ORDER BY TGL_REQUEST
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);

    resp.forEach(element => {
      result.data.push({
        no_order: element.NO_ORDER,
        dtrans: element.TGL_REQUEST,
        requestBy: element.REQUEST_BY,
        approve_stage: element.approve_stage,
        order_status: element.order_status,
        released: element.RELEASED_BY
      });
    });

    resolve({data: result});
  })
}

export const getIssuebyID = ({id}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let resp = await ExecuteQuery(`SELECT B.STOCKCODE,
    C.ITEMDESCRIPTION,B.QTY,C.UOMCODE,B.KETERANGAN,
    B.LOCATIONTYPE,B.LOCATIONCODE,B.JOBCODE,J.JOBDESCRIPTION,
    B.REJECTED,B.REJECT_REASON
    FROM REQUESTDETAIL B
    LEFT JOIN PURCHASEITEM C ON B.STOCKCODE=C.ITEMCODE
    LEFT JOIN STOCKGROUP D ON C.STOCKGROUPCODE=D.GROUPCODE
    LEFT JOIN JOB J ON B.JOBCODE=J.JOBCODE
    WHERE B.NO_ORDER=? AND B.REJECTED IS NULL`, [id]);

    resp.forEach(element => {
      result.data.push({
        itemCode: element.STOCKCODE,
        itemDescription: element.ITEMDESCRIPTION,
        qty: element.QTY,
        uomCode: element.UOMCODE,
        keterangan: element.KETERANGAN,
        locationType: element.LOCATIONTYPE,
        locationCode: element.LOCATIONCODE,
        jobCode: element.JOBCODE,
        jobDescription: element.JOBDESCRIPTION,
        rejected: element.REJECTED,
        reason: element.REJECT_REASON
      });
    });

    resolve({data: result});
  })
}

export const localIssueSV = ({id, username}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    await ExecuteQuery(`UPDATE REQUEST SET RELEASED_BY=?, RELEASED_DATE=strftime('%m/%d/%Y','now')
    WHERE NO_ORDER=?`,[username,id]);

    resolve({data: result});
  })
}