import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';

//Here is handled the rest of the data from the profile

const ProfileData = props => {

    const { profile } = props;

    return (
            <View style={styles.bioContainer}>
                {profile.aboutMe ? (
                    <View>
                        <Text style={styles.label} numberOfLines={2} >About me: 
                            <Text style={styles.text}> {profile.aboutMe}</Text>
                        </Text>
                    </View>
                    ) : null}
                {profile.gender ? (
                    <View>
                        <Text style={styles.label}>Gender:
                            <Text style={styles.text}> {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</Text>
                        </Text>
                    </View>
                    ) : null}
                {profile.height ? (
                    <View>
                        <Text style={styles.label}>Height: 
                            <Text style={styles.text}> {profile.height}m</Text>
                        </Text>
                    </View>
                    ) : null}
                {profile.profession ? (
                    <View>
                        <Text style={styles.label}>Profession: 
                            <Text style={styles.text}> {profile.profession}</Text>
                        </Text>
                    </View>
                    ) : null}
            </View>
    )
}


const styles = StyleSheet.create({
    bioContainer:{
        width: '100%',
        justifyContent: 'space-between',
        alignSelf:'center',
        paddingHorizontal: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        marginVertical: 3
    },
    text: {
        fontWeight: '100'
    }
})
export default ProfileData;