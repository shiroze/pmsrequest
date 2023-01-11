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
import { Icon, ThemeConsumer, Text, LinearProgress } from '@rneui/themed';

import DropDownPicker from 'react-native-dropdown-picker';

import {rootSwitch} from '~/config/navigator';

import { connect } from 'react-redux';

import {signIn, localSignIn} from '~/modules/auth/actions';
import * as Actions from '~/modules/auth/constants';
import { authSelector,locationSelector } from '~/modules/auth/selectors';
import {currentModulesSelector, totalModuleDone, totalModule} from '~/modules/sync/selectors';

import { SyncData } from '~/modules/sync/actions';

import {handleError, handleWarning} from '~/utils/message';

import reactotron from 'reactotron-react-native';
import RNFetchBlob from 'rn-fetch-blob';

const {width, height} = Dimensions.get('window');

function Login(props) {
  const {
    navigation,
    dispatch,
    auth,
    location,
    current,
    totalModule, totalModuleDone
  } = props;

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
    },
    {
      value: 'PGS',
      label: 'Pabrik Gunung Melayu Satu (PGS)'
    },
    {
      value: 'PGD',
      label: 'Pabrik Gunung Melayu Dua (PGD)'
    },
    {
      value: 'KSN',
      label: 'Kebun Sentral Netral (KSN)'
    }
  ]);

  const [cur_patch, setCurPatch] = useState("");
  const [progress, setProgress] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const toggleShow = () => {
    setShow(!show);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {  
      if(__DEV__) {
        setUsername('ASISTEN1');
        setPassword('SAYAMAUBERUBAH');
        // setTimeout(() => {
        //   setValue('PND');
        // }, 1000);
      }
    
      if(auth.pending) {
        dispatch({
          type: Actions.SIGN_OUT_SUCCESS
        });
      }
      
      if(location != "") {
        setValue(location);
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, location]);

  React.useEffect(() => {
    setCurPatch(current);
    setProgress(totalModuleDone);
    setTotalData(totalModule);
  }, [current, totalModuleDone]);

  const _signIn = () => {
    Keyboard.dismiss();

    if(username == "") {
      handleError(new Error("Username tidak boleh kosong"));
    } else if(password == "") {
      handleError(new Error("Password tidak boleh kosong"));
    } else if(value == null) {
      handleError(new Error("Cabang tidak boleh kosong"));
    } else {
      // dispatch(signIn({branch_id:value, username, password}));
      dispatch(localSignIn({branch_id:value, username, password}));
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
                  loading={auth.pending}
                  disabled={current == "" ? auth.pending : true}
                  onPress={_signIn}
                  title={'Sign In'}
                  containerStyle={styles.buttonStyle}
                />
                <Button
                  radius={20}
                  disabled={current == "" ? false : true}
                  type={'clear'}
                  title={'Sync Database'}
                  titleStyle={{color: '#F5B041'}}
                  onPress={() => { 
                    if(value != "" && value != null) {
                      dispatch(SyncData({branch_id: value}));
                    } else {
                      handleWarning({
                        message: "Cabang tidak boleh kosong"
                      });
                    }
                  }}
                />
                {cur_patch != "" ? 
                  <View style={{ margin: 10, width: width * 0.8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#2ECC71',
                        marginTop: 10,
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >{"Sinkronisasi: " + cur_patch}</Text>
                    <LinearProgress
                      style={{ margin: 10, width: width * 0.8 }}
                      value={progress}
                      animation
                      trackColor='#F5B041'
                      variant="determinate"
                    />
                    <Text >{progress} / {totalData}</Text>
                  </View>
                  : null}
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
    marginTop: 18, 
    marginLeft: 8, 
    marginRight: 8
  },
});

const mapStateToProps = (state) => {
  return {
    auth: authSelector(state),
    location: locationSelector(state),
    current: currentModulesSelector(state),
    totalModuleDone: totalModuleDone(state),
    totalModule: totalModule(state),
  };
};

export default connect(mapStateToProps)(Login);