import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { withTheme } from '@rneui/themed';

const Container = ({theme, isFullView, style, children, hideDrop, ...rest}) => {
  return (
    <TouchableWithoutFeedback {...rest} onPress={hideDrop}>
      <View
        style={StyleSheet.flatten([
          {
            backgroundColor: '#FFF',
          },
          isFullView && {flex: 1},
          style ? style : null,
        ])}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  )
}

Container.propTypes = {
  isFullView: PropTypes.bool,
  hideDrop: PropTypes.func,
}

Container.defaultProps = {
  isFullView: false,
  hideDrop: () => {},
};

export default withTheme(Container);