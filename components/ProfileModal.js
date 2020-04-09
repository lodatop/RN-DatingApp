import React, {useState, useEffect} from 'react';
import { View, Modal, Text, Image, ScrollView, TouchableWithoutFeedback, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window')

export const ProfileModal = (props) => {

    const { profile, visible = false, onClose } = props
    
    return (
        <Modal 
            visible={visible}
            style={styles.modal}
            onRequestClose={onClose}
        >
            <ScrollView
                style={styles.scrollView}
            >
                {/*Here the image has to be a carrusel, it will come in profile.photos array*/}
                <Image
                    style={{width: width, height: height*0.6}}
                    source={profile.photos ? {uri: profile.photos[0]}: require('../assets/default-user.png')}/>
                <Text>Here goes the profile data</Text>
                <Text>Name, age</Text>
                <Text>About me, profession</Text>
                <View style={{height: 300, width: width}}></View>
            </ScrollView>
            <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
            >
                <Ionicons name='md-close' size={30} color='white'/>
            </TouchableOpacity>
        </Modal>
    )


}

const styles = StyleSheet.create({
    modal: {
        width: width,
        height: height
    },
    scrollView: {
        flex: 1
    },
    closeButton:{
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.headerColor
    }
})