import React, { useState, useContext, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

import  { FirebaseContext } from '../components/Firebase';
import { ProfileContext } from '../components/ProfileContext/ProfileContext'

const MatchingScreen = props => {

    const profileContext = useContext(ProfileContext);

    const [firebase, setFirebase] = useState(useContext(FirebaseContext))
    const [profile, setProfile] = useState(profileContext.profile)
    const [datingProfiles, setDatingProfiles] = useState([])

    useEffect(()=> {
        getProfiles()
        console.log(datingProfiles)
    }, [])

    useEffect(()=> {
        setProfile(profileContext.profile)
    }, [profileContext])    

    const getProfiles = () => {

        let uid = profile.uid;

        const db = firebase.firestore;

        const query
        (profile.lookingFor)?
            query = db.collection('profile').where('gender', 'array-contains-any', profile.lookingFor).where('lookingFor', 'array-contains', profile.gender)
            : query = db.collection('profile').where('lookingFor', 'array-contains', profile.gender) ;
        
        query.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                let user = doc.data()
                if(user.likedBy.contains(uid) && !user.dilikedBy.contains(uid))
                    setDatingProfiles([...datingProfiles, user]);
            });
        })
        .catch(function(error) {
            alert("Error getting documents: ", error);
        });   
    }

    const checkMatch = (profileId) => {
        if(profile.likedBy.contains(profileId))
            alert('ITS A MOTHERFUCKING MATCH YOU MOTHERFUCKING BITCH SUCK MY DICK')
    }

    const likeProfile = (profileId) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", profileId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userLikedBy = doc.data().likedBy;
            userLikedBy.push(profileId)
            let toUpdate = {
                likedBy: userLikedBy
            }
            doc.ref.update(toUpdate);
            checkMatch(profileId)
            //aqui haces pa q se pase al otro perfil
            });
        }).catch(function(error) {
            alert("Error getting documents: ", error);
        }); 

    }

    const dislikeProfile = (profileId) => {

        var db = firebase.firestore;
        
        db.collection("profile").where("uid", "==", profileId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
            let userDislikedBy = doc.data().dislikedBy;
            userDislikedBy.push(profileId)
            let toUpdate = {
                dislikedBy: userLikedBy
            }
            doc.ref.update(toUpdate);
            //aqui haces pa q se pase al otro perfil
            });
        }).catch(function(error) {
            alert("Error getting documents: ", error);
        }); 

    }

    return (
        <View style={styles.container}>
            <Text>This is the matching screen</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default MatchingScreen;