import React from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';

import { KoroInput } from 'rn-koro-lib'

const RegisterScreen = props => {
    return (
        <View style={{...styles.container}}>
            <Text>This is the register screen</Text>
            <KoroInput 
                label='Name'
                onChange={()=>{}}/>
            <KoroInput 
                label='Age'
                onChange={()=>{}}/>
            <KoroInput 
                label='Email'
                onChange={()=>{}}/>
            <KoroInput 
                label='Username'
                onChange={()=>{}}/>
            <KoroInput 
                label='Password'
                onChange={()=>{}}/>
            <Button 
                title='Go to Login'
                onPress={()=>{props.navigation.replace({routeName: 'Login'})}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default RegisterScreen;