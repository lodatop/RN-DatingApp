import React, { useEffect, useState, useContext } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import  { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext'

import { MaterialIcons, AntDesign } from '@expo/vector-icons'

import UserData from '../components/profile/UserData'
import UserImages from '../components/profile/UserImages'
import ProfileData from '../components/profile/ProfileData'

import * as ImagePicker from 'expo-image-picker';

import { KoroProgress, KoroModal } from 'rn-koro-lib'
import Colors from '../constants/Colors';
import ImagePickerModal from '../components/ImagePickerModal';

const ProfileScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [profile, setProfile] = useState(profileContext.profile)
    const [modalOpen, setModalOpen] = useState(false)
    const [imagePickerOpen, setImagePickerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))

    useEffect(()=> {
        setLoading(true);
        setProfile(profileContext.profile)
        setTimeout(()=>{
            setLoading(false)
        }, 1000)
    }, [profileContext])

    const updateProfile = () => {
        getProfileData();
    }

    const handleTakePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchCameraAsync();
        
        if(response.uri){
            setPhoto(response)
            setModalOpen(true)
        }
    }

    const handleChoosePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchImageLibraryAsync();
        
        if(response.uri){
            setPhoto(response)
            setModalOpen(true)
        }
    }

    const uploadPhoto = async () => {

        let uid = profile.uid;

        var db = firebase.firestore;

        setLoading(true);

        var storageRef = firebase.storage.ref()
        var ref = storageRef.child(photo.uri.split("/")[photo.uri.split("/").length - 1])
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        ref.put(blob).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                let url = downloadURL
                const photos = (profile.photos) ? profile.photos : [];
                photos.push(url)
                const toUpdate = {
                    photos: photos
                }
                db.collection("profile").where("uid", "==", uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(function(document) {
                    document.ref.update(toUpdate);
                    updateProfile();
                    setLoading(false);
                    setModalOpen(false)
                    });
                }).catch(function(error) {
                    alert("Error getting documents: ", error);
                    setLoading(false);
                });  
            })
        
        })

    }

    const getProfileData = async () => {

        setLoading(true);

        let uid = profile.uid;

        var db = firebase.firestore;

        db.collection("profile").where("uid", "==", uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                profileContext.setProfile(doc.data())
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
            profileContext.setProfile({})
            setLoading(false);
            console.log('user logged out')
            props.navigation.navigate('Login')
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
            <ScrollView style={styles.biography}>
                { profile? <ProfileData profile={profile}/> : <Text style={styles.biography}>No info available</Text>}
            </ScrollView>
            <View style={{...styles.images}}>
                { profile ?
                    profile.photos ? 
                        <ScrollView horizontal={true} style={{flex: 1}}>
                            <UserImages images={[...profile.photos]}/>
                        </ScrollView>
                        :null
                    : null
                }
                <TouchableOpacity 
                    style={{...styles.viewPhotos}}
                    onPress={()=>props.navigation.navigate('UserImages')}
                    >
                    <Text>View More</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userOptionsContainer}>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, ...{width: 65, height: 65, borderColor: Colors.headerColor}}} 
                        activeOpacity={0.7}
                        onPress={() => props.navigation.navigate('EditProfile')}
                        >
                            <MaterialIcons name="edit" size={40} color={Colors.headerColor}/>
                    </TouchableOpacity>
                    <Text style={styles.userOptionText} numberOfLines={2}>Edit your profile</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, borderColor: Colors.acceptColor}} 
                        activeOpacity={0.7}
                        onPress={()=>setImagePickerOpen(true)}>
                            <MaterialIcons name="add-a-photo" size={40} color={Colors.acceptColor}/>
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Add a photo</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity
                        onPress={logout}
                        style={{...styles.iconContainer, ...{width: 65, height: 65, backgroundColor: '#fc4242'}}} 
                        activeOpacity={0.7}>
                            <AntDesign name="logout" size={40} color='white' />
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Logout</Text>
                </View>
            </View>
            <KoroModal 
                visible={modalOpen} 
                borderStyle={{padding: 20}} 
                contentStyle={{borderRadius: 15, elevation: 15, backgroundColor: 'rgba(255, 227, 236, 1)'}}
                onRequestClose={()=> setModalOpen(false)}>
                <Text style={styles.modalTitle}>Image Preview</Text>
                <View style={{width: '100%', height: 2, marginVertical: 10, backgroundColor: Colors.headerColor}}></View>
                {photo && (
                    <View
                        style={{ 
                            overflow: 'hidden',
                            marginVertical: 15,
                            width: '90%', 
                            height: '60%',
                            borderRadius: 10 }}>
                        <Image
                            resizeMode='cover'
                            source={{ uri: photo.uri }}
                            style={{
                                width: '100%', 
                                height: '100%'}}
                        />
                    </View>
                )}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{...styles.modalButton, backgroundColor: Colors.acceptColor}}
                    onPress={uploadPhoto}>
                    <Text style={styles.modalText}>Add image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{...styles.modalButton, backgroundColor: Colors.cancelColor}} 
                    onPress={()=> setModalOpen(false)}>
                    <Text style={{...styles.modalText}}>Cancel</Text>
                </TouchableOpacity>
            </KoroModal>
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
    viewPhotos: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(230, 230, 230, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomLeftRadius: 10
    },
    modalButton: {
        width: '80%',
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 10
    },
    modalTitle:{
        marginVertical: 15,
        fontSize: 25,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    modalText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
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
        backgroundColor: '#ffe6fa',
        borderWidth: 2
    }
})

ProfileScreen.tabBarOptions = {
    headerTitle: 'PROFILE'
}

export default ProfileScreen;