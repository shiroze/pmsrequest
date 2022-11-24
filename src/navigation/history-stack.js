import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {historyStack} from '~/config/navigator';

import Home from '~/screens/History/index';
import ViewHistory from '~/screens/History/view-history';

const Stack = createStackNavigator();

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={historyStack.home} component={Home} />
      <Stack.Screen name={historyStack.view_history} component={ViewHistory} />
    </Stack.Navigator>
  );
}

export default HistoryStack;