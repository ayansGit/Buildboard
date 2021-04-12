import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Platform, ActivityIndicator,
    ImageBackground
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { ADD_TO_CART_REQUEST } from "../../actions/types"
import { addToCartRequest } from "../../actions/ProductAction";
import { getToken, setToken, } from "../../utils/storage"
import moment from "moment"


export default function TrackOrder(props) {

    const [loading, setLoading] = useState(false)
    const [trackingDetails, setTrackingDetail] = useState(null)
    const dispatch = useDispatch()
    const cart = useSelector(state => state.product.cart)

    useEffect(() => {
        getTacking()
    }, [])


    async function getTacking() {
        setLoading(true)
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }

            let request = {
                order_id: props.route.params.productDetails.order_id
            }
            let response = await postRequest("user/track-order", request, header)
            if (response.success) {
                console.log("RES", response.data)
                setTrackingDetail(response.data)
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
                        title={"Track Order"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>

                        {loading ? <ActivityIndicator color={Color.navyBlue} size="large" /> : null}

                        <View style={{
                            width: "90%", borderRadius: normalize(5), backgroundColor: Color.white, elevation: normalize(8),
                            shadowColor: Color.black, shadowOpacity: 0.3, shadowRadius: normalize(5),
                            shadowOffset: { height: 0, width: 0 }, padding: normalize(15)
                        }}>
                            <Text style={{
                                fontSize: normalize(12), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>{props.route.params.productDetails.order_id}</Text>
                            <Text style={{
                                fontSize: normalize(14), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(2)
                            }}>{props.route.params.productDetails.product_name}</Text>

                            <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(5)
                            }}>Quantity: <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>{props.route.params.productDetails.quantity}</Text></Text>

                            {trackingDetails != null ?
                                <Text style={{
                                    fontSize: normalize(10), color: Color.darkGrey,
                                    fontFamily: "Roboto-Medium", marginTop: normalize(5)
                                }}>Order Placed at: <Text style={{
                                    fontSize: normalize(10), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular"
                                }}>{moment(trackingDetails.ordered_date, 'YYYY-MM-DD').format('DD MMM, YYYY')}</Text></Text> : null}


                            <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(5)
                            }}>Delivery Address:</Text>
                            {trackingDetails != null ?
                                <Text style={{
                                    width: "80%", fontSize: normalize(10), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular"
                                }}>{trackingDetails.address_id}</Text> : null}


                            {trackingDetails != null ?
                                <View style={{ width: "100%", flexDirection: "row", marginTop: normalize(15), justifyContent: "center" }}>

                                    {trackingDetails.delivered_date != null ?
                                        <Image
                                            style={{ width: normalize(11), height: normalize(195) }}
                                            source={ImagePath.track3}
                                            resizeMode="contain" /> :
                                        trackingDetails.dispatched_date != null ?
                                            <Image
                                                style={{ width: normalize(11), height: normalize(195) }}
                                                source={ImagePath.track2}
                                                resizeMode="contain" /> :
                                            <Image
                                                style={{ width: normalize(11), height: normalize(195) }}
                                                source={ImagePath.track1}
                                                resizeMode="contain" />}


                                    <View style={{ marginLeft: normalize(15) }}>
                                        <Text style={{
                                            fontSize: normalize(10), color: trackingDetails.confirmed != null ? Color.blue : Color.grey,
                                            fontFamily: "Roboto-Regular"
                                        }}>Order Confirmed</Text>
                                        {trackingDetails.confirmed != null ?
                                            <Text style={{
                                                fontSize: normalize(10), color: Color.blue,
                                                fontFamily: "Roboto-Regular"
                                            }}>{moment(trackingDetails.confirmed_date, 'YYYY-MM-DD').format('DD MMM, YYYY')}</Text> : null}


                                        <Text style={{
                                            fontSize: normalize(10), color: trackingDetails.dispatched != null ? Color.blue : Color.grey,
                                            fontFamily: "Roboto-Regular", marginTop: normalize(62)
                                        }}>Order Dispatched</Text>
                                        {trackingDetails.dispatched_date != null ?
                                            <Text style={{
                                                fontSize: normalize(10), color: Color.blue,
                                                fontFamily: "Roboto-Regular"
                                            }}>{moment(trackingDetails.dispatched_date, 'YYYY-MM-DD').format('DD MMM, YYYY')}</Text> : null}


                                        <Text style={{
                                            fontSize: normalize(10), color: trackingDetails.delivered != null ? Color.blue : Color.grey,
                                            fontFamily: "Roboto-Regular", marginTop: normalize(60)
                                        }}>Order Delivered</Text>

                                        {trackingDetails.delivered_date != null ?
                                            <Text style={{
                                                fontSize: normalize(10), color: Color.blue,
                                                fontFamily: "Roboto-Regular"
                                            }}>{moment(trackingDetails.delivered_date, 'YYYY-MM-DD').format('DD MMM, YYYY')}</Text> : null}


                                    </View>

                                </View> : null}

                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}