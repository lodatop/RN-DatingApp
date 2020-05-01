import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, Dimensions, Keyboard, Image, TouchableOpacity} from 'react-native';

import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';
import ImagePickerModal from '../components/ImagePickerModal'
import { KoroModal, KoroProgress } from 'rn-koro-lib'
import ChatHeader from '../components/ChatHeader'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';

import { Notifications } from 'expo';

const SCREEN_WITDH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const ChatScreen = props => {

    const chatId = props.route.params.ref
    const otherUser = props.route.params.user

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [photo, setPhoto] = useState(null)
    const [notification, setNotification] = useState({})
    const [newMsg, setNewMsg] = useState('')
    let KeyboardHiddenListener
    let KeyboardShownListener
    const [chatContainerStyle, setChatContainerStyle] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [imagePickerOpen, setImagePickerOpen] = useState(false)

    const scrollViewRef = useRef(null)

    const scrollDown = () => {
        scrollViewRef.current.scrollToEnd()
    }

    useEffect(()=>{
        KeyboardHiddenListener = Keyboard.addListener('keyboardDidHide', keyboardIsHidden)
        KeyboardShownListener = Keyboard.addListener('keyboardDidShow', keyboardIsVisible)
        Notifications.addListener(handleNotification); 
    }, [])

    const keyboardIsHidden = () => {
        setChatContainerStyle({height: SCREEN_HEIGHT*0.72})
    }

    const keyboardIsVisible = () => {
        setChatContainerStyle({height: SCREEN_HEIGHT*0.3})
    }

    const handleNotification = (notification) => {
        Vibration.vibrate(1000)
        setNotification(notification)
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

    const sendPushNotification = async (message) => {
        const msg = {
          to: otherUser.expoToken,
          sound: 'default',
          title: 'New message from ' + profile.name,
          body: message,
          data: { data: 'goes here' },
          _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(msg),
        });
      };

    useEffect(() => {
        const unsubscribe = firebase
          .firestore.collection('chat').doc(chatId)
          .onSnapshot(snapshot => {
            if (snapshot.exists) {
              // we have something
              setMessages(snapshot.data().messages.sort((a, b) => b.date - a.date))
              setLoading(false)
            } else {
              // it's empty
              setLoading(false)
            }
          })
      return () => {
          unsubscribe()
        }
      }, [firebase])

    //aqui agarramos el chat id del parametro en la ruta, dado q esta ruta es un chat/:id

    const sendMessage = async (content) => {

        let uid = profile.uid;

        var db = firebase.firestore;

        if(photo){
            setLoading(true)
            var storageRef = firebase.storage.ref()
            var ref = storageRef.child(photo.uri.split("/")[photo.uri.split("/").length - 1])
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            ref.put(blob).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    let url = downloadURL
                    const message = {
                        uid,
                        attachment: url,
                        sendAt: Date.now(),
                        content
                    }
                    let messagesX = messages
                    messagesX.push(message)
                    setMessages(oldArray => [...oldArray, message]);
                    const toUpdate = {
                        messages: messagesX
                    }
                    db.collection('chat').doc(chatId).update(toUpdate)
                })
                setLoading(false)
                setModalOpen(false)
            })

        } else {
            const message = {
                uid,
                sendAt: Date.now(),
                content
            }
            let messagesX = messages
            messagesX.push(message)
            setMessages(oldArray => [...oldArray, message]);
            const toUpdate = {
                messages: messagesX
            }
            db.collection('chat').doc(chatId).update(toUpdate)
            console.log(chatId)
            sendPushNotification(newMsg)
            setNewMsg('')
        }
    }

    // const sendMessageHandler = (msg) => {
    //     console.log(msg)
    //     setNewMsg('')
    // }

    // const getChatPartner = () => {
    //     const db = firebase.firestore; 

    //     db.collection("profile").where("uid", "==", chatPartner.uid)
    //     .get()
    //     .then(function(querySnapshot) {
    //         querySnapshot.forEach(async function(doc) {
    //             setChatPartner(doc.data())/*
    //             doc.ref.collection("story").get().then((querySnapshot) => {
    //                 setStories(querySnapshot.docs.data()) 
    //                 querySnapshot.forEach(async function(doc) {
    //                     setStories(oldArray => [...oldArray, doc.data()]);
    //                 })
    //               });*/
    //         });
    //     })
    //     .catch(function(error) {
    //         alert("Error getting documents: ", error);
    //     });
    // }

    const transformTime = (ms) => {
        let time = new Date(ms)
        let date = time.getDate()
        let month = time.getMonth()
        let year = time.getFullYear()
        let hour = time.getHours()
        let min = time.getMinutes()

        let newTime = `${date}/${month}/${year} ${hour}:${min}`

        return newTime
    }

    const renderMessages = () => {
        console.log(messages)
        return messages.map((msg, i) => {
            if(msg.content || msg.attachment) {
                if(msg.uid == profile.uid){
                    return (
                        <View key={i} style={{...styles.message, borderTopRightRadius: 0, backgroundColor: '#f8b0ff', alignSelf: 'flex-end' }}>
                        {msg.attachment ? 
                            (
                                <TouchableOpacity>
                                    <Image
                                    style={styles.photo}
                                    resizeMode='cover'
                                    source={{uri: msg.attachment}}/>
                                </TouchableOpacity>
                            ) 
                            : (
                                <Text style={{textAlign: 'right'}}>{msg.content}</Text>        
                                )    
                        }
                        <View style={{position: 'absolute', bottom: 5, right: 10}}>
                            <Text style={{fontSize: 10}}>{transformTime(msg.sendAt)}</Text>
                        </View>
                    </View>   
                )
                }
                else {
                    return (
                        <View key={i} style={{...styles.message, borderTopLeftRadius: 0, backgroundColor: '#fbc9ff', alignSelf: 'flex-start'}}>

                            {msg.attachment ? (
                                    <TouchableOpacity>
                                        <Image
                                        style={styles.photo}
                                        resizeMode='cover'
                                        source={{uri: msg.attachment}}/>
                                    </TouchableOpacity>
                                )  :
                                (
                                    <Text>{msg.content}</Text>
                                )  
                            }

                            <View style={{position: 'absolute', bottom: 5, left: 10}}>
                                <Text style={{fontSize: 10}}>{transformTime(msg.sendAt)}</Text>
                            </View>
                        </View> 
                    )
                }
            }
        })
    }

    return (
        <View style={styles.container}>
            <ChatHeader user={otherUser} goBack={()=>{props.navigation.navigate('Inbox')}}/>
            <View style={{...styles.chatLayout, ...chatContainerStyle}}>
                <ScrollView ref={scrollViewRef} onContentSizeChange={()=>scrollDown()}>
                    {renderMessages()}
                </ScrollView>
            </View>
            {/* This is the Input and send */}
            <View style={styles.sendContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <TextInput placeholder='Write a message' onChangeText={(text)=>setNewMsg(text)} value={newMsg} 
                        onFocus={()=>{console.log('im focussed')}}
                        onBlur={()=>{console.log('im blur')}}
                        />
                    </View>
                    <TouchableOpacity style={styles.camera} onPress={()=>setImagePickerOpen(true)}>
                        <Ionicons name='ios-camera' size={25} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.send} onPress={()=>sendMessage(newMsg)}>
                    <Ionicons name='ios-send' size={30} color='white'/>
                </TouchableOpacity>
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
                        onPress={sendMessage}>
                        <Text style={styles.modalText}>Send image</Text>
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
        flex: 1
    },
    sendContainer: {
        padding: 10,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        // backgroundColor: 'red',
        width: SCREEN_WITDH*0.95
    },
    inputContainer:{
        borderWidth: 1, 
        borderColor: 'rgba(0,0,0,0.4)',
        width: '88%',
        marginRight: 10,
        padding: 10,
        paddingLeft: 15,
        borderRadius: 30,
        flexDirection: 'row'
    },
    input: {
        width: '90%'
    },
    send: {
        backgroundColor: Colors.acceptColor, 
        width: 45, 
        height: 45,  
        paddingTop: 8,
        paddingLeft: 10, 
        borderRadius: 30,
    },
    chatLayout: {
        position: 'absolute',
        bottom: 80,
        height: SCREEN_HEIGHT*0.72,
        width: SCREEN_WITDH*0.95,
        marginHorizontal: 10,
        justifyContent: 'center',
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#fcd9ff',
        elevation: 5
    },
    message: {
        maxWidth: '80%',
        minWidth: '30%', 
        padding: 10,
        borderRadius: 10,
        margin: 5,
        paddingBottom: 20, 
        elevation: 8
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 10,
        padding: 10
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

export default ChatScreen;