import React, {useState, useEffect, useContext} from 'react';
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
    const user = props.route.params.user

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatPartner, setChatPartner] = useState({})
    const [messages, setMessages] = useState([])
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [photo, setPhoto] = useState(null)
    const [newMsg, setNewMsg] = useState('')

    // useEffect(() => {
    //     const unsubscribe = firebase
    //       .db.collection('chat').doc(chatId)
    //       .onSnapshot(snapshot => {
    //         console.log(snapshot)
    //         if (snapshot.exists) {
    //           // we have something
    //           let participants = snapshot.data().participants;
    //           (participants[0] == profile.uid)? setChatPartner({...chatPartner, uid: participants[1] }) : setChatPartner({...chatPartner, uid: participants[0] }) ;
    //           setMessages(snapshot.data().messages)
    //           setLoading(false)
    //         } else {
    //           // it's empty
    //           setLoading(false)
    //         }
    //       })
    //   return () => {
    //       unsubscribe()
    //     }
    //   }, [firebase])

    //aqui agarramos el chat id del parametro en la ruta, dado q esta ruta es un chat/:id

    // const sendMessage = async (content) => {

    //     let uid = profile.uid;

    //     var db = firebase.firestore;

    //     if(photo){
    //         var storageRef = firebase.storage.ref()
    //         var ref = storageRef.child(photo.uri.split("/")[photo.uri.split("/").length - 1])
    //         const response = await fetch(photo.uri);
    //         const blob = await response.blob();
    //         ref.put(blob).then(snapshot => {
    //             snapshot.ref.getDownloadURL().then(downloadURL => {
    //                 let url = downloadURL
    //                 const message = {
    //                     uid,
    //                     sendAt: Date.now(),
    //                     content,
    //                     attachment: [url],
    //                 }
    //                 db.collection('chat').doc(chatId).update({
    //                     messages: db.FieldValue.arrayUnion(message)
    //                 })
    //             })
            
    //         })

    //     } else {
    //         const message = {
    //             uid,
    //             sendAt: Date.now(),
    //             content
    //         }
    //         db.collection('chat').doc(chatId).update({
    //             messages: db.FieldValue.arrayUnion(message)
    //         })
    //     }

    // }

    const sendMessageHandler = (msg) => {
        console.log(msg)
        setNewMsg('')
    }

    // const getChatPartner = () => {
    //     const db = firebase.firestore; 

    //     db.collection("profile").where("uid", "==", chatPartner.uid)
    //     .get()
    //     .then(function(querySnapshot) {
    //         querySnapshot.forEach(async function(doc) {
    //             setChatPartner(doc.data()) 
    //             doc.ref.collection("story").get().then((querySnapshot) => {
    //                 setStories(querySnapshot.docs.data()) 
    //                 /*querySnapshot.forEach(async function(doc) {
    //                     setStories(oldArray => [...oldArray, doc.data()]);
    //                 })*/
    //               });
    //         });
    //     })
    //     .catch(function(error) {
    //         alert("Error getting documents: ", error);
    //     });
    // }


    return (
        <View style={styles.container}>
            <ChatHeader user={user} goBack={()=>{props.navigation.navigate('Inbox')}}/>
            <View style={styles.chatLayout}>
                <ScrollView>
                    <Text>This is the chat screen</Text>
                    <Text>{chatId}</Text>
                </ScrollView>
            </View>
            <View style={styles.sendContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <TextInput placeholder='Write a message' onChangeText={(text)=>setNewMsg(text)} value={newMsg}/>
                    </View>
                    <TouchableOpacity style={styles.camera}>
                        <Ionicons name='ios-camera' size={25} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.send} onPress={()=>sendMessageHandler(newMsg)}>
                    <Ionicons name='ios-send' size={30} color='white'/>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    sendContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },
    inputContainer:{
        borderWidth: 1, 
        borderColor: 'rgba(0,0,0,0.4)',
        width: SCREEN_WITDH*0.8,
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
        marginTop: 80,
        // height: SCREEN_HEIGHT*0.73
    }
})

export default ChatScreen;