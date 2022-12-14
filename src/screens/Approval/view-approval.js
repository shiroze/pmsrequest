import React, { useState } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';

import { SpeedDial, Button } from '@rneui/base';
import { Icon, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {approvalStack} from '~/config/navigator';
import {authSelector, accessSelector, locationSelector} from '~/modules/auth/selectors';
// import {getApprovalbyID} from '~/modules/approval/service';
import {getApprovalbyID} from '~/modules/approval/local';
import {approveOrder, localAppOrder} from '~/modules/approval/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import moment from 'moment/min/moment-with-locales';

const {width, height} = Dimensions.get("window");
const ITEM_HEIGHT = (height / 5) + 30;

moment.locale('id-ID');

function ViewApproval(props) {
  const {navigation, route, dispatch, auth, access, branch_id} = props;
  const {itemData, dtrans} = route.params;
  const [allow, setAllow] = useState(false);
  
  const [list, setList] = useState([]);

  const fetchData = async (id) => {
    try {
      /**
       * @param branch_id
       * @param id
       */
      const {data} = await getApprovalbyID({branch_id,id});

      if(data.error) {
        throw Error(data.message);
      } else {
        let result = data.data;
        // reactotron.log(result);

        setList(result);
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
      fetchData(itemData.no_order);
      if(itemData.approve_stage == 0 && access.some(val => val.namaSubmodul == "APPROVE STAGE 1" && val.allow == 'Y')) {
        setAllow(true);
      } else if(itemData.approve_stage == 1 && access.some(val => val.namaSubmodul == "APPROVE STAGE 2" && val.allow == 'Y')) {
        setAllow(true);
      } else {
        setAllow(false);
      }
      // reactotron.log(itemData.approve_stage);
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
    ({ item, index }) => <TouchableOpacity style={[styles.itemCard, {flex: 1, backgroundColor: (item.rejected && item.rejected == 1) ? '#ffc7c7' : '#c7ffdc'}]} 
      onPress={() => {
        // reactotron.log(item);
        navigation.navigate(approvalStack.detail_approval, {id: itemData.no_order, item, approveStage: itemData.approve_stage});
      }}
    >
      <View style={[styles.borderStyle, {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{branch_id}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: (item.rejected && item.rejected == 1) ? '#ffc7c7' : '#c7ffdc', textAlign: 'center'}]}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>{item.qty || 0}</Text>
          {" "+item.uomCode}
        </Text>
      </View>
      <Text style={styles.fontStyle} numberOfLines={1}>Nama : {item.itemDescription}</Text>
      <View style={[styles.borderStyle, {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 6,
        justifyContent: 'space-between',
      }]}>
        <Text style={styles.subdetailText}>Location Type: {item.locationType}</Text>
        <Text style={styles.subdetailText}>Location Code: {item.locationCode}</Text>
        <Text style={styles.subdetailText}>Job Code: {item.jobCode}</Text>
      </View>
    </TouchableOpacity>,
    [],
  )
  const keyExtractor = React.useCallback((item, index) => index.toString(), [])

  const approve = () => {
    let stage=0;

    if(access.some(val => val.namaSubmodul == "APPROVE STAGE 1" && val.allow == 'Y')) {
      stage=1;
    } else if(access.some(val => val.namaSubmodul == "APPROVE STAGE 2" && val.allow == 'Y')) {
      stage=2;
    }

    dispatch(localAppOrder({branch_id, id: itemData.no_order, username: auth.user.userName, stage}));
    // reactotron.log(access);
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header title={itemData.no_order} goBack={true} {...props} />
      <View style={[{margin: 14, padding: 8, flexDirection: 'row', borderBottomWidth: .5}]}>
        <View style={{width: '25%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>Tanggal</Text>
          <Text style={styles.fontStyle}>{moment(dtrans).format('ll')}</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>No Order</Text>
          <Text>{itemData.no_order}</Text>
        </View>
        <View style={{width: '25%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>Pemohon</Text>
          <Text>{itemData.requestBy}</Text>
        </View>
        <View style={{width: '20%'}}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>Status</Text>
          <Text>{itemData.order_status}</Text>
        </View>
      </View>
      <FlatList 
        data={list}
        renderItem={renderItem}
      />
      {
        (allow && list.filter(val => val.rejected == null).length > 0) && 
        (
          <Button 
            radius={18}
            title={'Approve'}
            buttonStyle={{backgroundColor: '#098438'}}
            containerStyle={{
              margin: 8
            }}
            onPress={approve}
          />
        )
      }
      {
        // __DEV__ && 
        // <Button title={'Test'} />
      }
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  fontStyle: {
    fontSize: 14,
    color: '#000'
  },
  subdetailText: {
    fontSize: 12,
    color: '#000'
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

const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    access: accessSelector(state),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(ViewApproval);