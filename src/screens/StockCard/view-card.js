import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

import { Button } from '@rneui/base';
import { Avatar, Icon, Input, Skeleton, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

// import {getMaterialbyID} from '~/modules/common/service';
import {getMaterialbyID} from '~/modules/common/service';
import {locationSelector} from '~/modules/auth/selectors';
import {addToCart} from '~/modules/order/actions';
import {orderSelector} from '~/modules/order/selectors';

import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');

function ViewItem(props) {
  const {navigation, route, dispatch, orderCart, branch_id} = props;
  const {item} = route.params;

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
        setData(data.data);
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
      // fetchData(item_code);
      reactotron.log(item);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} title={item && item.itemDescription} {...props} />
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{item && item.groupName}</Text>
        {(item && item.subgroupName) && <Icon name='arrow-right' type='font-awesome' size={14} />}
        <Text style={{fontWeight: 'bold', fontSize: 14}}>{(item && item.subgroupName) && item.subgroupName}</Text>
      </View>
      <View style={[styles.card, styles.borderStyle, {borderBottomWidth: .875}]}>
        <Text style={styles.textStyle}>Kode: {item ? item.itemCode : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={styles.textStyle}>Nama Barang: {item ? item.itemDescription : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
        <Text style={[styles.textStyle, {position: 'absolute', right: 10, top: 10, fontSize: 18, fontWeight: '800'}]}>{item ? (item.stock +" "+ item.uomCode) : <Skeleton skeletonStyle={styles.skeletonStyle} width={width * 0.3} height={20} />}</Text>
      </View>
      {/* <FlatList /> */}
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
  }
});

const mapStateToProps = (state) => {
  return {
    orderCart: orderSelector(state).toJS(),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(ViewItem);