import React, {useState} from 'react';
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {authSelector, locationSelector} from '~/modules/auth/selectors';
// import {loadItemGroup} from '~/modules/common/service';
import {loadItemGroup} from '~/modules/common/local';

import { connect } from 'react-redux';

import {handleError, handleInfo, handleSuccess} from '~/utils/message';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');
const btnSize = 72;
const iconSize = 32;

function Home (props) {
  const {navigation, route, auth, branch_id} = props;
  
  const [backPressCount, setBackPressCount] = useState(0);
  const [list, setList] = useState();
  const dataSource = [
    {
      icon_name: 'gas-pump',
      icon_source: 'font-awesome-5',
      name: 'Fuel'
    },
    {
      icon_name: 'engine-outline',
      icon_source: 'material-community',
      name: 'Grease'
    },
    {
      icon_name: 'setting',
      icon_source: 'antdesign',
      name: 'Spare part'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Oil'
    },
    {
      icon_name: 'thermometer',
      icon_source: 'feather',
      name: 'Chemical'
    },
    {
      icon_name: 'tree-outline',
      icon_source: 'material-community',
      name: 'Fertilisers'
    },
    {
      icon_name: 'shopping-bag',
      icon_source: 'feather',
      name: 'General Good'
    },
    {
      icon_name: 'git-compare-outline',
      icon_source: 'ionicon',
      name: 'Consignment'
    },
    {
      icon_name: 'box',
      icon_source: 'feather',
      name: 'Packing'
    }
  ];

  const fetchData = async () => {
    try {
      const {data} = await loadItemGroup({branch_id});
      let newData = [];
      if(data.error) {
        throw Error(data.message);
      } else {
        // data.forEach(element => {
        //   reactotron.log(element);
        // });
        let result = data.data;

        dataSource.sort((a, b) => (a.name > b.name) ? 1 : -1)
        .forEach(element => {
          if(result.some(val => element.name.toUpperCase() === val.groupName)) {
            let item = result.filter(val => element.name.toUpperCase() === val.groupName);
            let newItem = {
              name: item[0].groupName,
              count: item[0].subgroupCount,
              icon_name: element.icon_name,
              icon_source: element.icon_source
            };
            // reactotron.log(newItem);

            newData.push(newItem);
          }
        });

        // reactotron.log(newData);

        setList(newData);
      }
    } catch (e) {
      handleError({
        message: e.code,
        description: e.message,
      });
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  useFocusEffect(
    React.useCallback(() => {
      const backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if(route.name == homeStack.home) {
          BackHandler.exitApp();
          return true;
        } else {
          return false;
        }
      });

      return () => backhandler.remove();
    }, [])
  );

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header {...props} />
      <View style={{margin: "4%"}}>
        <View style={styles.identityCard}>
          <Avatar
            size={104}
            icon={{
              name: 'person-outline',
              type: 'material',
              color: '#098438',
              size: 40
            }}
            containerStyle={{ backgroundColor: '#FFF',borderRadius: 10, 
            overflow: 'hidden',
            borderWidth: 1, 
            borderColor: '#FFF' }}
          />
          <View>
            <Text style={styles.textWhite}>Nama : {auth.user.userName}</Text>
            <Text style={styles.textWhite}>Posisi: {auth.user.fullName}</Text>
            <Text style={styles.textWhite}>Mill: {branch_id}</Text>
            <Text style={styles.textWhite}>PT. Gunung Melayu</Text>
          </View>
        </View>
        <Text style={styles.headTitle}>Kategori</Text>
        <FlatList
          style={{marginTop: 20}}
          data={list}
          numColumns={3}
          horizontal={false}
          columnWrapperStyle={{
            margin: 10,
            justifyContent: 'space-around'
          }}
          showsVerticalScrollIndicator={true}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.btnItemgroup}
              key={index} 
              onPress={()=>navigation.navigate(homeStack.list_item, {group_name: item.name, sub_count: item.count})}>
              <Icon 
                style={styles.iconStyle}
                name={item.icon_name}
                type={item.icon_source}
                size={iconSize}
              />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
  textWhite: {
    color: '#FFF',
    lineHeight: 28,
  },
  identityCard: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 14,
    backgroundColor: "#008031", 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF'
  },
  headTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10
  },
  btnItemgroup: {
    margin: 8,
    width: width * 0.3,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconStyle: {
    margin: 10,
    padding: 10,
    backgroundColor: "#d9d9d9", 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF'
  }
});

/**
 * Mengambil informasi user kondisi login di mana
 */
const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    branch_id: locationSelector(state),
  };
};

export default connect(mapStateToProps)(Home);