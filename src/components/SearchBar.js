import React, {useState} from 'react';
import { Dimensions } from 'react-native';

import { SearchBar, withTheme } from '@rneui/themed';

import {rootSwitch,stockCardStack} from '~/config/navigator';
import reactotron from 'reactotron-react-native';
import { showMessage } from 'react-native-flash-message';

const {width, height} = Dimensions.get('window');

const CustomSearchBar = (props) => {
  const {navigation, route, stock} = props;
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
        marginLeft: 16,
        backgroundColor:'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
      }}
      inputContainerStyle = {{backgroundColor:'#FFF', height: 32,}}
      inputStyle={{fontSize: 14}}
      showCancel={true}
      onChangeText={setSearch}
      value={search}
      onSubmitEditing={() => {
        if(search != "") {
          if(!stock) {
            navigation.navigate(rootSwitch.search, {keyword: search});
          } else {
            navigation.navigate(stockCardStack.search, {keyword: search});
          }
        } else {
          showMessage({
            message: "Kata kunci tidak boleh kosong",
            type: 'danger',
            icon: 'danger',
          })
        }
      }}
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