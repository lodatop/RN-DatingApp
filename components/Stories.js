import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const SCREEN_WIDTH = Dimensions.get('window').width

const Stories = props => {

    const { stories } = props
    const [actualStory, setActualStory] = useState(null)
    const [actualIndex, setActualIndex] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)

    const openStoryHandler = (userStory) => {
        console.log(userStory)
        setActualStory(userStory)
        setModalOpen(true)
        setActualIndex(0)
    }

    const closeModalHandler = () => {
        setActualStory(null)
        setModalOpen(false)
        setActualIndex(0)
    }
    
    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                {stories.map((story, i) => {
                    return (
                        <TouchableOpacity key={i} style={{...styles.stories, backgroundColor: 'lightgrey'}} onPress={()=>openStoryHandler(story)}>
                            {
                                <Image
                                style={styles.image}
                                resizeMode='cover'
                                source={{uri: story.images[0].url}}/>      
                            }
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            <Modal 
                visible={modalOpen} transparent={true}
                onRequestClose={()=>{closeModalHandler()}}
                >
                {actualStory ? (
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: '80%', height: '80%'}}>
                            <Text>{actualStory.userName}</Text>
                            <Image
                                        style={styles.image}
                                        resizeMode='contain'
                                        source={{uri: actualStory.images[actualIndex].url}}/>
                        </View>
                        <TouchableOpacity 
                            style={{position: 'absolute', top: 0, right: 20}} 
                            onPress={()=>{closeModalHandler()}} 
                            >
                            <Ionicons name='ios-close' size={70} color='white'/>
                        </TouchableOpacity>
                    </View>
                    )
                : null}
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

export default Stories