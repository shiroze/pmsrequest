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

    var resp = await ExecuteQuery(`SELECT R.RELEASED_DATE,R.NO_ORDER,R.REQUEST_BY,RD.QTY_BEFORE,RD.QTY,RD.QTY_AFTER,P.UOMCODE 
      FROM REQUESTDETAIL RD
      LEFT JOIN REQUEST R ON RD.NO_ORDER=R.NO_ORDER
      INNER JOIN PURCHASEITEM P ON RD.STOCKCODE=P.ITEMCODE
      WHERE RD.STOCKCODE LIKE '%'
      ORDER BY R.TGL_REQUEST DESC
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);
    // <Text>Tgl.Disetujui</Text>
    // <Text>No. Order</Text>
    // <Text>Pemohon</Text>
    // <Text>Status</Text>

    resp.forEach(element => {
      result.data.push({
        dtrans: element.APPROVE_2_DATE,
        no_order: element.NO_ORDER,
        requestBy: element.REQUEST_BY,
        order_status: element.order_status
      });
    });

    resolve({data: result});
  });
}