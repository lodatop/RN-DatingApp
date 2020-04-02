import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Ionicons } from '@expo/vector-icons';

import InboxScreen from '../screens/InboxScreen';
import LoginScreen from '../screens/LoginScreen';
import MatchingScreen from '../screens/MatchingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import Colors from '../constants/Colors';

const MenuTabNavigator = createBottomTabNavigator(
    {
      Matching: {
        screen: MatchingScreen,
        navigationOptions: {
          tabBarLabel: 'Matching',
          tabBarIcon: tabInfo => {
            return (
              <Ionicons name="ios-heart" size={25} color={tabInfo.tintColor}
              />
            );
          }
        }
      },
      Inbox: {
        screen: InboxScreen,
        navigationOptions: {
          tabBarLabel: 'Inbox',
          tabBarIcon: tabInfo => {
            return (
              <Ionicons name="ios-chatbubbles" size={25} color={tabInfo.tintColor} />
            );
          }
        }
      },
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          tabBarLabel: 'Profile',
          tabBarIcon: tabInfo => {
            return (
              <Ionicons name="md-person" size={25} color={tabInfo.tintColor} />
            );
          }
        }
      }
    },
    {
      // initialRouteName: 'LoginScreen',
      tabBarOptions: {
        activeTintColor: Colors.accentColor
      }
    }
  );

const StackNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    CreateProfile: CreateProfileScreen,
    Main: MenuTabNavigator
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#ffadce'
      },
      headerTintColor: 'white',
      headerTitle: 'Ace Mate',
      headerTitleAlign: 'center'
    }
  }
);

export default createAppContainer(StackNavigator);
