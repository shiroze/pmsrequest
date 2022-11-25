import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {stockCardStack} from '~/config/navigator';

import Home from '~/screens/StockCard/index';
import ListItem from '~/screens/StockCard/list-item';
import ViewCard from '~/screens/StockCard/view-card';
import Search from '~/screens/StockCard/search';

const Stack = createStackNavigator();

function StockStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={stockCardStack.home} component={Home} />
      <Stack.Screen name={stockCardStack.list_item} component={ListItem} />
      <Stack.Screen name={stockCardStack.view_card} component={ViewCard} />
      <Stack.Screen name={stockCardStack.search} component={Search} />
    </Stack.Navigator>
  );
}

export default StockStack;