import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import InboxScreen from '../screens/InboxScreen';
import LoginScreen, { loginConfig } from '../screens/LoginScreen';
import MatchingScreen from '../screens/MatchingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen, { registerConfig } from '../screens/RegisterScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Colors from '../constants/Colors';
import UserImagesScreen, { userImagesConfig } from '../screens/UserImagesScreen';

const defaultStackConfig = {
  headerTitleAlign: 'center',
    headerStyle: {
        backgroundColor: Colors.headerColor
    },
    headerTintColor: 'white'
  }

const MatchingStackNavigator = createStackNavigator();
export const MatchingNavigator = () => {
  return (
    <MatchingStackNavigator.Navigator screenOptions={defaultStackConfig}>
      <MatchingStackNavigator.Screen 
        name='Matching' 
        component={MatchingScreen}
        options={{title: 'Find an Ace', headerLeft: null}}
        />
    </MatchingStackNavigator.Navigator>
  )
}

const InboxStackNavigator = createStackNavigator();
export const InboxNavigator = () => {
  return (
    <InboxStackNavigator.Navigator screenOptions={defaultStackConfig}>
      <InboxStackNavigator.Screen 
        name='Inbox' 
        component={InboxScreen}
        options={{title: 'Your Inbox', headerLeft: null}}
        />
    </InboxStackNavigator.Navigator>
  )
}

const ProfileStackNavigator = createStackNavigator();
export const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultStackConfig}>
      <ProfileStackNavigator.Screen 
        name='Profile' 
        component={ProfileScreen}
        options={{
          title: 'Your Profile', headerLeft: null
        }}
        />
      <ProfileStackNavigator.Screen 
        name='EditProfile' 
        component={EditProfileScreen}
        options={{
          title: 'Edit Your Profile', headerLeft: null
        }}
        />
      <ProfileStackNavigator.Screen 
        name='UserImages' 
        component={UserImagesScreen}
        options={{
          ...userImagesConfig,
          title: 'Your Pics'
        }}
        />
    </ProfileStackNavigator.Navigator>
  )
}

const AppTabNavigator = createBottomTabNavigator();
export const TabNavigator = () => {
  return (
    <AppTabNavigator.Navigator
        screenOptions = {({route}) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Matching') {
              iconName = 'ios-heart';
            } else if (route.name === 'Inbox') {
              iconName = 'ios-chatbubbles';
            } else if (route.name === 'Profile') {
              iconName = 'md-person'
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: Colors.headerColor,
          inactiveTintColor: '#bfbfbf',
        }}
      >
      <AppTabNavigator.Screen 
        name='Matching' 
        component={MatchingNavigator}
      />
      <AppTabNavigator.Screen 
        name='Inbox' 
        component={InboxNavigator}
      />
      <AppTabNavigator.Screen 
        name='Profile' 
        component={ProfileNavigator}
      />
    </AppTabNavigator.Navigator>
  )
}

const LoginStackNavigator = createStackNavigator();
export const LoginNavigator = () => {
  return (
    <LoginStackNavigator.Navigator screenOptions={defaultStackConfig}>
      <LoginStackNavigator.Screen 
        name='Login' 
        component={LoginScreen}
        options={{...loginConfig, headerLeft: null}}
        />
      <LoginStackNavigator.Screen 
        name='Register' 
        component={RegisterScreen}
        options={{...registerConfig, headerLeft: null}}
        />
      <LoginStackNavigator.Screen 
        name='CreateProfile' 
        component={CreateProfileScreen}
        options={{headerLeft: null}}
        />
      <LoginStackNavigator.Screen 
        name='Tabs' 
        component={TabNavigator}
        options={{
          headerLeft: null,
          headerShown: false
        }}
        />
    </LoginStackNavigator.Navigator>
  )
}
