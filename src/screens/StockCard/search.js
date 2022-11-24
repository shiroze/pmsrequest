import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {searchMaterial, loadSubGroup} from '~/modules/common/service';
import {locationSelector} from '~/modules/auth/selectors';

import reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = (height / 5) + 30;

function Search(props) {
  const {navigation, branch_id} = props;
  const {keyword} = props.route.params;

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [hide, setHide] = useState(false);
  const [subgroupName, setSubGroup] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (start, end) => {
    try {
      /**
       * @param groupName : group name
       * @param query : keyword
       * @param start : start page
       * @param end : end page
       */
      const {data} = await searchMaterial({branch_id,query: keyword,start,end});
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        var result = data.data;

        // data.forEach(element => {
        //   reactotron.log(element);
        // });

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
    } catch (error) {
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
      fetchData(start, end);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /**
   * Fungsi disini untuk menload data ketika pagination
   */
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
    ({ item }) => <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate(homeStack.view_item, {item_code: item.itemCode})}>
      <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{branch_id}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: '#c7ffdc', textAlign: 'center'}]}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>{item.stock || 0}</Text>
          {" "+item.uomCode}
        </Text>
      </View>
      <Text style={[styles.fontStyle, {flexGrow: 1}]} numberOfLines={2}>Nama : {item.itemDescription}</Text>
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
      <Header goBack={true} {...props} />
      {
        <FlatList 
          data={list}
          renderItem={renderItem}
          maxToRenderPerBatch={8}
          getItemLayout={getItemLayout}
          ListFooterComponent={() => {
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
          }}
          keyExtractor={keyExtractor}
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
    fontSize: 14,
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
  }
});

const mapStateToProps = (state) => {
  return {
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(Search);