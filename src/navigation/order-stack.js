import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {orderStack} from '~/config/navigator';

import Home from '~/screens/Order/index';

const Stack = createStackNavigator();

function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={orderStack.home} component={Home} />
    </Stack.Navigator>
  );
}

export default OrderStack;