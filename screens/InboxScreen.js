import React, {useState, useEffect, useContext, useReducer} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { KoroProgress, KoroModal } from 'rn-koro-lib'

import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

import UserChat from '../components/UserChat'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import ImagePickerModal from '../components/ImagePickerModal'
import Stories from '../components/Stories';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const InboxScreen = props => {

    const profileContext = useContext(ProfileContext);
    
    const [loading, setLoading] = useState(false);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState([]);
    const [stories, setStories] = useState([]);
    const [photo, setPhoto] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [imagePickerOpen, setImagePickerOpen] = useState(false)

    const img = 'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2019/11/12/15735360845312.jpg'

    // const stories = [
    //     { userId: '1234', images: [img] }, { userId: '1234', images: [img] },
    //     { userId: '1234', images: [img] }, { userId: '1234', images: [img] },
    //     { userId: '1234', images: [img] }, { userId: '1234', images: [img] },
    //     { userId: '1234', images: [img] }, { userId: '1234', images: [img] }
    // ]

    useEffect(()=>{
        if(profile.uid) {
            setLoading(true)
            getChats()
        }
    }, [])

    useEffect(()=> {
        if(profile.uid) {
            //getMatches()
            getChats()
        }
    }, [profile])

    useEffect(()=> {
        setProfile(profileContext.profile)
    }, [profileContext])

    //probar esto

    useEffect(() => {
        setMatches([]);
        setStories([]);
        const db = firebase.firestore;
        if(profile.matches){
            const unsubscribe = db.collection('profile')
            .where('uid', 'in', profile.matches)
            .onSnapshot(function(snapshot) {
                snapshot.forEach(async function(doc) {
                    let user = doc.data()
                    doc.ref.collection("story").where('uploadedAt', '>', Date.now() - 86400000).get().then((querySnapshot) => {
                        querySnapshot.forEach(async function(doc) {
                            if(!user.stories) user.stories = []
                            user.stories.push(doc.data());
                        })
                        if(user.stories) {
                            let userStories = {
                                userId: user.uid,
                                images: user.stories,
                                userName: user.name
                            }
                            console.log(userStories)
                            setStories(oldArray => [...oldArray, userStories]);
                        }
                        setMatches(oldArray => [...oldArray, user]);
                    });
                    
                });
                setLoading(false)
            })
            console.log(stories)
            return () => {
                    if(unsubscribe)
                        unsubscribe()
                }
            }
            setLoading(false)
      }, [firebase])


    // const getMatches = () => {
    //     setMatches([]);
    //     setStories([]);
    //     const db = firebase.firestore;
    //     if(profile.matches){
    //         const query = db.collection('profile').where('uid', 'in', profile.matches);

    //         query.get()
    //         .then(function(querySnapshot) {
    //             querySnapshot.forEach(async function(doc) {
    //                 let user = doc.data()
    //                 doc.ref.collection("story").where('uploadedAt', '>', Date.now() - 86400000).get().then((querySnapshot) => {
    //                     querySnapshot.forEach(async function(doc) {
    //                         if(!user.stories) user.stories = []
    //                         user.stories.push(doc.data());
    //                     })
    //                     if(user.stories) {
    //                         let userStories = {
    //                             userId: user.uid,
    //                             userName: user.name,
    //                             images: user.stories
    //                         }
    //                         console.log(userStories)
    //                         setStories(oldArray => [...oldArray, userStories]);
    //                     }
    //                     setMatches(oldArray => [...oldArray, user]);
    //                 });
    //             });
    //             setLoading(false)
    //         })
    //         .catch(function(error) {
    //             alert("Error getting documents: ", error);
    //         });
    //     } else {
    //         setLoading(false)
    //     }
        
    // }

    const getChats = () => {
        
        const db = firebase.firestore;
        const query = db.collection('chat').where('participants', 'array-contains', profile.uid);

        query.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                let chat = doc.data()
                chat.ref = doc.id
                
                setChatList(oldArray => [...oldArray, chat]);
                
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });

    }

    const accessChat = (user) => {
        //console.log(stories)
        // console.log(userId)
        let chat = chatList.find(chat => chat.participants.includes(user.uid) )
        // console.log(chat.ref)
        props.navigation.navigate('Chat', {ref: chat.ref, user: user})
        //chat.ref es el id con el q se va a redireccionar
        //hacer la navegacion con el chatId como parametro "chat/:id"
    }

    
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

    const uploadStory = async () => {

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
                const story = {
                    url,
                    uploadedAt: Date.now()
                }
                db.collection("profile").where("uid", "==", uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(function(doc) {
                        doc.ref.collection("story").add(story).then(ref => {
                            setModalOpen(false)
                            setLoading(false);
                        })
                    });
                }).catch(function(error) {
                    alert("Error getting documents: ", error);
                    setLoading(false);
                });  
            })
        
        })
    }

    const renderChats = () => {
        return matches.map((user, i) => {
            return <UserChat key={user.uid} user={user} onPress={()=>accessChat(user)}/>
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.stories}>
                <TouchableOpacity 
                    style={styles.addStory}
                    onPress={()=> setImagePickerOpen(true)}>
                    <Ionicons name='md-add' size={50} color='#ffcffb'/>
                </TouchableOpacity>
                <Stories stories={stories} />
            </View>
            <ScrollView>
                {matches.length > 0 ? renderChats() : <Text>You have no matches yet</Text>}
            </ScrollView>
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
                        onPress={uploadStory}>
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
    container: {
        width: SCREEN_WIDTH,
        height: '100%',
    },
    stories: {
        height: 80,
        width: '100%',
        backgroundColor: '#fac5e8',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addStory:{
        backgroundColor: '#f0f0f0',
        width: 60, 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal: 10,
        borderRadius: 30
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
    
})

export default InboxScreen;