import {CommonActions, StackActions} from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params = {}) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  );
}

function replace(routeName, params = {}) {
  _navigator.dispatch(StackActions.replace(routeName, params));
}

function reset(routeName) {
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName}],
    }),
  );
}

function goBack() {
  _navigator.goBack();
}

// add other navigation functions that you need and export them
export default {
  replace,
  navigate,
  goBack,
  reset,
  setTopLevelNavigator,
};
