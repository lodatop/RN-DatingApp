import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Vibration, StyleSheet, Image, Dimensions, Animated, PanResponder, PushNotificationIOS, TouchableNativeFeedbackComponent, TouchableOpacity } from 'react-native';

import {KoroProgress} from 'rn-koro-lib'

import  { FirebaseContext } from '../context/Firebase';
import { ProfileContext } from '../context/ProfileContext/ProfileContext'
import { Ionicons } from '@expo/vector-icons';
import { ProfileModal } from './ProfileModal';
import { MatchModal } from './MatchModal'
import { Wrapper } from '../hoc/Wrapper';
import Colors from '../constants/Colors'

import { Notifications } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const ProfileCard = props => {

    const { profiles = [], doneFetchin = false, onLike, onDislike } = props


    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false)

    const position = new Animated.ValueXY();

    //This is the logic for the card to rotate ad=nd translate
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
                onLike(currentIndex)
                Animated.timing(position, {
                    toValue: { x: SCREEN_WIDTH+100, y: gestureState.dy},
                    duration: 500
                }).start(()=>{
                    setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                        position.setValue({x: 0, y: 0})
                    }
                })
            } else if(gestureState.dx < -120){
                onDislike(currentIndex)
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
        onLike(currentIndex)
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
        onDislike(currentIndex)
        Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH-100, y: 8},
            duration: 500
        }).start(()=>{
            setCurrentIndex(currentIndex=> currentIndex + 1), ()=>{
                position.setValue({x: 0, y: 0})
            }
        })
    }

    //This function render all users being looked for by the actual user that havent being swiped yet
    const renderUsers = () => {
            return profiles.map((user, i) => {
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
    
    //Here is managed the order of the cards and the current card being shown
    return (
        <View style={styles.container}>
                {renderUsers()}
                {currentIndex < profiles.length ?
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
                        <ProfileModal visible={modalVisible} onClose={()=>setModalVisible(false)} profile={profiles[currentIndex]}/>
                    </Wrapper>
                    : <Text>No more profiles available yet</Text>
                }
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    swipeButtonsContainer: {
        position: 'absolute', 
        bottom: 0, 
        width: SCREEN_WIDTH*0.9, 
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        height: '18%'
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
        height: '80%',
        borderRadius: 15,
        overflow: 'hidden',
        position: 'absolute',
        backgroundColor: 'lightgrey',
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

export default ProfileCard;