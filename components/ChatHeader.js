import React, { useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const SCREEN_WIDTH = Dimensions.get('window').width

const ChatHeader = props => {

    const { user = '', goBack = ()=>{} } = props
    const [viewPhotoVisible, setViewPhotoVisible] = useState(false)
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={goBack}
                >
                <Ionicons name='md-arrow-back' size={25} color='white'/>
            </TouchableOpacity>
            <View style={styles.userName}>
                <Text style={{color: 'white', fontSize: 20}}>{user ? user.name : ''}</Text>
            </View>
            <TouchableOpacity style={styles.profilePicture} onPress={()=>{setViewPhotoVisible(true)}}>
                {
                    (user.photos)? 
                        <Image
                            style={styles.image}
                            resizeMode='cover'
                            source={{uri: user.photos[0]}}/>
                        :<Image
                            style={styles.image}
                            resizeMode='contain'
                            source={require('../assets/default-user.png')}/>      
                }
            </TouchableOpacity>
            <Modal 
                visible={viewPhotoVisible} transparent={true}
                onRequestClose={()=>{setViewPhotoVisible(false)}}
                >
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '80%', height: '80%'}}>
                        {
                            (user.photos)? 
                                <Image
                                    style={styles.image}
                                    resizeMode='cover'
                                    source={{uri: user.photos[0]}}/>
                                :<Image
                                    style={styles.image}
                                    resizeMode='contain'
                                    source={require('../assets/default-user.png')}/>      
                        }
                    </View>
                    <TouchableOpacity 
                        style={{position: 'absolute', top: 0, right: 20}} 
                        onPress={()=>{setViewPhotoVisible(false)}} 
                        >
                        <Ionicons name='ios-close' size={70} color='white'/>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: 80,
        paddingTop: 23,
        backgroundColor: Colors.headerColor, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        marginHorizontal: 20
    },
    userName: {
    },
    profilePicture: {
        width: 45,
        height: 45,
        backgroundColor: 'white',
        marginRight: 20,
        borderRadius: 40,
        overflow: 'hidden'
    },
    image:{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 20
    }
})

export default ChatHeader;