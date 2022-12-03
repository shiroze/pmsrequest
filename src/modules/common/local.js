import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

/**
 * Start for Default User
 */
export const loadItemGroup = async ({}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var resp = await ExecuteQuery(`SELECT GROUPNAME, COUNT(SUBGROUP) SUBGROUPCOUNT FROM (
      SELECT *,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP
      FROM STOCKGROUP
      ) A
      GROUP BY GROUPNAME`);

    resp.forEach(element => {
      result.data.push({
        groupName: element.GROUPNAME,
        subgroupCount: element.SUBGROUPCOUNT
      });
    });

    resolve({data: result});
  });
};

export const loadSubGroup = async ({groupName}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var resp = await ExecuteQuery(`SELECT GROUPNAME, SUBGROUP FROM (
      SELECT *,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP
      FROM STOCKGROUP
    ) A
    WHERE GROUPNAME=?
    GROUP BY GROUPNAME,SUBGROUP
    ORDER BY SUBGROUP`, [groupName]);

    resp.forEach(element => {
      result.data.push({
        name: element.GROUPNAME,
        subGroupName: element.SUBGROUP,
      });
    });

    resolve({data: result});
  });
};

export const getMaterial = async ({groupName, subgroupName, page, query}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    var queryStr = "";
    
    var newSB = subgroupName || '';
  
    if(newSB == "") {
      queryStr = `SELECT A.*, 
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, 
      CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
      FROM PURCHASEITEM A
      LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
      LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
      WHERE GRN IN ('N' ,'')`;
    } else {
      queryStr = `SELECT A.*, 
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, 
      CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
      FROM PURCHASEITEM A
      LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
      LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
      WHERE GRN IN ('N' ,'') AND
      TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) LIKE '%${newSB}%'`;
    }

    var resp = await ExecuteQuery(`SELECT * FROM (
        ${queryStr}
      ) WHERE GROUPNAME=? AND
      QTYONHAND > 0 AND
      ITEMDESCRIPTION LIKE ?
      ORDER BY ITEMDESCRIPTION
      LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`, [groupName, `%${query}%`]);

    resp.forEach(element => {
      result.data.push({
        itemCode: element.ITEMCODE,
        itemDescription: element.ITEMDESCRIPTION,
        groupName: element.GROUPNAME,
        subGroupName: element.SUBGROUPNAME,
        uomCode: element.UOMCODE,
        // C
        stock: element.QTYONHAND,
        warehouse: element.STORECODE
      });
    });

    resolve({data: result});
  });
}

export const getMaterialbyID = ({item_code}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    
    var resp = await ExecuteQuery(`SELECT A.*,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, 
      CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
      FROM PURCHASEITEM A
      LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
      LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
      WHERE A.ITEMCODE=? AND GRN IN ('N' ,'')
      ORDER BY ITEMDESCRIPTION
    `, [item_code]);
  
    resp.forEach(element => {
      result.data.push({
        itemCode: element.ITEMCODE,
        itemDescription: element.ITEMDESCRIPTION,
        groupName: element.GROUPNAME,
        subGroupName: element.SUBGROUPNAME,
        uomCode: element.UOMCODE,
        // C
        stock: element.QTYONHAND,
        warehouse: element.STORECODE
      });
    });

    resolve({data: result});
  });
}

export const searchMaterial = ({query, page}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };

    var keyword = query.split(':');
    var searchGroup = query.includes(':') ? keyword[0] : '%';
    var searchName = query.includes(':') ? keyword[1] : query;
    
    var resp = await ExecuteQuery(`SELECT * FROM (
        SELECT A.*, 
        CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
        CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
        IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, 
        CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
        FROM PURCHASEITEM A
        LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
        LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
        WHERE GRN IN ('N' ,'')
    ) WHERE GROUPNAME LIKE ? AND (ITEMDESCRIPTION LIKE ? OR ITEMCODE LIKE ?) AND QTYONHAND > 0
    ORDER BY ITEMDESCRIPTION
    LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`, [`%${searchGroup}%`, `%${searchName}%`, `%${searchName}%`]);
  
    resp.forEach(element => {
      result.data.push({
        itemCode: element.ITEMCODE,
        itemDescription: element.ITEMDESCRIPTION,
        groupName: element.GROUPNAME,
        subGroupName: element.SUBGROUPNAME,
        uomCode: element.UOMCODE,
        // C
        stock: element.QTYONHAND,
        warehouse: element.STORECODE
      });
    });

    resolve({data: result});

  });
}

/**
 * Start for Advanced User
 */
export const loadPendingOrder = async ({init = 0, start = 0, end = 50}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    var whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    var resp = await ExecuteQuery(`SELECT APPROVE_2_DATE,NO_ORDER,REQUEST_BY,
        CASE WHEN APPROVE_1 IS NULL THEN 'pending'
        WHEN APPROVE_1='Y' AND APPROVE_2 IS NULL THEN 'asisten'
        WHEN APPROVE_1='Y' AND APPROVE_2='Y' THEN 'approved'
        WHEN RELEASED_BY IS NOT NULL THEN 'released' END order_status
      FROM REQUEST 
      WHERE APPROVE_2='Y' AND RELEASED_BY IS NULL
      ${whereCond}`);
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

export const loadSyncSIV = async ({init = 0, start = 0, end = 50}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    var whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    var resp = await ExecuteQuery(`SELECT 
      SIVDT,
      COUNT(ASV.SIVCODE) JlhSIV,
      COUNT(REQ.SIVCODE) JlhREQ
    FROM (
      SELECT SIVCODE,STORECODE,
      substr(substr(SIVDATE, pos+1),instr(substr(SIVDATE, pos+1),'/')+1,length(substr(SIVDATE, pos+1))) || '-' || 
      CASE length(substr(SIVDATE, 1, pos-1)) WHEN 1 THEN '0' || substr(SIVDATE, 1, pos-1) ELSE substr(SIVDATE, 1, pos-1) END || '-' || 
      CASE length(substr(substr(SIVDATE, pos+1),0,instr(substr(SIVDATE, pos+1),'/'))) WHEN 1 THEN '0' || substr(substr(SIVDATE, pos+1),0,instr(substr(SIVDATE, pos+1),'/')) ELSE substr(substr(SIVDATE, pos+1),0,instr(substr(SIVDATE, pos+1),'/')) END SIVDT,
      CREATEDBY,CREATEDDATE
      FROM (
        SELECT *,instr(SIVDATE,'/') AS pos FROM SIV
      )
    ) ASV
    LEFT JOIN REQUEST REQ ON ASV.SIVCODE=REQ.SIVCODE
    GROUP BY SIVDT
    ORDER BY SIVDT
    ${whereCond}`);

    resp.forEach(element => {
      result.data.push({
        dtrans: element.SIVDT,
        jlhRequest: element.JlhREQ,
        jlhSIV: element.JlhSIV
      });
    });

    resolve({data: result});
  });
}

export const loadMinStock = async ({init = 0, start = 0, end = 50}) => {
  return new Promise(async (resolve, reject) => {
    var result = {
      error: false,
      data: [],
      message: ""
    };
    var whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    var resp = await ExecuteQuery(`SELECT B.*,A.QTYONHAND FROM STORESTOCK A
    INNER JOIN PURCHASEITEM B ON A.ITEMCODE=B.ITEMCODE
    WHERE A.QTYONHAND <= B.MIN_STOCK + 5`);

    resp.forEach(element => {
      result.data.push({
        itemCode: element.ITEMCODE,
        itemDescription: element.ITEMDESCRIPTION,
        stock: element.QTYONHAND
      });
    });

    resolve({data: result});
  });
}