import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { LoginNavigator } from './AppNavigator'

//Here we wrap our navigators into a container, this container is the one thats going to be used

const AppNavigatorContainer = props => {
    return (
        <NavigationContainer>
            <LoginNavigator />
        </NavigationContainer>
    )
}

export default AppNavigatorContainer;