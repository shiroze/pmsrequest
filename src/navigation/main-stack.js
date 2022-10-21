import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {mainStack} from '~/config/navigator';

import Home from '~/navigation/home-stack';
import Order from '~/navigation/order-stack';
import History from '~/navigation/history-stack';
import Approval from '~/navigation/approval-stack';
import { Icon } from '@rneui/themed';

const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={mainStack.home} component={Home} options={{
        title: "Home",
        tabBarIcon: ({color, size}) => (
          <Icon name='home' type='feather' size={size} color={color} />
        )
      }} />
      <Tab.Screen name={mainStack.order} component={Order} options={{
        title: "Order",
        tabBarIcon: ({color, size}) => (
          <Icon name='shopping-cart' type='feather' size={size} color={color} />
        )
      }} />
      <Tab.Screen name={mainStack.history} component={History} options={{
        title: "History",
        tabBarIcon: ({color, size}) => (
          <Icon name='file-text' type='feather' size={size} color={color} />
        )
      }} />
      <Tab.Screen name={mainStack.approval} component={Approval} options={{
        title: "Approval",
        tabBarIcon: ({color, size}) => (
          <Icon name='user-check' type='feather' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  );
}

export default MainStack;