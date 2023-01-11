import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native';

import { Button } from '@rneui/base';
import { Avatar, Icon, Input, Skeleton, Overlay, Dialog } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {authSelector,accessSelector,locationSelector} from '~/modules/auth/selectors';
// import {getMaterialbyID} from '~/modules/common/service';
import {getMaterialbyID} from '~/modules/common/local';
import {saveItem, localSaveItem} from '~/modules/order/actions';
import {rejectItem, localRejectItem} from '~/modules/approval/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import moment from 'moment/min/moment-with-locales';

const {height, width} = Dimensions.get('window');

function DetailApproval(props) {
  const {navigation, route, dispatch, auth, access, branch_id} = props;
  const {id, item, approveStage} = route.params;

  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(0);
  const [type, setType] = useState(1);
  const [keterangan, setKeterangan] = useState("");
  const [alasan, setAlasan] = useState("");
  const [allow, setAllow] = useState(false);

  const fetchData = async () => {
    try {
      /**
       * @param start : start page
       * @param end : end page
       * @param date_from : tanggal mulai
       * @param date_to : tanggal akhir
       */
      const {data} = await getMaterialbyID({branch_id, item_code: item.itemCode});

      if(data.error) {
        throw Error(data.message);
      } else {
        let result = data.data;

        setData(result[0]);
        
        setQty(item.qty);
        setKeterangan(item.keterangan);
      }
    } catch (e) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true
      });
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchData();
      if(item.rejected && item.rejected == 1) {
        setAllow(false);
      } else {
        if(approveStage == 0 && access.some(val => val.namaSubmodul == "APPROVE STAGE 1" && val.allow == 'Y')) {
          setAllow(true);
        } else if(approveStage == 1 && access.some(val => val.namaSubmodul == "APPROVE STAGE 2" && val.allow == 'Y')) {
          setAllow(true);
        } else {
          setAllow(false);
        }
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const toggleOverlay = (tipe) => {
    setType(tipe);

    setTimeout(() => {
      setVisible(!visible);
    }, 700);
  };

  const Save = item => {
    /**
     * Update data Qty & keterangan
     * Replace old data
     */
    dispatch(
      localSaveItem({branch_id, id, itemCode: item.itemCode, qty: item.qty, keterangan: item.keterangan})
    );
  }

  const Reject = item => {
    /**
     * Reject 1 Item and go Back
     * @param branch_id, id, itemCode, alasan, username
     */
    reactotron.log("Reject Data");
    dispatch(
      localRejectItem({branch_id, id, itemCode: item.itemCode, alasan, username: auth.userName})
    );
  };
  
  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} title={data && data.itemDescription} {...props} />
      <Overlay isVisible={visible} animationType={'slide'} onBackdropPress={() => setVisible(!visible)}
        overlayStyle={{backgroundColor: '#FFF'}}>
        {(data && type == 1) ?
          <View style={{margin: 20}}>
            <Text style={styles.textStyle}>{"Kode: " + data.itemCode}</Text>
            <Text style={styles.textStyle}>{"Nama: " + data.itemDescription}</Text>
            <Text style={styles.textStyle}>{"Satuan: " + data.uomCode}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Tersedia: " + data.stock}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Diminta: "+qty}</Text>
            <Text style={styles.textStyle}>{"Keterangan Penggunaan: "+keterangan}</Text>
            <View style={{
              // position: 'absolute', left: 0, right: 0, bottom: 12, 
              alignContent: 'center'}}>
              <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#098438', width: '40%'}]} onPress={() => {
                let item = {
                  itemCode: data.itemCode,
                  itemDescription: data.itemDescription,
                  uomCode: data.uomCode,
                  groupName: data.groupName,
                  subgroupName: data.subgroupName,
                  qty,keterangan,
                  stock: data.stock,
                  warehouse: data.warehouse
                };
                Save(item);
              }}>
                <Text style={{color: '#FFF'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <KeyboardAvoidingView style={{alignSelf: 'center'}}>
            <Text style={{fontSize: 20}}>Dengan menekan tombol <Text style={{fontWeight: 'bold'}}>Reject</Text> item berikut akan dibatalkan:</Text>
            <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginTop: 24}}>{data && data.itemDescription}</Text>
              <Input 
                multiline
                numberOfLines={5}
                textAlignVertical={'top'}
                containerStyle={{width: width*0.6, alignSelf: 'center', marginTop: 16}}
                inputStyle={styles.inputStyle}
                inputContainerStyle={[styles.inputContainerStyle, {height: (height * 0.08) + 12}]}
                onChangeText={(value) => setAlasan(value)}
                value={alasan}
                placeholder='Alasan dibatalkan'
                selectTextOnFocus={true}
              />
            <View style={{
              // position: 'absolute', left: 0, right: 0, bottom: 12, 
              alignContent: 'center'}}>
              <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#ce0000', width: '40%'}]} onPress={() => {
                Reject(data);
              }}>
                <Text style={{color: '#FFF'}}>Reject</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        }
      </Overlay>
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{data && data.groupName}</Text>
        {(data && data.subgroupName) && <Icon name='arrow-right' type='font-awesome' size={14} />}
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{(data && data.subgroupName) && data.subgroupName}</Text>
        <Icon name='arrow-right' type='font-awesome' size={14} />
        <Text style={{fontWeight: 'bold', fontSize: 14, width: width*0.6}} numberOfLines={1}>{data && data.itemDescription}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.textStyle}>Kode: {data ? data.itemCode : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={styles.textStyle}>Nama Barang: {data ? data.itemDescription : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={styles.textStyle}>Satuan: {data ? data.uomCode : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={styles.textStyle}>Kuantiti Tersedia: {data ? ((item.rejected && item.rejected == 1) ? data.stock : (data.stock + qty)) : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textStyle}>Kuantiti Diminta: </Text>
          <Input 
            disabled={!allow}
            placeholder='Kuantiti Diminta'
            containerStyle={{width: width*0.5}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={setQty}
            value={""+qty}
            onBlur={() => {
              if(qty > data.stock) {
                showMessage({
                  message: "Stock kurang",
                  icon: 'warning',
                  type: 'info',
                  duration: 2000
                });
                setQty(1);
              }
            }}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textStyle}>Keterangan Penggunaan: </Text>
          <Input 
            disabled={!allow}
            multiline
            numberOfLines={5}
            textAlignVertical={'top'}
            containerStyle={{width: width*0.6}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={[styles.inputContainerStyle, {height: (height * 0.08) + 12}]}
            onChangeText={setKeterangan}
            value={keterangan}
            placeholder='Keterangan penggunaan'
            selectTextOnFocus={true}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 16, display: !allow ? 'none' : 'flex'}}>
        <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#008031'}]} onPress={() => {
          if(qty != 0 && data.stock > qty) {
            toggleOverlay(1);
          } else {
            showMessage({
              message: "Stock tidak boleh kosong",
              icon: 'warning',
              type: 'danger'
            });
          }
        }}>
          <Text style={{color: '#FFF'}}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnStyle, {backgroundColor: 'red'}]} onPress={() => toggleOverlay(2)}>
          <Text style={{color:'#FFF'}}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  borderStyle: {
    borderColor: '#CACFD2',
  },
  card: {
    width: (width * 0.95) - 24, 
    margin: 18, 
    // flexDirection: 'row'
  },
  contentCard: {
    flex: 1
  },
  inputContainerStyle: {
    backgroundColor:'#EAEDED',
    // borderBottomWidth: 0,
    marginLeft: -10,
    marginRight: -10,
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  inputStyle: {
    fontSize: 12
  },
  textStyle: {
    fontSize: 14,
    lineHeight: 24
  },
  skeletonStyle: {
    backgroundColor: '#85929E'
  },
  btnStyle: {
    width: '40%', 
    padding: 12,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#FFF',
    overflow: 'hidden',
  }
});

const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    access: accessSelector(state),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(DetailApproval);