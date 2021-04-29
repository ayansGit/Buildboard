import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, SafeAreaView, Image } from "react-native";
import PropTypes from "prop-types";
import Colors from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { RadioButton } from 'react-native-paper';
import Color from "../../assets/Color";
import FilterCategoryItem from "./FilterCategoryItem"
import FilterColorItem from "./FilterColorItem"
import { getRequest } from "../../utils/apiRequest"
import { Checkbox } from "react-native-paper"


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

var categoryCalled = false
var colorCalled = false

function NewFilterModal(props) {


    const [selectedPos, setSelectedPos] = useState(0)
    const [discount, setDiscount] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [colorList, setColorList] = useState([])

    if (!categoryCalled) {
        getCategoryList()
    }


    async function getCategoryList() {
        try {
            let categoryResp = await getRequest("user/category")
            let colorResp = await getRequest("user/colors")
            console.log("RESPONSE", categoryResp)
            console.log("RESPONSE", colorResp)
            categoryCalled = true
            setCategoryList(categoryResp.data)
            setColorList(colorResp.data)

        } catch (error) {
            console.log("ERROR", error)
            categoryCalled = false
        }
    }

    async function getColorList() {
        try {
            let colorResp = await getRequest("user/colors")
            console.log("RESPONSE", colorResp)
            colorCalled = true
            setColorList(colorResp.data)

        } catch (error) {
            console.log("ERROR", error)
            colorCalled = false
        }
    }

    return (

        <Modal
            animationType="fade"
            transparent={false}
            visible={props.visible}
            onRequestClose={() => {
                if (props.onRequestClose) {
                    props.onRequestClose()
                }
            }}>

            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ flex: 1, alignItems: "center", backgroundColor: Colors.white }}>

                    <View style={{ width: "100%", height: "8%", flexDirection: "row", alignItems: "center", paddingStart: normalize(10) }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (props.onRequestClose) {
                                    props.onRequestClose()
                                }
                            }}>
                            <Image
                                style={{ width: normalize(10), height: normalize(10), margin: normalize(5) }}
                                source={ImagePath.close} />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: "Roboto-Regular", fontSize: normalize(12),
                            color: Color.navyBlue, marginLeft: normalize(10)
                        }}>Filter</Text>
                    </View>

                    <View style={{ width: "100%", height: "84%", flexDirection: "row" }}>

                        <View style={{ width: "40%", height: "100%", alignItems: "center", backgroundColor: Color.greyTransparent2 }}>

                            <TouchableOpacity
                                onPress={() => setSelectedPos(0)}
                                style={{ marginTop: normalize(25) }}>
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                    color: Color.darkGrey, margin: normalize(10)
                                }}>Categories</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedPos(1)
                                    getColorList()
                                }}
                                style={{ marginTop: normalize(10) }}>
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                    color: Color.darkGrey, margin: normalize(10)
                                }}>Color</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedPos(2)}
                                style={{ marginTop: normalize(10) }}>
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                    color: Color.darkGrey, margin: normalize(10)
                                }}>Price</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setDiscount(!discount)}
                                style={{ marginTop: normalize(10), flexDirection: "row", alignItems: "center" }}>
                                <Checkbox status={discount ? "checked" : "unchecked"} />
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                    color: Color.darkGrey, textAlign: "center"
                                }}>{"Product with \n Discount"}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ width: "60%", height: "100%" }}>

                            {selectedPos == 0 ?
                                <FlatList
                                    data={categoryList}
                                    style={{ width: "100%" }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(data) => {
                                        return (<FilterCategoryItem data={data.item} />)
                                    }} /> : selectedPos == 1 ?
                                    <FlatList
                                        data={colorList}
                                        style={{ width: "100%" }}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={(data) => {
                                            return (<FilterColorItem color={data.item} />)
                                        }} /> :
                                    <View style = {{width: "100%",}}>
                                    </View>}


                        </View>

                    </View>
                    <View style={{ width: "100%", height: "8%", flexDirection: "row" }}>
                        <TouchableOpacity
                        onPress = {() => {
                            if (props.onRequestClose) {
                                props.onRequestClose()
                            }
                        }}
                         style={{ width: "40%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{
                                fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                color: Color.darkGrey
                            }}>CLOSE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: "60%", height: "100%", backgroundColor: Color.navyBlue, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{
                                fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                color: Color.white
                            }}>APPLY</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </SafeAreaView>





        </Modal>

    )
}

export const SortType = {

    A_TO_Z: 0,
    Z_TO_A: 1,
    PRICE_HIGHT_TO_LOW: 2,
    PRICE_LOW_TO_HIGH: 3
}

export default NewFilterModal;

NewFilterModal.propTypes = {

    visible: PropTypes.bool,
    onSortItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func

};

NewFilterModal.defaultProps = {

    visible: false,
    onSortItemSelected: null,
    onRequestClose: null
};
