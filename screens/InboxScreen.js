import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const InboxScreen = props => {
    return (
        <View style={styles.container}>
            <Text>This is the inbox screen</Text>
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

export default InboxScreen;