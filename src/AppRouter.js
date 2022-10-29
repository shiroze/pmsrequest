import React from 'react';

import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import FlashMessage from 'react-native-flash-message';

import {ThemeProvider} from '@rneui/themed';
import Router from '~/navigation/root-nav';
import { getStatusBarHeight } from 'react-native-status-bar-height';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    
  }

  render() {
    return (
      <ThemeProvider theme={'light'}>
        <StatusBar
          translucent
          barStyle={'dark-content'}
          backgroundColor="white"
        />
        <Router />
        <FlashMessage position="top" statusBarHeight={getStatusBarHeight()} />
      </ThemeProvider>
    );
  }
}

export default connect()(AppRouter);