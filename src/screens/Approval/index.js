import React, { useState } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';

import { SpeedDial, Button } from '@rneui/base';
import { Icon, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {approvalStack} from '~/config/navigator';
import {getApproval} from '~/modules/approval/service';
import {authSelector, locationSelector} from '~/modules/auth/selectors';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

import moment from 'moment/min/moment-with-locales';

const {width, height} = Dimensions.get("window");
const ITEM_HEIGHT = (height / 5) + 30;

moment.locale('id-ID');

function Approval(props) {
  const {navigation, route, dispatch, branch_id} = props;
  
  const [approval, setApproval] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (start, end) => {
    try {
      /**
       * @param start : start page
       * @param end : end page
       * @param date_from : tanggal mulai
       * @param date_to : tanggal akhir
       */
      const {data} = await getApproval({branch_id,start, end});
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        var result = data.data;
        if(result.length < 50) {
          setHide(true);
        } else {
          setHide(false);
        }

        if(start == 1) {
          setApproval(result);
        } else {
          let listData = approval;
          let cData = listData.concat(result);

          // reactotron.log(cData);

          setApproval(cData);
        }
        setLoading(false);
      }
    } catch (e) {
      showMessage({
        message: e.code,
        description: e.message,
        icon: 'danger',
        type: 'danger',
        hideOnPress: true
      });
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchData(start,end);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  React.useLayoutEffect(() => {
    if(start != 1 && end != 50) {
      fetchData(start, end);
    }
  }, [start, end]);

  const getItemLayout = React.useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  )
  const renderItem = React.useCallback(
    ({ item, index }) => <TouchableOpacity style={styles.itemCard} 
      onPress={() => {
        navigation.navigate(approvalStack.view_approval, {id: item.no_order, dtrans: item.dtrans, requestBy: item.requestBy, order_status: item.order_status});
      }}
    >
      <Text>{item.dtrans}</Text>
      <Text>{item.no_order}</Text>
      <Text>{item.requestBy}</Text>
      <Text>{item.order_status}</Text>
    </TouchableOpacity>,
    [],
  )
  const keyExtractor = React.useCallback((item, index) => index.toString(), [])

  const _nextPage = async () => {
    setStart(end+1);
    setEnd(end+50);
    setLoading(true);
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header {...props} />
      {
        <FlatList 
          data={approval}
          renderItem={renderItem}
          // initialNumToRender={10}
          // maxToRenderPerBatch={5}
          // getItemLayout={getItemLayout}
          ListFooterComponent={() => {
            if(approval.length > 0) {
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
          }}
          // keyExtractor={keyExtractor}
        />
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
    flex:1, 
    margin: 14, 
    padding: 8,
    backgroundColor: '#FFF',
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
    fontSize: 12,
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
    branch_id: locationSelector(state)
  };
};

export default connect(mapStateToProps)(Approval);