import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

const InboxScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatList, setChatList] = useState([]);

    const getChats = () => {
        
        let uid = profile.uid;
        const db = firebase.firestore;
        const query = db.collection('chat').where('participants', 'array-contains', profile.uid);

        query.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                let chat = doc.data()
                
                setChatList(oldArray => [...oldArray, chat]);
                
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });

    }

    const accessChat = (chatId) => {
        //hacer la navegacion con el chatId como parametro "chat/:id"
    }


    return (
        <View style={styles.container}>
            <Text>This is the inbox screen</Text>
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

export default InboxScreen;