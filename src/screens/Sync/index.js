import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { LinearProgress } from '@rneui/themed';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { showMessage } from 'react-native-flash-message';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {locationSelector} from '~/modules/auth/selectors';
import {totalModuleDone, totalModule} from '~/modules/sync/selectors';

import { connect } from 'react-redux';
import {SyncUpload, SyncDownload, SyncData} from '~/modules/sync/actions';

import reactotron from 'reactotron-react-native';

const db_schema = require('~/modules/sync/db_schema.json');

const {height, width} = Dimensions.get('window');

function SyncPage(props) {
  const {navigation, dispatch, branch_id, totalModule, totalModuleDone} = props;
  const [progress, setProgress] = useState(0);
  const [totalData, setTotalData] = useState(0);

  React.useEffect(() => {
    setProgress(totalModuleDone);
    setTotalData(totalModule);

  }, [totalModuleDone])

  const SynchronizeData = (type, element) => {
    if(type == 'GET') {
      dispatch(SyncDownload({branch_id, element}));
    } else {
      dispatch(SyncUpload({branch_id}));
    }
  }

  const SinkronisasiSemuaData = () => {
    dispatch(SyncData({branch_id}));
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          data={db_schema}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.row} key={index}>
                <Text style={styles.rowText}>{item.NAME}</Text>
                <TouchableOpacity style={[styles.btnSync, {backgroundColor: '#3498DB'}]} onPress={() => SynchronizeData(item.SYNC_TYPE, item)}>
                  <Text style={{fontSize: 14, color: '#FFF', fontWeight: '600'}}>Sinkron</Text>
                </TouchableOpacity>
              </View>
            )
          }}
          disableVirtualization
          showsVerticalScrollIndicator={false}
        />
        {/* <TouchableOpacity style={styles.btnSync} onPress={() => SynchronizeData()}>
          <Text style={{fontSize: 18, color: '#FFF', fontWeight: '600'}}>Sync Data</Text>
        </TouchableOpacity> */}
        <View
          style={{ margin: 10, width: width * 0.8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
            <LinearProgress
              style={{ margin: 10, width: width * 0.8 }}
              value={progress}
              variant="determinate"
            />
            <Text >{progress} / {totalData}</Text>
            <TouchableOpacity style={[styles.btnSync, {backgroundColor: '#2ECC71'}]} onPress={() => SinkronisasiSemuaData()}>
              <Text style={{fontSize: 14, color: '#FFF', fontWeight: '600', textAlign: 'center'}}>Sinkronisasi Semua Data</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnSync: {
    padding: 12,
    width: width * 0.35,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

/**
 * Mengambil informasi user kondisi login di mana
 */
const mapStateToProps = (state) => {
  return {
    branch_id: locationSelector(state),
    totalModuleDone: totalModuleDone(state),
    totalModule: totalModule(state),
  };
};

export default connect(mapStateToProps)(SyncPage);