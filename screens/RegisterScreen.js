import React, { useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';

import { KoroInput } from 'rn-koro-lib'

const RegisterScreen = props => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    
    const firebase = useContext(FirebaseContext);

    const register = (e) => {
        e.preventDefault();
        firebase.auth.createUserWithEmailAndPassword(email, password)
        .then(result => {
            var user = result.user;
            props.navigation.replace({routeName: 'Main'})
        })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage)
        });
    }

    return (
        <View style={{...styles.container}}>
            <Text>This is the register screen</Text>
            <KoroInput 
                label='Email'
                onChange={(text)=>{setEmail(text)}}/>
            <KoroInput 
                label='Password'
                onChange={(text)=>{setPassword(text)}}/>
            <Button 
                title='Register'
                onPress={register}
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