import React, { useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image, Picker, TouchableOpacity} from 'react-native';

import ImagePicker from 'react-native-image-picker'

import { KoroProgress } from 'rn-koro-lib'

import { FirebaseContext } from '../components/Firebase';

const CreateProfileScreen = props => {

    const [profile, setProfile] = useState({})
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(false);
    
    const firebase = useContext(FirebaseContext);

    handleChoosePhoto = () => {
        const options = {
          noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            setPhoto(response)
          }
        })
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
            var storageRef = firebase.storage().ref()
            var ref = storageRef.child(photo)

            ref.put(photo).then(snapshot => {
                console.log(snapshot)
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    let url = downloadURL
                    const postProfile = {
                        uid,
                        name: profile.name,
                        age: profile.age,
                        gender: profile.gender,
                        aboutMe: profile.aboutMe,
                        profession: profile.profession,
                        height: profile.height,
                        photos: [url]
                    }
                    db.collection('profile').add(postProfile).then(ref => {
                        setLoading(false);
                        props.navigation.replace({routeName: 'Main'})
                    }).catch(function(error) {
                        setLoading(false);
                        var errorMessage = error.message;
                        alert(errorMessage);
                    })
                })
            
            })

        } else {
            postProfile = {
                uid,
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                aboutMe: profile.aboutMe,
                profession: profile.profession,
                height: profile.height,
            }
            db.collection('profile').add(postProfile).then(ref => {
                setLoading(false);
                props.navigation.replace({routeName: 'Main'})
            }).catch(function(error) {
                setLoading(false);
                var errorMessage = error.message;
                alert(errorMessage);
            })
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tell us about yourself!</Text>
            <Text>Name:</Text>
            <TextInput
                keyboardType='email-address'
                onChangeText={(txt) => handleChange("name", txt)}
                style={{...styles.textInput, borderColor: profile.name ? 'green': 'red'}}
                value={profile.name}
            />
            <Text>Age:</Text>
            <TextInput
                keyboardType='number-pad'
                onChangeText={(txt) => 
                    {
                        (txt <= 110 ) ? handleChange("age", txt.replace(/[^0-9]/g, '')) : {}
                    }
                }
                style={{...styles.textInput, borderColor: profile.age ? 'green': 'red'}}
                value={profile.age}
            />
            
            <Text> Gender: </Text>
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
                </Picker>
            </View>

            <Text>About You:</Text>
            <TextInput
                onChangeText={(txt) => handleChange("aboutMe", txt)}
                style={{...styles.textInput, borderColor: profile.aboutMe ? 'green': 'red'}}
                value={profile.aboutMe}
            />
            <Text>Profession:</Text>
            <TextInput
                onChangeText={(txt) => handleChange("profession", txt)}
                style={{...styles.textInput, borderColor: profile.profession ? 'green': 'red'}}
                value={profile.profession}
            />
            <Text>Height:</Text>
            <TextInput
                keyboardType='number-pad'
                onChangeText={(txt) => handleChange("height", txt)}
                style={{...styles.textInput, borderColor: profile.height ? 'green': 'red'}}
                value={profile.height}
            />
            {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 300, height: 300 }}
                />
            )}
           <TouchableOpacity 
                style={styles.choosePhotoButton} 
                onPress={this.handleChoosePhoto}>
                <Text style={styles.choosePhotoText}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.continueButton} 
                onPress={createProfile}>
                <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
            <KoroProgress visible={loading}/>
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
    headerTitle: 'YOUR PROFILE'
}

export default CreateProfileScreen;