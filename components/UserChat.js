import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';

const UserChat = props => {

    const { user, onPress } = props

    return (
        <View style={styles.matches}>
            <TouchableOpacity 
                    style={styles.chat} 
                    onPress={onPress}
                    >

                    <View style={{width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                        {user.photos?
                            <Image
                                style={{width: '80%', height: '80%', borderRadius: 80}}
                                resizeMode='cover'
                                source={{uri: user.photos[0]}}/>
                         
                            :<Image
                                style={{width: '80%', height: '80%', borderRadius: 80}}
                                resizeMode='contain'
                                source={require('../assets/default-user.png')}/>
                        }
                        </View>
                <Text>{user.name}</Text>
                        
            </TouchableOpacity>
        </View>
    ) 
}


const styles = StyleSheet.create({
    matches: {
        width: '95%',
        height: 80,
        flexDirection: 'row',
        marginVertical: 5,
        alignSelf: 'center'
    }, 
    chat: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#ffdef4',
        flexDirection: 'row',
        borderRadius: 5
    },
    profileImg: {
        height: 80,
        width: 80
    },
    image: {
        width: 80,
        height: 80
    }
})
export default UserChat;