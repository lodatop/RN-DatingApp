import React from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';

const LoginScreen = props => {
    return (
        <View>
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