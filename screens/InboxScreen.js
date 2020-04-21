import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';

import { KoroProgress } from 'rn-koro-lib'

import { ProfileContext } from '../context/ProfileContext/ProfileContext';
import  { FirebaseContext } from '../context/Firebase';

import UserChat from '../components/UserChat'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const InboxScreen = props => {

    const profileContext = useContext(ProfileContext);
    
    const [loading, setLoading] = useState(false);
    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [chatList, setChatList] = useState([]);
    const [matches, setMatches] = useState([]);

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

    const accessChat = (userId) => {
        console.log(userId)
        let chat = chatList.find(chat => chat.participants.includes(userId) )
        console.log(chat)
        //chat.ref es el id con el q se va a redireccionar
        //hacer la navegacion con el chatId como parametro "chat/:id"
    }

    const renderChats = () => {
        return matches.map((user, i) => {
            return <UserChat user={user} onPress={()=>console.log(user.name)}/>
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.stories}>
                <Text style={{alignSelf: 'center'}}>Here goes the stories</Text>
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
        justifyContent: 'center',
        marginBottom: 5
    },
    
})

export default InboxScreen;