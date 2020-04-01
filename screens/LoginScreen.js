import React, { useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';

import { KoroInput } from 'rn-koro-lib'

const LoginScreen = props => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    
    const firebase = useContext(FirebaseContext);

    const login = (e) => {
        e.preventDefault();
        firebase.auth.signInWithEmailAndPassword(email, password)
        .then(result => {
            var user = result.user;
            props.navigation.replace({routeName: 'Main'});
        })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }

    return (
        <View>
            <KoroInput 
                label='Email'
                onChange={(text)=>{setEmail(text)}}/>
            <KoroInput 
                label='Password'
                onChange={(text)=>{setPassword(text)}}/>
            <Text>This is the login screen</Text>
            <View style={styles.button}>
                <Button
                    title='Login'
                    onPress={login}
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