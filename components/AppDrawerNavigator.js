import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Input, Icon} from 'react-native-elements'
import { AppTabNavigator } from './AppTabNavigator'
import SettingsScreen from '../screens/SettingsScreen'
import NotificationScreen from '../screens/NotificationScreen';
import MyBartersScreen from '../screens/MyBartersScreen'
import CustomSideBarMenu  from './CustomSideBar';
import MyReceivedToysScreen from '../screens/MyRecievedToysScreen'


export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
      screen : AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5"/>
      }
      },
    Settings: {
            screen: SettingsScreen,
            navigationOptions: {
              drawerIcon: <Icon name="settings" type="fontawesome5"/>,
              drawerLabel: "Settings"
            }
        },
    MyBarters:{
          screen: MyBartersScreen,
          navigationOptions: {
            drawerIcon: <Icon name="gift" type="font-awesome"/>,
            drawerLabel: "My Barters"
          }
      },
    Notifications :{
        screen : NotificationScreen,
        navigationOptions: {
          drawerIcon: <Icon name="bell" type="font-awesome"/>,
          drawerLabel: "My Notifications"
        }
      },
    MyReceivedToys :{
      screen: MyReceivedToysScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="fontawesome5"/>,
        drawerLabel: "My Recieved Toys"
      }
    },
  },
  {
    contentComponent: CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })

