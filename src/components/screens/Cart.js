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
import { addToCartRequest } from "../../actions/ProductAction";
import { getToken } from "../../utils/storage";

export default function Cart(props) {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const cart = useSelector(state => state.product.cart)

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getCartList()
        });
        return unsubscribe
    }, [props.navigation])

    async function getCartList() {
        let token = await getToken()
        if (token != null && token != undefined && token.length > 0) {
            try {
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
                let response = await getRequest(`user/cart/list`, header)
                console.log("RESPONSE", response)
                if (response.success) {
                    dispatch(addToCartRequest(response.data))
                }

            } catch (error) {
                console.log("ERROR", error)
            }
        }

    }

    async function addItem(item, addProduct) {
        let cartList = cart
        for (let i = 0; i < cartList.length; i++) {
            if (item.product_id == cartList[i].product_id) {
                cartList[i].loading = true
                break
            }
        }
        dispatch(addToCartRequest(cartList))
        let cartItem = {}
        let product = item
        if (addProduct)
            product.quantity = product.quantity + 1
        else product.quantity = product.quantity - 1
        try {
            setLoading(true)

            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let request = {
                vendor_id: product.vendor_id,
                product_id: product.product_id,
                quantity: product.quantity,
                image: product.image
            }
            let response = await postRequest("user/cart/store", request, header)
            console.log("ADD_TO_CART_RESP", response)
            if (response.success) {
                cartItem = {
                    ...product,
                    ...response.data,
                    loading: false
                }

            } else if (Array.isArray(response.message)) {
                var message = ""
                response.message.map((value) => { message = message + "\n" + value })
                console.log("MSG", message)
                alert(message)
            } else {
                alert(response.message)
            }
        } catch (error) {
            alert(error.message)
        }
        for (let i = 0; i < cartList.length; i++) {
            if (item.product_id == cartList[i].product_id) {
                cartList[i] = cartItem
                break
            }
        }
        dispatch(addToCartRequest(cartList))
        setLoading(false)
    }


    async function removeItem(item) {
        let cartList = cart
        let tempList = cart

        for (let i = 0; i < cartList.length; i++) {
            if (item.product_id == cartList[i].product_id) {
                cartList[i].loading = true
                break
            }
        }
        dispatch(addToCartRequest(cartList))
        let cartItem = {}
        let product = item

        try {
            setLoading(true)
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let url = `user/cart/${item.cart_id}/remove`
            console.log("URL", url)
            let response = await getRequest(url, header)
            console.log("RESPONSE: " + response)
            if (response.success) {
                for (let i = 0; i < cartList.length; i++) {
                    if (item.product_id == cartList[i].product_id) {
                        tempList.splice(i, 1)
                        break
                    }
                }
                dispatch(addToCartRequest(tempList))
            } else if (Array.isArray(response.message)) {
                for (let i = 0; i < cartList.length; i++) {
                    if (item.product_id == cartList[i].product_id) {
                        cartList[i].loading = false
                        break
                    }
                }
                dispatch(addToCartRequest(cartList))
                var message = ""
                response.message.map((value) => { message = message + "\n" + value })
                console.log("MSG", message)
                alert(message)
            } else {
                for (let i = 0; i < cartList.length; i++) {
                    if (item.product_id == cartList[i].product_id) {
                        cartList[i].loading = false
                        break
                    }
                }
                dispatch(addToCartRequest(cartList))
                console.log("ERROR: " + response)
                alert(response.message)
            }
        } catch (error) {
            for (let i = 0; i < cartList.length; i++) {
                if (item.product_id == cartList[i].product_id) {
                    cartList[i].loading = false
                    break
                }
            }
            dispatch(addToCartRequest(cartList))
            alert(error.message)
        }
        setLoading(false)
    }


    function cartItem(data) {

        console.log("DATA_ITEM: " + data.index + ": " + data.item.loading)
        return (
            <TouchableOpacity style={{
                width: "100%", marginTop: normalize(10), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                borderBottomWidth: normalize(1), borderBottomColor: Color.grey,
                justifyContent: "space-between", alignItems: "flex-start"
            }}
                onPress={() => {
                    props.navigation.navigate("ProductDetail", { productId: data.item.product_id })
                }}>
                <Image
                    style={{
                        width: "30%", height: normalize(60), borderRadius: normalize(1), borderWidth: normalize(1),
                        borderColor: Color.grey, backgroundColor: Color.white, padding: normalize(1)
                    }}
                    resizeMode="contain"
                    source={{ uri: data.item.image }} />
                <View style={{ width: "50%", paddingTop: normalize(5) }}>
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
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: normalize(10) }}>
                        <TouchableOpacity
                            disabled={data.item.loading != undefined && data.item.loading}
                            onPress={() => addItem(data.item, true)}>
                            <Image
                                source={ImagePath.plus}
                                style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: "Roboto-Regular", fontSize: normalize(12),
                            color: Color.grey, marginStart: normalize(3), marginEnd: normalize(3), marginBottom: normalize(1)
                        }}>{data.item.quantity}</Text>
                        <TouchableOpacity
                            disabled={data.item.loading != undefined && data.item.loading}
                            onPress={() => {
                                if (data.item.quantity > 1)
                                    addItem(data.item, false)
                            }}>
                            <Image
                                source={ImagePath.minus}
                                style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>

                        {data.item.loading != undefined && data.item.loading ?
                            <ActivityIndicator style={{ marginLeft: normalize(15) }} size="small" color={Color.navyBlue} /> : null}


                    </View>
                </View>
                <TouchableOpacity
                    disabled={data.item.loading != undefined && data.item.loading}
                    onPress={() => removeItem(data.item)}
                    style={{ padding: normalize(5) }}>
                    <Image
                        source={ImagePath.delete}
                        style={{ height: normalize(10), width: normalize(10) }} />
                </TouchableOpacity>
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
                        title="Cart"
                        showCart={false}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    {cart.length == 0 ? <Text style={{
                        fontFamily: "Roboto-Medium", fontSize: normalize(18),
                        color: Color.grey, marginTop: "40%", alignSelf: "center"
                    }}>YOUR CART IS EMPTY</Text> : null}

                    <FlatList
                        style={{ width: "100%" }}
                        renderItem={(data) => cartItem(data)}
                        data={cart}
                        keyExtractor={(item, index) => index.toString()} />



                    {cart.length > 0 ?
                        <TouchableOpacity
                            style={{
                                width: "100%", height: normalize(40), position: "absolute",
                                bottom: 0
                            }}
                            onPress={() => props.navigation.navigate("OrderSummary", { cartList: cart })}>
                            <ImageBackground
                                style={{
                                    height: "100%", width: "100%", alignItems: "center",
                                    justifyContent: "center"
                                }}
                                source={ImagePath.button_gradient}
                            >
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                    color: Color.white
                                }}>CHECKOUT</Text>
                            </ImageBackground>
                        </TouchableOpacity> : null}


                </View>
            </SafeAreaView>
        </View>
    )
}