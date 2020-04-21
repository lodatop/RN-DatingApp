import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

const InboxScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(()=>{
        if(profile.uid) {
            getMatches()
            getChats()
        }
    }, [])

    useEffect(()=> {
        if(profile.uid) {
            getMatches()
            getChats()
        }
        console.log(matches)
    }, [profile])

    useEffect(()=> {
        setProfile(profileContext.profile)
    }, [profileContext])

    const getMatches = () => {

        setMatches([]);
        
        let uid = profile.uid;
        const db = firebase.firestore;
        if(profile.matches){
            const query = db.collection('profile').where('uid', 'in', profile.matches);

            query.get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(async function(doc) {
                    let user = doc.data()
                    setMatches(oldArray => [...oldArray, user]);
                    
                });
            })
            .catch(function(error) {
                alert("Error getting documents: ", error);
            });
        }

    }

    const getChats = () => {
        
        let uid = profile.uid;
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

    const accessChat = (userId) => {
        console.log(userId)
        let chat = chatList.find(chat => chat.participants.includes(userId) )
        console.log(chat)
        //chat.ref es el id con el q se va a redireccionar
        //hacer la navegacion con el chatId como parametro "chat/:id"
    }

    const renderChats = () => {
        return matches.map((user, i) => {
            return (
            <View>
                <Text> {user.name} </Text>
                <TouchableOpacity 
                        style={styles.choosePhotoButton} 
                        onPress={()=>accessChat(user.uid)}>
                        <Text style={styles.choosePhotoText}>Chat</Text>
                </TouchableOpacity>
            </View>
            ) 
        })
    }

    return (
        <View style={styles.container}>
            {renderChats()}
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