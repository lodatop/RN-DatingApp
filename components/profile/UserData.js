import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';

import { Ionicons } from '@expo/vector-icons'

const UserData = props => {

    const { name, age, photo } = props;

    return (
            <View style={styles.infoContainer}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.changePhoto}>
                        <Ionicons name='ios-add' size={30}/>
                    </TouchableOpacity>
                    <View style={styles.profileImg}>
                        {
                            (photo)? 
                                <Image
                                    style={styles.image}
                                    resizeMode='cover'
                                    source={{uri: photo}}/>
                                :<Image
                                    style={styles.image}
                                    resizeMode='contain'
                                    source={require('../../assets/default-user.png')}/>      
                        }         
                    </View>
                </View>
                <View style={styles.userData}>
                    {(name && age) ? 
                        <Text style={styles.text} numberOfLines={1}>{name.split(' ')[0]}, {age}.</Text> 
                        : <Text style={styles.text}>No info</Text>}
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    image:{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    text: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    profileImg: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 100
    },
    imageContainer: {
        zIndex: 100,
        width: '85%',
        height: '85%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userData:{
        width: '100%'
    },
    infoContainer:{
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').width * 0.6,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf:'center',
        padding: 10,
    },
    changePhoto: {
        position: 'absolute',
        zIndex: 150,
        width: 30,
        height: 30,
        borderRadius: 15,
        bottom: 15,
        right: 15,
        borderWidth: 1,
        borderColor: '#96878d',
        backgroundColor: '#ded3d7',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default UserData;