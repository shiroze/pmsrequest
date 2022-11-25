import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {rootSwitch} from '~/config/navigator';

import Login from '~/screens/login';
import MainStack from './main-stack';
import MainStack2 from './main-stack-2';
import Search from '~/screens/search';
import Account from '~/screens/account';

import { isLoginSelector, accessSelector } from '~/modules/auth/selectors';

import { connect } from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import reactotron from 'reactotron-react-native';

const Stack = createStackNavigator();

function rootNav(props) {
  const {isLogin, accessRight} = props;

  const initRoute = (__DEV__ && isLogin) ? rootSwitch.main : rootSwitch.login;

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
        // SQLite.deleteDatabase(
        //   {name: 'test.db', location: '~www/test.db'},  
        //   () => { console.log('second db deleted');  },
        //   error => {
        //       console.log("ERROR: " + error); 
        //   }
        // );
      } 
      // else {
      //   // reactotron.log("Database already existed, Skip Initialization");
      // }
    });
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
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    accessRight: accessSelector(state),
    isLogin: isLoginSelector(state),
  }
}
export default connect(mapStateToProps)(rootNav);