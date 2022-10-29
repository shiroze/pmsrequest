import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {getMaterial, loadSubGroup} from '~/modules/common/service';

import reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = (height / 5) + 30;

function Search(props) {
  const {navigation} = props;
  const {group_name, sub_count} = props.route.params;

  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [hide, setHide] = useState(false);
  const [subgroupName, setSubGroup] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (groupName, subgroupName, start, end, query='') => {
    try {
      /**
       * @param groupName : group name
       * @param query : keyword
       * @param start : start page
       * @param end : end page
       */
      const {data} = await getMaterial({groupName,subgroupName,query,start,end});

      // data.forEach(element => {
      //   reactotron.log(element);
      // });

      if(data.length < 50) {
        setHide(true);
      } else {
        setHide(false);
      }

      let listData = list;
      let cData = listData.concat(data);

      setList(cData);
      setLoading(false);
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

  const fetchSubgroup = async (groupName) => {
    const {data} = await loadSubGroup({groupName});

    if(data.length > 0) {
      setSubList(data);
      /**
       * Set yang lagi aktif subgroup pertama
       */
      setSubGroup(data[0].subGroupName);
    } else {
      setSubList([]);
      setSubGroup("");
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchSubgroup(group_name);
      if(sub_count == 0 && subgroupName == "") {
        fetchData(group_name, "", start, end);
      }
    });
    if(subgroupName && subgroupName != "" && sub_count > 0) {
      fetchData(group_name, subgroupName, start, end);
    }

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, subgroupName]);

  /**
   * Fungsi disini untuk menload data ketika pagination
   */
  React.useLayoutEffect(() => {
    if(start != 1 && end != 50) {
      fetchData(group_name, subgroupName || "", start, end);
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
        <Text style={[styles.fontStyle, {width: '25%'}]}>PNS</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>
          {(item.stock || 0)+" "+item.uomCode}
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
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10}]}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{group_name}</Text>
      </View>
      {
        (subList.length > 0 && sub_count > 0) && (
          <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10}]}>
            <FlatList 
              horizontal
              data={subList}
              renderItem={({item, index}) => (
                <TouchableOpacity 
                  style={[styles.pills, {backgroundColor: subgroupName == item.subGroupName ? '#008031' : '#FFF'}]}
                  onPress={() => {
                    setLoading(true);
                    setList([]);
                    setSubGroup(item.subGroupName)
                  }}
                >
                  <Text style={{color: subgroupName != item.subGroupName ? '#008031' : '#FFF'}}>{item.subGroupName}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )
      }
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

export default connect()(Search);