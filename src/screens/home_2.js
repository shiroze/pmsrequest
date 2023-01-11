import React, {useState} from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Dimensions, 
  Keyboard, 
  FlatList, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {authSelector, locationSelector} from '~/modules/auth/selectors';
// import {loadPendingOrder,loadSyncSIV,loadMinStock} from '~/modules/common/service';
import {loadPendingOrder,loadSyncSIV,loadMinStock} from '~/modules/common/local';

import { showMessage } from 'react-native-flash-message';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';

import moment from 'moment';

const {width, height} = Dimensions.get('window');
const btnSize = 72;
const iconSize = 32;

function Home (props) {
  const {navigation, auth, branch_id} = props;
  
  const [row1, setRow1] = useState();
  const [row2, setRow2] = useState();
  const [row3, setRow3] = useState();

  const fetchPendingOrder = async () => {
    try {
      /**
       * Tarik data Request Permintaan Pemakaian barang
       */
      const {data} = await loadPendingOrder({branch_id,init: 1});
      
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;

        // reactotron.log(result);

        setRow1(result);
      }
      return true;
    } catch (e) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true
      });
      return false;
    }
  }

  const fetchSyncSIV = async () => {
    try {
      /**
       * Tarik data Request Permintaan Pemakaian barang
       */
      const {data} = await loadSyncSIV({branch_id,init: 1});
      
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;

        setRow2(result);
      }

      return true;
    } catch (e) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true
      });
      return false;
    }
  }

  const fetchMinStock = async () => {
    try {
      /**
       * Tarik data Request Permintaan Pemakaian barang
       */
      const {data} = await loadMinStock({branch_id,init: 1});
      
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;

        reactotron.log(result);

        setRow3(result);
      }

      return true;
    } catch (e) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true
      });

      return false;
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // fetchData();
      // await fetchPendingOrder();
      // await fetchSyncSIV().then(async (value) => {
      // //   await fetchMinStock();
      // });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header {...props} />
      <ScrollView 
        style={{margin: 16, flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        <View style={styles.identityCard}>
          <View>
            <Text style={styles.textWhite}>Nama : {auth.user.userName}</Text>
            <Text style={styles.textWhite}>Posisi: {auth.user.fullName}</Text>
          </View>
          <View style={{marginLeft: 32}}>
            <Text style={styles.textWhite}>Mill: {branch_id}</Text>
            <Text style={styles.textWhite}>PT. Gunung Melayu</Text>
          </View>
        </View>
        <>
          <Text style={styles.headTitle}>Barang Belum diambil</Text>
          <View style={styles.itemCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={{width: '25%'}}>Tgl.Disetujui</Text>
              <Text style={{width: '25%'}}>No. Order</Text>
              <Text style={{width: '25%'}}>Pemohon</Text>
              <Text style={{width: '25%'}}>Status</Text>
            </View>
            {
              row1 != undefined &&
              row1.map((item, index) => {
                return (
                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}} key={index}>
                    <Text style={{width: '25%'}}>{moment(item.dtrans).format('ll')}</Text>
                    <Text style={{width: '25%'}}>{item.no_order}</Text>
                    <Text style={{width: '25%'}}>{item.requestBy}</Text>
                    <Text style={{width: '25%'}}>{item.order_status}</Text>
                  </View>
                )
              })
            }
          </View>
        </>
        <>
          <Text style={styles.headTitle}>Upload Terakhir ke SIV</Text>
          <View style={styles.itemCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={{width: '25%'}}>Tgl.diterima</Text>
              <Text style={{width: '25%'}}>Jlh.Order</Text>
              <Text style={{width: '25%'}}>Jlh.SIV</Text>
            </View>
            {
              row2 != undefined &&
              row2.map((item, index) => {
                return (
                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}} key={index}>
                    <Text style={{width: '25%'}}>{item.dtrans}</Text>
                    <Text style={{width: '25%'}}>{item.jlhRequest}</Text>
                    <Text style={{width: '25%'}}>{item.jlhSIV}</Text>
                  </View>
                )
              })
            }
          </View>
        </>
        {/* <>
          <Text style={styles.headTitle}>Stock Rendah</Text>
          <View style={styles.itemCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={{width: '25%'}}>Kode Barang</Text>
              <Text style={{width: '25%'}}>Nama Barang</Text>
              <Text style={{width: '25%'}}>Sisa Stock</Text>
            </View>
          </View>
        </> */}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  textWhite: {
    color: '#FFF',
    lineHeight: 28,
    fontSize: width > 420 ? 14 : 12
  },
  identityCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    height: height * 0.15,
    width: (width * 0.9) + 16,
    overflow: 'hidden',
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#008031", 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF'
  },
  headTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemCard: {
    height: height * 0.2, 
    padding: 16,
    marginTop: 16,
    backgroundColor: '#d9d9d9', 
    borderRadius: 30,
    overflow: 'hidden'
  },
  btnItemgroup: {
    margin: 8,
    width: width * 0.3,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconStyle: {
    margin: 10,
    padding: 10,
    backgroundColor: "#d9d9d9", 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF'
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

export default connect(mapStateToProps)(Home);