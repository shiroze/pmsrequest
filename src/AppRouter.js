import React from 'react';

import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import FlashMessage from 'react-native-flash-message';

import {ThemeProvider} from '@rneui/themed';
import Router from '~/navigation/root-nav';

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
          backgroundColor="transparent"
        />
        <Router />
        <FlashMessage position="top" />
      </ThemeProvider>
    );
  }
}

export default connect()(AppRouter);