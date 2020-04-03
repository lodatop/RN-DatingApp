import React  from 'react';
import Firebase, { FirebaseContext } from './components/Firebase';
import { ProfileProvider } from './components/ProfileContext/ProfileContext'
import { YellowBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

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
      <ProfileProvider>
        <AppNavigator />
      </ProfileProvider>
    </FirebaseContext.Provider>
    
  );
}
