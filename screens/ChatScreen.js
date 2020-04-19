import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const ChatScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatPartner, setChatPartner] = useState({})
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [photo, setPhoto] = useState(null)

    useEffect(() => {
        const unsubscribe = firebase
          .db.collection('chat').doc(chatId)
          .onSnapshot(snapshot => {
            console.log(snapshot)
            if (snapshot.exists) {
              // we have something
              let participants = snapshot.data().participants;
              (participants[0] == profile.uid)? setChatPartner({...chatPartner, uid: participants[1] }) : setChatPartner({...chatPartner, uid: participants[0] }) ;
              setMessages(snapshot.data().messages)
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

    const sendMessage = (content) => {

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
            db.collection('chat').doc(chatId).update({
                messages: db.FieldValue.arrayUnion(message)
            })
        }

    }


    return (
        <View style={styles.container}>
            <Text>This is the chat screen</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default ChatScreen;