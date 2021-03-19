import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Platform, } from "react-native";
import PropTypes from "prop-types";
import Colors from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { Picker, PickerIOS } from "@react-native-picker/picker";


function StatePicker(props) {

    const [showDropdown, manageShowDropdown] = useState(false)
    const [itemIndex, setItemIndex] = useState(0)

    const [text, setText] = useState(props.selectedValue == "" ? props.emptySelectText : getSelectedValueText())
    const [selValue, setSelValue] = useState(props.selectedValue)


    function getSelectedValueText() {

        if (props.data.length > 0) {
            return props.data[Number(props.selectedValue)].name;
        } else
            return props.emptySelectText
    }

    function toggleShowDropdown() {
        if (showDropdown) {
            manageShowDropdown(false);
        } else {
            manageShowDropdown(true);
        }

    }

    function onSelectItem(item, itemIndex) {
        if (props.itemParam == "") {
            setText(item)
        } else {
            setText(props.data.length > 0 ? props.data[itemIndex][props.itemParam] : props.emptySelectText)
        }

        setSelValue(item)
    }

    function onDone() {
        manageShowDropdown(false);
        if (props.data.length > 0) {

            setText(props.data[itemIndex].name)
            if (props.onPickerItemSelected) {
                props.onPickerItemSelected(props.data[itemIndex], itemIndex);
            }

        }

    }

    function setRef(ref) {
        if (props.ref) {
            props.ref(ref)
        }
    }

    function renderIOSPicker() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDropdown}>
                <View style={{ flex: 1, backgroundColor: Colors.greyTransparent }}>

                    <View style={{ width: "100%", height: normalize(200), position: "absolute", bottom: 0, alignItems: "center", backgroundColor: Colors.white }}>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableOpacity
                                onPress={() => manageShowDropdown(false)}
                                style={{ padding: normalize(10) }}>
                                <Text style={{ fontSize: normalize(12), color: Colors.blue }}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ padding: normalize(10) }}
                                onPress={() => {
                                    onDone()
                                }}>
                                <Text style={{ fontSize: normalize(12), color: Colors.blue }}>DONE</Text>
                            </TouchableOpacity>
                        </View>

                        <PickerIOS
                            selectedValue={selValue}
                            style={{
                                marginTop: normalize(-5),
                                width: "100%",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                                setItemIndex(itemIndex)
                                setSelValue(itemValue)
                            }}>

                            {props.data.map((item, itemIndex) => {

                                return (
                                    <Picker.Item key={itemIndex.toString()} label={item.name} value={itemIndex.toString()} />
                                )

                            })
                            }

                        </PickerIOS>
                    </View>

                </View>


            </Modal>

        )
    }

    return (

        <View style={{ width: props.width, }}>
            {props.placeholder != "" ?
                <Text style={{ fontFamily: "Lato-Bold", fontSize: normalize(12), marginBottom: normalize(5), }}>{props.placeholder}</Text> : null}

            {Platform.OS == "ios" ?
                <TouchableOpacity
                    disabled={!props.editable}
                    ref={(ref) => setRef(ref)}
                    style={{ width: "100%", height: normalize(20), flexDirection: "row", justifyContent: "flex-end", }}
                    onPress={() => {
                        toggleShowDropdown()
                    }}>
                    <Text numberOfLines={1} style={{ fontFamily: "Lato-Regular", fontSize: normalize(props.textSize), color: Colors.navyBlue, width: "100%", paddingRight: normalize(props.textPadding), alignSelf: "center", position: "relative", textAlign: props.textAlign }}>{text}</Text>
                </TouchableOpacity> :
                <Picker
                    enabled={props.editable}
                    ref={(ref) => setRef(ref)}
                    selectedValue={selValue}
                    style={{ width: "100%", height: normalize(20), marginLeft: normalize(-5) }}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelValue(itemValue);
                        if (props.onPickerItemSelected) {
                            props.onPickerItemSelected(props.data[itemIndex], itemIndex);
                        }
                        // if (props.getSelectedIndex) {
                        //     props.getSelectedIndex(itemIndex.toString());
                        // }
                    }}>

                    {props.data.map((item, index) => {

                        return (
                            <Picker.Item key={index} label={item.name} value={index.toString()} />
                        )
                    })}
                </Picker>

            }


            {renderIOSPicker()}



        </View >
    )
}

export default StatePicker;

StatePicker.propTypes = {
    ref: PropTypes.func,
    selectedValue: PropTypes.any,
    placeholder: PropTypes.string,
    textSize: PropTypes.number,
    onTextChange: PropTypes.func,
    marginTop: PropTypes.number,
    data: PropTypes.array,
    itemParam: PropTypes.string,
    valueParam: PropTypes.string,
    onPickerItemSelected: PropTypes.func,
    width: PropTypes.any,
    textAlign: PropTypes.string,
    textPadding: PropTypes.number,
    emptySelectText: PropTypes.string,
    editable: PropTypes.bool,
    getSelectedIndex: PropTypes.func,

};

StatePicker.defaultProps = {
    ref: null,
    selectedValue: "",
    placeholder: "",
    textSize: 15,
    onTextChange: null,
    marginTop: 10,
    data: [],
    itemParam: "",
    valueParam: "",
    onPickerItemSelected: null,
    width: "100%",
    textAlign: "left",
    textPadding: 20,
    emptySelectText: "Select",
    editable: true,
    getSelectedIndex: null,
};
