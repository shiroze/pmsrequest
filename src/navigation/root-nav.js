import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {rootSwitch} from '~/config/navigator';

import Login from '~/screens/login';
import MainStack from './main-stack';
import Search from '~/screens/search';
import Account from '~/screens/account';

import { connect } from 'react-redux';

const Stack = createStackNavigator();

function rootNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={rootSwitch.login} component={Login} />
      <Stack.Screen name={rootSwitch.main} component={MainStack} />
      <Stack.Screen name={rootSwitch.search} component={Search} />
      <Stack.Screen name={rootSwitch.account} component={Account} />
    </Stack.Navigator>
  );
}

export default connect()(rootNav);