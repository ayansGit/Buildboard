import React, { useState } from "react"
import { useSelector, useDispatch, connect } from "react-redux"
import { View, TouchableOpacity, Text } from "react-native"
import { Checkbox } from "react-native-paper"
import Color from "../../assets/Color";
import normalize from "../../utils/dimen"

export default function FilterCategoryItem(props){

     const id = useSelector(state => state.product.id)

    console.log("LL", id)

    return (
        <TouchableOpacity 
        onPress={() =>  {
            if(props.onChecked){
                props.onChecked()
            }
        }}
        style ={{width: "100%", flexDirection: "row", alignItems: "center", margin: normalize(10)}}>

            <Checkbox status = {props.data.id == id ? "checked": "unchecked"} />

            <Text style={{marginLeft: normalize(10), fontSize: normalize(10), fontFamily: "Roboto-Medium",}}>{props.data.name}</Text>

        </TouchableOpacity>
    )
}

// const mapStateToProps = state => {
//     return {
//         id: state.product.id
//     }
// }

// export default connect(
//     mapStateToProps,
//     null
// )(FilterCategoryItem)