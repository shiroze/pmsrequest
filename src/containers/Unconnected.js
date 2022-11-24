import { Button } from '@rneui/base';
import { Avatar } from '@rneui/themed';
import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import Container from '~/components/Container';

const Unconnected = ({clickTry}) => {
  return (
    <Container isFullView>
      <View style={styles.container}>
        <Avatar
          containerStyle={styles.avatar}
          avatarStyle={{resizeMode: 'stretch'}}
          source={require('~/assets/images/unconnected.png')}
        />
        <Text style={styles.textTitle}>No Internet Connection</Text>
        <Text style={styles.textSubtitle}>Please check your internet connection and try again</Text>
        <Button 
          type='outline'
          title={'Try Again'}
          onPress={clickTry ? clickTry : () => {}}
          buttonStyle={[styles.button]}
          containerStyle={[styles.containerButton]}
        />
      </View>
      {/* <Empty
        title="No Internet Connection"
        subTitle="Please check your internet connection and try again"
        avatarElement={
          <ThemedView colorSecondary style={styles.avatar}>
            <Image
              source={require('src/assets/images/unconnected.png')}
              resizeMode="stretch"
            />
          </ThemedView>
        }
        titleButton="Try again"
        clickButton={clickTry ? clickTry : () => {}}
        buttonProps={{
          type: 'solid',
        }}
      /> */}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  textSubtitle: {
    marginBottom: 8,
    textAlign: 'center'
  },
  button: {
    paddingHorizontal: 20
  },
  containerButton: {
    minWidth: 160,
  }
});

export default Unconnected;
