import React from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

import { connect } from 'react-redux';

function Account(props) {
  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header goBack={true} {...props} />
      <Text>Account Screen</Text>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },

})

export default connect()(Account);