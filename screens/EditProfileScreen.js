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

    const updateProfile = async () => {

        let uid = await firebase.auth.currentUser.uid;

        var db = firebase.firestore;
        setLoading(true);

        const toUpdate = {};

        if(profile.aboutMe != '' && profile.aboutMe)
            toUpdate.aboutMe = profile.aboutMe;
        if(profile.profession != '' && profile.profession)
            toUpdate.profession = profile.profession;

        if(toUpdate.length !== 0){
            db.collection("profile").where("uid", "==", uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function(document) {
                document.ref.update(toUpdate); 
                setLoading(false);
                props.navigation.replace({routeName: 'Main'})
                });
            }).catch(function(error) {
                alert("Error getting documents: ", error);
                setLoading(false);
            });  
        } else {
            setLoading(false);
            alert('Nothing to update.')
            props.navigation.replace({routeName: 'Main'})
        }

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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.applyButton} 
                        onPress={updateProfile}>
                        <Text style={styles.buttonText}>Apply Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        style={styles.discardButton} 
                        onPress={()=>{props.navigation.goBack()}}>
                        <Text style={styles.buttonText}>Discard Changes</Text>
                    </TouchableOpacity>
                </View>
                <KoroProgress visible={loading} color='#ed1f63'/>
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    buttonContainer:{
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    applyButton: {
        marginVertical: 10,
        backgroundColor: '#f569a1', 
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    discardButton: {
        marginVertical: 10,
        backgroundColor: '#ff1c67', 
        paddingVertical: 10,
        width: '70%',
        alignSelf: 'center'
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