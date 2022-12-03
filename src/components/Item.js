import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const Item = (props) => {
  const {onPress, branch_id, item} = props;

  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '35%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{branch_id}</Text>
        <Text style={[styles.fontStyle, {width: '15%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: '#c7ffdc', textAlign: 'center'}]}>
          <Text style={[styles.fontStyle, {fontWeight: 'bold'}]}>{item.stock || 0}</Text>
          {" "+item.uomCode}
        </Text>
      </View>
      <Text style={[styles.fontStyle, {flexGrow: 1, fontWeight: 'bold'}]} numberOfLines={2}>{item.itemDescription}</Text>
      {
        item.keterangan &&
        <Text style={styles.fontStyle} numberOfLines={3}>{item.keterangan}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fontStyle: {
    fontSize: 14,
  },
  borderStyle: {
    borderColor: '#CACFD2',
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
  },
})

export default Item;