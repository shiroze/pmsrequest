import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput } from 'react-native';

import { Avatar, Icon, Input, Button, Skeleton, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {getMaterialbyID} from '~/modules/common/service';
import {addToCart} from '~/modules/order/actions';
import {orderSelector} from '~/modules/order/selectors';

import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');

function ViewItem(props) {
  const {navigation, route, dispatch, orderCart} = props;
  const {item_code} = route.params;

  const [search, setSearch] = useState("");
  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState(0);
  const [keterangan, setKeterangan] = useState("");

  const fetchData = async (groupCode) => {
    try {
      /**
       * @param groupCode : group name
       */
      const {data} = await getMaterialbyID({groupCode});
      
      setData(data[0]);
    } catch (error) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true,
        statusBarHeight: getStatusBarHeight()
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

  const checkItem = item => {
    if (!orderCart.some(val => item.itemCode === val.itemCode)) {
      const newArrayList = [];
      orderCart.forEach(obj => {
        if (!newArrayList.some(o => o.itemCode === obj.itemCode)) {
          newArrayList.push({...obj});
        }
      });

      var index = newArrayList.findIndex(o => o.itemCode == item.itemCode);
      // newArrayList[index].qty += 1;

      reactotron.log(newArrayList,index);

      dispatch(addToCart({products:newArrayList}));
    } else {
      let listData = orderCart;
      let cData = listData.concat(item);

      reactotron.log("Tidak ada yang sama");

      dispatch(addToCart({products:cData}));
    }
  };

  const OrderConfirmation = () => {
    return (
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{backgroundColor: '#FFF', padding: 12}}>
        {data && 
          <View style={{margin: 20}}>
            <Text style={styles.textStyle}>{"Kode: " + data.itemCode}</Text>
            <Text style={styles.textStyle}>{"Nama: " + data.itemDescription}</Text>
            <Text style={styles.textStyle}>{"Satuan: " + data.uomCode}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Tersedia: "}</Text>
            <Text style={styles.textStyle}>{"Kuantiti Diminta: "+qty}</Text>
            <Text style={styles.textStyle}>{"Keterangan Penggunaan: "+keterangan}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginTop: 18}}>
              <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#ce0000', width: '40%'}]} onPress={toggleOverlay}>
                <Text style={{color: '#FFF'}}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnStyle, {width: '40%'}]} onPress={() => {
                var item = [{
                  itemCode: data.itemCode,qty,keterangan
                }];
                checkItem(item);
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
      <Header onChangeText={setSearch} value={search} goBack={true} {...props} />
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
        <Text style={styles.textStyle}>Kuantiti Tersedia: 0</Text>
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
              if(qty > 0) {
                showMessage({
                  message: "Stock kurang",
                  icon: 'warning',
                  type: 'info',
                  duration: 2000,
                  statusBarHeight: getStatusBarHeight()
                });
                setQty(0);
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
        {/* <View style={styles.contentCard}>
          <Text style={styles.textStyle}>Kode</Text>
          <Text style={styles.textStyle}>Nama</Text>
          <Text style={styles.textStyle}>Satuan</Text>
          <Text style={styles.textStyle}>Kuantiti Tersedia</Text>
          <Text style={styles.textStyle}>Kuantiti Diminta</Text>
          <Text style={styles.textStyle}>Keterangan Penggunaan</Text>
        </View>
        <View style={styles.contentCard}>
          {data ? <Text style={styles.textStyle}>{data.itemCode}</Text> : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}
          {data ? <Text style={styles.textStyle}>{data.itemDescription}</Text> : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}
          {data ? <Text style={styles.textStyle}>{data.uomCode}</Text> : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}
          {data ? <Text style={styles.textStyle}>0</Text> : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}
          <Input 
            placeholder='Kuantiti Diminta'
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={setQty}
            value={qty}
            onBlur={() => {
              if(qty > 0) {
                showMessage({
                  message: "Stock kurang",
                  icon: 'warning',
                  type: 'info',
                  duration: 2000,
                  statusBarHeight: getStatusBarHeight()
                });
                setQty(0);
              }
            }}
            keyboardType={'number-pad'}
          />
          <Input 
            multiline
            numberOfLines={5}
            textAlignVertical={'top'}
            inputStyle={styles.inputStyle}
            inputContainerStyle={[styles.inputContainerStyle, {height: (height * 0.08) + 12}]}
            onChangeText={setKeterangan}
            value={keterangan}
            placeholder='Keterangan penggunaan'
            selectTextOnFocus={true}
          />
        </View> */}
      </View>
      <TouchableOpacity style={styles.btnStyle} onPress={() => {
        if(qty != 0) {
          toggleOverlay();
        } else {
          showMessage({
            message: "Stock tidak boleh kosong",
            icon: 'warning',
            type: 'danger',
            statusBarHeight: getStatusBarHeight()
          });
          toggleOverlay();
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
    fontSize: 12,
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
    orderCart: orderSelector(state),
  };
};

export default connect(mapStateToProps)(ViewItem);