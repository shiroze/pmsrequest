import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {homeStack} from '~/config/navigator';

import Home from '~/screens/Approval/index';
import ViewItem from '~/screens/view-item';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={homeStack.home} component={Home} />
      <Stack.Screen name={homeStack.view_item} component={ViewItem} />
    </Stack.Navigator>
  );
}

export default HomeStack;