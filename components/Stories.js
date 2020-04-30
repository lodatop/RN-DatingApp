import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

const {width, height} = Dimensions.get('window')

const Stories = props => {

    const { stories } = props
    const [actualStory, setActualStory] = useState(null)
    const [actualIndex, setActualIndex] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [storyLength, setStoryLength] = useState(0)

    const openStoryHandler = (userStory) => {
        console.log(userStory)
        setActualStory(userStory)
        setStoryLength(userStory.images.length)
        setModalOpen(true)
        setActualIndex(0)
    }

    const closeModalHandler = () => {
        setActualStory(null)
        setModalOpen(false)
        setActualIndex(0)
    }

    let topPart = (
        actualStory ? 
        actualStory.images.map((photo, i) => {
            return (<View style={{
                        width: `${100/actualStory.images.length}%`, 
                        height: 5, 
                        paddingHorizontal: 5,
                        alignSelf: 'center',
                        zIndex: 200
                        }}
                        key={actualStory.images[i]}>
                        <View style={{ ...styles.topBar, backgroundColor: i === actualIndex ? 'white': styles.topBar.backgroundColor}}></View>
                    </View>
                )
            }
        ) : (
            <View style={{
                width: '100%', 
                height: 5, 
                paddingHorizontal: 5,
                alignSelf: 'center',
                zIndex: 200
                }}>
                <View style={{backgroundColor: 'white', width: 5}}></View>
            </View>
        )
    )
    
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
                                source={{uri: story.images[story.images.length - 1].url}}/>      
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
                        <View style={{width: '80%', height: '60%'}}>
                            <TouchableOpacity 
                                style={{...styles.changePhotoContainer, left: 0}}
                                disabled={actualIndex === 0 ? true : false}
                                onPress={()=> setActualIndex(prevIndex=> prevIndex - 1)}
                                >
                                <View style={{...styles.changePhoto}}>
                                    <Ionicons 
                                        name='ios-arrow-back' 
                                        size={50} 
                                        color={actualIndex === 0 ? 'grey': 'white'}
                                        />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{...styles.changePhotoContainer, right: 0}}
                                disabled={actualIndex === (actualStory.images.length - 1) ? true : false}
                                onPress={()=> setActualIndex(prevIndex=> prevIndex + 1)}
                                >
                                <View style={{...styles.changePhoto, alignItems: 'flex-end'}}>
                                    <Ionicons 
                                        name='ios-arrow-forward' 
                                        size={50} 
                                        color={actualIndex === (actualStory.images.length - 1) ? 'grey': 'white'}
                                        />
                                </View>
                            </TouchableOpacity>
                            <View style={{...styles.photoRollIndicator, flexDirection: 'row'}}>
                                {topPart}
                            </View>
                            <View style={{position: 'absolute', top: 30, width: '100%', zIndex: 200}}>
                                <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>{actualStory.userName}</Text>
                            </View>
                            <Image
                                        style={{...styles.image, backgroundColor: 'lightgrey'}}
                                        resizeMode='cover'
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
    },
    topBar:{
        backgroundColor: '#919191',
        flex: 1, 
        borderRadius: 2
    },
    changePhotoContainer: {
        width: '50%', height: '95%',
        zIndex: 100,
        position: 'absolute',
        top: '5%',
        padding: 30,
        justifyContent: 'center'
    },
    changePhoto: {
        flex: 1,
        justifyContent: 'center'
    },
    photoRollIndicator:{
        position: 'absolute',
        top: 0,
        // width: width,
        height: '5%',
        justifyContent: 'center',
        paddingHorizontal: 10

    }
})

export default Stories