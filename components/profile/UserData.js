import React from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions, Image} from 'react-native';

import { Ionicons } from '@expo/vector-icons'

const UserData = props => {
    return (
            <View style={styles.infoContainer}>
                <View style={styles.profileImg}>
                    <Image
                        style={styles.image}
                        resizeMode='contain'
                        source={require('../../assets/default-user.png')}
                    />              
                </View>
                <View style={styles.userData}>
                    <Text style={styles.text} numberOfLines={1}>Name, age</Text>
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    image:{
        width: '100%',
        height: '100%'
    },
    text: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    profileImg: {
        width: '85%',
        height: '85%',
        overflow: 'hidden',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userData:{
        width: '100%',
        height: '10%'
    },
    infoContainer:{
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').width * 0.6,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf:'center',
        padding: 10,
        marginBottom: 15
    }
})
export default UserData;