import React from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ListItem } from '@rneui/base';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {rootSwitch} from '~/config/navigator';
import {signOut} from '~/modules/auth/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';

import SQLite from 'react-native-sqlite-storage';
import { showMessage } from 'react-native-flash-message';

function Account(props) {
  const {navigation, dispatch} = props;

  const reInitSQL = () => {
    SQLite.deleteDatabase(
      {name: 'db_pms.db'},  
      () => { reactotron.log('db deleted'); },
      error => { reactotron.log("ERROR: " + error); }
    );

    dispatch(signOut({expired: false}));
  }

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <ListItem onPress={() => {
        reactotron.log("Kamu lagi mencoba ganti password");
      }}>
        <ListItem.Content>
          <ListItem.Title>Change Password</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron></ListItem.Chevron>
      </ListItem>
      <ListItem onPress={() => {
        navigation.navigate(rootSwitch.sync_page);
      }}>
        <ListItem.Content>
          <ListItem.Title>Sync Data</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron></ListItem.Chevron>
      </ListItem>
      <ListItem onPress={() => {
        dispatch(signOut({expired: false}));
      }}>
        <ListItem.Content>
          <ListItem.Title>Logout</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron></ListItem.Chevron>
      </ListItem>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },

})

export default connect()(Account);