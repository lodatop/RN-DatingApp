import React, { useState, useContext, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image, Picker, TouchableOpacity} from 'react-native';

//import ImagePicker from 'react-native-image-picker';

import * as ImagePicker from 'expo-image-picker';


import { KoroProgress } from 'rn-koro-lib';

import { FirebaseContext } from '../components/Firebase';

const CreateProfileScreen = props => {

    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: '',
        aboutMe: '',
        profession: '',
        height: ''
    })
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(false);
    const [continueDisabled, setContinueDisabled] = useState(true);
    
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        (profile.name === '' || eval(profile.age) < 18 || profile.gender === '') ?
        setContinueDisabled(true) : setContinueDisabled(false)
    }, [profile])

    const handleChoosePhoto = async () => {
        
        let response = await ImagePicker.launchImageLibraryAsync();
        
        if(response.uri){
            setPhoto(response)
        }

        /*const options = {
          noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
            setPhoto(response)
          }
        })*/
      }

    const handleChange = (name, value) => {
        setProfile({...profile,
            [name]: value})
    }

    const createProfile = async () => {

        let uid = await firebase.auth.currentUser.uid;

        var db = firebase.firestore;
        setLoading(true);
        if(photo){
            var storageRef = firebase.storage.ref()
            var ref = storageRef.child(photo.uri.split("/")[photo.uri.split("/").length - 1])
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            ref.put(blob).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    let url = downloadURL
                    const postProfile = {
                        uid,
                        name: profile.name,
                        age: profile.age,
                        gender: profile.gender,
                        photos: [url]
                    }
                    if(profile.aboutMe != '')
                        postProfile.aboutMe = profile.aboutMe;
                    if(profile.height != '')
                        postProfile.height = profile.height;
                    if(profile.profession != '')
                        postProfile.profession = profile.profession;
                    db.collection('profile').add(postProfile).then(ref => {
                        setLoading(false);
                        props.navigation.replace({routeName: 'Main'})
                    })
                })
            
            })

        } else {
            const postProfile = {
                uid,
                name: profile.name,
                age: profile.age,
                gender: profile.gender
            }
            if(profile.aboutMe != '')
                postProfile.aboutMe = profile.aboutMe;
            if(profile.height != '')
                postProfile.height = profile.height;
            if(profile.profession != '')
                postProfile.aboutMe = profile.profession;
            db.collection('profile').add(postProfile).then(ref => {
                setLoading(false);
                props.navigation.replace({routeName: 'Main'})
            })
        }

    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Tell us about yourself!</Text>
                <Text>Name*:</Text>
                <TextInput
                    keyboardType='email-address'
                    onChangeText={(txt) => handleChange("name", txt)}
                    style={{...styles.textInput, borderColor: profile.name ? 'green': 'red'}}
                    value={profile.name}
                />
                <Text>Age*:</Text>
                <TextInput
                    keyboardType='number-pad'
                    onChangeText={(txt) => 
                        {
                            (txt <= 110 ) ? handleChange("age", txt.replace(/[^0-9]/g, '')) : {}
                        }
                    }
                    style={{...styles.textInput, borderColor: eval(profile.age) > 17 ? 'green': 'red'}}
                    value={profile.age}
                />
                
                <Text> Gender*: </Text>
                <View style={{ ...styles.textInput, width: '100%', borderColor: profile.gender ? 'green': 'red' }}>
                    <Picker
                        mode='dialog'
                        selectedValue={profile.gender || 'Select...'}
                        style={{ width: '100%', marginBottom: 10}}
                        onValueChange={(itemValue, itemIndex) => handleChange("gender", itemValue)}
                    >
                        <Picker.Item label="Select..." value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Non Binary" value="non_binary" />
                        <Picker.Item label="Trans Male" value="trans_male" />
                        <Picker.Item label="Trans Female" value="trans_female" />
                    </Picker>
                </View>

                <Text>About You (Optional):</Text>
                <TextInput
                    onChangeText={(txt) => handleChange("aboutMe", txt)}
                    style={{...styles.textInput, borderColor: profile.aboutMe ? 'green': 'red'}}
                    value={profile.aboutMe}
                />
                <Text>Profession (Optional):</Text>
                <TextInput
                    onChangeText={(txt) => handleChange("profession", txt)}
                    style={{...styles.textInput, borderColor: profile.profession ? 'green': 'red'}}
                    value={profile.profession}
                />
                <Text>Height (Optional):</Text>
                <TextInput
                    keyboardType='number-pad'
                    onChangeText={(txt) => handleChange("height", txt)}
                    style={{...styles.textInput, borderColor: profile.height ? 'green': 'red'}}
                    value={profile.height}
                />
                {photo && (
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: 300, height: 300, alignSelf: 'center' }}
                        />
                )}
                <TouchableOpacity 
                    style={styles.choosePhotoButton} 
                    onPress={handleChoosePhoto}>
                    <Text style={styles.choosePhotoText}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={continueDisabled}
                    style={styles.continueButton} 
                    onPress={createProfile}>
                    <Text style={{...styles.continueText, opacity: continueDisabled ? 0.7 : null}}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
            <KoroProgress visible={loading} color='#ed1f63'/>
        </View>
    )
}

const styles = StyleSheet.create({
    choosePhotoButton: {
        marginVertical: 10,
        backgroundColor: '#ff3888', 
        paddingVertical: 10
    },
    choosePhotoText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    continueButton: {
        marginVertical: 10,
        backgroundColor: '#f569a1', 
        paddingVertical: 10
    },
    continueText: {
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

CreateProfileScreen.navigationOptions = {
    headerTitle: 'Edit Profile'
}

export default CreateProfileScreen;