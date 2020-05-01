import React, { useState, useContext, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image, TouchableOpacity} from 'react-native';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


import { KoroProgress } from 'rn-koro-lib';

import { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import Colors from '../constants/Colors';
import { Input } from '../components/Input'
import { Picker } from '../components/Picker'
import {MultiPick} from '../components/MultiPick'
import ImagePickerModal from '../components/ImagePickerModal'

const CreateProfileScreen = props => {

    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: '',
        aboutMe: '',
        profession: '',
        height: '',
        expoToken: ''
    })
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(false);
    const [continueDisabled, setContinueDisabled] = useState(true);
    const [lookingFor, setLookingFor] = useState([]);
    const [imagePickerOpen, setImagePickerOpen] = useState(false)
    const [location, setLocation] = useState(null);

    
    const firebase = useContext(FirebaseContext);
    const profileContext = useContext(ProfileContext)

    useEffect(()=> {
        registerForPushNotificationsAsync()
        getGeolocation()
    }, [])
    useEffect(() => {
        (profile.name === '' || eval(profile.age) < 18 || profile.gender === '' || lookingFor.length == 0) ?
        setContinueDisabled(true) : setContinueDisabled(false)
    }, [profile, lookingFor])

    const items = [{
        label: 'Male',
        name: 'male'
      }, {
        label: 'Female',
        name: 'female'
      }, {
        label: 'Non Binary',
        name: 'non_binary'
      }, {
        label: 'Trans Male',
        name: 'trans_male'
      }, {
        label: 'Trans Female',
        name: 'trans_female'
      }
    ];

    //gets location
    const getGeolocation = async () => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              alert('Permission to access location was denied');
            }
      
            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
            setLocation(location);
          })();
    }

    //creates an expoPushToken for notification purposes.
    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          let token = await Notifications.getExpoPushTokenAsync();
          setProfile({...profile,
            expoToken: token})
          console.log(token)
        } else {
          alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
      };

    const handleTakePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchCameraAsync();
        
        if(response.uri){
            setPhoto(response)
        }
    }

    const handleChoosePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchImageLibraryAsync();
        
        if(response.uri){
            setPhoto(response)
        }
    }

    const handleChange = (name, value) => {
        setProfile({...profile,
            [name]: value})
    }


    //Gets all data entered by the user and adds it to the profile
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
                        lookingFor: lookingFor,
                        photos: [url],
                        expoToken: profile.expoToken
                    }
                    if(location) {
                        postProfile.geolocation.latitude = location.coords.latitude;
                        postProfile.geolocation.longitude = location.coords.longitude;
                    }
                    if(profile.aboutMe != '')
                        postProfile.aboutMe = profile.aboutMe;
                    if(profile.height != '')
                        postProfile.height = profile.height;
                    if(profile.profession != '')
                        postProfile.profession = profile.profession;
                    db.collection('profile').add(postProfile).then(ref => {
                        profileContext.setProfile(postProfile)
                        setLoading(false);
                        props.navigation.navigate('Tabs')
                    })
                })
            
            })

        } else {
            const postProfile = {
                uid,
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                lookingFor: lookingFor,
                expoToken: profile.expoToken
            }
            if(location) {
                postProfile.geolocation.latitude = location.coords.latitude;
                postProfile.geolocation.longitude = location.coords.longitude;
            }
            if(profile.aboutMe != '')
                postProfile.aboutMe = profile.aboutMe;
            if(profile.height != '')
                postProfile.height = profile.height;
            if(profile.profession != '')
                postProfile.profession = profile.profession;
            db.collection('profile').add(postProfile).then(ref => {
                profileContext.setProfile(postProfile)
                setLoading(false);
                props.navigation.navigate('Tabs')
            })
        }

    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Tell us about yourself!</Text>
                <View style={{marginBottom: 10}}>
                    <Input 
                        onChange={(txt) => handleChange("name", txt)}
                        type='default'
                        value={profile.name}
                        label='Name'
                        style={{ borderColor: profile.name !== '' ? Colors.checkColor: Colors.closeColor }}
                        />
                </View>
                <View style={{marginBottom: 10}}>
                    <Input 
                        onChange={(txt) => 
                            {
                                (txt <= 110 ) ? handleChange("age", txt.replace(/[^0-9]/g, '')) : {}
                            }
                        }
                        type='number-pad'
                        value={profile.age}
                        label='Age'
                        style={{ borderColor: profile.age > 17 ? Colors.checkColor: Colors.closeColor }}
                        />
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={{color:'#b5b5b5'}}>Gender</Text>
                    <View style={{ ...styles.picker, borderColor: profile.gender ? Colors.checkColor: Colors.closeColor }}>
                        <Picker 
                            onValueChange={(itemValue) => handleChange("gender", itemValue)} 
                            options={
                                [
                                    { label: "Male", value: "male" }, 
                                    { label: "Female", value: "female" }, 
                                    { label: "Non Binary", value: "non_binary" }, 
                                    { label: "Trans Male", value: "trans_male" },
                                    { label: "Trans Female", value: "trans_female" }
                                ]}
                            />
                    </View>
                </View>
                <View style={{marginBottom: 10}}>
                    <Input 
                        onChange={(txt) => handleChange("aboutMe", txt)}
                        type='default'
                        value={profile.aboutMe}
                        label='About You'
                        style={{ borderColor: profile.aboutMe !== '' ? Colors.checkColor: Colors.closeColor }}
                        />
                </View>
                <View style={{marginBottom: 10}}>
                    <Input 
                        onChange={(txt) => handleChange("profession", txt)}
                        type='default'
                        value={profile.profession}
                        label='Profession'
                        style={{ borderColor: profile.profession !== '' ? Colors.checkColor: Colors.closeColor }}
                        />
                </View>
                <View style={{marginBottom: 10}}>
                    <Input 
                        onChange={(txt) => handleChange("height", txt)}
                        type='number-pad'
                        value={profile.height}
                        label='Height'
                        style={{ borderColor: profile.height !== '' ? Colors.checkColor: Colors.closeColor }}
                        />
                </View>
                <View style={{marginBottom: 10}}>
                    <Text style={{color:'#b5b5b5'}}>Looking For</Text>
                    <View style={{ ...styles.picker, borderColor: lookingFor.length > 0 ? Colors.checkColor: Colors.closeColor }}>
                        <MultiPick options={items} visible={true} onValueChange={(answer)=>setLookingFor(answer)}/>
                    </View>
                </View>

                {photo && (
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: '80%', height: 400, alignSelf: 'center', borderRadius: 10 }}
                        />
                )}
                <TouchableOpacity 
                    style={styles.choosePhotoButton} 
                    onPress={()=>setImagePickerOpen(true)}>
                    <Text style={styles.choosePhotoText}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={continueDisabled}
                    style={styles.continueButton} 
                    onPress={createProfile}>
                    <Text style={{...styles.continueText, opacity: continueDisabled ? 0.7 : null}}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
            <ImagePickerModal 
                visible={imagePickerOpen} 
                onClose={()=>setImagePickerOpen(false)} 
                onRollPick={handleChoosePhoto}
                onCameraPick={handleTakePhoto}
                />
            <KoroProgress visible={loading} contentStyle={{borderRadius: 10}} color='#ed1f63'/>
        </View>
    )
}

const styles = StyleSheet.create({
    choosePhotoButton: {
        marginVertical: 10,
        backgroundColor: '#ff3888', 
        paddingVertical: 10,
        borderRadius: 10
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
        backgroundColor: Colors.acceptColor, 
        paddingVertical: 10,
        borderRadius: 10
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
    },
    picker: {
        borderBottomWidth: 3, 
        borderColor: 'red', 
        margin: 5,
        alignItems: 'center'
    }
})

CreateProfileScreen.navigationOptions = {
    headerTitle: 'Edit Profile'
}

export default CreateProfileScreen;