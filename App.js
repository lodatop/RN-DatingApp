import React  from 'react';
import Firebase, { FirebaseContext } from './components/Firebase';
import { Text, View } from 'react-native';
// import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './navigation/AppNavigator';
import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

enableScreens();

export default function App() {
  return (
    
    <FirebaseContext.Provider value={new Firebase()}>
      <AppNavigator />
    </FirebaseContext.Provider>
    
  );
}
