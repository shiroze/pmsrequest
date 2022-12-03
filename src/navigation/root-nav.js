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
import SyncPage from '~/screens/synchronize';

import * as Actions from '~/modules/auth/constants';
import {signOut} from '~/modules/auth/actions';
import { isLoginSelector, accessSelector, sessionSelector } from '~/modules/auth/selectors';

import { connect } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import reactotron from 'reactotron-react-native';

const Stack = createStackNavigator();

function rootNav(props) {
  const {route, dispatch, sessionTime, isLogin, accessRight} = props;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const initRoute = (__DEV__ && isLogin) ? rootSwitch.main : rootSwitch.login;

  React.useEffect(() => {
    /**
     * Check if DB PMS is available
     */
    RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.MainBundleDir + '/databases').then((files) => {
      let db_name = files.filter(e => e == 'db_pms.db')[0];
      
      reactotron.log(db_name, db_name == undefined ? 'Not Exist' : 'Exist');
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

    if(sessionTime !== undefined) {
      var diff = moment(sessionTime).diff(moment(), 'm');
      
      if(diff < 0) {
        reactotron.log("Cur Session : " + moment(sessionTime).format('lll')+" | "+moment().format('lll'), "Diff : " + diff);
        dispatch(signOut({expired: true}));
      }
    }
  }, [sessionTime]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        reactotron.log("App has come to the foreground!");
      } else if(appState.current.match(/active/) && nextAppState === "background" && isLogin) {
        /** Set Timeout to Login */
        dispatch({
          type: Actions.SET_SESSION
        });
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initRoute}>
      <Stack.Screen name={rootSwitch.login} component={Login} />
      {
        accessRight.some(e => e.namaSubmodul == 'DEFAULT VIEW') ? 
        <Stack.Screen name={rootSwitch.main} component={MainStack} />
        :
        <Stack.Screen name={rootSwitch.main} component={MainStack2} />
      }
      <Stack.Screen name={rootSwitch.search} options={{title: "Search"}} component={Search} />
      <Stack.Screen name={rootSwitch.account} options={{title: "Account"}} component={Account} />
      <Stack.Screen name={rootSwitch.sync_page} options={{title: "Sync Data"}} component={SyncPage} />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    sessionTime: sessionSelector(state),
    accessRight: accessSelector(state),
    isLogin: isLoginSelector(state),
  }
}
export default connect(mapStateToProps)(rootNav);