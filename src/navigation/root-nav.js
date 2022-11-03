import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {rootSwitch} from '~/config/navigator';

import Login from '~/screens/login';
import MainStack from './main-stack';
import Search from '~/screens/search';
import Account from '~/screens/account';

import { isLoginSelector } from '~/modules/auth/selectors';

import { connect } from 'react-redux';

const Stack = createStackNavigator();

function rootNav(props) {
  const {isLogin} = props;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={(__DEV__ && isLogin) ? rootSwitch.main : rootSwitch.login}>
      <Stack.Screen name={rootSwitch.login} component={Login} />
      <Stack.Screen name={rootSwitch.main} component={MainStack} />
      <Stack.Screen name={rootSwitch.search} options={{title: "Search"}} component={Search} />
      <Stack.Screen name={rootSwitch.account} options={{title: "Account"}} component={Account} />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    isLogin: isLoginSelector(state)
  }
}
export default connect(mapStateToProps)(rootNav);