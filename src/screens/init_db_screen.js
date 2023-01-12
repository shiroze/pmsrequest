import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, Dimensions } from 'react-native';
import { LinearProgress } from '@rneui/themed';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { showMessage } from 'react-native-flash-message';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {authSelector, locationSelector} from '~/modules/auth/selectors';

import { connect } from 'react-redux';
import {signOut} from '~/modules/auth/actions';

import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import configApi from '~/config/api';
import SQLite from 'react-native-sqlite-storage';

import reactotron from 'reactotron-react-native';

const {height, width} = Dimensions.get('window');

function UpdateScreen(props) {
  const {navigation, dispatch, branch_id} = props;
  const [uploadFile, setUpFile] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const dirs = RNFetchBlob.fs.dirs;

  let conversion = (value) => {
    let temp = "";
    if (value < 1000) {
      temp = value + " bytes";
    } else if (value > 1000 && value < 1000000) {
      temp = (value/1000).toFixed(2) + " KB";
    } else if (value > 1000000 && value < 1000000000) {
      temp = (value/1000000).toFixed(2) + " MB";
    } else if (value > 1000000000) {
      temp = (value/1000000000).toFixed(2) + " GB";
    }

    return temp;
  }

  let uploadBegin = (response) => {
    let jobId = response.jobId;
    reactotron.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
  };

  let uploadProgress = (response) => {
    // let percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
    setProgress(response.totalBytesSent);
  };

  const SyncData = async () => {
    setProgress(0);
    await RNFetchBlob.fs.stat(dirs.MainBundleDir + '/databases/db_pms.db')
    .then((stats) => { 
      setUpFile(stats.path);
      setTotalData(stats.size);
    })
    .catch((err) => {reactotron.log(err)});
    
    let dbloc = RNFS.DocumentDirectoryPath.replace('files', 'databases') + '/db_pms.db';
    // RNFS.stat(dbloc).then((stats) => {
    //   reactotron.log(stats);
    // })

    RNFS.uploadFiles({
      /**
       * Developement URL
       */
      toUrl: `http://172.21.10.242:3000/${branch_id}/api/v1/sync_data`,
      // toUrl: configApi.API_ENDPOINT + `/${branch_id}/api/v1/sync_data`,
      files: [{name: "filedb", filename: "db_pms.db", filepath: dbloc}],
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // "Content-Type": "application/octet-stream",
      },
      fields: {
        'branch': branch_id,
      },
      begin: uploadBegin,
      progress: uploadProgress
    })
    .promise.then((response) => {
      if (response.statusCode == 200) {
        reactotron.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      } else {
        reactotron.log('SERVER ERROR');
      }
    })
    .catch((err) => {
      if(err.description === "cancelled") {
        // cancelled by user
      }
      reactotron.log(err);
    });
  }

  /**
   * Before Update DB Delete previous 1 first
   */
  const reInitSQL = () => {
    SQLite.deleteDatabase(
      {name: 'db_pms.db'},  
      () => { 
        SQLite.openDatabase({name: 'db_pms.db', createFromLocation: 1}, 
        () => {
          reactotron.log("Database Initialization Success");
          dispatch(signOut({expired: false}));
        }, 
        (e) => reactotron.log(e));
      },
      error => { reactotron.log("ERROR: " + error); }
    );
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <TouchableOpacity style={styles.btnSync} onPress={() => reInitSQL()}>
        <Text style={{fontSize: 18, color: '#FFF', fontWeight: '600'}}>Re-Init Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSync} onPress={() => SyncData()}>
        <Text style={{fontSize: 18, color: '#FFF', fontWeight: '600'}}>Sync Data</Text>
      </TouchableOpacity>
      <View
        style={{ margin: 10, width: width * 0.8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
          <LinearProgress
            style={{ margin: 10, width: width * 0.8 }}
            value={progress}
            variant="determinate"
          />
          <Text >{conversion(progress)} / {conversion(totalData)}</Text>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  btnSync: {
    padding: 12,
    marginTop: 18,
    backgroundColor: '#2ECC71',
    width: width * 0.35,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
});

/**
 * Mengambil informasi user kondisi login di mana
 */
const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(UpdateScreen);