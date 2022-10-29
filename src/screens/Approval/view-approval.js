import React, { useState } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';

import { SpeedDial, Button } from '@rneui/base';
import { Icon, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {approvalStack} from '~/config/navigator';
import {getApprovalbyID} from '~/modules/approval/service';
import {approveOrder} from '~/modules/approval/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import moment from 'moment/min/moment-with-locales';

const {width, height} = Dimensions.get("window");
const ITEM_HEIGHT = (height / 5) + 30;

moment.locale('id-ID');

function ViewApproval(props) {
  const {navigation, route, dispatch} = props;
  const {id} = route.params;
  
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState();

  const fetchData = async (id) => {
    try {
      /**
       * @param start : start page
       * @param end : end page
       * @param date_from : tanggal mulai
       * @param date_to : tanggal akhir
       */
      const {data} = await getHistorybyID({id});

      let listData = list;
      let cData = listData.concat(data);

      reactotron.log(cData);

      setList(cData);
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
      fetchData(id);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setOpen(false);
      setShowView(false);
      setSelected();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getItemLayout = React.useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  )
  const renderItem = React.useCallback(
    ({ item, index }) => <TouchableOpacity style={[styles.itemCard, {flex: 1, backgroundColor: '#c7ffdc'}]} 
      onPress={() => {
        navigation.navigate(approvalStack.detail_approval, {id, itemCode: item.itemCode});
      }}
    >
      <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}></Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: '#c7ffdc', textAlign: 'center'}]}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>{item.qty || 0}</Text>
          {" "+item.uomCode}
        </Text>
      </View>
      <Text style={styles.fontStyle} numberOfLines={1}>Nama : {item.itemDescription}</Text>
      <Text style={styles.fontStyle} numberOfLines={3}>Keterangan: </Text>
    </TouchableOpacity>,
    [],
  )
  const keyExtractor = React.useCallback((item, index) => index.toString(), [])

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <ViewItem />
      <View style={[{margin: 14, padding: 8, flexDirection: 'row', borderBottomWidth: .5}]}>
        <View style={{width: '25%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>Tanggal</Text>
          <Text style={styles.fontStyle}>{moment(dtrans).format('ll')}</Text>
        </View>
        <View style={{width: '40%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>No Order</Text>
          <Text>{id}</Text>
        </View>
        <View style={{width: '25%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>Pemohon</Text>
          <Text>{createdBy}</Text>
        </View>
      </View>
      <FlatList 
        data={list}
        renderItem={renderItem}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  fontStyle: {
    fontSize: 14
  },
  borderStyle: {
    borderColor: '#CACFD2',
  },
  pills: {
    borderRadius: 16, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#008031', 
    margin: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 2
  },
  itemCard: {
    margin: 14, 
    padding: 8,
    backgroundColor: '#FFF',
    height: (height * 0.07) + 22, 
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
  textStyle: {
    fontSize: 14,
    lineHeight: 24
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

export default connect()(ViewApproval);