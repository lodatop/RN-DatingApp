import React, { useEffect, useState, useContext } from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

import { KoroProgress } from 'rn-koro-lib'

import  { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import Colors from '../constants/Colors';
import { Input } from '../components/Input'
import { MultiPick } from '../components/MultiPick'
import { Picker } from '../components/Picker'

const EditProfileScreen = props => {

    const profileContext = useContext(ProfileContext)

    const [profile, setProfile] = useState(profileContext.profile)
    const [loading, setLoading] = useState(false);
    const [nameDisabled, setNameDisabled] = useState(true);
    const [ageDisabled, setAgeDisabled] = useState(true);
    const [genderDisabled, setGenderDisabled] = useState(true);
    const [aboutMeDisabled, setAboutMeDisabled] = useState(true);
    const [professionDisabled, setProfessionDisabled] = useState(true);
    const [lookingForDisabled, setLookingForDisabledDisabled] = useState(true);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))

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

    const handleChange = (name, value) => {
        setProfile({...profile,
            [name]: value})
    }

    const getProfileData = async () => {

        let uid = profile.uid;

        var db = firebase.firestore;

        db.collection("profile").where("uid", "==", uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                profileContext.setProfile(doc.data())
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
            setLoading(false);
        });
    }

    //THe new data is taken and updated to the preview data, so the profile can be updated
    const updateProfile = async () => {

        let uid = profile.uid;

        var db = firebase.firestore;
        setLoading(true);

        const toUpdate = {};

        toUpdate.name = profile.name ? profile.name : '';
        toUpdate.age = profile.age ? profile.age : '';
        toUpdate.gender = profile.gender ? profile.gender : '';
        toUpdate.aboutMe = profile.aboutMe ? profile.aboutMe : '';
        toUpdate.profession = profile.profession ? profile.profession : '';
        toUpdate.lookingFor = profile.lookingFor ? profile.lookingFor : [];

        if(toUpdate.length !== 0){
            db.collection("profile").where("uid", "==", uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async function(document) {
                document.ref.update(toUpdate); 
                await getProfileData()
                setLoading(false);
                props.navigation.navigate('Profile')
                });
            }).catch(function(error) {
                alert("Error getting documents: ", error);
                setLoading(false);
            });  
        } else {
            setLoading(false);
            alert('Nothing to update.')
            props.navigation.navigate('Profile')
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <Input 
                            onChange={(name) => handleChange("name", name)}
                            editable={nameDisabled ? false: true}
                            value={profile.name}
                            style={{
                                ...styles.textInput, 
                                borderColor: nameDisabled ? Colors.closeColor: Colors.checkColor,
                                opacity: nameDisabled ? 0.6 : 1,
                                backgroundColor: nameDisabled ? 'lightgrey' : 'transparent'
                            }}
                            label='Name'
                            />
                    </View>
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setNameDisabled(!nameDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <Input
                            onChange={(age) => 
                                {
                                    (age <= 110 ) ? handleChange("age", age.replace(/[^0-9]/g, '')) : {}
                                }
                            }
                            type='number-pad'
                            // onChange={(age) => handleChange("age", age)}
                            editable={ageDisabled ? false: true}
                            value={profile.age}
                            style={{
                                ...styles.textInput, 
                                borderColor: ageDisabled || profile.age < 17 ? Colors.closeColor: Colors.checkColor,
                                opacity: ageDisabled ? 0.6 : 1,
                                backgroundColor: ageDisabled ? 'lightgrey' : 'transparent'
                            }}
                            label='Age'
                            />
                    </View>
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setAgeDisabled(!ageDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>


                <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <Text style={{color:'#b5b5b5'}}>Gender</Text>
                        <View style={{ 
                            ...styles.picker, 
                            borderColor: genderDisabled ? Colors.closeColor: Colors.checkColor,
                            opacity: genderDisabled ? 0.6:1,
                            backgroundColor: genderDisabled ? 'lightgrey' : 'transparent'
                            }}>
                            <Picker
                                value={profile.gender}
                                disabled={genderDisabled}
                                onValueChange={(gender) => handleChange("gender", gender)} 
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
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setGenderDisabled(!genderDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>


                <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <Input 
                            onChange={(aboutme) => handleChange("aboutMe", aboutme)}
                            editable={aboutMeDisabled ? false: true}
                            value={profile.aboutMe}
                            style={{
                                ...styles.textInput, 
                                borderColor: aboutMeDisabled ? Colors.closeColor: Colors.checkColor,
                                opacity: aboutMeDisabled ? 0.6 : 1,
                                backgroundColor: aboutMeDisabled ? 'lightgrey' : 'transparent'
                            }}
                            label='About Me'
                            />
                    </View>
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setAboutMeDisabled(!aboutMeDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <Input 
                            onChange={(prof) => handleChange("profession", prof)}
                            value={profile.profession}
                            editable={professionDisabled ? false: true}
                            style={{
                                ...styles.textInput, 
                                borderColor: professionDisabled ? Colors.closeColor: Colors.checkColor,
                                opacity: professionDisabled ? 0.6:1,
                                backgroundColor: professionDisabled ? 'lightgrey' : 'transparent'
                            }}
                            label='Profession'
                            />
                    </View>
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setProfessionDisabled(!professionDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{marginBottom: 10, width: '87%'}}>
                        <View style={{marginBottom: 10}}>
                            <Text style={{color:'#b5b5b5'}}>Looking For</Text>
                            <View style={{ 
                                ...styles.picker, 
                                borderColor: lookingForDisabled ? Colors.closeColor: Colors.checkColor,
                                opacity: lookingForDisabled ? 0.6:1,
                                backgroundColor: lookingForDisabled ? 'lightgrey' : 'transparent'
                                }}>
                                <MultiPick disabled={lookingForDisabled} options={items} visible={true} value={profile.lookingFor} onValueChange={(lookingFor) => handleChange("lookingFor", lookingFor)}/>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={{flex: 1, alignSelf:'center', marginLeft: 8}} 
                        activeOpacity={0.6}
                        onPress={()=>setLookingForDisabledDisabled(!lookingForDisabled)}
                        >
                        <MaterialIcons name='mode-edit' size={35} color='#ff73a1'/>
                    </TouchableOpacity>
                </View>
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
                        onPress={()=>{props.navigation.navigate('Profile')}}>
                        <Text style={styles.buttonText}>Discard Changes</Text>
                    </TouchableOpacity>
                </View>
                <KoroProgress visible={loading} contentStyle={{borderRadius: 10}} color='#ed1f63'/>
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    picker: {
        borderBottomWidth: 3, 
        borderColor: 'red', 
        margin: 5,
        alignItems: 'center'
    },
    buttonContainer:{
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    applyButton: {
        marginVertical: 10,
        backgroundColor: Colors.acceptColor, 
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10
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
        backgroundColor: Colors.cancelColor, 
        paddingVertical: 10,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 10
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
        margin: 5,
        paddingHorizontal: 10
    }
})

EditProfileScreen.navigationOptions = {
    headerTitle: 'Edit profile'
}

export default EditProfileScreen;