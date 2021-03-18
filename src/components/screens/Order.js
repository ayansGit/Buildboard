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
    Platform, Alert, ToastAndroid, ActivityIndicator
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { getToken, setToken, } from "../../utils/storage"
import { withNavigationFocus } from '@react-navigation/compat'


function Order(props) {

    const [loading, setLoading] = useState(false)
    const [orderList, setOrderList] = useState([])

    let subs = [];
    useEffect(() => {
        // getOrderList()
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getOrderList()
          });
        return unsubscribe
    }, [props.navigation])

    async function getOrderList() {
        setLoading(true)
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest("user/order/list", header)
            if(response.success){
                console.log("RES", response.data)
                setOrderList(response.data)
            }
        } catch (error) {
            alert(error)
        }
        setLoading(false)
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
                        loading={loading}
                        title={"My Orders"}
                        navigation={props.navigation}
                        onDrawerButtonPressed={() => {
                            props.navigation.openDrawer()
                        }} />

                    <View style={{ width: "100%", alignItems: "center" }}>

                        <FlatList
                            style={{ width: "100%" }}
                            data={orderList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(data) => {
                                return (
                                    <View style={{
                                        width: "100%", alignItems: "center", paddingBottom: normalize(10),
                                        borderBottomWidth: normalize(1), 
                                        borderBottomColor: data.index == orderList.length-1 ? Color.white: Color.veryLightGrey, 
                                        marginTop: normalize(10), marginBottom: data.index == orderList.length-1 ? normalize(60): normalize(1)
                                    }}>
                                        <View style={{
                                            width: "100%", marginTop: normalize(2), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                                            alignItems: "flex-start"
                                        }}>
                                            <Image
                                                style={{
                                                    width: "30%", height: normalize(60), borderRadius: normalize(1), borderWidth: normalize(1),
                                                    borderColor: Color.grey, backgroundColor: Color.white, padding: normalize(3),
                                                }}
                                                resizeMode="contain"
                                                source={{uri: data.item.product_image}} />
                                            <View style={{ width: "55%", marginLeft: normalize(15) }}>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                                    color: Color.black,
                                                }}
                                                >{data.item.product_name}</Text>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Bold", fontSize: normalize(16),
                                                    color: Color.navyBlue, marginTop: normalize(2)
                                                }}
                                                >{`₹${data.item.product_price}`}</Text>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                                    color: Color.darkGrey, marginTop: normalize(2)
                                                }}
                                                >{`Quantity: ${data.item.quantity}`}</Text>
                                            </View>
                                        </View>

                                        <Text
                                            style={{
                                                width: "90%", fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                color: Color.black, marginTop: normalize(2)
                                            }}>Delivery Address</Text>
                                        <Text style={{
                                            width: "90%", fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                            color: Color.darkGrey, marginTop: normalize(2)
                                        }}>{data.item.address_id}</Text>

                                        <Text
                                            style={{
                                                width: "90%", fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                color: Color.black, marginTop: normalize(5)
                                            }}>Order Id</Text>
                                        <Text style={{
                                            width: "90%", fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                            color: Color.darkGrey, marginTop: normalize(2)
                                        }}>{data.item.order_id}</Text>
                                        <Text
                                            style={{
                                                width: "90%", fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                color: Color.black, marginTop: normalize(5)
                                            }}>Status</Text>
                                        <Text style={{
                                            width: "90%", fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                            color: Color.darkGrey, marginTop: normalize(2)
                                        }}>{data.item.status}</Text>
                                    </View>
                                )
                            }}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}

export default Order