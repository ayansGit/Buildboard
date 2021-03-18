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
    ImageBackground, ActivityIndicator,
    ToastAndroid
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { addToCartRequest } from "../../actions/ProductAction";
import { Checkbox, FAB } from 'react-native-paper';
import { getUserId, getToken } from "../../utils/storage";

export default function OrderSummary(props) {

    const cart = useSelector(state => state.product.cart)
    const dispatch = useDispatch()
    const [isCod, setCod] = useState(false)
    const [loading, setLoading] = useState(false)

    async function placeOrder() {
        setLoading(true)
        var userId = parseInt(await getUserId())
        console.log("USER_ID: ", userId)
        console.log("PLACE_ORDER: ", props.route.params.cartList)
        let cartList = props.route.params.cartList

        let orderRequest = {
            order: []
        }
        for (let i = 0; i < cartList.length; i++) {
            orderRequest.order.push({
                vendor_id: cartList[i].vendor_id,
                quantity: cartList[i].quantity,
                product_name: cartList[i].name,
                product_image: cartList[i].image,
                product_price: cartList[i].price,
                full_name: "Jon Doe",
                address_id: "kolkata",
                phone: "8981170012",
                payment_type: "cod",
                transaction_id: null
            })
        }

        console.log("ORDER_REQ: ", orderRequest)

        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let orderResponse = await postRequest("user/order/store", orderRequest, header)
            console.log(orderResponse)
            if (orderResponse.success) {
                let cartResponse = await getRequest(`user/cart/list`, header)
                console.log("RESPONSE", cartResponse)
                if (cartResponse.success) {
                    dispatch(addToCartRequest(cartResponse.data))
                    props.navigation.navigate("DrawerNavigator")
                    if (Platform.OS == "android") {
                        ToastAndroid.show("Order placed successfully", ToastAndroid.SHORT)
                    } else {
                        alert("Order placed successfully")
                    }
                }
            }
        } catch (error) {
            alert(error)
        }
        setLoading(false)

    }

    function cartItem(data) {

        return (
            <View style={{
                width: "100%", marginTop: normalize(10), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                borderBottomWidth: normalize(1), borderBottomColor: data.index == cart.length - 1 ? "#00000000" : Color.grey,
                alignItems: "flex-start"
            }}>
                <Image
                    style={{
                        width: "30%", height: normalize(60), borderRadius: normalize(1), borderWidth: normalize(1),
                        borderColor: Color.grey, backgroundColor: Color.white, padding: normalize(1)
                    }}
                    resizeMode="contain"
                    source={{ uri: data.item.image }} />
                <View style={{ width: "50%", paddingTop: normalize(5), marginLeft: normalize(15) }}>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                        color: Color.navyBlue
                    }}
                    >{data.item.name}</Text>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Bold", fontSize: normalize(16),
                        color: Color.navyBlue, marginTop: normalize(2)
                    }}
                    >{`₹${data.item.price}`}</Text>

                </View>

            </View>
        )
    }

    function getProductPrice() {
        let price = 0;
        for (let i = 0; i < cart.length; i++) {
            price = price + cart[i].price
        }
        return price
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
                        title="Order Summary"
                        showCart={false}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    <ScrollView style={{ width: "100%" }}>
                        <FlatList
                            scrollEnabled={false}
                            style={{ width: "100%" }}
                            renderItem={(data) => cartItem(data)}
                            data={cart}
                            keyExtractor={(item, index) => index.toString()} />
                        <View style={{
                            width: "90%", alignSelf: "center", backgroundColor: Color.white, padding: normalize(15),
                            borderRadius: normalize(10), elevation: normalize(8), shadowColor: Color.black,
                            shadowOpacity: 0.3, shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                            alignItems: "flex-start", marginTop: normalize(10)
                        }}>
                            <Text style={{
                                fontSize: normalize(12), color: Color.black,
                                fontFamily: "Roboto-Medium",
                            }}>Address:</Text>
                            <Text style={{
                                width: "80%", fontSize: normalize(12), color: Color.darkGrey,
                                fontFamily: "Roboto-Regular", marginTop: normalize(2)
                            }}>1B/10 AGC Bose Road, Kolkata: 700020, West Bengal</Text>

                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("AddressList")}
                                style={{
                                    backgroundColor: Color.blue, borderRadius: normalize(5),
                                    elevation: normalize(8),
                                    shadowColor: Color.black, shadowOpacity: 0.3, shadowOffset: { height: 0, width: 0 },
                                    shadowRadius: normalize(5), marginTop: normalize(15),
                                }}>
                                <Text style={{
                                    fontSize: normalize(10), fontFamily: "Roboto-Regular",
                                    color: Color.white, marginTop: normalize(6), marginBottom: normalize(6),
                                    marginLeft: normalize(20), marginRight: normalize(20)
                                }}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            width: "90%", alignSelf: "center", backgroundColor: Color.white,
                            borderRadius: normalize(10), borderWidth: normalize(1), borderColor: Color.veryLightGrey,
                            alignItems: "flex-start", marginTop: normalize(20), marginBottom: normalize(10)
                        }}>
                            <Text style={{
                                fontSize: normalize(12), color: Color.darkGrey,
                                fontFamily: "Roboto-Medium", marginTop: normalize(10), marginLeft: normalize(10)
                            }}>Price Details</Text>

                            <View style={{
                                width: "100%", height: normalize(1), marginTop: normalize(10),
                                backgroundColor: Color.veryLightGrey
                            }} />

                            <View style={{
                                alignSelf: "stretch", margin: normalize(10), flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <Text style={{
                                    fontSize: normalize(12), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular", marginTop: normalize(10), marginLeft: normalize(10)
                                }}>{`Price (${cart.length} items):`}</Text>

                                <Text style={{
                                    fontSize: normalize(14), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginTop: normalize(10), marginLeft: normalize(10)
                                }}>{`₹${getProductPrice()}`}</Text>
                            </View>

                            <View style={{
                                alignSelf: "stretch", margin: normalize(10), marginTop: normalize(1), flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <Text style={{
                                    fontSize: normalize(12), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular", marginLeft: normalize(10)
                                }}>Shipping: </Text>

                                <Text style={{
                                    fontSize: normalize(14), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                                }}>{`₹500`}</Text>
                            </View>

                            <View style={{
                                alignSelf: "stretch", margin: normalize(10), flexDirection: "row",
                                justifyContent: "space-between", marginTop: normalize(5)
                            }}>
                                <Text style={{
                                    fontSize: normalize(14), color: Color.darkGrey,
                                    fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                                }}>Total: </Text>

                                <Text style={{
                                    fontSize: normalize(16), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                                }}>{`₹${getProductPrice() + 500}`}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", marginLeft: 20, marginBottom: normalize(90), alignItems: "center" }}>
                            <Checkbox
                                disabled={loading}
                                status={isCod ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setCod(!isCod);
                                }} />
                            <Text style={{ fontSize: 16, fontFamily: "Roboto-Medium", color: Color.darkGrey }}>Pay with Cash on Delivery</Text>
                        </View>


                    </ScrollView>

                    <View style={{
                        width: "100%", flexDirection: "row", padding: normalize(10), alignItems: "center",
                        justifyContent: "space-between", backgroundColor: Color.white, elevation: normalize(9),
                        position: "absolute", bottom: 0
                    }}>
                        <Text style={{
                            fontSize: normalize(18), color: Color.navyBlue, width: "35%",
                            fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                        }}>{`₹${getProductPrice() + 500}`}</Text>


                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => placeOrder()}
                            style={{ height: normalize(40), width: "55%", }}>
                            <ImageBackground
                                style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                                source={ImagePath.gradientButton}
                                resizeMode="stretch">

                                {loading ? <ActivityIndicator size="small" color={Color.white} /> :
                                    <Text
                                        style={{
                                            fontSize: normalize(14),
                                            fontFamily: "Roboto-Medium",
                                            color: Color.white,
                                        }}>PLACE ORDER</Text>}
                            </ImageBackground>

                        </TouchableOpacity>
                    </View>



                </View>
            </SafeAreaView>
        </View>
    )
}