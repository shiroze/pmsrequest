import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {getMaterial, loadSubGroup} from '~/modules/common/service';

import reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');

function ListItem(props) {
  const {navigation} = props;
  const {group_name} = props.route.params;

  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [hide, setHide] = useState(false);
  const [subgroupName, setSubGroup] = useState("");

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

  const fetchSubgroup = async (groupName) => {
    const {data} = await loadSubGroup({groupName});

    setSubList(data);
    /**
     * Set yang lagi aktif subgroup pertama
     */
    setSubGroup(data[0].subGroupName);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setStart(1);
      setEnd(50);

      fetchSubgroup(group_name);
    });
    if(subgroupName != "") {
      fetchData(group_name, subgroupName, start, end);
    }

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, subgroupName]);

  const _nextPage = async () => {
    setStart(end+1);
    setEnd(end+50);

    fetchData(group_name, subgroupName, start, end);
    // if(!onEndReachedCalledDuringMomentum && !isEnd) {
    //   setPage(page+1);
    //   const nextPage=page+1;

    //   if(keyword == '') {
    //     const {data} = await loadRent({page: nextPage});
    //     let listData = list;
    //     let cData = listData.concat(data);

    //     setList(cData);

    //     if(data.length < 20) {
    //       // update state End fetch
    //       setEnd(true);
    //     }
    //   } else {
    //     const {data} = await searchRent({keyword, page: nextPage});

    //     arraySearch.concat(data);

    //     if(data.length < 20) {
    //       // update state End fetch
    //       setEnd(true);
    //     }
    //   }

    //   onEndReachedCalledDuringMomentum = true;
    // }

    // if(isEnd) {
    //   reactotron.log("End of Page");
    // }
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header onChangeText={setSearch} value={search} goBack={true} {...props} />
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10}]}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{group_name}</Text>
      </View>
      <View style={[styles.borderStyle, {borderBottomWidth: .875, padding: 10}]}>
        <FlatList 
          horizontal
          data={subList}
          renderItem={({item, index}) => (
            <TouchableOpacity 
              style={[styles.pills, {backgroundColor: subgroupName == item.subGroupName ? '#008031' : '#FFF'}]}
              onPress={() => {
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
      <FlatList 
        data={list}
        renderItem={({item, index}) => (
          <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate(homeStack.view_item, {item_code: item.itemCode})}>
            <View style={[styles.borderStyle, {flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 4, borderBottomWidth: .5}]}>
              <Text style={styles.fontStyle}>{item.itemCode}</Text>
              <Text style={styles.fontStyle}>{"{Lokasi}"}</Text>
              <Text style={styles.fontStyle}>{"{Gudang}"}</Text>
              <Text style={styles.fontStyle}>{item.uomCode}</Text>
            </View>
            <Text style={styles.fontStyle}>Nama : {item.itemDescription}</Text>
          </TouchableOpacity>
        )}
        // onEndReached={({distanceFromEnd}) => {
        //   if(distanceFromEnd < 0) {
        //     return (
        //       <TouchableOpacity style={{}} onPress={_nextPage}>
        //         <Text>Load more</Text>
        //       </TouchableOpacity>
        //     )
        //   }
        // }}
        ListFooterComponent={() => {
          return (
            !hide ? <TouchableOpacity style={{marginBottom: 12, alignItems: 'center'}} onPress={_nextPage}>
              <Text style={{fontSize: 18}}>Load more</Text>
            </TouchableOpacity> : <View style={{marginBottom: 12, alignItems: 'center'}}>
              <Text style={{fontSize: 18}}>Reach end of list</Text>
            </View>
          )
        }}
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

export default connect()(ListItem);