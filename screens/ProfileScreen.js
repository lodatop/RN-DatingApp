import React, { useEffect, useState, useContext } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';

import { MaterialIcons, AntDesign } from '@expo/vector-icons'

import UserData from '../components/profile/UserData'
import UserImages from '../components/profile/UserImages'
import ProfileData from '../components/profile/ProfileData'

import { KoroProgress } from 'rn-koro-lib'

const ProfileScreen = props => {

    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(false);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    
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

    const logout = () => {
        setLoading(true);
        firebase.auth.signOut()
        .then(() => {
            setLoading(false);
            props.navigation.replace({routeName: 'Login'})
        }).catch(err=> {
            setLoading(false);
            alert("Couldn't logout, try again");
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.userDataContainer}>
                {(profile) ?
                    (profile.photos) ? 
                        <UserData name={profile.name} age={profile.age} photo={profile.photos[0]}/>
                        : <UserData name={profile.name} age={profile.age}/>
                    :<UserData />}
            </View>
            <View style={styles.biography}>
                { profile? <ProfileData profile={profile}/> : <Text style={styles.biography}>No info available</Text>}
            </View>
            <View style={{...styles.images}}>
                { profile ?
                        <ScrollView horizontal={true}>
                            <UserImages images={profile.photos}/>
                        </ScrollView>
                    : null
                }
            </View>
            <View style={styles.userOptionsContainer}>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, ...{width: 65, height: 65, borderColor: '#ff96c0'}}} 
                        activeOpacity={0.7}
                        onPress={() => props.navigation.navigate({routeName: 'EditProfile'})}
                        >
                            <MaterialIcons name="edit" size={40} color='#ff96c0'/>
                    </TouchableOpacity>
                    <Text style={styles.userOptionText} numberOfLines={2}>Edit your profile</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, borderColor: '#ff66a3'}} 
                        activeOpacity={0.7}>
                            <MaterialIcons name="add-a-photo" size={40} color='#ff66a3'/>
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Add a photo</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity
                        onPress={logout}
                        style={{...styles.iconContainer, ...{width: 65, height: 65, backgroundColor: 'red'}}} 
                        activeOpacity={0.7}>
                            <AntDesign name="logout" size={40} color='white' />
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Logout</Text>
                </View>
            </View>
            <KoroProgress visible={loading}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
        overflow: 'visible'
    },
    userDataContainer:{
        height: '37%',
        backgroundColor: 'transparent'
    },
    images: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '28%',
        marginBottom: 15,
        padding: 5,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'lightgrey'
    },
    userOptions: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '40%',
        overflow: 'visible'
    },
    userOptionText: {
        fontSize: 15,
        textAlign: 'center',
        overflow: 'visible'
    },
    userOptionsContainer:{
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        overflow: 'visible',
        alignItems: 'center'
    },
    biography: {
        height: '18%',
        width: '100%',
        backgroundColor: 'transparent'
    },
    iconContainer: {
        width: 80,
        height: 80,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#ffedf4',
        borderWidth: 2
    }
})

ProfileScreen.tabBarOptions = {
    headerTitle: 'PROFILE'
}

export default ProfileScreen;