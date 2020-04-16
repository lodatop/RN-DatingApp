import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Vibration, StyleSheet, Image, Dimensions, Animated, PanResponder, PushNotificationIOS, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';

import {KoroProgress} from 'rn-koro-lib'

import  { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext'
import { Ionicons } from '@expo/vector-icons';
import { ProfileModal } from '../components/ProfileModal';
import { MatchModal } from '../components/MatchModal'
import { Wrapper } from '../hoc/Wrapper';
import Colors from '../constants/Colors'

import { Notifications } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const MatchingScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [datingProfiles, setDatingProfiles] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false)
    const [doneFetchin, setDoneFetchin] = useState(false)
    const [thereIsMatch, setThereIsMatch] = useState(false)
    const [notification, setNotification] = useState({})
    const [matchedName, setMatchedName] = useState('')

    const position = new Animated.ValueXY();

    useEffect(()=>{
        setCurrentIndex(0)
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
            db.collection('profile').where('gender', 'in', profile.lookingFor)
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

    const likeProfile = () => {

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
            //aqui haces pa q se pase al otro perfil
            });
        }).catch(function(error) {
            console.log(error)
            alert("Error getting documents: ", error);
        }); 

    }

    const dislikeProfile = () => {

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
            //aqui haces pa q se pase al otro perfil
            });
        }).catch(function(error) {
            alert("Error getting documents: ", error);
        }); 

    }

    const rotate = position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        outputRange:['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    })

    const rotateAndTranslate = {
        transform: [{
            rotate: rotate
        },
        ...position.getTranslateTransform()
        ]
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState)=> {
            position.setValue({x: gestureState.dx, y: gestureState.dy});
        },
        onPanResponderRelease: (e, gestureState) => {
            if(gestureState.dx > 120){
                likeProfile()
                Animated.timing(position, {
                    toValue: { x: SCREEN_WIDTH+100, y: gestureState.dy},
                    duration: 500
                }).start(()=>{
                    setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                        position.setValue({x: 0, y: 0})
                    }
                })
            } else if(gestureState.dx < -120){
                dislikeProfile()
                Animated.timing(position, {
                    toValue: { x: -SCREEN_WIDTH-100, y: gestureState.dy},
                    duration: 500
                }).start(()=>{
                    setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                        position.setValue({x: 0, y: 0})
                    }
                })
            } else {
                Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }
        }
    });

    const likeOpacity = position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        outputRange:[0, 0, 1],
        extrapolate: 'clamp'
    })

    const dislikeOpacity = position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        outputRange:[1, 0, 0],
        extrapolate: 'clamp'
    })

    const nexCardOpacity = position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        outputRange:[1, 0, 1],
        extrapolate: 'clamp'
    })

    const nexCardScale = position.x.interpolate({
        inputRange:[-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        outputRange:[1, 0.8, 1],
        extrapolate: 'clamp'
    })

    const swipeRigth = () => {
        likeProfile()
        Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH+100, y: 8},
            duration: 500
        }).start(()=>{
            setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                position.setValue({x: 0, y: 0})
            }
        })
    }

    const swipeLeft = () => {
        dislikeProfile()
        Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH-100, y: 8},
            duration: 500
        }).start(()=>{
            setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                position.setValue({x: 0, y: 0})
            }
        })
    }


    const renderUsers = () => {
        if(doneFetchin){
            return datingProfiles.map((user, i) => {
                if (i < currentIndex) {
                    return null
                }
                else if (i == currentIndex) {
                    return (
                        <Animated.View
                        key={user.uid}
                        {...panResponder.panHandlers}
                        style={{
                            ...rotateAndTranslate,
                            ...styles.cardStyle
                        }}>
                            <Animated.View 
                                style={{ opacity: likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                                <Text style={{ ...styles.label, borderColor: 'green', color: 'green' }}>
                                    LIKE
                                </Text>
                            </Animated.View>
                            <Animated.View 
                                style={{ opacity: dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                                <Text style={{ ...styles.label, borderColor: 'red', color: 'red' }}>
                                    NOPE
                                </Text>
                            </Animated.View>

                            <Image 
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: null
                                }}
                                resizeMode='cover'
                                source={user.photos ? {uri: user.photos[0]}: require('../assets/default-user.png')}/>

                            <View style={styles.profileInfoContainer}>
                                <Text style={styles.profileInfo}>{user.name}, {user.age}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={()=>setModalVisible(true)}
                                style={styles.showMoreContainer}>
                                <View style={styles.showMoreButton}>
                                    <Ionicons name='ios-arrow-down' size={50} color='white'/>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )
                }
                else {
                    return (
                        <Animated.View 
                        // {...panResponder.panHandlers}
                        key={user.uid}
                        style={{
                            opacity: nexCardOpacity,
                            transform: [{scale: nexCardScale}],
                            ...styles.cardStyle
                        }}>

                            <Image 
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: null
                                }}
                                resizeMode='cover'
                                source={user.photos ? {uri: user.photos[0]}: require('../assets/default-user.png')}/>

                            <View style={styles.profileInfoContainer}>
                                <Text style={styles.profileInfo}>{user.name}, {user.age}</Text>
                            </View>

                            
                            <TouchableOpacity
                                onPress={()=>setModalVisible(true)}
                                style={styles.showMoreContainer}>
                                <View style={styles.showMoreButton}>
                                    <Ionicons name='ios-arrow-down' size={50} color='white'/>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )
                }
            }).reverse()
        }
    }
    
    return (
        <View style={styles.container}>
                {renderUsers()}
                {currentIndex < datingProfiles.length ?
                    <Wrapper>
                        <View style={styles.swipeButtonsContainer}>
                            <TouchableOpacity 
                                onPress={swipeLeft}
                                style={{
                                    ...styles.swipeButton, 
                                    backgroundColor: Colors.closeColor
                                }}>
                                <Ionicons name='md-close' size={50} color='white'/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={swipeRigth}
                                style={{
                                    ...styles.swipeButton, 
                                    backgroundColor: Colors.checkColor
                                }}>

                                <Ionicons name='md-checkmark' size={50} color='white'/>
                            </TouchableOpacity>
                        </View>
                        <ProfileModal visible={modalVisible} onClose={()=>setModalVisible(false)} profile={datingProfiles[currentIndex]}/>
                    </Wrapper>
                    : <Text>No more profiles available yet</Text>
                }
                <KoroProgress visible={!doneFetchin} contentStyle={{borderRadius: 10}} color='#ed1f63'/>
                <MatchModal visible={thereIsMatch} name={matchedName} onClose={() => {setThereIsMatch(false)}} />
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20
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