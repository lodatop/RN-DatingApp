import React  from 'react';
import Firebase, { FirebaseContext } from './components/Firebase';
import { Text, View } from 'react-native';
// import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './navigation/AppNavigator';

enableScreens();

export default function App() {
  return (
    
    <FirebaseContext.Provider value={new Firebase()}>
      <AppNavigator />
    </FirebaseContext.Provider>
    
  );
}
