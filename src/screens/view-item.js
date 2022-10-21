import React, {useState} from 'react'
import { Text, View, StyleSheet, Dimensions, Keyboard, FlatList, TouchableOpacity } from 'react-native';

import { Avatar, Icon, Input } from '@rneui/themed';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Container from '~/components/Container';
import Header from '~/components/Header';

export default function ViewItem(props) {
  const {navigation} = props;
  const [search, setSearch] = useState("");

  return (
    <Container isFullView style={styles.container} hideDrop={() => {Keyboard.dismiss()}}>
      <Header onChangeText={setSearch} value={search} goBack={"abc"} />
      <Text>This is View Item Screen</Text>
    </Container>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
  },
});