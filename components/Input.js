//This is a customized Input

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Animated } from 'react-native';

const Input = (props) => {

    const { onChange, label = '', value = '', isHidden = false, type = 'default', style = {}, editable = true } = props;
    const top = new Animated.Value(20);
    const fontSize = new Animated.Value(20);
        
    const handleChange = (text) => {
        onChange(text)
    }

    const focus = () => {
            Animated.timing(top, {
                toValue: 5,
                duration: 220
              }).start();
              Animated.timing(fontSize, {
                toValue: 12,
                duration: 220
              }).start();
    }

    const blur = () => {
        if (value == '') {
            Animated.timing(top, {
                toValue: 20,
                duration: 220
            }).start();
            Animated.timing(fontSize, {
                toValue: 20,
                duration: 220
            }).start();
        }
    }

    value != '' ? (top.setValue(5)) : null
    value != '' ? (fontSize.setValue(12)) : null

    const labelStyle = {
      position: 'absolute',
      left: 10,
      color: '#b5b5b5'
    };

    return(
        <View>
            <Animated.Text style={{...labelStyle, top: top, fontSize: fontSize, zIndex: 100}}>{label}</Animated.Text>
            <TextInput
                editable={editable}
                onFocus={focus}
                onBlur={blur}
                secureTextEntry={isHidden}
                keyboardType={type}
                onChangeText={handleChange}
                style={{...styles.textInput, ...style }}
                value={value}
            />
        </View>
    )
    
}

const styles = StyleSheet.create({
    textInput: {
        height: 60,
        borderBottomWidth: 3,
        margin: 5,
        paddingLeft: 10,
        zIndex: 90
    }
});

export {Input}