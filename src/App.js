/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component} from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { SafeAreaProvider } from 'react-native-safe-area-context';
 import Router from './AppRouter';
 
 import NavigationService from '~/utils/navigation';
 
 import configureStore from './config-store';
 import { Provider } from 'react-redux';
 import { PersistGate } from 'redux-persist/integration/react';
 
 const {store, persistor} = configureStore();
 
 class App extends Component {
   render() {
     return (
       <SafeAreaProvider>
         <NavigationContainer
           ref={(navigationRef) => NavigationService.setTopLevelNavigator(navigationRef)}
         >
           <Provider store={store}>
             <PersistGate persistor={persistor}>
               <Router />
             </PersistGate>
           </Provider>
         </NavigationContainer>
       </SafeAreaProvider>
     );
   }
 }
 
 export default App;
 