import SQLite from 'react-native-sqlite-storage';
import BcryptReactNative from 'bcrypt-react-native';
import {ExecuteQuery} from '~/config/db';

import reactotron from 'reactotron-react-native';

export const LocalSignIn = ({username, password}) => {
  return new Promise(async (resolve, reject) => {
    let result = {
      error: false,
      data: [],
      message: ""
    };

    let user = await ExecuteQuery(`SELECT * FROM USERPROFILE WHERE LOGINID=? AND ACCESSRIGHTS='Y'`, [username.toUpperCase()]);
    
    if(user.length > 0) {
      const salt = await BcryptReactNative.getSalt(15);
      const hash = await BcryptReactNative.hash(salt, user[0].PASSWORD);
      const valid = await BcryptReactNative.compareSync(password, hash);
      
      let accessRight = [];

      if(valid) {
        let roles = await ExecuteQuery(`SELECT C.NAME AS NAMAMODUL,D.NAME AS NAMASUBMODUL,D.CLASSNAME,B.AUTHORIZED
            FROM ACCESSRIGHTS B
            LEFT JOIN MODULE C ON B.MODULECODE=C.CODE
            LEFT JOIN SUBMODULE D ON C.CODE=D.MODULE AND B.SUBMODULECODE=D.CODE
            WHERE B.LOGINID=? AND C.NAME='WAREHOUSE ROLES'
            ORDER BY C.NAME,D.NAME,D.CLASSNAME`, [username.toUpperCase()]);
        
        if(roles.length > 0) {
          await roles.forEach(element => {
            accessRight.push({
              namaModul: element.NAMAMODUL,
              namaSubmodul: element.NAMASUBMODUL,
              className: element.CLASSNAME,
              allow: element.AUTHORIZED
            });
          });

          result.data.push({
            userName: user[0].LOGINID,
            fullName: user[0].FULLNAME,
            department: user[0].DEPARTMENT,
            accessRight
          });
        } else {
          result.error = true;
          result.message = "User tidak mempunya hak akses";
        }
      }
    } else {
      result.error = true;
      result.message = "User tidak terdaftar di system";
    }

    resolve(result);
  })
};