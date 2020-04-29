import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, ScrollView, StyleSheet, TextInput, Dimensions} from 'react-native';

import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

import ChatHeader from '../components/ChatHeader'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

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
    const [newMsg, setNewMsg] = useState('')

    const scrollViewRef = useRef(null)

    useEffect(()=>{
        scrollViewRef.current.scrollToEnd()
    },[])
/*
    let messages = [
        {
            userId: otherUser.uid,
            value: 'hola soy wisam',
        },
        {
            userId: profile.uid,
            value: 'hola soy ester',
        },
        {
            userId: otherUser.uid,
            value: 'como te va',
        },
        {
            userId: profile.uid,
            value: 'bien y a ti',
        },
        {
            userId: otherUser.uid,
            value: 'todo bien',
        },
        {
            userId: profile.uid,
            value: 'me alegro',
        },
        {
            userId: otherUser.uid,
            value: 'Que te gusta hacer por las tardes?',
        },
        {
            userId: profile.uid,
            value: 'Escuchar musica y a ti?',
        },
        {
            userId: otherUser.uid,
            value: 'Verte en Elite',
        },
        {
            userId: profile.uid,
            value: 'Jaja gracias, me alegra de que seas fan',
        },
        {
            userId: profile.uid,
            value: 'me alegro',
        },
        {
            userId: otherUser.uid,
            value: 'Que te gusta hacer por las tardes?',
        },
        {
            userId: profile.uid,
            value: 'Escuchar musica y a ti?',
        },
        {
            userId: otherUser.uid,
            value: 'Verte en Elite',
        },
        {
            userId: profile.uid,
            value: 'Jaja gracias, me alegra de que seas fan',
        },
    ]
    */
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
            var storageRef = firebase.storage.ref()
            var ref = storageRef.child(photo.uri.split("/")[photo.uri.split("/").length - 1])
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            ref.put(blob).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    let url = downloadURL
                    const message = {
                        uid,
                        sendAt: Date.now(),
                        content,
                        attachment: [url],
                    }
                    db.collection('chat').doc(chatId).update({
                        messages: db.FieldValue.arrayUnion(message)
                    })
                })
            
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

    const renderMessages = () => {
        return messages.map((msg, i) => {
            if(msg.userId == profile.uid){
                return (
                    <View key={i} style={{...styles.message, borderTopLeftRadius: 0, backgroundColor: '#fbc9ff', alignSelf: 'flex-start'}}>
                        <Text>{msg.content}</Text>
                        <View style={{position: 'absolute', bottom: 5, left: 10}}>
                            <Text style={{fontSize: 10}}>Time</Text>
                        </View>
                    </View> 
                )
            }
            else {
                return (
                    <View key={i} style={{...styles.message, borderTopRightRadius: 0, backgroundColor: '#f8b0ff', alignSelf: 'flex-end' }}>
                        <Text style={{textAlign: 'right'}}>{msg.content}</Text>
                        <View style={{position: 'absolute', bottom: 5, right: 10}}>
                            <Text style={{fontSize: 10}}>Time</Text>
                        </View>
                    </View>
                )
            }
        })
    }

    return (
        <View style={styles.container}>
            <ChatHeader user={otherUser} goBack={()=>{props.navigation.navigate('Inbox')}}/>
            <View style={styles.chatLayout}>
                <ScrollView ref={scrollViewRef} >
                    {renderMessages()}
                </ScrollView>
            </View>
            {/* This is the Input and send */}
            <View style={styles.sendContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <TextInput placeholder='Write a message' onChangeText={(text)=>setNewMsg(text)} value={newMsg}/>
                    </View>
                    <TouchableOpacity style={styles.camera}>
                        <Ionicons name='ios-camera' size={25} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.send} onPress={()=>sendMessage(newMsg)}>
                    <Ionicons name='ios-send' size={30} color='white'/>
                </TouchableOpacity>
            </View>
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
        padding: 10,
        borderRadius: 10,
        margin: 5,
        paddingBottom: 20, 
        elevation: 8
    }
})

export default ChatScreen;