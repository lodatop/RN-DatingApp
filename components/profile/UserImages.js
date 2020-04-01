import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';

import { Ionicons } from '@expo/vector-icons'

const UserImages = props => {
    return (
            <View style={styles.container}>
                <View style={styles.image}><Text>User images</Text></View>
                <View style={styles.image}><Text>User images</Text></View>
                <View style={styles.image}><Text>User images</Text></View>
                <View style={styles.image}><Text>User images</Text></View>
                <View style={styles.image}><Text>User images</Text></View>
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row'
    },
    image: {
        width: 120,
        height:120,
        margin:5,
        backgroundColor: 'blue',
    }
})
export default UserImages;