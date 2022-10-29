import React, {useState} from 'react';
import { Dimensions } from 'react-native';

import { SearchBar, withTheme } from '@rneui/themed';

import {rootSwitch} from '~/config/navigator';
import reactotron from 'reactotron-react-native';

const {width, height} = Dimensions.get('window');

const CustomSearchBar = (props) => {
  const {navigation, route} = props;
  const [search, setSearch] = useState("");

  return (
    <SearchBar 
      // platform={Platform.OS}
      placeholder={"Search by Keyword"}
      round
      lightTheme
      searchIcon={{
        name: 'search',
        type: 'font-awesome',
        size: 16
      }}
      containerStyle={{
        width: width * 0.85,
        backgroundColor:'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
      }}
      inputContainerStyle = {{backgroundColor:'#FFF', height: 32,}}
      inputStyle={{fontSize: 14}}
      showCancel={true}
      onChangeText={setSearch}
      value={search}
      onSubmitEditing={() => navigation.navigate(rootSwitch.search, {keyword: search})}
      returnKeyType={'search'}
    />
  )
}

// SearchBar.propTypes = {
//   onChangeText: PropTypes.func,
//   value: PropTypes.string,
// }

// SearchBar.defaultProps = {
//   onChangeText: () => {},
//   value: "",
// };
export default withTheme(CustomSearchBar);