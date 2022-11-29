import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import {issueStack} from '~/config/navigator';

import Home from '~/screens/Issue/index';
import ReleaseItem from '~/screens/Issue/release-item';
import TakePhoto from '~/screens/Issue/take-photo';

const Stack = createStackNavigator();

function IssueStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={issueStack.home} component={Home} />
      <Stack.Screen name={issueStack.release_item} options={{headerTitle: 'Release Item'}} component={ReleaseItem} />
      <Stack.Screen name={issueStack.take_photo} options={{headerTitle: 'Upload Photo'}} component={TakePhoto} />
    </Stack.Navigator>
  );
}

export default IssueStack;