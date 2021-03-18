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
    Platform,
    ImageBackground
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { ADD_TO_CART_REQUEST } from "../../actions/types"
import { addToCartRequest } from "../../actions/ProductAction";


export default function TrackOrder(props) {

    const [product, setProduct] = useState(null)
    const dispatch = useDispatch()
    const cart = useSelector(state => state.product.cart)

    useEffect(() => {
        getProducts()
    }, [])


    async function getProducts() {

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
                        <View style={{
                            width: "90%", borderRadius: normalize(5), backgroundColor: Color.white, elevation: normalize(8),
                            shadowColor: Color.black, shadowOpacity: 0.3, shadowRadius: normalize(5),
                            shadowOffset: { height: 0, width: 0 }, padding: normalize(15)
                        }}>
                            <Text style={{
                                fontSize: normalize(12), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>BLBD00194</Text>
                            <Text style={{
                                fontSize: normalize(14), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(2)
                            }}>3 Seater Mini Sofa</Text>

                            <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(5)
                            }}>Quantity: <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>3</Text></Text>

                            <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(5)
                            }}>Order Placed at: <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>22 Dec, 2020</Text></Text>

                            <Text style={{
                                fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(5)
                            }}>Delivery Address:</Text>
                            <Text style={{
                                width: "80%", fontSize: normalize(10), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular"
                            }}>1B/10 AGC Bose Road, Kolkata: 700020, West Bengal</Text>

                            <View style={{ width: "100%", flexDirection: "row", marginTop: normalize(15), justifyContent: "center" }}>

                                <Image
                                    style={{ width: normalize(11), height: normalize(195) }}
                                    source={ImagePath.track2}
                                    resizeMode="contain" />

                                <View style={{ marginLeft: normalize(15) }}>
                                    <Text style={{
                                        fontSize: normalize(10), color: Color.blue,
                                        fontFamily: "Roboto-Regular"
                                    }}>Order Confirmed</Text>
                                    <Text style={{
                                        fontSize: normalize(10), color: Color.blue,
                                        fontFamily: "Roboto-Regular"
                                    }}>22 Dec, 2020</Text>

                                    <Text style={{
                                        fontSize: normalize(10), color: Color.blue,
                                        fontFamily: "Roboto-Regular", marginTop: normalize(62)
                                    }}>Order Dispatched</Text>
                                    <Text style={{
                                        fontSize: normalize(10), color: Color.blue,
                                        fontFamily: "Roboto-Regular"
                                    }}>23 Dec, 2020</Text>

                                    <Text style={{
                                        fontSize: normalize(10), color: Color.grey,
                                        fontFamily: "Roboto-Regular", marginTop: normalize(60)
                                    }}>Order Delivered</Text>
                                    <Text style={{
                                        fontSize: normalize(10), color: Color.grey,
                                        fontFamily: "Roboto-Regular"
                                    }}>25 Dec, 2020</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}