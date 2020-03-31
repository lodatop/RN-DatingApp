import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const ProfileScreen = props => {
    return (
        <View style={styles.container}>
            <Text>This is the profile screen</Text>
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
export default ProfileScreen;