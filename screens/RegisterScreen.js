import React, { useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';

import Colors from '../constants/Colors';
import { KoroProgress } from 'rn-koro-lib';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = props => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    
    const firebase = useContext(FirebaseContext);

    const register = (e) => {
        e.preventDefault();
        setLoading(true);
        firebase.auth.createUserWithEmailAndPassword(email, password)
        .then(result => {
            setLoading(false);
            var user = result.user;
            console.log('user registered')
            props.navigation.navigate('CreateProfile')
        })
        .catch(function(error) {
            setLoading(false);
            var errorMessage = error.message;
            alert(errorMessage)
        });
    }

    return (
        <View style={{...styles.container}}>
            <Text style={styles.title}>Sign up to continue!</Text>
            <Text>Email:</Text>
            <TextInput
                keyboardType='email-address'
                onChangeText={(text)=>{setEmail(text.trim())}}
                style={{...styles.textInput, borderColor: email !== '' ? Colors.checkColor: Colors.closeColor}}
                value={email}
            />
            <Text>Password:</Text>
            <View>
                <TextInput
                    autoCorrect={false}
                    autoCompleteType='off'
                    secureTextEntry={passwordIsHidden}
                    keyboardType='default'
                    onChangeText={(text)=>{setPassword(text.trim())}}
                    style={{...styles.textInput, borderColor: password.length > 5 ? Colors.checkColor: Colors.closeColor}}
                    value={password}
                />
                <TouchableOpacity 
                    style={{...styles.showPassword}}
                    onPressIn={()=>setPasswordIsHidden(false)}
                    onPressOut={()=>setPasswordIsHidden(true)}
                    >
                    <Ionicons name='md-eye' size={30} color='black'/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.loginButton} 
                onPress={register}>
                <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'black', textAlign: 'center'}}>OR</Text>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.registerButton} 
                onPress={() => props.navigation.navigate('Login')}
                >
                <Text style={styles.registerText}>Go back to login</Text>
            </TouchableOpacity>
            <KoroProgress visible={loading} color='#ed1f63'/>
        </View>
    )
}

const styles = StyleSheet.create({
    showPassword: {
        position: 'absolute',
        top: 0,
        right: 5,
        backgroundColor: 'rgba(224, 224, 224, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    loginButton: {
        marginVertical: 10,
        backgroundColor: Colors.acceptColor, 
        paddingVertical: 10,
        borderRadius: 10
    },
    loginText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    registerButton: {
        marginVertical: 10,
        backgroundColor: Colors.acceptColor, 
        paddingVertical: 10,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 10
    },
    registerText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    textInput:{
        height: 40,
        borderBottomWidth: 3,
        borderColor: 'red',
        margin: 5,
        paddingLeft: 10
    },
    container: {
        flex: 1,
        padding: 15
    }, 
    title:{
        fontSize: 20,
        textAlign: 'center',
        borderColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15
    }
})

export const registerConfig = {
    headerTitle: 'REGISTER'
}


export default RegisterScreen;