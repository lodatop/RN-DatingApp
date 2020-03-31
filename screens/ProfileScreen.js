import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';

import { MaterialIcons, AntDesign } from '@expo/vector-icons'

import UserData from '../components/profile/UserData'

const ProfileScreen = props => {
    return (
        <View style={styles.container}>
            <View style={styles.userDataContainer}>
                <UserData />
            </View>
            <View style={styles.biography}>
                <Text>Aqui va la biografia</Text>
            </View>
            <View style={styles.userOptionsContainer}>
            <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, ...{width: 65, height: 65, backgroundColor: '#ff96c0'}}} 
                        activeOpacity={0.7}>
                            <MaterialIcons name="edit" size={40} />
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Edit your profile</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, backgroundColor: '#ff66a3'}} 
                        activeOpacity={0.7}>
                            <MaterialIcons name="add-a-photo" size={40} />
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Add a photo</Text>
                </View>
                <View style={styles.userOptions}>
                    <TouchableOpacity 
                        style={{...styles.iconContainer, ...{width: 65, height: 65, backgroundColor: 'red'}}} 
                        activeOpacity={0.7}>
                            <AntDesign name="logout" size={40} color='white' />
                    </TouchableOpacity>
                    <Text style={styles.userOptionText}>Logout</Text>
                </View>
            </View>
            {/* <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="settings" size={40} />
                <Text style={styles.userOptionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="add-a-photo" size={40} />
                <Text style={styles.userOptionText}>Add photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={40} />
                <Text style={styles.userOptionText}>Edit your profile</Text>
            </TouchableOpacity> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    userDataContainer:{
        
    },
    userOptions: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '50%'
    },
    userOptionText: {
        fontSize: 15,
        textAlign: 'center'
    },
    userOptionsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    biography: {
        height: '40%'
    },
    iconContainer: {
        width: 80,
        height: 80,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    }
})
export default ProfileScreen;