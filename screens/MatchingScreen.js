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
                if (user.geolocation){
                    if(user.uid != profile.uid){
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
                    }
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
                    participants: [profile.uid, profileId],
                    messages: []
                }
                db.collection('chat').add(chat).then(ref => {
                    if(expoToken && expoToken !== '') sendPushNotification(expoToken, profile.name)
                        showModal(name)
                })
                addMatch(profileId)
               
            }
        }
    }

    const addMatch = (profileId) => {

        const db = firebase.firestore; 

        db.collection("profile").where("uid", "in", [profileId, profile.uid])
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                let uid = (doc.data().uid == profile.uid)? profileId : profile.uid;
                let matches = (doc.data().matches)? doc.data().matches : [];
                matches.push(uid)
                let toUpdate = {
                    matches: matches
                }
                doc.ref.update(toUpdate);
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });
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
    
    console.log(datingProfiles)
    
    //se calcula la distancia en Kilometros entre el usuario logeado y el usuario que se desee
    const distance = (lat1, lon1, lat2, lon2, unit) => {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            let radlat1 = Math.PI * lat1/180;
            let radlat2 = Math.PI * lat2/180;
            let theta = lon1-lon2;
            let radtheta = Math.PI * theta/180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            return dist;
        }
    }

    //se ordenan del mas cercano al mas lejano
    const sortProfiles = (arr) => {
        if(profile.geolocation){
            
            let aux = [...arr]
            let n = arr.length
            for (let i = 0; i < n ; i++) {
                let distA = distance(profile.geolocation.latitude, profile.geolocation.longitude, arr[i].geolocation.latitude, arr[i].geolocation.longitude, 'K')
                for (let j = i+1; j < n ; j++){
                    let distB = distance(profile.geolocation.latitude, profile.geolocation.longitude, arr[j].geolocation.latitude, arr[j].geolocation.longitude, 'K')
                    if(distB < distA){
                        let temp = aux[i]
                        aux[i] = aux[j]
                        aux[j] = temp                      
                    }
                }
            }
            return aux
            } else {
                return []
            }
    }
    
    //Here is managed the order of the cards and the current card being shown
    return (
        <View style={styles.container}>
            {profile ?
                (<ProfileCard myProfile={profile} profiles={sortProfiles(datingProfiles)} onLike={(index)=>likeProfile(index)} onDislike={(index)=>dislikeProfile(index)}/>)
                : null }
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