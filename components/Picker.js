import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Modal, TouchableOpacity, SectionList } from 'react-native';
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'

const Picker = (props) => {

    const { placeholder = 'Select...', options = null, onValueChange } = props

    const [selectedValue, setSelectedValue] = useState('')
    const [visible, setVisible] = useState(false)

    const handleChange = (newValue) => {
        setVisible(false),
        onValueChange(newValue)
        setSelectedValue(newValue)
    }

    return(
        // <View><Text>Im the picker</Text></View>
        <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.container}
            onPress={()=>setVisible(true)}
        >
            <View style={{width: '90%'}}>
                <Text placeholder={placeholder} style={styles.pickerValue}>{selectedValue ? selectedValue : placeholder}</Text>
            </View>
            <View style={{width: '10%', alignItems: 'flex-end'}}>
                <AntDesign name={!visible ? 'caretleft' : 'caretdown'} size={20} />
            </View>
            <Modal visible={visible} transparent={true} style={{flex: 1}} onRequestClose={()=>setVisible(false)}>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '90%', minHeight: 30, backgroundColor: 'white', paddingHorizontal: 10, borderRadius: 5}}>
                        { options ? (
                            options.map((option, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={()=>handleChange(option.value)}
                                        activeOpacity={0.7}
                                        style={{...styles.item, borderBottomWidth: index + 1 < options.length ? 1 : 0}}
                                    >
                                        <Text style={{textTransform: 'capitalize', fontSize: 20}}>{option.label}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            ) : null
                        }
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    )
    
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20,
    },
    item: {
        paddingHorizontal: 20, 
        paddingVertical: 10,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    pickerValue: {
        fontSize: 16,
        textTransform: 'capitalize'
    }
});

export {Picker}