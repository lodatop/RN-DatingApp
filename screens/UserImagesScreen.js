import React, {useContext, useState, useEffect} from 'react';
import {View, Image, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { KoroProgress, KoroModal } from 'rn-koro-lib'
import * as ImagePicker from 'expo-image-picker';


import  { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext'
import ImagePickerModal from '../components/ImagePickerModal'
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window')

const UserImagesScreen = props => {
    const profileContext = useContext(ProfileContext);
    const [photos, setPhotos] = useState(profileContext.profile.photos);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [imagePickerOpen, setImagePickerOpen] = useState(false)
    const [photo, setPhoto] = useState(null)


    useEffect(()=> {
        setLoading(true);
        setPhotos(profileContext.profile.photos)
        setProfile(profileContext.profile)
        setTimeout(()=>{
            setLoading(false)
        }, 1000)
    }, [profileContext])

    const handleTakePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchCameraAsync();
        
        if(!response.cancelled){
            setPhoto(response)
            setModalOpen(true)
        }
    }

    const handleChoosePhoto = async () => {
        setImagePickerOpen(false)
        let response = await ImagePicker.launchImageLibraryAsync();
        
        if(!response.cancelled){
            setPhoto(response)
            setModalOpen(true)
        }
    }

    const uploadPhoto = async () => {

        let uid = await firebase.auth.currentUser.uid;

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

    const deletePhoto = async (photoId) => {

        let uid = profile.uid;

        var db = firebase.firestore;
        setLoading(true);

        const toUpdate = {};

        toUpdate.photos = profile.photos.filter(photoUri => photoUri != photoId);

        if(toUpdate.length !== 0){
            db.collection("profile").where("uid", "==", uid)
            .get()
            .then((querySnapshot) => {
                    querySnapshot.forEach(async function(document) {
                    document.ref.update(toUpdate); 
                    await getProfileData()
                    setLoading(false);
                });
            }).catch(function(error) {
                alert("Error getting documents: ", error);
                setLoading(false);
            }); 
        } else {
            setLoading(false);
            alert('No photo selected to be deleted.')
            props.navigation.navigate('Profile')
        }

    }

    const updateProfile = () => {
        getProfileData();
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

    return (
        // <View><Text>Hello im your pictures</Text></View>
        <ScrollView style={{flex:1}}>
            <View style={{...styles.container, flexDirection: photos ? photos.length > 0 ? 'row' : 'column' : 'row'}}>
                {photos ?
                    photos.length > 0 ?
                    photos.map((photo, index) => {
                        return (
                            <View key={photo} style={styles.photo}>
                                <Image
                                    style={{width: width*0.44, height: width*0.44, borderRadius: 10}}
                                    resizeMode='cover'
                                    source={{uri: photo}}/>
                                <TouchableOpacity 
                                    style={styles.deletePhoto}
                                    onPress={()=>deletePhoto(photo)}
                                    >
                                    <MaterialIcons name='delete' size={30} color='white'/>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                    : <View style={{width: width, marginBottom: 10}}><Text style={{alignSelf: 'center', fontSize: 20, fontWeight: '700', textTransform: 'capitalize'}}>No photos</Text></View> 
                    : <View style={{width: width, marginBottom: 10}}><Text style={{alignSelf: 'center', fontSize: 20, fontWeight: '700', textTransform: 'capitalize'}}>No photos</Text></View> 
                }
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
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=>setImagePickerOpen(true)}
                    style={{...styles.photo, alignItems: 'center', justifyContent: 'center'}}>
                        <MaterialIcons name='add' size={100} color='white'/>
                </TouchableOpacity>
                <ImagePickerModal 
                    visible={imagePickerOpen} 
                    onClose={()=>setImagePickerOpen(false)} 
                    onRollPick={handleChoosePhoto}
                    onCameraPick={handleTakePhoto}
                />
                <KoroProgress visible={loading} contentStyle={{borderRadius: 10}} color='#ed1f63'/>
            </View>
        </ScrollView>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between'
        
    },
    photo: {
        width: width*0.44,
        height: width*0.44,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        marginBottom: 15
    },
    deletePhoto: {
        position: 'absolute',
        borderRadius: 10,
        bottom: -5,
        right: -5,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: Colors.cancelColor,
        alignItems: 'center',
        justifyContent: 'center'
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
    modalButton: {
        width: '80%',
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 10
    },
})

export const userImagesConfig = {
    
}

export default UserImagesScreen;