import React, { useEffect, useState, useContext } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';

import { MaterialIcons, AntDesign } from '@expo/vector-icons'

import UserData from '../components/profile/UserData'
import UserImages from '../components/profile/UserImages'

import { KoroProgress } from 'rn-koro-lib'

const ProfileScreen = props => {

    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(false);
    
    const firebase = useContext(FirebaseContext);

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
                setLoading(false);
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });

    }

    return (
        <View style={styles.container}>
            <View style={styles.userDataContainer}>
                {(profile)?
                    (profile.photo)?<UserData name={profile.name} age={profile.age} photo={profile.photo[0]}/>
                    : <UserData name={profile.name} age={profile.age}/>
                    :<UserData />}
            </View>
            <View style={styles.biography}>
                {(profile)? 
                (
                    <View>
                        <Text>About me:</Text>
                        <Text numberOfLines={2}>{profile.aboutMe}</Text>
                        <Text>Profession: {profile.profession}</Text>
                    </View>
                ) : <Text> </Text>}
                {/* <View style={{ backgroundColor: 'green', alignItems: 'center'}}>
                    <ScrollView horizontal={true}>
                        <UserImages />
                    </ScrollView>
                </View> */}
            </View>
            <View style={styles.userOptionsContainer}>
            <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, ...{width: 65, height: 65, borderColor: '#ff96c0'}}} 
                        activeOpacity={0.7}>
                            <MaterialIcons name="edit" size={40} color='#ff96c0'/>
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Edit your profile</Text>
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
        padding: 30
    },
    userDataContainer:{
        
    },
    userOptions: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '50%'
    },
    userOptionText: {
        fontSize: 15,
        textAlign: 'center'
    },
    userOptionsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    biography: {
        flex: 1,
        maxHeight: '40%',
        width: '100%',
        marginBottom: 15
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
export default ProfileScreen;