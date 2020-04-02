import React, { useEffect, useState, useContext } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';


const UserImages = props => {

    const { images = [] } = props

    return (
            <View style={styles.container}>
                {images ? 
                    images.map((image, index) => {
                        return (
                            <View key={index} style={styles.image}>
                                <Image
                                    style={styles.image}
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
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 150,
        height:150,
        backgroundColor: 'blue',
        borderRadius: 10,
        marginRight: 10
    }
})
export default UserImages;