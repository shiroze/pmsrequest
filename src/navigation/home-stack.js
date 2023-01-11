import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {homeStack} from '~/config/navigator';

import Home from '~/screens/home';
import ListItem from '~/screens/common/list-item';
import ViewItem from '~/screens/common/view-item';
import JobDetail from '~/screens/common/job_detail';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={homeStack.home} component={Home} />
      <Stack.Screen name={homeStack.list_item} component={ListItem} />
      <Stack.Screen name={homeStack.view_item} component={ViewItem} />
      <Stack.Screen name={homeStack.job_detail} component={JobDetail} />
    </Stack.Navigator>
  );
}

export default HomeStack;