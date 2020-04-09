import React, {useState, useEffect} from 'react';
import { View, Modal, Text, Image, ScrollView, TouchableWithoutFeedback, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window')

export const ProfileModal = (props) => {

    const { profile, visible = false, onClose } = props
    const [currentIndex, setCurrentIndex] = useState(0)
    useEffect(()=>{
        setCurrentIndex(last => 0)
    }, [profile])
    console.log(profile.photos.length)
    let topPart = (
        profile.photos ? profile.photos.lenght > 0 ? 
        profile.photos.map(photo => {
            return (<View style={{
                        width: profile.photos ? `${100/profile.photos.length}%`: '100%', 
                        height: 5, 
                        paddingHorizontal: 5
                        }}>
                        <View style={{backgroundColor: 'white', flex: 1}}></View>
                    </View>
                )
            }
        ) : (<View style={{
                width: profile.photos ? `${100/profile.photos.lenght}%`: '100%', 
                height: 5, 
                paddingHorizontal: 5
                }}>
                <View style={{backgroundColor: 'white', flex: 1}}></View>
            </View>) : null
    )
    return (
        <Modal 
            visible={visible}
            style={styles.modal}
            onRequestClose={onClose}
        >
            {/* <ScrollView
                style={styles.scrollView}
            > */}
                {/*Here the image has to be a carrusel, it will come in profile.photos array*/}
                <View style={{width: width, height: height*0.6, 
                    overflow: 'hidden', zIndex: 90,
                    flexDirection: 'row'}}>
                    <Image
                        style={{...styles.image, width: width, height: height*0.6}}
                        source={profile.photos ? {uri: profile.photos[0]}: require('../assets/default-user.png')}
                        />
                    <TouchableOpacity style={{...styles.changePhotoContainer, left: 0}}>
                        <View style={{...styles.changePhoto}}>
                            <Text>left</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.changePhotoContainer, right: 0}}>
                        <View style={{...styles.changePhoto}}>
                            <Text>right</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{...styles.photoRollIndicator, flexDirection: 'row'}}>
                        <View style={{
                            width: `${100/profile.photos.length}%`,
                            height: 5, 
                            paddingHorizontal: 5,
                            }}>
                            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}></View>
                        </View>
                        <View style={{
                            width: 50, 
                            height: 5, 
                            paddingHorizontal: 5,
                            }}>
                            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}></View>
                        </View>
                    </View>
                </View>




                <Text style={{fontSize: 50}}>{profile.name}, {profile.age}</Text>
                <Text style={styles.label}>Gender: 
                    <Text style={styles.text}> {profile.gender}</Text>
                </Text>
                <Text style={styles.label}>Lookinig for: 
                    {profile.lookingFor ? 
                        <Text style={styles.text}> {profile.lookingFor.join(', ')}</Text>
                    : <Text style={styles.text}>No info provided</Text> }
                </Text>
                <Text style={styles.label}>About Me: 
                    {profile.aboutMe ? 
                        <Text style={styles.text}> {profile.aboutMe}</Text>
                    : <Text style={styles.text}>No info provided</Text>}
                </Text>
                <Text style={styles.label}>Profession:
                    {profile.profession ?
                        <Text style={styles.text}> {profile.profession}</Text>
                    : <Text style={styles.text}>No info provided</Text>}
                </Text>
                <Text style={styles.label}>Height:
                    {profile.height ?
                        <Text style={styles.text}> {profile.height}m</Text>
                    : <Text style={styles.text}>No info provided</Text>}
                </Text>
                <View style={{height: 300, width: width}}></View>
            {/* </ScrollView> */}
            <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
            >
                <Ionicons name='md-close' size={30} color='white'/>
            </TouchableOpacity>
        </Modal>
    )


}

const styles = StyleSheet.create({
    modal: {
        width: width,
        height: height
    },
    scrollView: {
        flex: 1,
        flexWrap: 'wrap'
    },
    closeButton:{
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.headerColor,
        zIndex: 200
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: 3,
        fontSize: 17
    },
    text: {
        fontWeight: '100'
    },
    changePhotoContainer: {
        width: '50%', height: '95%',
        zIndex: 100,
        position: 'absolute',
        top: '5%',
        padding: 30
    },
    changePhoto: {
        flex: 1,
        justifyContent: 'center'
    },
    photoRollIndicator:{
        position: 'absolute',
        top: 0,
        width: width,
        height: '5%',
        backgroundColor: 'green',
        justifyContent: 'center',
        paddingHorizontal: 10

    },
    image: {
        position: 'absolute'
    }
})