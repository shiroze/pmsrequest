import React from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ListItem } from '@rneui/base';

import Container from '~/components/Container';
import Header from '~/components/Header';

import {signOut} from '~/modules/auth/actions';

import { connect } from 'react-redux';
import reactotron from 'reactotron-react-native';

function Account(props) {
  const {navigation, dispatch} = props;

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <Text>Account Screen</Text>
      <ListItem onPress={() => {
        reactotron.log("Kamu lagi mencoba ganti password");
      }}>
        <ListItem.Content>
          <ListItem.Title>Change Password</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron></ListItem.Chevron>
      </ListItem>
      <ListItem onPress={() => {
        dispatch(signOut());
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