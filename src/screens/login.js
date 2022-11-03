import React, {useState} from 'react';
import { 
  Platform, 
  Dimensions, 
  ImageBackground, 
  Keyboard, 
  KeyboardAvoidingView, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { Button, Input } from '@rneui/base';
import { Icon, ThemeConsumer } from '@rneui/themed';

import DropDownPicker from 'react-native-dropdown-picker';

import { connect } from 'react-redux';

import {signIn} from '~/modules/auth/actions';
import { locationSelector } from '~/modules/auth/selectors';

import {handleError, handleInfo, handleSuccess} from '~/utils/message';

import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(null);
  const [branch, setBranch] = useState([
    {
      value: 'PNS',
      label: 'Pabrik Negri Lama Satu (PNS)'
    },
    {
      value: 'PND',
      label: 'Pabrik Negri Lama Dua (PND)'
    }
  ]);
  const [conn, setConn] = useState(false);

  const {
    navigation,
    dispatch,
    location
  } = props;

  const toggleShow = () => {
    setShow(!show);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {  
      if(__DEV__) {
        setUsername('EKTU1');
        setPassword('SAYAMAUBERUBAH');
        setTimeout(() => {
          setValue('PND');
        }, 1000);
      }
    });
    if(location != "") {
      setValue(location);
      reactotron.log("Last Login Location : " + location);
    }

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, location]);

  const _signIn = () => {
    Keyboard.dismiss();
    if(username == "") {
      handleError(new Error("Username tidak boleh kosong"));
    } else if(password == "") {
      handleError(new Error("Password tidak boleh kosong"));
    } else if(value == null) {
      handleError(new Error("Cabang tidak boleh kosong"));
    } else {
      setConn(!conn);
      dispatch(signIn({branch_id:value, username, password}));
    }
    // navigation.replace('MainStack');
  };

  return (
    <ThemeConsumer>
      {(theme) => (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1, backgroundColor: '#FFF', marginTop: getStatusBarHeight()}} enabled>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ImageBackground source={require('~/assets/images/hd_background.jpg')} style={styles.imageBackgroundStyle} imageStyle={{width,height}} resizeMode={'contain'}>
              <View style={styles.loginFrm}>
                <Input
                  placeholder={'Username'}
                  value={username}
                  containerStyle={styles.containerStyle}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={{fontSize: 14}}
                  onChangeText={(text) => setUsername(text)}
                />
                <Input
                  placeholder={'Password'}
                  secureTextEntry={!show}
                  rightIcon={<Icon name={show ? 'eye-off' : 'eye'} type='feather' onPress={toggleShow} />}
                  value={password}
                  containerStyle={styles.containerStyle}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={{fontSize: 14}}
                  onChangeText={(text) => setPassword(text)}
                  errorMessage={'Password is case-sensitive'}
                />
                <DropDownPicker 
                  open={open}
                  value={value}
                  items={branch}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setBranch}
                  searchable={true}
                  placeholder={"Pilih Cabang"}
                  dropDownDirection={'AUTO'}
                  listMode={'MODAL'}
                  modalProps={{
                    animationType: "fade"
                  }}
                  style={styles.dropdownStyle}
                  dropDownContainerStyle={styles.dropdownStyle}
                  searchContainerStyle={{
                    borderBottomColor: '#D7DBDD'
                  }}
                  searchTextInputStyle={styles.borderStyle}
                  itemSeparatorStyle={{
                    backgroundColor: '#D7DBDD'
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: "#c7ffdc"
                  }}
                  zIndex={10}
                />
                <Button
                  radius={20}
                  loading={conn}
                  disabled={conn}
                  onPress={_signIn}
                  title={'Sign In'}
                  containerStyle={styles.buttonStyle}
                />
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </ThemeConsumer>
  )
}

const styles = StyleSheet.create({
  imageBackgroundStyle: {
    flex: 1, 
    // justifyContent: 'flex-end', 
    marginTop: height * 0.125 * -1
  },
  loginFrm: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: height * 0.06 - 24,
    padding: 24,
    width: width * 0.9,
    // alignSelf: 'center', 
    borderRadius: 20,
    marginBottom: 50, 
    backgroundColor: '#FFF',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity:  0.18,
    shadowRadius: 4.59,
    elevation: 5
  },
  containerStyle: {
    width: '100%', // width * 0.85,
    backgroundColor:'transparent',
    // borderTopWidth: 0,
    // borderBottomWidth: 0,
  },
  inputContainer: {
    // backgroundColor:'#FFF', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7DBDD'
  },
  borderStyle: {
    borderColor: '#D7DBDD'
  },
  dropdownStyle: {
    borderColor: '#D7DBDD',
    width: '95%', // width * 0.9 + 16,
    marginLeft: 8,
    // marginRight: 50
  },
  dropDownContainerStyle: {
    borderColor: '#D7DBDD',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity:  0.18,
    shadowRadius: 4.59,
    elevation: 5
  },
  buttonStyle: {
    zIndex: 5,
    marginTop: 24, 
    marginLeft: 8, 
    marginRight: 8
  }
});

const mapStateToProps = (state) => {
  return {
    location: locationSelector(state),
  };
};

export default connect(mapStateToProps)(Login);