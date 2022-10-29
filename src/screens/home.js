import React, {useState} from 'react';
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';
import {loadItemGroup} from '~/modules/common/service';
import { showMessage } from 'react-native-flash-message';
import reactotron from 'reactotron-react-native';
import { connect } from 'react-redux';

const {width, height} = Dimensions.get('window');
const btnSize = 72;
const iconSize = 32;

function Home (props) {
  const {navigation} = props;
  
  const [list, setList] = useState();
  const dataSource = [
    {
      icon_name: 'gas-pump',
      icon_source: 'font-awesome-5',
      name: 'Fuel'
    },
    {
      icon_name: 'oil',
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
      icon_name: 'droplet',
      icon_source: 'feather',
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
      const {data} = await loadItemGroup();
      let newData = [];
      // reactotron.log(data);

      data.forEach(element => {
        dataSource.map((item,index) => {
          if(item.name.toUpperCase() == element.groupName) {
            var newItem = {
              name: element.groupName,
              count: element.subgroupCount,
              icon_name: item.icon_name,
              icon_source: item.icon_source
            };
            // reactotron.log(newItem);

            newData.push(newItem);
          }
        });
      });

      // reactotron.log(newData);

      setList(newData);
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
      fetchData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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
            <Text style={styles.textWhite}>Nama : Albella Khotani</Text>
            <Text style={styles.textWhite}>Posisi: Asistem Proses</Text>
            <Text style={styles.textWhite}>Mill: PNS</Text>
            <Text style={styles.textWhite}>PT: Gunung Melayu</Text>
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

export default connect()(Home);