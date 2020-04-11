import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import { KoroProgress } from 'rn-koro-lib';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext';
import { Input } from '../components/Input'
import {Picker} from '../components/Picker'

const LoginScreen = props => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);

    const firebase = useContext(FirebaseContext);
    const profileContext = useContext(ProfileContext);

    const login = (e) => {
        e.preventDefault();
        setLoading(true);
        firebase.auth.signInWithEmailAndPassword(email, password)
        .then(async result => {
            setLoading(false);
            var user = result.user;
            await setProfileContext()
            console.log('user logged in')
            props.navigation.navigate('Tabs');
        })
        .catch(function(error) {
            setLoading(false);
            var errorMessage = error.message;
            alert(errorMessage)
        });
    }
    
    const setProfileContext = async () => {
        setLoading(true);

        let uid = await firebase.auth.currentUser.uid;

        var db = firebase.firestore;

        db.collection("profile").where("uid", "==", uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                await profileContext.setProfile(doc.data())
                setLoading(false);
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
            setLoading(false);
        });   
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in to continue!</Text>
            <View style={{marginBottom: 10}}>
                <Input 
                    onChange={(value)=>{setEmail(value.trim())}}
                    type='email-address'
                    value={email}
                    label='Email'
                    style={{ borderColor: email !== '' ? Colors.checkColor: Colors.closeColor }}
                    />
            </View>
            <View style={{marginBottom: 10}}>
                <Input
                    autoCorrect={false}
                    autoCompleteType='off'
                    onChange={(value)=>{setPassword(value.trim())}}
                    type='default'
                    value={password}
                    label='Password'
                    isHidden={passwordIsHidden}
                    style={{ borderColor: password.length > 5 ? Colors.checkColor: Colors.closeColor }}
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
                onPress={login}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'black', textAlign: 'center'}}>OR</Text>
            <TouchableOpacity 
                activeOpacity={0.7}
                style={styles.registerButton} 
                onPress={() => props.navigation.navigate('Register')}
                >
                <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
            <KoroProgress visible={loading} color='#ed1f63'/>
        </View>
    )
}

const styles = StyleSheet.create({
    showPassword: {
        position: 'absolute',
        top: '25%',
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
        backgroundColor: Colors.cancelColor, 
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
        height: 60,
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

export const loginConfig = {
    headerTitle: 'LOGIN'
}

export default LoginScreen;