import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { LoginNavigator } from './AppNavigator'

const AppNavigatorContainer = props => {
    return (
        <NavigationContainer>
            <LoginNavigator />
        </NavigationContainer>
    )
}

export default AppNavigatorContainer;