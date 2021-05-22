import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';

import SignupLoginScreen from './screens/SignupLoginScreen.js';
import { AppDrawerNavigator } from './components/AppDrawerNavigator.js';
import { AppTabNavigator } from './components/AppTabNavigator';

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  OpeningScreen:{screen: SignupLoginScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator },
})

const AppContainer =  createAppContainer(switchNavigator);