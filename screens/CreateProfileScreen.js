import React, { useState, useContext, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image, Picker, TouchableOpacity} from 'react-native';

//import ImagePicker from 'react-native-image-picker';

import * as ImagePicker from 'expo-image-picker';
import MultiSelect from 'react-native-multiple-select';


import { KoroProgress } from 'rn-koro-lib';

import { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext';
import Colors from '../constants/Colors';

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
        backgroundColor: Colors.acceptColor, 
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