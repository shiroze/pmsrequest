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
  
  // reactotron.log(route);

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
    <View style={{height: headerHeight, width, flexDirection: 'row', backgroundColor: "#faa634", alignItems: 'center', padding: 8}}>
      {
        goBack &&
        <TouchableOpacity style={{width: 24}} onPress={() => navigation.goBack()}>
          <Icon 
            name='arrow-left'
            type='material-community'
            color={'#FFF'}
            size={24}
          />
        </TouchableOpacity>
      }
      {route.name == "Home" || route.name == "KartuStock" ? (
        <>
          <SearchBar {...props} stock={route.name == "Home" ? false : true} />
        </>
      ) : (
        <View style={{marginLeft: 12, width: goBack ? (width * 0.75) + 8 : (width * 0.8) + 12}}>
          <Text style={{fontSize: 22, fontWeight: 'bold', color: '#FFF'}} numberOfLines={1}>{Headertitle}</Text>
        </View>
      )}
      {!goBack && <Avatar
        size={40}
        rounded
        icon={{
          name: 'person-outline',
          type: 'material',
          color: '#098438',
          size: 32
        }}
        containerStyle={{ backgroundColor: '#FFF' }}
        onPress={() => navigation.navigate(rootSwitch.account)}
      />}
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