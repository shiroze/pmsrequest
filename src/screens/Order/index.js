import React, { useState } from 'react'
import { View, Text } from 'react-native';
import {orderSelector} from '~/modules/order/selectors';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';

function Order(props) {
  const {navigation, route, dispatch, orderCart} = props;
  const [list, setList] = useState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // setList(orderCart);
      reactotron.log(orderCart);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>This is Order Screen</Text>
      {
        orderCart.map((item, index) => {
          return (
            <Text key={index}>{item.itemCode}</Text>
          )
        })
      }
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    orderCart: orderSelector(state),
  };
};

export default connect(mapStateToProps)(Order);