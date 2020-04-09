import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Animated, PanResponder, PushNotificationIOS, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';

import  { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext'
import { Ionicons } from '@expo/vector-icons';
import { ProfileModal } from '../components/ProfileModal';
import { Wrapper } from '../hoc/Wrapper';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const Users = [
    { id: "1", uri: require('../assets/1.jpg') },
    { id: "2", uri: require('../assets/2.jpg') },
    { id: "3", uri: require('../assets/3.jpg') },
    { id: "4", uri: require('../assets/4.jpg') },
    { id: "5", uri: require('../assets/5.jpg') },
    { id: "6", uri: require('../assets/1.jpg') },
    { id: "7", uri: require('../assets/2.jpg') },
    { id: "8", uri: require('../assets/3.jpg') },
    { id: "9", uri: require('../assets/4.jpg') },
    { id: "10", uri: require('../assets/5.jpg') },
    { id: "11", uri: require('../assets/1.jpg') },
    { id: "12", uri: require('../assets/2.jpg') },
    { id: "13", uri: require('../assets/3.jpg') },
    { id: "14", uri: require('../assets/4.jpg') },
    { id: "15", uri: require('../assets/5.jpg') },
    { id: "16", uri: require('../assets/1.jpg') },
    { id: "17", uri: require('../assets/2.jpg') },
    { id: "18", uri: require('../assets/3.jpg') },
    { id: "19", uri: require('../assets/4.jpg') },
    { id: "20", uri: require('../assets/5.jpg') },
  ]

const MatchingScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [datingProfiles, setDatingProfiles] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const position = new Animated.ValueXY();
    const [modalVisible, setModalVisible] = useState(false)
    // const [isSwipeable, setIsSwipeable] = useState(true)

    useEffect(()=> {
        if(profile.uid) getProfiles()
    }, [profile])  
    useEffect(()=> {
        setProfile(profileContext.profile)
        console.log(datingProfiles)
    }, [profileContext])    

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
                    if(user.likedBy.contains(uid) && !user.dilikedBy.contains(uid))
                        setDatingProfiles(oldArray => [...oldArray, user]);
                } else {
                    setDatingProfiles(oldArray => [...oldArray, user]);
                }
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });
    }

    const checkMatch = (profileId) => {
        if(profile.likedBy.contains(profileId))
            alert('ITS A MOTHERFUCKING MATCH YOU MOTHERFUCKING BITCH SUCK MY DICK')
    }

    const likeProfile = (profileId) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", profileId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userLikedBy = doc.data().likedBy;
            userLikedBy.push(profileId)
            let toUpdate = {
                likedBy: userLikedBy
            }
            doc.ref.update(toUpdate);
            checkMatch(profileId)
            //aqui haces pa q se pase al otro perfil
            });
        }).catch(function(error) {
            alert("Error getting documents: ", error);
        }); 

    }

    const dislikeProfile = (profileId) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", profileId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userDislikedBy = doc.data().dislikedBy;
            userDislikedBy.push(profileId)
            let toUpdate = {
                dislikedBy: userLikedBy
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
                console.log(gestureState.dy)
                Animated.timing(position, {
                    toValue: { x: SCREEN_WIDTH+100, y: gestureState.dy},
                    duration: 500
                }).start(()=>{
                    console.log('like')
                    setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                        position.setValue({x: 0, y: 0})
                    }
                })
            } else if(gestureState.dx < -120){
                console.log(gestureState.dy)
                Animated.timing(position, {
                    toValue: { x: -SCREEN_WIDTH-100, y: gestureState.dy},
                    duration: 500
                }).start(()=>{
                    console.log('dislike')
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
        console.log('called')
        // setIsSwipeable(false)
        Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH+100, y: 8},
            duration: 500
        }).start(()=>{
            console.log('like')
            console.log('done')
            setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                position.setValue({x: 0, y: 0})
                // setIsSwipeable(true)
            }
        })
    }

    const swipeLeft = () => {
        // setIsSwipeable(false)
        Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH-100, y: 8},
            duration: 500
        }).start(()=>{
            console.log('dislike')
            // setIsSwipeable(true)
            setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                position.setValue({x: 0, y: 0})
            }
        })
    }


    const renderUsers = () => {
        return Users.map((item, i) => {
            if (i < currentIndex) {
                return null
            }
            else if (i == currentIndex) {
                return (
                    <Animated.View
                        key={item.id}
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
                            source={item.uri}/>

                        <View style={styles.profileInfoContainer}>
                            <Text style={styles.profileInfo}>{item.id}</Text>
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
                        key={item.id}
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
                            source={item.uri}/>

                        <View style={styles.profileInfoContainer}>
                            <Text style={styles.profileInfo}>{item.id}</Text>
                        </View>

                        {/* 
                        <TouchableOpacity
                            onPress={()=>setModalVisible(true)}
                            style={styles.showMoreContainer}>
                            <View style={styles.showMoreButton}>
                                <Ionicons name='ios-arrow-down' size={50} color='white'/>
                            </View>
                        </TouchableOpacity> */}
                    </Animated.View>
                )
            }
        }).reverse()
    }
    
    return (
            <View style={styles.container}>
                {renderUsers()}
                {currentIndex < Users.length ?
                    <Wrapper>
                        <View style={styles.swipeButtonsContainer}>
                            <TouchableOpacity 
                                onPress={swipeLeft}
                                // disabled={!isSwipeable}
                                style={{
                                    ...styles.swipeButton, 
                                    backgroundColor: 'red'
                                }}>
                                <Ionicons name='md-close' size={50} color='white'/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={swipeRigth}
                                // disabled={!isSwipeable}
                                style={{
                                    ...styles.swipeButton, 
                                    backgroundColor: 'green'
                                }}>

                                <Ionicons name='md-checkmark' size={50} color='white'/>
                            </TouchableOpacity>
                        </View>
                        <ProfileModal visible={modalVisible} onClose={()=>setModalVisible(false)} profile={Users[currentIndex]}/>
                    </Wrapper>
                    : <Text>No more profiles available yet</Text>
                }
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
        borderColor: 'black',
        borderWidth: 1,
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