import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const MatchingScreen = props => {
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