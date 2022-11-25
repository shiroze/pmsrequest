import React, { useState } from 'react'
import { View, Text, Dimensions, FlatList, StyleSheet, Keyboard, TouchableOpacity, Alert } from 'react-native';

import { SpeedDial, Button } from '@rneui/base';
import { Icon, Overlay } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {removeFromCart, emptyCart, checkout, localCheckout} from '~/modules/order/actions';
import {orderSelector} from '~/modules/order/selectors';
import {authSelector, locationSelector} from '~/modules/auth/selectors';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get("window");
const ITEM_HEIGHT = (height / 5) + 30;

function Order(props) {
  const {navigation, route, dispatch, orderCart, branch_id, auth} = props;
  
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setList(orderCart);
      // reactotron.log(orderCart);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setOpen(false);
      setShowView(false);
      setSelected();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const toggleView = () => {
    setShowView(!showView);
  };
  
  const ViewOrder = () => {
    let array = orderCart;
    let viewData = orderCart[selected];

    return (
      <Overlay isVisible={showView} animationType={'slide'} onBackdropPress={toggleView} overlayStyle={{backgroundColor: '#FFF', padding: 8, height: '60%', width: '80%'}}>
        {viewData ?
          (
            <View style={{flex:1, margin: 20}}>
              <Text style={styles.textStyle}>{"Kode: " + viewData.itemCode}</Text>
              <Text style={styles.textStyle}>{"Nama: " + viewData.itemDescription}</Text>
              <Text style={styles.textStyle}>{"Satuan: " + viewData.uomCode}</Text>
              <Text style={styles.textStyle}>{"Kuantiti Tersedia: "+viewData.stock}</Text>
              <Text style={styles.textStyle}>{"Kuantiti Diminta: "+viewData.qty}</Text>
              <Text style={styles.textStyle}>{"Keterangan Penggunaan: "+viewData.keterangan}</Text>
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}}>
                <TouchableOpacity style={[styles.btnStyle, {backgroundColor: '#ce0000', width: '40%'}]}
                  onPress={() => {
                    array.splice(selected, 1);
                    dispatch(removeFromCart({payload:array}))
                  }}>
                  <Text style={{color: '#FFF'}}>Hapus</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnStyle, {width: '40%'}]} onPress={toggleView}>
                  <Text style={{color: '#FFF'}}>Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
          :
          (
            <View style={{margin: 20, padding: 15, height: height * 0.12575}}>
              <Text>
                Tidak ada Data
              </Text>
            </View>
          )
        }
      </Overlay>
    )
  }
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
        setSelected(index);
        setTimeout(() => {
          toggleView();
        }, 700);
      }}
    >
      <View style={[styles.borderStyle, {flexDirection: 'row', marginBottom: 4, borderBottomWidth: .5}]}>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.itemCode}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{branch_id}</Text>
        <Text style={[styles.fontStyle, {width: '25%'}]}>{item.warehouse}</Text>
        <Text style={[styles.fontStyle, {width: '25%', backgroundColor: '#c7ffdc', textAlign: 'center'}]}>
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

  const submitOrder = () => {
    Alert.alert("Confirm", "Anda yakin ingin submit Data ?",
    [
      {
        text: "OK",
        onPress: () => dispatch(localCheckout({branch_id,username: auth.user.userName,cart: orderCart})),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel"),
        style: "cancel"
      }
    ])
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header {...props} />
      <ViewOrder />
      {
        orderCart.length == 0 ? (
          <View style={{flex:1, width, height, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Order Cart is Empty add Item first</Text>
          </View>
        ) : (
          <FlatList 
            data={orderCart}
            renderItem={renderItem}
            ListFooterComponent={() => (
              <Button 
                radius={20}
                title={"Submit"}
                buttonStyle={{backgroundColor: '#098438'}}
                containerStyle={{margin: 30}}
                onPress={submitOrder}
              />
            )}
          />
        )
      }
      <SpeedDial
        isOpen={open}
        icon={{ name: 'edit', color: '#FFF'}}
        openIcon={{ name: 'close', color: '#FFF'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={{ name: 'delete', color: '#FFF' }}
          title="Empty Order"
          onPress={() => 
            dispatch(emptyCart())
          }
        />
      </SpeedDial>
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
    orderCart: orderSelector(state).toJS(),
    auth: authSelector(state),
    branch_id: locationSelector(state)
  };
};

export default connect(mapStateToProps)(Order);