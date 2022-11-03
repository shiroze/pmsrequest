import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {approvalStack} from '~/config/navigator';

import Home from '~/screens/Approval/index';
import ViewApproval from '~/screens/Approval/view-approval';
import DetailApproval from '~/screens/Approval/detail_approval';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={approvalStack.home} component={Home} />
      <Stack.Screen name={approvalStack.view_approval} options={{headerTitle: 'View Item'}} component={ViewApproval} />
      <Stack.Screen name={approvalStack.detail_approval} component={DetailApproval} />
    </Stack.Navigator>
  );
}

export default HomeStack;