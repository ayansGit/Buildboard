import React, { useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { Checkbox } from "react-native-paper"
import Color from "../../assets/Color";
import normalize from "../../utils/dimen"



export default function FilterColorItem(props) {

    return (
        <TouchableOpacity
            onPress={() =>  {
                if(props.onChecked){
                    props.onChecked()
                }
            }}
            style={{ width: "100%", flexDirection: "row", alignItems: "center", marginTop: normalize(10), paddingEnd: normalize(5), marginBottom: normalize(10), justifyContent: "space-around" }}>

            <Checkbox status = {props.isChecked? "checked": "unchecked"} />

            <View style={{ width: "65%", height: normalize(30), borderWidth: 1, borderColor: Color.veryLightGrey, padding: normalize(3) }}>
                <View
                    style={{ width: "100%", height: "100%", backgroundColor: props.color }} />

            </View>

        </TouchableOpacity>
    )
}