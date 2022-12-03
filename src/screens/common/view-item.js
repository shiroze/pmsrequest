import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

import { Button } from '@rneui/base';
import { Avatar, Icon, Input, Skeleton, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

// import {getMaterialbyID} from '~/modules/common/service';
import {getMaterialbyID} from '~/modules/common/local';
import {locationSelector} from '~/modules/auth/selectors';
import {addToCart} from '~/modules/order/actions';
import {orderSelector} from '~/modules/order/selectors';

import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');

function ViewItem(props) {
  const {navigation, route, dispatch, orderCart, branch_id} = props;
  const {item_code} = route.params;

  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(0);
  const [keterangan, setKeterangan] = useState("");

  const fetchData = async (item_code) => {
    try {
      /**
       * @param groupCode : group name
       */
      const {data} = await getMaterialbyID({branch_id,item_code});

      if(data.error) {
        throw Error(data.message);
      } else {
        setData(data.data[0]);
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
      fetchData(item_code);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const add_to_cart = item => {
    if (orderCart.some(val => item.itemCode === val.itemCode)) {
      /**
       * Membuang duplikat item
       */
      const newArrayList = [];
      orderCart.forEach(obj => {
        if (!newArrayList.some(o => o.itemCode === obj.itemCode)) {
          newArrayList.push({...obj});
        }
      });

      /**
       * Update Qty jika barang yang sama dipilih
       * Timpa Qty lama
       */
      var index = newArrayList.findIndex(o => o.itemCode == item.itemCode);
      newArrayList[index].qty = item.qty;

      dispatch(addToCart({payload:newArrayList}));
    } else {
      let listData = orderCart;
      let cData = listData.concat(item);

      dispatch(addToCart({payload:cData}));
    }
  };

  const OrderConfirmation = () => {
    return (
      <Overlay isVisible={visible} animationType={'slide'} onBackdropPress={toggleOverlay} overlayStyle={{backgroundColor: '#FFF', padding: 8, height: '60%', width: '80%'}}>
        {data && 
          <View style={{flex:1, margin: 20}}>
            <Text style={styles.textStyle}>{"Kode: " + data.itemCode}</Text>
            <Text style={styles.textStyle}>{"Nama: " + data.itemDescription}</Text>
            <Text style={styles.textStyle}>{"Satuan: " + data.uomCode}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Tersedia: " + data.stock}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Diminta: "+qty}</Text>
            <Text style={styles.textStyle}>{"Keterangan Penggunaan: "+keterangan}</Text>
            <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginTop: 18}}>
              <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#ce0000', width: '40%'}]} onPress={toggleOverlay}>
                <Text style={{color: '#FFF'}}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnStyle, {width: '40%'}]} onPress={() => {
                var item = {
                  itemCode: data.itemCode,
                  itemDescription: data.itemDescription,
                  uomCode: data.uomCode,
                  groupName: data.groupName,
                  subgroupName: data.subgroupName,
                  qty,keterangan,
                  stock: data.stock,
                  warehouse: data.warehouse
                };
                add_to_cart(item);
              }}>
                <Text style={{color: '#FFF'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </Overlay>
    )
  }
  
  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} title={data && data.itemDescription} {...props} />
      <OrderConfirmation />
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
        <Text style={styles.textStyle}>Kuantiti Tersedia: {data ? data.stock : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textStyle}>Kuantiti Diminta: </Text>
          <Input 
            placeholder='Kuantiti Diminta'
            containerStyle={{width: width*0.5}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={setQty}
            value={qty}
            onBlur={() => {
              if(qty > data.stock) {
                showMessage({
                  message: "Kuantiti Diminta melebihi stock yang ada",
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
      <TouchableOpacity style={styles.btnStyle} onPress={() => {
        if(qty != 0 && data.stock > qty) {
          toggleOverlay();
        } else {
          showMessage({
            message: "Kuantiti Diminta tidak boleh kosong",
            icon: 'warning',
            type: 'danger'
          });
        }
      }}>
        <Text style={{color: '#FFF'}}>Save</Text>
      </TouchableOpacity>
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
    width: width * 0.85, 
    backgroundColor: '#008031',
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
    orderCart: orderSelector(state).toJS(),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(ViewItem);