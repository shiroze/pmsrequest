import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { SearchBar } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {getLocationType, getLocationCode, getJobCode} from '~/modules/common/local';
import {locationSelector} from '~/modules/auth/selectors';

import reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = (height / 5) + 30;

function JobDetail(props) {
  const {navigation, branch_id, route} = props;
  const {tipe, value} = route.params;

  const [filter, setFilter] = useState("");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLocationType = async () => {
    try {
      /**
       * @param groupName : group name
       * @param query : keyword
       * @param start : start page
       * @param end : end page
       */
      const {data} = await getLocationType({branch_id, keyword: filter});
      
      if(data.error) {
        throw Error(data.message);
      } else {
        let result = data.data;
        if(result.length < 50) {
          setHide(true);
        } else {
          setHide(false);
        }

        reactotron.log(result);

        let temp = [];

        result.map((item) => {
          temp.push({
            id: item.loc_type,
            name: item.loc_name,
          });
        });

        if(filter == "") {
          let listData = list;
          let cData = listData.concat(temp);
          
          setList(cData);
        } else {
          setList(temp);
        }
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

  const fetchLocationCode = async () => {
    try {
      /**
       * @param groupName : group name
       * @param query : keyword
       * @param start : start page
       * @param end : end page
       */
      const {data} = await getLocationCode({branch_id, loc_type: value, keyword: filter, page});
      
      if(data.error) {
        throw Error(data.message);
      } else {
        let result = data.data;
        if(result.length < 50) {
          setHide(true);
        } else {
          setHide(false);
        }

        reactotron.log(result);

        let temp = [];

        result.map((item) => {
          temp.push({
            id: item.loc_code,
            name: item.description,
          });
        });

        if(filter == "") {
          let listData = list;
          let cData = listData.concat(temp);
          
          setList(cData);
        } else {
          setList(temp);
        }
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

  const fetchJobCode = async () => {
    try {
      /**
       * @param groupName : group name
       * @param subgroupName : group name
       * @param page : pagination
       * @param query : keyword
       */
      const {data} = await getJobCode({branch_id, keyword: filter, page});

      if(data.error) {
        setLoading(false);
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;
        if(result.length < 50) {
          setHide(true);
        } else {
          setHide(false);
        }

        let temp = [];

        result.map((item) => {
          temp.push({
            id: item.job_code,
            name: item.job_name,
          });
        });

        if(filter == "") {
          let listData = list;
          let cData = listData.concat(temp);
          
          setList(cData);
        } else {
          setList(temp);
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

  const fetchDataTable = () => {
    if(tipe == 1) {
      fetchLocationType();
    } else if(tipe == 2) {
      fetchLocationCode();
    } else {
      fetchJobCode(page);
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchDataTable();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  /**
   * Fungsi disini untuk menload data ketika pagination
   */
  React.useLayoutEffect(() => {
    if(page != 1) {
      fetchDataTable();
    }
  }, [page]);

  const renderItem = React.useCallback(
    ({ item }) => <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate(homeStack.view_item, {tipe, code: item.name, value: item.id})}>
      <Text>{`${item.id} - ${item.name}`}</Text>
    </TouchableOpacity>,
    [],
  )
  const _nextPage = async () => {
    if(!hide) {
      setPage(page+1);
      setLoading(true);
    }
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <SearchBar
        placeholder='Input keyword'
        round
        onChangeText={setFilter}
        value={filter}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        onSubmitEditing={() => {
          fetchDataTable();
        }}
        returnKeyLabel='Search'
        returnKeyType='search'
      />
      {
        <FlatList 
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={list.length}
          maxToRenderPerBatch={10}
          ListFooterComponent={() => {
            if(list.length > 0) {
              return (
                (!hide && tipe != 1) ? <TouchableOpacity style={styles.footerComponentStyle} onPress={_nextPage}>
                  <Text style={{fontSize: 18}}>{loading ? <ActivityIndicator size={"large"} color={'#faa634'} style={{marginTop: 24}} /> : "Load more"}</Text>
                </TouchableOpacity> : <View style={styles.footerComponentStyle}>
                  <Text style={{fontSize: 18}}>Reach end of list</Text>
                </View>
              )
            } else {
              return (
                <View style={styles.footerComponentStyle}>
                  <Text style={{fontSize: 20}}>No data Found</Text>
                </View>
              )
            }
          }}
          onEndReached={_nextPage}
          onEndReachedThreshold={0.15}
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
    flex: 1,
    margin: 8,
    padding: 14,
    backgroundColor: '#FFF',
    // height: (height * 0.07) + 22, 
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
    elevation: 3
  },
  containerStyle: {
    // width: width * 0.85,
    backgroundColor:'#faa634',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainerStyle: {
    backgroundColor:'#FFF', 
    height: 32,
  },
  inputStyle: {
    fontSize: 14
  },
  footerComponentStyle: {
    marginTop:18, 
    marginBottom: 12, 
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(JobDetail);