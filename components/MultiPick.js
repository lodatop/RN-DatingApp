//This component is the multipicker we see at the create profile screen, it allows to pick M from N options being M <= N

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Modal, TouchableOpacity, SectionList } from 'react-native';
import { AntDesign } from '@expo/vector-icons'

const MultiPick = (props) => {

    const { placeholder = 'What are you interested in?', options = null, onValueChange = () => {}, value=[], disabled = false } = props

    const [selectedValues, setSelectedValues] = useState(value)
    const [visible, setVisible] = useState(false)

    const handleChange = (newValue) => {
        if(selectedValues.indexOf(newValue) >= 0){
            setSelectedValues(prev => prev.filter(prev=> prev !== newValue))
        } else {
            setSelectedValues(prev => [...prev, newValue])
        }
    }

    const handleValueChange = () => {
        setVisible(false);
        onValueChange(selectedValues)
    }
    
    return(
        <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.container}
            onPress={()=>setVisible(true)}
            disabled={disabled}
        >
            <View style={{width: '90%'}}>
                <Text
                    style={{...styles.pickerValue, color: selectedValues.length > 0 ? 'black' : '#b5b5b5'}}>{selectedValues.length > 0 ? selectedValues.join(', ') : placeholder }</Text>
            </View>
            <View style={{width: '10%', alignItems: 'flex-end'}}>
                <AntDesign name={!visible ? 'caretleft' : 'caretdown'} size={20} />
            </View>
            <Modal visible={visible} transparent={true} style={{flex: 1}}>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '90%', minHeight: 30, backgroundColor: 'white', paddingHorizontal: 10, borderRadius: 5}}>
                        { options ? (
                            options.map((option, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={()=>handleChange(option.name)}
                                        activeOpacity={0.7}
                                        style={{...styles.item, borderBottomWidth:  1}}
                                    >   
                                        <View style={{width: '90%'}}>
                                            <Text style={{
                                                textTransform: 'capitalize', 
                                                fontSize: 20, 
                                                color: selectedValues.indexOf(option.name) >= 0 ? '#b0b0b0' : 'black'
                                            }}>
                                                    {option.label}
                                            </Text>
                                        </View>
                                        <View style={{alignItems: 'flex-end', width: '10%'}}>
                                            {selectedValues.indexOf(option.name) >= 0 ? (<AntDesign name='check' size={20} color='#b0b0b0'/>) : null}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                            ) : null
                        }
                        <TouchableOpacity
                            onPress={handleValueChange}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 30
                            }}>
                            <Text style={{
                                textTransform: 'capitalize', 
                                fontSize: 20, 
                                color: 'black',
                                alignSelf: 'flex-end'
                            }}>
                                done
                            </Text>
                        </TouchableOpacity>
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
        borderColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickerValue: {
        fontSize: 16,
        textTransform: 'capitalize'
    }
});

export {MultiPick}