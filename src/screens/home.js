import React, {useState} from 'react';
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {homeStack} from '~/config/navigator';

const {width, height} = Dimensions.get('window');
const btnSize = 72;
const iconSize = 40;

export default function Home (props) {
  const {navigation} = props;
  const [search, setSearch] = useState("");
  const dataSource = [
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Fuel'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Grease'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Oil'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Fuel'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Grease'
    },
    {
      icon_name: 'droplet',
      icon_source: 'feather',
      name: 'Oil'
    }
  ];

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header onChangeText={setSearch} value={search} />
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
          data={dataSource}
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
              onPress={()=>navigation.navigate(homeStack.view_item)}>
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
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconStyle: {
    margin: 10,
    padding: 5,
    backgroundColor: "#d9d9d9", 
    borderRadius: 10, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFF'
  }
});