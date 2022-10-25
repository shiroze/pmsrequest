import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text, TouchableOpacity, Platform } from 'react-native';

import { SearchBar, Avatar, withTheme, Icon } from '@rneui/themed';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const Header = (props) => {
  const {onChangeText, value, navigation, goBack} = props;
  // reactotron.log(Platform.OS);

  return (
    <View style={{height: 72, flexDirection: 'row', backgroundColor: "#faa634", alignItems: 'center', justifyContent: 'space-evenly'}}>
      {
        goBack &&
        <TouchableOpacity style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
          <Icon 
            name='chevron-left'
            type='font-awesome'
          />
        </TouchableOpacity>
      }
      <SearchBar 
        // platform={Platform.OS}
        // placeholder={"{itemgrou}:{keyword} for faster search"}
        round
        lightTheme
        containerStyle={{
          width: width * 0.80,
          backgroundColor:'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        searchIcon={{
          name: 'search',
          type: 'font-awesome',
          size: 24
        }}
        inputContainerStyle = {{backgroundColor:'white'}}
        showCancel={true}
        onChangeText={onChangeText}
        value={value}
      />
      <Avatar
        size={48}
        rounded
        icon={{
          name: 'person-outline',
          type: 'material',
          color: '#098438',
          size: 40
        }}
        containerStyle={{ backgroundColor: '#FFF', marginRight: 10 }}
      />
    </View>
  )
}

// Header.propTypes = {
//   onChangeText: PropTypes.func,
//   value: PropTypes.string,
// }

// Header.defaultProps = {
//   onChangeText: () => {},
//   value: "",
// };
export default withTheme(Header);