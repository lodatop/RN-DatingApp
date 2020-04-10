import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Modal, Dimensions} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const { width, height } = Dimensions.get('window')
const ImagePickerModal = (props) => {

    const { visible = false, onCameraPick = ()=>{}, onRollPick = ()=>{}, onClose = ()=>{}} = props

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true}> 
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity onPress={onCameraPick}>
                        <View style={styles.button}>
                            <View style={styles.icon}>
                                <MaterialIcons name='camera' size={40} color='black'/>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Take a Picture</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRollPick}>
                        <View style={styles.button}>
                            <View style={styles.icon}>
                                <MaterialIcons name='photo-library' size={40} color='black'/>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Select from Camera Roll</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <MaterialIcons name='close' size={30} color='white'/>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    content: {
        height: height*0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebebeb'
    },
    button: {
        width: width*0.9,
        maxWidth: 800,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fa9be1',
        marginVertical: 10,
        padding: 10,
        borderRadius: 10
    },
    icon: {
        paddingHorizontal: 10
    },
    text: {
        fontSize: 20,
        textAlign: 'center'
    },
    textContainer: {
        flex: 1
    },
    closeButton:{
        position: 'absolute',
        top: 25,
        right: 25,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.headerColor,
        zIndex: 200
    }
})

export default ImagePickerModal