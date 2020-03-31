import React from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';

const RegisterScreen = props => {
    return (
        <View style={{...styles.container}}>
            <Text>This is the register screen</Text>
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