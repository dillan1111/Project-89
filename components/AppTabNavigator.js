import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {AppStackNavigator} from './AppStackNavigator'
import ExchangeScreen from '../screens/ExchangeScreen.js';

export const AppTabNavigator = createBottomTabNavigator({
    DonateToys:{
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarLabel: "Home/Exhange Toy"
        }
    },
    Exchange: {
        screen: ExchangeScreen,
        navigationOptions: {
            tabBarLabel: "Request Toy"
        }
    }
})