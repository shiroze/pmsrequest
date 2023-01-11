import React, {useRef, useState} from 'react';
import { AppState } from 'react-native';
import moment from 'moment';

import { createStackNavigator } from '@react-navigation/stack';

import {rootSwitch} from '~/config/navigator';

import Login from '~/screens/login';
import MainStack from './main-stack';
import MainStack2 from './main-stack-2';
import Search from '~/screens/search';
import Account from '~/screens/account';
import SyncPage from '~/screens/Sync/index';
import Synchronize from '~/screens/synchronize';

import * as Actions from '~/modules/auth/constants';
import {signOut} from '~/modules/auth/actions';
import { isLoginSelector, accessSelector, sessionSelector } from '~/modules/auth/selectors';
import { lastUpdateSelector } from '~/modules/sync/selectors';

import { connect } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import reactotron from 'reactotron-react-native';

const Stack = createStackNavigator();

function RootNav(props) {
  const {route, dispatch, sessionTime, isLogin, accessRight, lastUpdate} = props;
  const appState = useRef(AppState.currentState);

  const initRoute = isLogin ? rootSwitch.main : rootSwitch.login;

  React.useEffect(() => {
    /**
     * Check if DB PMS is available
     */
    RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.MainBundleDir + '/databases').then((files) => {
      let db_name = files.filter(e => e == 'db_pms.db')[0];
      
      // reactotron.log(db_name, db_name == undefined ? 'Not Exist' : 'Exist');
      if(db_name == undefined) {
        SQLite.openDatabase({name: 'db_pms.db', createFromLocation: 1}, 
        () => {
          reactotron.log("Database Initialization Success");
        }, 
        (e) => reactotron.log(e));
      } 
      // else {
      //   // reactotron.log("Database already existed, Skip Initialization");
      // }
    });
  }, []);

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        reactotron.log("App has come to the foreground!");
      } else if(appState.current.match(/active/) && nextAppState === "background" && isLogin) {
        /** Set Timeout to Login */
        dispatch({
          type: Actions.SET_SESSION,
          payload: moment().add(30, 'm')
        });
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [sessionTime]);

  React.useLayoutEffect(() => {
    if(sessionTime !== undefined) {
      let diff = moment(sessionTime).diff(moment(), 'm');
      
      // reactotron.log("Cur Session : " + moment(sessionTime).format('lll')+" | "+moment().format('lll'), "Diff : " + diff);
      
      if(diff < 0) {
        // reactotron.log("Cur Session : " + moment(sessionTime).format('lll')+" | "+moment().format('lll'), "Diff : " + diff);
        dispatch(signOut({expired: true}));
      } else {
        dispatch({
          type: Actions.SET_SESSION,
          payload: moment().add(2, 'h')
        });
      }
    }
  }, [route])

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initRoute}>
      <Stack.Screen name={rootSwitch.login} component={Login} />
      {
        accessRight.some(e => e.namaSubmodul == 'DEFAULT VIEW') ? 
        <Stack.Screen name={rootSwitch.main} component={MainStack} />
        :
        <Stack.Screen name={rootSwitch.main} component={MainStack2} />
      }
      <Stack.Screen name={rootSwitch.search} component={Search} />
      <Stack.Screen name={rootSwitch.account} component={Account} />
      <Stack.Screen name={rootSwitch.sync_page} component={SyncPage} />
      <Stack.Screen name={rootSwitch.synchronize} component={Synchronize} />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    sessionTime: sessionSelector(state),
    accessRight: accessSelector(state),
    isLogin: isLoginSelector(state),
    lastUpdate: lastUpdateSelector(state),
  }
}
export default connect(mapStateToProps)(RootNav);