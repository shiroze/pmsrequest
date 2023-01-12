import SQLite from 'react-native-sqlite-storage';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

/**
 * Start for Default User
 */
export const loadItemGroup = async () => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let resp = await ExecuteQuery(`SELECT GROUPNAME, COUNT(SUBGROUP) SUBGROUPCOUNT FROM (
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
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let resp = await ExecuteQuery(`SELECT GROUPNAME, SUBGROUP FROM (
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
    let result = {
      error: false,
      data: [],
      message: ""
    };
    let queryStr = "";
    
    let newSB = subgroupName || '';
  
    if(newSB == "") {
      queryStr = `SELECT A.*, 
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, IFNULL(C.QTYONHAND,0) CUR_STOCK,
      CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
      FROM PURCHASEITEM A
      LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
      LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
      WHERE GRN IN ('N' ,'')`;
    } else {
      queryStr = `SELECT A.*, 
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, IFNULL(C.QTYONHAND,0) CUR_STOCK,
      CASE WHEN C.STORECODE IS NULL THEN 'ST1' ELSE C.STORECODE END STORECODE
      FROM PURCHASEITEM A
      LEFT JOIN STOCKGROUP B ON A.STOCKGROUPCODE=B.GROUPCODE
      LEFT JOIN STORESTOCK C ON A.ITEMCODE=C.ITEMCODE
      WHERE GRN IN ('N' ,'') AND
      TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) LIKE '%${newSB}%'`;
    }

    let resp = await ExecuteQuery(`SELECT * FROM (
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
        actual_stock: element.CUR_STOCK,
        warehouse: element.STORECODE
      });
    });

    resolve({data: result});
  });
}

export const getMaterialbyID = ({item_code}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };
    
    let resp = await ExecuteQuery(`SELECT A.*,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN GROUPDESCRIPTION ELSE TRIM(substr(GROUPDESCRIPTION,0,instr(GROUPDESCRIPTION,','))) END GROUPNAME,
      CASE instr(GROUPDESCRIPTION,',') WHEN 0 THEN NULL ELSE TRIM(substr(GROUPDESCRIPTION,instr(GROUPDESCRIPTION,',')+1,length(GROUPDESCRIPTION))) END SUBGROUP,
      IFNULL(C.QTYONHAND,0)-IFNULL(C.QTYHOLD,0) QTYONHAND, IFNULL(C.QTYONHAND,0) CUR_STOCK,
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
        actual_stock: element.CUR_STOCK,
        warehouse: element.STORECODE
      });
    });

    resolve({data: result});
  });
}

export const searchMaterial = ({query, page}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let keyword = query.split(':');
    let searchGroup = query.includes(':') ? keyword[0] : '%';
    let searchName = query.includes(':') ? keyword[1] : query;
    
    let resp = await ExecuteQuery(`SELECT * FROM (
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

export const getLocationType = ({keyword}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let query = `SELECT * FROM LOCATIONTYPE`;

    if(keyword != '') {
      query += ` WHERE LOCATIONTYPECODE LIKE '%${keyword}%'`;
    } else {
      query += ` `;
    }

    let resp = await ExecuteQuery(`${query} ORDER BY LOCATIONTYPENAME`);

    resp.forEach(element => {
      result.data.push({
        loc_type: element.LOCATIONTYPECODE,
        loc_name: element.LOCATIONTYPENAME
      });
    });

    resolve({data: result});
  });
}

export const getLocationCode = ({loc_type, keyword, page}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let query = `SELECT * FROM LOCATION
    WHERE LOCATIONTYPECODE = ?`;

    if(keyword != '') {
      query += ` AND LOCATIONCODE LIKE '%${keyword}%'`;
    } else {
      query += ` AND DESCRIPTION <> ''`;
    }

    let resp = await ExecuteQuery(`${query}
    ORDER BY LOCATIONCODE
    LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`, [loc_type]);

    resp.forEach(element => {
      result.data.push({
        loc_code: element.LOCATIONCODE,
        description: element.DESCRIPTION
      });
    });

    resolve({data: result});
  });
}

export const getJobCode = ({keyword, page}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    /*
    * JOBGROUPCODE
    *	1020000, 1200000, 1210000, 1240000, 4201000, 
    * 4501000, 4701000, 4702000, 4801000
    * 
    * 1049999, 1058888, 1200903, 4201002, 4201003,
    * 4501024, 4501025, 4501026, 4501027, 4501031
    * 4502002, 4502004, 4701001, 4702002
    * 
    * 1020000, 1200000, 4201000, 4501000, 4502000, 4701000, 4702000
    */
    let query = `SELECT * FROM JOB
    WHERE STATUS=0`;

    if(keyword != '') {
      query += ` AND (JOBDESCRIPTION LIKE '%${keyword}%' OR JOBCODE LIKE '%${keyword}%')`;
    } else {
      query += ` AND JOBGROUPCODE IN ('1020000', '1200000', '4201000', '4501000', '4502000', '4701000', '4702000')`;
    }

    let resp = await ExecuteQuery(`${query}
    ORDER BY JOBCODE
    LIMIT 50 OFFSET ${page == 1 ? 0 : ((page-1) * 50)}`);

    resp.forEach(element => {
      result.data.push({
        job_code: element.JOBCODE,
        job_name: element.JOBDESCRIPTION,
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
    let result = {
      error: false,
      data: [],
      message: ""
    };
    let whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    let resp = await ExecuteQuery(`SELECT APPROVE_2_DATE,NO_ORDER,REQUEST_BY,
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
    let result = {
      error: false,
      data: [],
      message: ""
    };
    let whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    let resp = await ExecuteQuery(`SELECT 
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
    let result = {
      error: false,
      data: [],
      message: ""
    };
    let whereCond = '';
    if(init == 1) {
      whereCond = 'LIMIT 10';
    }

    let resp = await ExecuteQuery(`SELECT B.*,A.QTYONHAND FROM STORESTOCK A
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