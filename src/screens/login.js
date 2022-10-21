import React, {useState} from 'react';
import { Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from 'react-native';
import {Button, Input} from '@rneui/base';
import { ThemeConsumer } from '@rneui/themed';

import { connect } from 'react-redux';

const {width, height} = Dimensions.get('window');

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    navigation,
    dispatch,
  } = props;

  const _signIn = () => {
    Keyboard.dismiss();
    navigation.replace('MainStack');
  };

  return (
    <ThemeConsumer>
      {(theme) => (
        <KeyboardAvoidingView behavior='padding' style={{flex: 1, backgroundColor: '#FFF'}} enabled>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ImageBackground source={require('~/assets/images/hd_background.jpg')} style={{flex: 1, justifyContent: 'flex-end'}} imageStyle={{width,height}} resizeMode={'contain'}>
              <View style={{width: width * 0.8, alignSelf: 'center', marginBottom: 50, backgroundColor: '#FCFCFC'}}>
                <Input
                  placeholder={'Username'}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                />
                <Input
                  placeholder={'Password'}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <Button
                  onPress={_signIn}
                  title={'Sign In'}
                  style={{marginTop: 20}}
                />
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </ThemeConsumer>
  )
}

export default connect()(Login);