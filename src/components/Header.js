import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';

import { SearchBar, Avatar, withTheme, Icon } from '@rneui/themed';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const Header = (onChangeText, value, goBack, ...rest) => {
  reactotron.log("This Go Back Function",goBack);

  return (
    <View style={{height: 72, flexDirection: 'row', backgroundColor: "#faa634", alignItems: 'center', justifyContent: 'space-evenly'}}>
      {
        goBack &&
        <TouchableOpacity style={{marginLeft: 10}} onPress={goBack}>
          <Icon 
            name='chevron-left'
            type='font-awesome'
          />
        </TouchableOpacity>
      }
      <SearchBar 
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
        {...onChangeText}
        {...value}
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

Header.propTypes = {
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  goBack: PropTypes.string
}

Header.defaultProps = {
  onChangeText: () => {},
  value: "",
  goBack: "",
};
export default withTheme(Header);