import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {mainStack2} from '~/config/navigator';

import Home from '~/screens/home_2';
import Stock from '~/navigation/stock-stack';
import History from '~/navigation/history-stack';
import Approval from '~/navigation/approval-stack';
import Issue from '~/navigation/issue-stack';

import { isLoginSelector, accessSelector } from '~/modules/auth/selectors';

import { Icon } from '@rneui/themed';

import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

function MainStack(props) {
  const {accessRight} = props;

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name={mainStack2.home} component={Home} options={{
        title: "Home",
        tabBarIcon: ({color, size}) => (
          <Icon name='home' type='feather' size={size} color={color} />
        )
      }} />
      <Tab.Screen name={mainStack2.stock} component={Stock} options={{
        title: "Stock",
        tabBarIcon: ({color, size}) => (
          <Icon name='shopping-cart' type='feather' size={size} color={color} />
        )
      }} />
      {/* <Tab.Screen name={mainStack2.history} component={History} options={{
        title: "History",
        tabBarIcon: ({color, size}) => (
          <Icon name='file-text' type='feather' size={size} color={color} />
        )
      }} /> */}
      {
        accessRight.some(e => e.namaSubmodul == "RELEASE ITEM" && e.allow == "Y") ?
        <Tab.Screen name={mainStack2.approval} component={Issue} options={{
          title: "Status",
          tabBarIcon: ({color, size}) => (
            <Icon name='user-check' type='feather' size={size} color={color} />
          )
        }} />
        :
        <Tab.Screen name={mainStack2.approval} component={Approval} options={{
          title: "Status",
          tabBarIcon: ({color, size}) => (
            <Icon name='user-check' type='feather' size={size} color={color} />
          )
        }} />
      }
    </Tab.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    accessRight: accessSelector(state),
    isLogin: isLoginSelector(state),
  }
}

export default connect(mapStateToProps)(MainStack);