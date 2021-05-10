import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
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
import { addFilteredCategory, addFilteredColor } from "../../actions/ProductAction"
import Slider from "@react-native-community/slider"
import RangeSlider from 'rn-range-slider';


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
var filterRequest = {}

function NewFilterModal(props) {

    const dispatch = useDispatch()
    const categoryList = useSelector(state => state.product.filterCategory)
    // const colorList = useSelector(state => state.product.filterColor)

    const [selectedPos, setSelectedPos] = useState(0)
    const [discount, setDiscount] = useState(false)
    const [minPrice, setminPrice] = useState(1000)
    const [maxPrice, setmaxPrice] = useState(0)
    // const [categoryList, setCategoryList] = useState([])
    const [colorList, setColorList] = useState([])
    const [selectedColor, setSelectedColor] = useState(-1)


    if (!categoryCalled) {
        getCategoryList()
    }


    async function getCategoryList() {
        try {
            let categoryResp = await getRequest("user/category")
            let categoryList = categoryResp.data
            categoryList.forEach((value, index) => {
                value.isChecked = false
                return value
            });
            console.log("CATEGORY", categoryList)
            categoryCalled = true
            dispatch(addFilteredCategory({ categoryList: categoryList, id: -1 }))

        } catch (error) {
            console.log("ERROR", error)
            categoryCalled = false
        }
    }

    async function getColorList() {
        try {
            let colorResp = await getRequest("user/colors")
            console.log("RESPONSE", colorResp)
            let colorList = colorResp.data
            // colorList.forEach((value, index) => {
            //     value.isChecked = false
            //     return value
            // });
            colorCalled = true
            setColorList(colorList)
            // dispatch(addFilteredColor(colorList))

        } catch (error) {
            console.log("ERROR", error)
            colorCalled = false
        }
    }

    function selectCategory(position, id) {
        clearFilter()
        let categoryArr = categoryList
        categoryArr.forEach((value, index) => {
            if (position == index)
                value.isChecked = !value.isChecked
            else value.isChecked = false
            return value
        });
        filterRequest = {}
        filterRequest.category_id = id
        dispatch(addFilteredCategory({ categoryList: categoryList, id: id }))
    }

    function clearFilter() {
        let categoryArr = categoryList
        categoryArr.forEach((value, index) => {
            value.isChecked = false
            return value
        });
        setDiscount(false)
        setmaxPrice(0)
        setSelectedColor(-1)
        filterRequest = {}
        dispatch(addFilteredCategory({ categoryList: categoryList, id: -1 }))
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

                    <View style={{ width: "100%", height: "8%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingStart: normalize(10) }}>
                        <View style={{ flexDirection: "row" }}>
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

                        <TouchableOpacity
                            onPress={() => {
                                clearFilter()
                                if (props.clearFilter) {
                                    props.clearFilter()
                                }
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                color: Color.navyBlue, marginLeft: normalize(10), marginRight: normalize(10)
                            }}>Clear</Text>
                        </TouchableOpacity>

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
                                onPress={() => {
                                    // filterRequest = {}
                                    clearFilter()
                                    if (!discount) {
                                        filterRequest.discount = "discount"
                                    } else {
                                        delete filterRequest.discount
                                    }
                                    setDiscount(!discount)
                                }}
                                style={{ marginTop: normalize(10), flexDirection: "row", alignItems: "center" }}>
                                <Checkbox status={discount ? "checked" : "unchecked"} />
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                    color: Color.darkGrey, textAlign: "center", marginLeft: normalize(5)
                                }}>{"Discounts"}</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ width: "60%", height: "100%" }}>

                            {selectedPos == 0 ?
                                <FlatList
                                    data={categoryList}
                                    style={{ width: "100%" }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(data) => {
                                        return (<FilterCategoryItem
                                            onChecked={() => selectCategory(data.index, data.item.id)}
                                            data={data.item} />)
                                    }} /> : selectedPos == 1 ?
                                    <FlatList
                                        data={colorList}
                                        style={{ width: "100%" }}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={(data) => {
                                            return (<FilterColorItem color={data.item}
                                                isChecked={selectedColor == data.index}
                                                onChecked={() => {
                                                    // filterRequest = {}
                                                    clearFilter()
                                                    filterRequest.color = data.item
                                                    setSelectedColor(data.index)
                                                }} />)
                                        }} /> :
                                    <View style={{ width: "100%", alignItems: "center" }}>
                                        <Slider
                                            style={{ width: normalize(180), height: normalize(40), marginTop: normalize(50) }}
                                            minimumValue={1000}
                                            maximumValue={100000}
                                            step={5000}
                                            value = {maxPrice}
                                            onValueChange={(value) => {
                                                clearFilter()
                                                setmaxPrice(value)
                                                filterRequest = {}
                                                filterRequest.min_price = minPrice
                                                filterRequest.max_price = value
                                            }}
                                        />
                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                                color: Color.darkGrey, margin: normalize(10)
                                            }}>₹ 1000</Text>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                                color: Color.darkGrey, margin: normalize(10)
                                            }}>{`₹ ${maxPrice}`}</Text>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(10),
                                                color: Color.darkGrey, margin: normalize(10)
                                            }}>₹ 100000</Text>
                                        </View>
                                    </View>}

                        </View>
                    </View>

                    <View style={{ width: "100%", height: "8%", flexDirection: "row" }}>
                        <TouchableOpacity
                            onPress={() => {
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

                        <TouchableOpacity
                            onPress={() => {
                                if (props.onFilterApply)
                                    props.onFilterApply(filterRequest)
                                console.log('FILTER_REQ', filterRequest)
                            }}
                            style={{ width: "60%", height: "100%", backgroundColor: Color.navyBlue, justifyContent: "center", alignItems: "center" }}>
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
    onRequestClose: PropTypes.func,
    onFilterApply: PropTypes.func,
    clearFilter: PropTypes.func,

};

NewFilterModal.defaultProps = {

    visible: false,
    onSortItemSelected: null,
    onRequestClose: null,
    onFilterApply: null,
    clearFilter: null,
};
