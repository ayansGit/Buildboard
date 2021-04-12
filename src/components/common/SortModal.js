import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, } from "react-native";
import PropTypes from "prop-types";
import Colors from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { RadioButton } from 'react-native-paper';
import Color from "../../assets/Color";


const sortParameter = [
    {
        type: 0,
        name: "Sort from A to Z"

    },
    {
        type: 2,
        name: "Price high to low"

    },
    {
        type: 3,
        name: "Price low to high"

    },
    {
        type: 1,
        name: "Sort from Z to A"

    },

]

function SortModal(props) {


    const [selectedPos, setSelectedPos] = useState(-1)

    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                if (props.onRequestClose) {
                    props.onRequestClose()
                }
            }}>
            <TouchableOpacity
                activeOpacity={1}
                touchSoundDisabled={true}
                style={{ flex: 1, backgroundColor: Colors.greyTransparent }}
                onPress={() => {
                    if (props.onRequestClose) {
                        props.onRequestClose()
                    }
                }}>

                <View style={{ width: "100%", position: "absolute", bottom: 0, alignItems: "center", backgroundColor: Colors.white }}>

                    <RadioButton.Group
                        value={selectedPos}
                        onValueChange={(value) => {
                            setSelectedPos(value)
                            if (props.onSortItemSelected) {
                                props.onSortItemSelected(sortParameter[value].type)
                            }
                        }}>
                        <FlatList
                            style={{ width: "100%", marginTop: normalize(5) }}
                            data={sortParameter}
                            renderItem={(data) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedPos(data.item.type)
                                            if (props.onSortItemSelected) {
                                                props.onSortItemSelected(data.item.type)
                                            }
                                        }}
                                        style={{
                                            width: "100%", flexDirection: "row",
                                            paddingTop: normalize(2), paddingBottom: normalize(2), alignItems: "center", justifyContent: "space-around",
                                            marginTop: normalize(5), marginBottom: Platform.OS == "ios" ? data.index == sortParameter.length - 1 ? normalize(25) : normalize(5): normalize(5)
                                        }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(12), color: selectedPos == data.item.type ? Color.blue : Color.darkGrey }}>{data.item.name}</Text>
                                        <RadioButton value={data.item.type} />

                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </RadioButton.Group>


                </View>

            </TouchableOpacity>


        </Modal>

    )
}

export const SortType = {

    A_TO_Z: 0,
    Z_TO_A: 1,
    PRICE_HIGHT_TO_LOW: 2,
    PRICE_LOW_TO_HIGH: 3
}

export default SortModal;

SortModal.propTypes = {

    visible: PropTypes.bool,
    onSortItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func

};

SortModal.defaultProps = {

    visible: false,
    onSortItemSelected: null,
    onRequestClose: null
};
