import React, { useEffect, useState, useContext } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';

//Here are handled the profile photos shown in the carrusel
const UserImages = props => {

    const { images = [] } = props

    return (
            <View style={styles.container}>
                {images ? 
                    images.reverse().map((image, index) => {
                        return (
                            <View key={index} style={styles.image}>
                                <Image
                                    style={{width: '100%', height: '100%'}}
                                    resizeMode='cover'
                                    source={{uri: image}}/> 
                            </View>
                        )
                    })
                    : null
                }
            </View>
        )
}


const styles = StyleSheet.create({
    container: {
        minWidth: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 150,
        height:150,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        marginRight: 10,
        overflow: 'hidden'
    }
})
export default UserImages;