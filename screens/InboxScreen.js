import React, {useState, useEffect, useContext, useReducer} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';

import { KoroProgress } from 'rn-koro-lib'

import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

import UserChat from '../components/UserChat'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
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

    const stories = [
        { userId: '1234', images: [profile.photos[0]] }, { userId: '1234', images: [profile.photos[0]] },
        { userId: '1234', images: [profile.photos[0]] }, { userId: '1234', images: [profile.photos[0]] },
        { userId: '1234', images: [profile.photos[0]] }, { userId: '1234', images: [profile.photos[0]] },
        { userId: '1234', images: [profile.photos[0]] }, { userId: '1234', images: [profile.photos[0]] }
    ]

    useEffect(()=>{
        if(profile.uid) {
            setLoading(true)
            getChats()
        }
    }, [])

    useEffect(()=> {
        if(profile.uid) {
            getMatches()
            getChats()
        }
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
                    setLoading(false)
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

    const accessChat = (user) => {
        // console.log(userId)
        let chat = chatList.find(chat => chat.participants.includes(user.uid) )
        // console.log(chat.ref)
        props.navigation.navigate('Chat', {ref: chat.ref, user: user})
        //chat.ref es el id con el q se va a redireccionar
        //hacer la navegacion con el chatId como parametro "chat/:id"
    }

    const renderChats = () => {
        return matches.map((user, i) => {
            return <UserChat key={user.uid} user={user} onPress={()=>accessChat(user)}/>
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.stories}>
                <TouchableOpacity style={styles.addStory}>
                    <Ionicons name='md-add' size={50} color='#ffcffb'/>
                </TouchableOpacity>
                <Stories stories={stories} />
            </View>
            <ScrollView>
                {renderChats()}
            </ScrollView>
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
    }
    
})

export default InboxScreen;