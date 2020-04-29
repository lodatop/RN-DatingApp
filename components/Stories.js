import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const SCREEN_WIDTH = Dimensions.get('window').width

const Stories = props => {

    const { stories } = props
    const [actualStory, setActualStory] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    
    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                {stories.map((story, i) => {
                    return (
                        <TouchableOpacity key={i} style={styles.stories}>
                            {
                                <Image
                                style={styles.image}
                                resizeMode='contain'
                                source={{uri: story.images[0]}}/>      
                            }
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            <Modal 
                visible={modalOpen} transparent={true}
                onRequestClose={()=>{setModalOpen(false)}}
                >
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '80%', height: '80%'}}>
                        <Image
                                    style={styles.image}
                                    resizeMode='contain'
                                    source={require('../assets/default-user.png')}/>
                    </View>
                    <TouchableOpacity 
                        style={{position: 'absolute', top: 0, right: 20}} 
                        onPress={()=>{setModalOpen(false)}} 
                        >
                        <Ionicons name='ios-close' size={70} color='white'/>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    stories: {
        height: 60,
        width: 60,
        alignItems: 'center',
        borderRadius: 50,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderColor: '#ff0fa3',
        borderWidth: 2,
        elevation: 10
    },
    image:{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 20
    }
})

export default Stories;