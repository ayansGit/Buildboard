import React, { useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { Checkbox } from "react-native-paper"
import Color from "../../assets/Color";
import normalize from "../../utils/dimen"

export default function FilterCategoryItem(props){

    return (
        <TouchableOpacity style ={{width: "100%", flexDirection: "row", alignItems: "center", margin: normalize(10)}}>

            <Checkbox />

            <Text style={{marginLeft: normalize(10), fontSize: normalize(10), fontFamily: "Roboto-Medium",}}>{props.data.name}</Text>

        </TouchableOpacity>
    )
}