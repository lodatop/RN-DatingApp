import React, {useState, useEffect} from 'react';
import { View, Modal, Text, Image, ScrollView, TouchableWithoutFeedback, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window')

export const MatchModal = (props) => {

    const { visible = false, onClose = ()=>{} } = props

    return (
        <Modal
            visible={visible}
            transparent={true}
            style={styles.container}
            >
            <View style={{...styles.content}}>
                
                <View
                style={{...styles.textContainter}}>
                    <Text style={{...styles.text, color: Colors.acceptColor}}>YOU HAVE A MATCH, CHECK INBOX FOR MORE INFO!</Text>
                    <View style={{width: '100%', backgroundColor: Colors.cancelColor, height: 2, marginVertical: 10}}></View>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{...styles.text, color: Colors.cancelColor}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )


}

const styles = StyleSheet.create({
    text: {textAlign: 'center', fontWeight: 'bold', fontSize: 15, lineHeight: 20},
    textContainter: {
        width: width*0.9, 
        minHeight: 105, 
        backgroundColor: '#ffe6fa', 
        justifyContent: 'center',
        borderRadius: 10,
        padding: 20,
        borderColor: Colors.headerColor,
        borderWidth: 1
    },
    container: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }


})