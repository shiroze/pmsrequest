import React from 'react';

import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {connect} from 'react-redux';
import {compose} from 'redux';

import FlashMessage from 'react-native-flash-message';

import {ThemeProvider} from '@rneui/themed';
import Router from '~/navigation/root-nav';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import Unconnected from '~/containers/Unconnected';
import reactotron from 'reactotron-react-native';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      isConnected: true,
    };
  }

  componentDidMount() {
    // NetInfo.addEventListener(state => {
    //   const {isCheck} = this.state;
    //   const {isConnected} = state;
    //   if (!isConnected) {
    //     this.setState({
    //       isConnected: false,
    //     });
    //   }
    //   /**
    //    * Listener work but on emu keep crashing
    //    */
    //   if (isCheck && isConnected) {
    //     this.setState({
    //       isConnected: true,
    //       isCheck: false,
    //     }, () => {
    //       reactotron.log("Connection : "+this.state.isConnected);
    //     });
    //   }
    // });
  }

  checkInternet = () => {
    this.setState({
      isCheck: true,
    });
    NetInfo.refresh();
  };

  componentDidUpdate(prevProps) {
    
  }

  render() {
    const {theme, colors} = this.props;
    const {isConnected} = this.state;

    return (
      <ThemeProvider theme={'light'}>
        <StatusBar
          translucent
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        {/* {!isConnected ? (
          <Unconnected clickTry={this.checkInternet} />
        ) : (
          <Router />
        )} */}
        <Router />
        <FlashMessage position="top" statusBarHeight={getStatusBarHeight()} />
      </ThemeProvider>
    );
  }
}

export default connect()(AppRouter);