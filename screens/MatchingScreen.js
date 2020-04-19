import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Vibration, StyleSheet, Image, Dimensions, Animated, PanResponder, PushNotificationIOS, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';

import {KoroProgress} from 'rn-koro-lib'

import  { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext'
import { MatchModal } from '../components/MatchModal'
import ProfileCard from '../components/ProfileCard';

import { Notifications } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const MatchingScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [datingProfiles, setDatingProfiles] = useState([])
    const [doneFetchin, setDoneFetchin] = useState(false)
    const [thereIsMatch, setThereIsMatch] = useState(false)
    const [notification, setNotification] = useState({})
    const [matchedName, setMatchedName] = useState('')

    const position = new Animated.ValueXY();

    useEffect(()=>{
        setDoneFetchin(false)
        Notifications.addListener(handleNotification);
    }, [])

    useEffect(()=> {
        if(profile.uid) getProfiles()
    }, [profile])

    useEffect(()=> {
        setProfile(profileContext.profile)
    }, [profileContext])

    const handleNotification = (notification) => {
        Vibration.vibrate(1000)
        setNotification(notification)
    }

    //sends notification when users match
    const sendPushNotification = async (expoToken, name) => {
        const message = {
          to: expoToken,
          sound: 'default',
          title: 'NEW MATCH, COME CHECK THIS OUT',
          body: "You've matched with " + name + "!",
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
          body: JSON.stringify(message),
        });
      };

    //the algorithm to get the profiles for the user to match with
    const getProfiles = () => {
        setDatingProfiles([])
        
        let uid = profile.uid;
        const db = firebase.firestore;
        const query =
        (profile.lookingFor)?
            db.collection('profile').where('gender', 'in', profile.lookingFor).where('lookingFor', 'array-contains', profile.gender)
            : db.collection('profile').where('lookingFor', 'array-contains', profile.gender);

        query.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                let user = doc.data()
                
                if(user.likedBy && user.dislikedBy){
                    if(!user.likedBy.includes(uid) && !user.dislikedBy.includes(uid))
                         setDatingProfiles(oldArray => [...oldArray, user]);
                 } else if (user.likedBy) {
                    if(!user.likedBy.includes(uid))
                         setDatingProfiles(oldArray => [...oldArray, user]);
                 } else if (user.dislikedBy) {
                    if(!user.dislikedBy.includes(uid))
                         setDatingProfiles(oldArray => [...oldArray, user]);
                 } else {
                    setDatingProfiles(oldArray => [...oldArray, user]);
                 }
            });
            setDoneFetchin(prev => true)
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });
    }

    //checks if users have matched
    const checkMatch = (profileId, name, expoToken) => {
        if(profile.likedBy){
            if(profile.likedBy.includes(profileId))
            {
                const db = firebase.firestore;   
                const chat = {
                    createdAt: Date.now(),
                    participants: [profile.uid, profileId]
                }
                db.collection('chat').add(chat).then(ref => {
                    if(expoToken && expoToken !== '') sendPushNotification(expoToken, profile.name)
                        showModal(name)
                })
            }
        }
    }

    //shows modal when matched if previous one was closed
    const showModal = (name) => {
        if(thereIsMatch){
            setInterval(()=>{
                showModal(name)
            }, 1000)
        } else {
            setMatchedName(name)
            setThereIsMatch(true)
        }
    }

    const likeProfile = (currentIndex) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", datingProfiles[currentIndex].uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userLikedBy = doc.data().likedBy? doc.data().likedBy : [];
            userLikedBy.push(profile.uid)
            let toUpdate = {
                likedBy: userLikedBy
            }
            doc.ref.update(toUpdate);
            (datingProfiles[currentIndex].expoToken)? checkMatch(datingProfiles[currentIndex].uid, datingProfiles[currentIndex].name, datingProfiles[currentIndex].expoToken) : checkMatch(datingProfiles[currentIndex].uid) ;
            });
        }).catch(function(error) {
            console.log(error)
            alert("Error getting documents: ", error);
        }); 

    }

    const dislikeProfile = (currentIndex) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", datingProfiles[currentIndex].uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userDislikedBy = doc.data().dislikedBy? doc.data().dislikedBy : [];
            userDislikedBy.push(profile.uid)
            let toUpdate = {
                dislikedBy: userDislikedBy
            }
            doc.ref.update(toUpdate);
            });
        }).catch(function(error) {
            alert("Error getting documents: ", error);
        }); 

    }
    
    //Here is managed the order of the cards and the current card being shown
    return (
        <View style={styles.container}>
            <ProfileCard profiles={datingProfiles} onLike={(index)=>likeProfile(index)} onDislike={(index)=>dislikeProfile(index)}/>
            <MatchModal visible={thereIsMatch} name={matchedName} onClose={() => {setThereIsMatch(false)}} />
            <KoroProgress visible={!doneFetchin} contentStyle={{borderRadius: 10}} color='#ed1f63'/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10
    },
    swipeButtonsContainer: {
        position: 'absolute', 
        bottom: 0,
        width: SCREEN_WIDTH*0.9, 
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        height: SCREEN_HEIGHT*0.11
    },
    swipeButton: {
        width: 60, 
        height: 60, 
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
    },
    cardStyle: {
        width: SCREEN_WIDTH*0.9,
        height: SCREEN_HEIGHT*0.7,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'absolute',
        top: 20
    },
    showMoreContainer: {
        width: SCREEN_WIDTH*0.9, 
        height: 70, 
        backgroundColor:'rgba(0,0,0,0.5)', 
        position: 'absolute', 
        bottom: 0
    },
    showMoreButton: {
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    profileInfo: {
        fontSize: 30,
        color: 'white',
        textShadowColor: 'black', 
        textShadowOffset: { width: 0, height: 0 }, 
        textShadowRadius: 1,
    },
    profileInfoContainer: {
        position: 'absolute',
        bottom: 70,
        height: 60,
        width: SCREEN_WIDTH*0.9,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    label: {
        borderWidth: 1,
        fontSize: 32, 
        fontWeight: '800', 
        padding: 10 
    }
})

export default MatchingScreen;