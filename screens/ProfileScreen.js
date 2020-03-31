import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons'

import UserData from '../components/profile/UserData'

const ProfileScreen = props => {
    return (
        <View style={styles.container}>
            <View style={styles.userDataContainer}>
                <UserData />
            </View>
            <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="settings" size={40} />
                <Text style={styles.userOptionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="add-a-photo" size={40} />
                <Text style={styles.userOptionText}>Add photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userOptions} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={40} />
                <Text style={styles.userOptionText}>Edit information</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    userDataContainer:{
        marginBottom: 0
    },
    userOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9eb8ff',
        elevation: 10,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginVertical: 10
    },
    userOptionText: {
        fontSize: 20,
        marginLeft: 30
    }
})
export default ProfileScreen;