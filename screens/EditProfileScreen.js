import React, { useEffect, useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, Picker, TouchableOpacity} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

import { KoroProgress } from 'rn-koro-lib'

import  { FirebaseContext } from '../components/Firebase';

const EditProfileScreen = props => {

    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: '',
        aboutMe: '',
        profession: '',
        height: ''
    })
    const [loading, setLoading] = useState(false);
    const [aboutMeDisabled, setAboutMeDisabled] = useState(true);
    const [professionDisabled, setProfessionDisabled] = useState(true);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))

    const handleChange = (name, value) => {
        setProfile({...profile,
            [name]: value})
    }


    useEffect(() => {
        getProfileData();
      }, []);

    const getProfileData = async () => {

        setLoading(true);

        let uid = await firebase.auth.currentUser.uid;

        var db = firebase.firestore;

        db.collection("profile").where("uid", "==", uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                setProfile(doc.data())
            });
            setLoading(false);
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
            setLoading(false);
        });

    }

    return (
        <View style={styles.container}>
                <Text style={styles.label}>About me:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        keyboardType='default'
                        editable={aboutMeDisabled ? false: true}
                        onChangeText={(aboutme) => handleChange("aboutMe", aboutme)}
                        style={
                            {...styles.textInput, 
                                borderColor: aboutMeDisabled ? 'red':'green',
                                opacity: aboutMeDisabled ? 0.6:1
                            }}
                        value={profile.aboutMe}
                        placeholder='Tell us something about you'
                    />
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setAboutMeDisabled(!aboutMeDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>profession:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        keyboardType='default'
                        editable={professionDisabled ? false: true}
                        onChangeText={(prof) => handleChange("profession", prof)}
                        style={
                            {...styles.textInput, 
                                borderColor: professionDisabled ? 'red':'green',
                                opacity: professionDisabled ? 0.6:1
                            }}
                        value={profile.profession}
                        placeholder='What is your profession'
                    />
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setProfessionDisabled(!professionDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Im interested in:</Text>
                <Text>Helicopteros</Text>
                <KoroProgress visible={loading}/>
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    inputContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: 3
    },
    text: {
        fontWeight: '100'
    },
    textInput:{
        width: '85%',
        height: 40,
        borderBottomWidth: 3,
        // borderRightWidth: 3,
        borderColor: 'red',
        backgroundColor: '#fae3ef',
        margin: 5,
        paddingHorizontal: 10
    }
})

EditProfileScreen.navigationOptions = {
    headerTitle: 'Edit profile'
}

export default EditProfileScreen;