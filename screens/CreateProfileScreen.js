import React, { useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, Button, TextInput, Image} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';
import ImagePicker from 'react-native-image-picker'

const createProfileScreen = props => {

    const [profile, setProfile] = useState({})
    const [photo, setPhoto] = useState(null)
    
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
                        props.navigation.replace({routeName: 'Main'})
                    }).catch(function(error) {
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
                props.navigation.replace({routeName: 'Main'})
            }).catch(function(error) {
                var errorMessage = error.message;
                alert(errorMessage);
            })
        }

    }

    return (
        <View>
            <Text> Tell us about Yourself. Wisam haz esto un titulo grandecito y lindo o algo asi. </Text>
            <Text> Name: </Text>
            <TextInput onChangeText={(txt) => handleChange("name", txt)} value={profile.name}></TextInput>
            <Text> Age: </Text>
            <TextInput onChangeText={(txt) => handleChange("age", txt)} value={profile.age} keyboardType="number-pad"></TextInput>
            <Text> Gender: </Text>
            {//esto tiene q ser un select, acomodalo vos
                }
            <TextInput onChangeText={(txt) => handleChange("gender", txt)} value={profile.gender}></TextInput>
            <Text> About You: </Text>
            <TextInput onChangeText={(txt) => handleChange("aboutMe", txt)} value={profile.aboutMe}></TextInput>
            <Text> Profession: </Text>
            <TextInput onChangeText={(txt) => handleChange("profession", txt)} value={profile.profession}></TextInput>
            <Text> Height: </Text>
            <TextInput onChangeText={(txt) => handleChange("height", txt)} value={profile.height}></TextInput>
           
            <View>
                {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 300, height: 300 }}
                />
                )}
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
            </View>

            <View style={styles.button}>
                <Button
                    title='Continue'
                    onPress={createProfile}
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

export default createProfileScreen;