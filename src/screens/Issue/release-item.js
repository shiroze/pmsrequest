import React, { useState } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';

import { SpeedDial, Button } from '@rneui/base';
import { Icon, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {issueStack} from '~/config/navigator';
import {authSelector, accessSelector, locationSelector} from '~/modules/auth/selectors';
// import {getIssuebyID} from '~/modules/issue/service';
import {getIssuebyID} from '~/modules/issue/local';
import {issueOrder, localIssueOrder} from '~/modules/issue/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import moment from 'moment/min/moment-with-locales';

const {width, height} = Dimensions.get("window");
const ITEM_HEIGHT = (height / 5) + 30;

moment.locale('id-ID');

function ReleaseItem(props) {
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
      const {data} = await getIssuebyID({branch_id,id});

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
      if(access.some(val => val.namaSubmodul == "RELEASE ITEM" && val.allow == 'Y') && itemData.approve_stage < 3) {
        setAllow(true);
      } else if (itemData.approve_stage == 3) {
        setAllow(false);
      } else {
        setAllow(false);
      }
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
        // navigation.navigate(issueStack.detail_issue, {id, item});
        reactotron.log("Do Nothing");
      }}
    >
      <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{branch_id}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: (item.rejected && item.rejected == 1) ? '#ffc7c7' : '#c7ffdc', textAlign: 'center'}]}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>{item.qty || 0}</Text>
          {" "+item.uomCode}
        </Text>
      </View>
      <Text style={styles.fontStyle} numberOfLines={1}>Nama : {item.itemDescription}</Text>
      <Text style={styles.fontStyle} numberOfLines={3}>Keterangan: {item.keterangan}</Text>
    </TouchableOpacity>,
    [],
  )
  const keyExtractor = React.useCallback((item, index) => index.toString(), [])

  const release = () => {
    dispatch(localIssueOrder({branch_id, id: itemData.no_order, username: auth.user.userName}));
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
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
        allow && (
          <Button 
            radius={18}
            title={'Release'}
            buttonStyle={{backgroundColor: '#098438'}}
            containerStyle={{
              margin: 8
            }}
            onPress={release}
          />
        )
      }
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

const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    access: accessSelector(state),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(ReleaseItem);