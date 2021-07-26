import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { getToken, setCoupon } from "../../utils/storage";



export default function Coupon(props) {

    const [isSignedIn, setSignedIn] = useState(false)
    const [couponList, setCouponList] = useState([])

    useEffect(() => {
        console.log("Cat id: ", props.route.params)
        initialize()
        getCouponList()
    }, [])

    async function initialize() {
        try {
            let token = await getToken()
            if (token != null && token != undefined && token.length > 0) {
                setSignedIn(true)
            } else {
                setSignedIn(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getCouponList() {
        try {
            let response = await getRequest("user/coupon/list")
            console.log("RESPONSE", response)
            setCouponList(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }

    async function addCoupon(data) {

        setCoupon(data)
        props.navigation.goBack()

    }


    function renderCategoryItem(data) {
        return (
            <TouchableOpacity style={{
                width: "90%", flexDirection: "row",
                alignSelf: "center",
                marginTop: normalize(5),
                marginBottom: data.index == couponList.length - 1 ? normalize(70) : normalize(5),
                paddingStart: normalize(10),
                paddingEnd: normalize(5),
                paddingTop: normalize(15),
                paddingBottom: normalize(15),
                borderRadius: normalize(4),
                elevation: normalize(8), shadowColor: Color.black, shadowOpacity: 0.3,
                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(4),
                backgroundColor: Color.white, justifyContent: "space-around", alignItems: "center"
            }}
                onPress={() => {
                    // props.navigation.navigate("ProductList", { categoryId: data.item.id, categoryName: data.item.name })
                    setCoupon(data.item)
                    props.navigation.goBack()
                }}>
                <Image
                    style={{ width: normalize(30), height: normalize(30) }}
                    source={ImagePath.coupon} />

                <View style={{ width: "75%" }}>
                    <Text style={{
                        width: "80%", fontFamily: "Roboto-Bold", color: Color.navyBlue,
                        fontSize: normalize(14)
                    }}>{data.item.name}</Text>

                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Regular", color: Color.darkGrey,
                        fontSize: normalize(10), marginTop: normalize(10)
                    }}>{data.item.description}</Text>
                </View>

                {/* <Text style={{
                        fontFamily: "Roboto-Regular", color: Color.blue,
                        fontSize: normalize(12)
                    }}>Apply</Text> */}
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == "android" ?
                <StatusBar hidden={false} barStyle="dark-content" backgroundColor={Color.white} /> :
                <StatusBar hidden={false} />}
            <SafeAreaView style={{ flex: 1 }}>
                <View style={Platform.OS == "android" ? {
                    flex: 1, alignItems: "center",
                    backgroundColor: Color.white
                } : { flex: 1 }}>
                    <Header
                        navigation={props.navigation}
                        containNavDrawer={false}
                        title={"Available Coupons"}
                        isSignedIn={isSignedIn}
                        onBackPressed={() => props.navigation.goBack()}
                        onDrawerButtonPressed={() => {
                            props.navigation.openDrawer()
                        }}
                        showCart={false} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <FlatList
                            style={{ width: "100%", }}
                            data={couponList}
                            renderItem={(data) => renderCategoryItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}