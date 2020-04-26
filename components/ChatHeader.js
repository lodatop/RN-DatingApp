import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const SCREEN_WIDTH = Dimensions.get('window').width

const ChatHeader = props => {

    const { user = '', goBack = ()=>{} } = props
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={goBack}
                >
                <Ionicons name='md-arrow-back' size={25} color='white'/>
            </TouchableOpacity>
            <View style={styles.userName}>
                <Text>{user ? user.name : ''}</Text>
            </View>
            <View style={styles.profilePicture}></View>
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
        paddingTop: 20,
        backgroundColor: Colors.headerColor, 
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        marginHorizontal: 20
    },
    userName: {},
    profilePicture: {}
})

export default ChatHeader;