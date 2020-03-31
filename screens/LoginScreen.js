import React from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';

import { KoroInput } from 'rn-koro-lib'

const LoginScreen = props => {
    return (
        <View>
            <KoroInput 
                label='Username'
                onChange={()=>{}}/>
            <KoroInput 
                label='Password'
                onChange={()=>{}}/>
            <Text>This is the login screen</Text>
            <View style={styles.button}>
                <Button
                    title='Login'
                    onPress={()=>{props.navigation.replace({routeName: 'Main'})}}
                />
            </View>
            <View style={styles.button}>
                <Button
                    title='Go to register'
                    onPress={()=>{props.navigation.replace({routeName: 'Register'})}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 10
    }
})

export default LoginScreen;