import React, { useState } from 'react';
import { Text, View } from 'react-native';
// import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './navigation/AppNavigator';

enableScreens();

export default function App() {
  return <AppNavigator />;
}
