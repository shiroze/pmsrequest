import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text, TouchableOpacity, Platform } from 'react-native';

import { Avatar, withTheme, Icon } from '@rneui/themed';
import { getDefaultHeaderHeight, getHeaderTitle, useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import SearchBar from './SearchBar';

import {rootSwitch} from '~/config/navigator';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const Header = (props) => {
  const {navigation, route, goBack, title} = props;
  
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top) - getStatusBarHeight();
  let Headertitle = "";

  const [search, setSearch] = useState("");
  switch (route.name) {
    case "ListItem":
      Headertitle = title;
      break;
    case "ViewItem":
      Headertitle = title;
      break;
    default:
      Headertitle = route.name;
      break;
  }

  return (
    <View style={{height: headerHeight,flexDirection: 'row', backgroundColor: "#faa634", alignItems: 'center'}}>
      {
        goBack &&
        <TouchableOpacity style={{marginLeft: 8}} onPress={() => navigation.goBack()}>
          <Icon 
            name='arrow-left'
            type='material-community'
            color={'#FFF'}
            size={24}
          />
        </TouchableOpacity>
      }
      {route.name == "Home" ? (
        <>
          <SearchBar {...props} />
          <Avatar
            size={40}
            rounded
            icon={{
              name: 'person-outline',
              type: 'material',
              color: '#098438',
              size: 32
            }}
            containerStyle={{ backgroundColor: '#FFF', marginLeft: 12 }}
            onPress={() => navigation.navigate(rootSwitch.account)}
          />
        </>
      ) : (
        <View style={{marginLeft: 24, width: width * 0.85}}>
          <Text style={{fontSize: 22, fontWeight: 'bold', color: '#FFF'}} numberOfLines={1}>{Headertitle}</Text>
        </View>
      )}
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