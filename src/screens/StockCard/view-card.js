import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

import { Button } from '@rneui/base';
import { Avatar, Icon, Input, Skeleton, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

// import {getMaterialbyID} from '~/modules/common/service';
import {loadCardStock} from '~/modules/report/local';
import {locationSelector} from '~/modules/auth/selectors';
import {addToCart} from '~/modules/order/actions';
import {orderSelector} from '~/modules/order/selectors';

import reactotron from 'reactotron-react-native';

import {handleError, handleInfo, handleSuccess} from '~/utils/message';

import { connect } from 'react-redux';
import moment from 'moment';

const {height, width} = Dimensions.get('window');

function ViewItem(props) {
  const {navigation, route, dispatch, orderCart, branch_id} = props;
  const {itemData} = route.params;

  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (item_code, page) => {
    try {
      /**
       * @param item_code : kode barang
       * @param page : halaman
       */
      const {data} = await loadCardStock({branch_id,item_code,page});

      if(data.error) {
        setLoading(false);
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;

        // reactotron.log(result);

        if(result.length < 50) {
          setHide(true);
        } else {
          setHide(false);
        }

        let listData = list;
        let cData = listData.concat(result);

        setList(cData);
        setLoading(false);
      }
    } catch (e) {
      handleError(e);
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchData(itemData.itemCode, page);
      // reactotron.log(item);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  const renderItem = React.useCallback(
    ({ item }) => {
      let dt = item.dtrans ? item.dtrans.split('/') : '';
      let dtrans = item.dtrans ? dt[1]+'-'+dt[0]+'-'+dt[2] : moment().format('DD-MM-YYYY');

      return (
        <View style={styles.itemCard}>
          <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 8}]}>
            <Text style={[styles.fontStyle, {width: '40%'}]}>{dtrans}</Text>
            <Text style={[styles.fontStyle, {width: '40%'}]}>{item.no_order}</Text>
            <Text style={[styles.fontStyle, {width: '20%'}]}>{item.requestBy}</Text>
          </View>
          <View style={[styles.borderStyle, {flexDirection: 'row'}]}>
            <Text style={[styles.fontStyle, {width: '20%', fontWeight: '800'}]}>Qty Diambil</Text>
            <Text style={[styles.fontStyle, {width: '37%'}]}>{`${item.qty} ${item.uom}`}</Text>
            <Text style={[styles.fontStyle, {width: '25%', fontWeight: '800'}]}>Saldo</Text>
            <Text style={[styles.fontStyle, {width: '18%'}]}>{`${item.qty_after} ${item.uom}`}</Text>
          </View>
        </View>
      )
    },
    [],
  )
  const footerComponent = () => {
    if(list.length > 0) {
      return (
        !hide ? <TouchableOpacity style={{marginBottom: 12, alignItems: 'center'}} onPress={_nextPage}>
          <Text style={{fontSize: 18}}>{loading ? <ActivityIndicator size={"large"} color={'#faa634'} style={{marginTop: 24}} /> : "Load more"}</Text>
        </TouchableOpacity> : <View style={{marginBottom: 12, alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>Reach end of list</Text>
        </View>
      )
    } else {
      return (
        <View style={{marginTop:18, marginBottom: 12, alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>No data Found</Text>
        </View>
      )
    }
  }
  const _nextPage = async () => {
    setPage(page+1);
    setLoading(true);
    setFilter("");
  }
  
  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} title={itemData && itemData.itemDescription} {...props} />
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{itemData && itemData.groupName}</Text>
        {(itemData && itemData.subgroupName) && <Icon name='arrow-right' type='font-awesome' size={14} />}
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{(itemData && itemData.subgroupName) && itemData.subgroupName}</Text>
      </View>
      <View style={[styles.card, styles.borderStyle, {borderBottomWidth: .875}]}>
        <Text style={styles.textStyle}>Kode: {itemData ? itemData.itemCode : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={styles.textStyle}>Spec: {itemData ? itemData.itemDescription : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={[styles.textStyle, {position: 'absolute', right: 10, top: 10, fontSize: 18, fontWeight: '800'}]}>{itemData ? (itemData.actual_stock +" "+ itemData.uomCode) : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
      </View>
      <View style={[styles.borderStyle, {flexDirection: 'row', padding: 4, marginTop: 4, marginLeft: 16}]}>
        <Text style={[styles.fontStyle, {width: '38%', fontWeight: '800'}]}>Tanggal Pengeluaran</Text>
        <Text style={[styles.fontStyle, {width: '38%', fontWeight: '800'}]}>No. Order</Text>
        <Text style={[styles.fontStyle, {width: '24%', fontWeight: '800'}]}>Pemohon</Text>
      </View>
      <FlatList
        data={list}
        renderItem={renderItem}
        // maxToRenderPerBatch={8}
        // getItemLayout={getItemLayout}
        ListFooterComponent={footerComponent}
        // keyExtractor={keyExtractor} 
      />
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
    padding: 10
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
  },
  fontStyle: {
    fontSize: 14,
  },
  itemCard: {
    flex:1, 
    margin: 14, 
    padding: 8,
    backgroundColor: '#FFF',
    height: (height * 0.0465) + 24, 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity:  0.18,
    shadowRadius: 4.59,
    elevation: 5
  },
});

const mapStateToProps = (state) => {
  return {
    orderCart: orderSelector(state).toJS(),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(ViewItem);