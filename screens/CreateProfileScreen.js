import React, { useState, useContext, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image, TouchableOpacity} from 'react-native';

//import ImagePicker from 'react-native-image-picker';

import * as ImagePicker from 'expo-image-picker';
import MultiSelect from 'react-native-multiple-select';


import { KoroProgress } from 'rn-koro-lib';

import { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext';
import Colors from '../constants/Colors';
import { Input } from '../components/Input'
import { Picker } from '../components/Picker'
import ImagePickerModal from '../components/ImagePickerModal'

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
    const [lookingFor, setLookingFor] = useState([]);
    const [imagePickerOpen, setImagePickerOpen] = useState(false)

    
    const firebase = useContext(FirebaseContext);
    const profileContext = useContext(ProfileContext)

    useEffect(() => {
        (profile.name === '' || eval(profile.age) < 18 || profile.gender === '' || lookingFor.length == 0) ?
        setContinueDisabled(true) : setContinueDisabled(false)
    }, [profile, lookingFor])

    const items = [{
        id: '1',
        name: 'male',
      }, {
        id: '2',
        name: 'female',
      }, {
        id: '3',
        name: 'non_binary',
      }, {
        id: '4',
        name: 'trans_male',
      }, {
        id: '5',
        name: 'trans_female'
      }];

    const onSelectedLookingFor = (selected) => {
        /*let lookingFor = selected.map(function (obj) {
            return obj.name;
        });*/
        setLookingFor(selected);
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
                        photos: [url]
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
                lookingFor: lookingFor
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

                <View style={{ flex: 1, marginVertical: 2}}>
                    <MultiSelect
                        hideTags
                        items={items}
                        uniqueKey="name"
                        onSelectedItemsChange={onSelectedLookingFor}
                        selectedItems={lookingFor}
                        selectText="Looking for..."
                        searchInputPlaceholderText="Search..."
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        fixedHeight={true}
                        hideSubmitButton={true}
                        searchInputStyle={{ color: '#CCC' }}
                        />
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
            <KoroProgress visible={loading} color='#ed1f63'/>
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