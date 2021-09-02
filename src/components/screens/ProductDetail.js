import React, { useState, useEffect, useRef } from 'react';
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
    ImageBackground, KeyboardAvoidingView,
    ToastAndroid, Alert, useWindowDimensions
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
import { getToken } from "../../utils/storage";
import HTML from "react-native-render-html";
import { showAlert } from "../../utils/Utils"



export default function ProductDetail(props) {

    const regex = /(<([^>]+)>)/ig;
    const contentWidth = useWindowDimensions().width;

    const scrollViewRef = useRef()

    const [isSignedIn, setSignedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadImage, setLoadImage] = useState(false)
    const [product, setProduct] = useState(null)
    const [assemble, setAssemble] = useState(false)
    const [careInstruction, setCareInstruction] = useState(false)
    const [properties, setProperties] = useState(false)
    const [refund, setRefund] = useState(false)
    const [feature, setFeature] = useState(false)
    const [isAddedToWishlist, setAddToWishlist] = useState(false)
    const [pincode, setPincode] = useState("")
    const [pincodeCheking, setPincodeCheking] = useState("")
    const [colors, setColors] = useState([])
    const [productImages, setProductImages] = useState([])
    const [selectedColor, setSelectedColor] = useState("")
    const [wishlist, setWishlist] = useState([])
    const [selectedImagePos, setSelectedImagePos] = useState(0)
    const dispatch = useDispatch()
    const cart = useSelector(state => state.product.cart)

    useEffect(() => {
        getProducts()
    }, [])


    console.log("HHH")
    async function getProducts() {
        let token = await getToken()
        if (token != null && token != undefined && token.length > 0) {
            setSignedIn(true)
        } else {
            setSignedIn(false)
        }
        console.log("DATA: ", props.route.params.productId)
        try {
            let response = await getRequest(`user/product/${props.route.params.productId}/list`)
            console.log("RESPONSE", response)
            let wishlist = await getWishlist()
            setProduct(response.data)
            console.log("Wishlist", wishlist)
            for (let i = 0; i < wishlist.length; i++) {
                if (wishlist[i].product.product_id == response.data.product_id) {
                    setAddToWishlist(true)
                }
            }
            if (response.data.color != null && response.data.color.length > 0) {
                setColors(response.data.color)
                setSelectedColor(response.data.color[0])
                await getImages(response.data.color[0])
            } else {
                let productImages = []
                productImages.push(response.data.image)
                setProductImages(productImages)
            }
        } catch (error) {
            console.log("ERROR", error)
        }
    }

    async function getWishlist() {

        let wishlist = []
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest("user/wishlist", header)
            console.log("RESPONSE", response)
            // setWishlist(response.data)
            wishlist = response.data

        } catch (error) {
            console.log("ERROR", error)
        }
        return wishlist
    }

    async function getImages(color) {
        setLoadImage(true)
        try {
            let request = {
                color: color,
                product_id: props.route.params.productId
            }
            let response = await postRequest(`user/product/imagewithcolor`, request)
            console.log("RESPONSE", response)
            setProductImages(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
        setLoadImage(false)
    }



    async function addToCart() {

        console.log("CART: ", cart)
        console.log("PRODUCT_ID: ", product.product_id)
        var isAddedToCart = false
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].product_id == product.product_id) {
                isAddedToCart = true
                break
            }
        }
        if (!isAddedToCart) {
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
                    quantity: 1,
                    image: productImages[0]
                }
                let response = await postRequest("user/cart/store", request, header)
                console.log("ADD_TO_CART_RESP", response)
                if (response.success) {
                    let cartItem = {
                        ...product,
                        ...response.data
                    }
                    cart.push(cartItem)
                    dispatch(addToCartRequest(cart))
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
            setLoading(false)
        } else {
            if (Platform.OS == "android")
                ToastAndroid.show("Product already added to cart", ToastAndroid.SHORT)
            else alert("Product already added to cart")
        }


    }

    function buyNow() {
        let cart = []
        let tempProduct = product
        tempProduct.quantity = 1
        tempProduct.vendor_id = product.vendor_id
        cart.push(tempProduct)
        // dispatch(addToCartRequest(cart))
        props.navigation.navigate("OrderSummary", { cartList: cart, productId: product.product_id })
    }

    async function checkPincode() {

        if (pincode.length > 0) {
            setPincodeCheking(true)
            try {
                let response = await getRequest(`user/pincode/${pincode}/list`)
                if (response.success) {
                    showAlert("Product is available on this pincode")
                } else {
                    showAlert("Product is not available on this pincode")
                }
            } catch (error) {
                alert(error)
            }
            setPincodeCheking(false)
        } else {
            showAlert("Insert a pincode to check")
        }


    }

    async function addToWishlist() {
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let request = {
                vendor_id: product.vendor_id,
                product_id: product.product_id,
            }
            let response = await postRequest("user/wishlist/store", request, header)
            if (response.success) {
                showAlert(response.message)
            } else if (Array.isArray(response.message)) {
                var message = ""
                response.message.map((value) => { message = message + "\n" + value })
                console.log("MSG", message)
                alert(message)
            } else {
                alert(response.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    function showLogintAlert() {
        Alert.alert(
            "Alert",
            "You have to login first",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => { props.navigation.navigate("SignedOutNavigator") } }
            ],
            { cancelable: false }
        );
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
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1, width: "100%", alignItems: "center" }}>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            ref={scrollViewRef}
                            style={{ width: "100%" }}>

                            <View style={{ width: "100%", alignItems: "center" }}>

                                {product ?
                                    <View style={{
                                        width: "90%", alignSelf: "center",
                                        elevation: normalize(8), shadowColor: Color.black, shadowOpacity: 0.3,
                                        shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                                        backgroundColor: Color.white, marginTop: normalize(15), marginBottom: normalize(20)
                                    }}>
                                        {productImages.length > 0 ?
                                            <ViewPager
                                                pageMargin={normalize(10)}
                                                onPageSelected={(event) => { setSelectedImagePos(event.nativeEvent.position) }}
                                                style={{ width: "100%", height: normalize(200), marginTop: normalize(5) }}>
                                                {productImages.map((value, index) => {
                                                    
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => props.navigation.navigate("ProductImage", { productImages: productImages })}
                                                            key={index}
                                                            style={{ width: "100%", height: "100%", marginTop: normalize(10) }}>
                                                            <Image
                                                                resizeMode="contain"
                                                                style={{ width: "100%", height: "100%", }}
                                                                source={{ uri: value }} />
                                                        </TouchableOpacity>
                                                    )
                                                })}

                                            </ViewPager> : null}


                                        <View style={{ flexDirection: "row", position: "absolute", alignSelf: "center", bottom: normalize(4) }}>
                                        {
                                            productImages.map((value, index) => {

                                                return (
                                                    <View
                                                        style={{
                                                            height: normalize(7), width: normalize(7), borderRadius: normalize(4), backgroundColor: selectedImagePos == index? Color.blue: null,
                                                            borderWidth: normalize(1), borderColor: Color.blue, margin: normalize(2)
                                                        }} />
                                                )
                                            })
                                        }
                                        </View>
                                        

                                        <TouchableOpacity
                                            style={{ position: "absolute", bottom: normalize(9), right: normalize(10) }}
                                            onPress={() => {
                                                if (isSignedIn) {
                                                    setAddToWishlist(!isAddedToWishlist)
                                                    addToWishlist()
                                                } else {
                                                    showLogintAlert()
                                                }

                                            }}>
                                            <Image
                                                style={{ height: normalize(16), width: normalize(16), margin: normalize(5) }}
                                                source={isAddedToWishlist ? ImagePath.heart : ImagePath.heart_outline} />
                                        </TouchableOpacity>

                                        {loadImage ? <ActivityIndicator style={{ position: "absolute", alignSelf: "center", bottom: normalize(100) }} size="large" color={Color.navyBlue} /> : null}

                                    </View> : null}

                                <View style={{ flexDirection: "row", alignSelf: "center", }}>
                                    {colors.map((value, index) => {
                                        return (
                                            <View style={{ marginLeft: normalize(10), marginRight: normalize(10), alignSelf: "flex-end", }}>
                                                <TouchableOpacity
                                                    disabled={false}
                                                    key={index}
                                                    onPress={() => {
                                                        setSelectedColor(value)
                                                        getImages(value)
                                                    }}
                                                    style={{
                                                        padding: normalize(1),
                                                        borderRadius: normalize(10),
                                                        borderWidth: normalize(1), borderColor: selectedColor == value ? value : "#ffffff"
                                                    }}>
                                                    <View style={{
                                                        height: normalize(16), width: normalize(16),
                                                        borderRadius: normalize(10), backgroundColor: value,
                                                    }}>

                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                        )
                                    })}
                                </View>


                                {product ?

                                    <View style={{ width: "90%", marginTop: normalize(20) }}>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            color: Color.darkGrey,
                                        }}>{product.name}</Text>

                                        {product.offer_price ?
                                            <View style={{ flexDirection: "row", color: Color.navyBlue, marginTop: normalize(5) }}>
                                                <Text style={{
                                                    fontFamily: "Roboto-Bold", fontSize: normalize(20),
                                                    color: Color.navyBlue,
                                                }}>{`₹${product.offer_price}`}</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(14), marginLeft: normalize(10), color: Color.grey,
                                                    textDecorationLine: "line-through",
                                                }}>{`₹${product.price}`}</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(14), marginLeft: normalize(3), color: Color.red,
                                                }}>{`(${product.percentage_off}% Off)`}</Text>
                                            </View> :
                                            <Text style={{
                                                fontFamily: "Roboto-Bold", fontSize: normalize(20),
                                                color: Color.navyBlue, marginTop: normalize(5)
                                            }}>{`₹${product.price}`}</Text>}


                                        <Text style={{
                                            fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                            color: Color.darkGrey, marginTop: normalize(10)
                                        }}>{`Category: ${product.category.name}`}</Text>

                                        {/* <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            color: Color.darkGrey, marginTop: normalize(15)
                                        }}>Feature:</Text>
                                        <Text
                                            numberOfLines={3}
                                            style={{
                                                fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                                color: Color.darkGrey, marginTop: normalize(5)
                                            }}>{product.description ? product.description.replace(regex, '') : "No description available"}</Text> */}

                                        {/* <HtmlText style={{
                                            fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                            color: Color.darkGrey, marginTop: normalize(5)
                                        }}
                                            html={product.description ? product.description : "No description available"} /> */}

                                        {/* <TouchableOpacity style={{
                                            width: normalize(70), flexDirection: "row", flexWrap: "wrap", paddingTop: normalize(2), paddingBottom: normalize(2),
                                            paddingStart: normalize(5), paddingEnd: normalize(5),
                                            elevation: normalize(8), shadowColor: Color.black, shadowOpacity: 0.3,
                                            shadowRadius: normalize(9), shadowOffset: { height: 0, width: 0 },
                                            alignItems: "center", backgroundColor: Color.white, borderRadius: normalize(15),
                                            marginTop: normalize(10), marginBottom: normalize(10)

                                        }}
                                            onPress={() => { props.navigation.navigate("ProductDescription", { desc: product.description }) }}>
                                            <View style={{
                                                height: normalize(15), width: normalize(15),
                                                borderRadius: normalize(7), backgroundColor: Color.blue,
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Text style={{
                                                    fontFamily: "Roboto-Medium",
                                                    fontSize: normalize(12), color: Color.white,
                                                }}>i</Text>
                                            </View>
                                            <Text style={{
                                                fontSize: normalize(12), fontFamily: "Roboto-Medium",
                                                color: Color.darkGrey, marginBottom: normalize(1), marginLeft: normalize(3)
                                            }}>Details</Text>
                                        </TouchableOpacity> */}


                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            color: Color.darkGrey, marginTop: normalize(10)
                                        }}>Check Availibility:</Text>

                                        <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>

                                            <TextInput style={{
                                                width: "100%", borderBottomWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, fontFamily: "Roboto-Regular",
                                                fontSize: normalize(14), color: Color.darkGrey, marginTop: Platform.OS == "ios" ? normalize(15) : 0,
                                                paddingBottom: Platform.OS == "ios" ? normalize(5) : 0
                                            }}
                                                value={pincode}
                                                onChangeText={(text) => setPincode(text)}
                                                placeholder={"Pincode"}
                                                placeholderTextColor={Color.grey}
                                                selectionColor={Color.blue}
                                                numberOfLines={1}
                                                keyboardType="number-pad"
                                                maxLength={9} />

                                            <TouchableOpacity
                                                onPress={() => checkPincode()}
                                                style={{
                                                    borderRadius: normalize(5), padding: normalize(4),
                                                    paddingLeft: normalize(10), paddingRight: normalize(10),
                                                    backgroundColor: Color.blue, right: 0, position: "absolute"
                                                }}>
                                                {pincodeCheking ? <ActivityIndicator size="small" color={Color.white} /> :
                                                    <Text style={{
                                                        color: Color.white,
                                                        fontFamily: "Roboto-Medium",
                                                        fontSize: normalize(12)
                                                    }}>
                                                        Check
                                                    </Text>}

                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: normalize(35) }}>
                                            <View style={{ alignItems: "center" }}>
                                                <View style={{
                                                    height: normalize(35), width: normalize(35), justifyContent: "center",
                                                    alignItems: "center", borderRadius: normalize(18), borderWidth: normalize(1),
                                                    borderColor: Color.grey
                                                }}>
                                                    <Image
                                                        style={{
                                                            height: normalize(20), width: normalize(20)
                                                        }}
                                                        resizeMode="contain"
                                                        source={ImagePath.warranty} />
                                                </View>

                                                { }
                                                <Text style={{
                                                    fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>{product.warranty_in_year != null ? product.warranty_in_year : "12"} Months</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>Warranty</Text>
                                            </View>

                                            <View style={{ alignItems: "center" }}>
                                                <View style={{
                                                    height: normalize(35), width: normalize(35), justifyContent: "center",
                                                    alignItems: "center", borderRadius: normalize(18), borderWidth: normalize(1),
                                                    borderColor: Color.grey
                                                }}>
                                                    <Image
                                                        style={{
                                                            height: normalize(20), width: normalize(20)
                                                        }}
                                                        resizeMode="contain"
                                                        source={ImagePath.cancel_order} />
                                                </View>

                                                <Text style={{
                                                    fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>Easy</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                                    color: Color.darkGrey,
                                                }}>Cancel</Text>
                                            </View>

                                            <View style={{ alignItems: "center" }}>
                                                <View style={{
                                                    height: normalize(35), width: normalize(35), justifyContent: "center",
                                                    alignItems: "center", borderRadius: normalize(18), borderWidth: normalize(1),
                                                    borderColor: Color.grey
                                                }}>
                                                    <Image
                                                        style={{
                                                            height: normalize(25), width: normalize(25)
                                                        }}
                                                        resizeMode="contain"
                                                        source={ImagePath.delivery} />
                                                </View>

                                                <Text style={{
                                                    fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>Early</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>Shipping</Text>
                                            </View>
                                        </View>

                                    </View> : null}

                                {product ?
                                    <View style={{ width: "100%" }}>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setFeature(!feature)
                                                if (!feature) {
                                                    scrollViewRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            style={{
                                                width: "100%", flexDirection: "row", justifyContent: "space-between",
                                                alignItems: "center", borderBottomWidth: normalize(1), borderTopWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, borderTopColor: Color.darkGrey, paddingTop: normalize(10),
                                                paddingBottom: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10), marginTop: normalize(15)
                                            }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                color: Color.darkGrey,
                                            }}>FEATURE</Text>

                                            <Image
                                                style={{ width: normalize(16), height: normalize(16) }}
                                                source={feature ? ImagePath.up_arrow : ImagePath.down_arrow} />

                                        </TouchableOpacity>

                                        {feature && product.description ? <ScrollView
                                            nestedScrollEnabled={true}
                                            style={{
                                                width: "100%", height: normalize(130),
                                                borderBottomWidth: normalize(1), borderTopColor: Color.darkGrey
                                            }}>
                                            <HTML source={{ html: product.description }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} />
                                        </ScrollView> : null}


                                        <TouchableOpacity
                                            onPress={() => {
                                                setProperties(!properties)
                                                if (!properties) {
                                                    scrollViewRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            style={{
                                                width: "100%", flexDirection: "row", justifyContent: "space-between",
                                                alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey, paddingTop: normalize(10),
                                                paddingBottom: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10),
                                            }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                color: Color.darkGrey,
                                            }}>PROPERTIES</Text>

                                            <Image
                                                style={{ width: normalize(16), height: normalize(16) }}
                                                source={properties ? ImagePath.up_arrow : ImagePath.down_arrow} />

                                        </TouchableOpacity>

                                        {properties ? <ScrollView
                                            nestedScrollEnabled={true}
                                            style={{
                                                width: "100%", height: normalize(130),
                                                borderBottomWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, padding: normalize(15)
                                            }}>
                                            {product.properties ?
                                                <HTML source={{ html: product.properties }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} /> : null}

                                        </ScrollView> : null}

                                        <TouchableOpacity
                                            onPress={() => {
                                                setAssemble(!assemble)
                                                if (!assemble) {
                                                    scrollViewRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            style={{
                                                width: "100%", flexDirection: "row", justifyContent: "space-between",
                                                alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey, paddingTop: normalize(10),
                                                paddingBottom: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10),
                                            }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                color: Color.darkGrey,
                                            }}>ASSEMBLY</Text>

                                            <Image
                                                style={{ width: normalize(16), height: normalize(16) }}
                                                source={assemble ? ImagePath.up_arrow : ImagePath.down_arrow} />

                                        </TouchableOpacity>

                                        {assemble ? <ScrollView
                                            nestedScrollEnabled={true}
                                            style={{
                                                width: "100%", height: normalize(130), borderBottomWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, padding: normalize(15)
                                            }}>
                                            {product.assembly ?
                                                <HTML source={{ html: product.assembly }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} /> : null}

                                        </ScrollView> : null}

                                        <TouchableOpacity
                                            onPress={() => {
                                                setCareInstruction(!careInstruction)
                                                if (!careInstruction) {
                                                    scrollViewRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            style={{
                                                width: "100%", flexDirection: "row", justifyContent: "space-between",
                                                alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey, paddingTop: normalize(10),
                                                paddingBottom: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10),
                                            }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                color: Color.darkGrey,
                                            }}>CARE INSTRUCTION</Text>

                                            <Image
                                                style={{ width: normalize(16), height: normalize(16) }}
                                                source={careInstruction ? ImagePath.up_arrow : ImagePath.down_arrow} />

                                        </TouchableOpacity>

                                        {careInstruction ? <ScrollView
                                            nestedScrollEnabled={true}
                                            style={{
                                                width: "100%", height: normalize(130),
                                                borderBottomWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, padding: normalize(15)
                                            }}>
                                            {product.care_instructions ?
                                                <HTML source={{ html: product.care_instructions }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} /> : null}

                                        </ScrollView> : null}


                                        <TouchableOpacity
                                            onPress={() => {
                                                setRefund(!refund)
                                                if (!refund) {
                                                    scrollViewRef.current.scrollToEnd({ animated: true })
                                                }
                                            }}
                                            style={{
                                                width: "100%", flexDirection: "row", justifyContent: "space-between",
                                                alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey, paddingTop: normalize(10),
                                                paddingBottom: normalize(10), paddingLeft: normalize(10), paddingRight: normalize(10),
                                            }}>
                                            <Text style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                color: Color.darkGrey,
                                            }}>RETURN AND REFUND</Text>

                                            <Image
                                                style={{ width: normalize(16), height: normalize(16) }}
                                                source={refund ? ImagePath.up_arrow : ImagePath.down_arrow} />

                                        </TouchableOpacity>

                                        {refund ? <ScrollView
                                            nestedScrollEnabled={true}
                                            style={{
                                                width: "100%", height: normalize(130),
                                                borderBottomWidth: normalize(1),
                                                borderBottomColor: Color.darkGrey, padding: normalize(15)
                                            }}>
                                            {product.returns ?
                                                <HTML source={{ html: product.returns }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} /> : null}

                                        </ScrollView> : null}


                                    </View> : null}
                            </View>
                            <View style={{ height: normalize(20) }}></View>
                            <View style={{ height: normalize(20) }}></View>
                            <View style={{ height: normalize(20) }}></View>
                            <View style={{ height: normalize(20) }}></View>

                        </ScrollView>
                        <View style={{
                            flexDirection: "row", width: "100%", height: normalize(40), bottom: 0,
                            position: "absolute", backgroundColor: Color.white
                        }}>
                            <TouchableOpacity
                                disabled={loading}
                                style={{
                                    width: "50%", height: normalize(40),
                                    alignItems: "center", justifyContent: "center", borderTopWidth: normalize(1),
                                    borderTopColor: Color.navyBlue
                                }}
                                onPress={() => {
                                    if (isSignedIn) {
                                        addToCart()
                                    } else {
                                        showLogintAlert()
                                    }
                                }}>
                                {loading ? <ActivityIndicator size="small" color={Color.navyBlue} /> :
                                    <Text style={{
                                        fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                        color: Color.navyBlue
                                    }}>ADD TO CART</Text>}

                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={loading}
                                onPress={() => {
                                    if (isSignedIn) {
                                        buyNow()
                                    } else {
                                        showLogintAlert()
                                    }
                                }}
                                style={{ width: "50%", height: normalize(40), }}>
                                <ImageBackground
                                    style={{
                                        height: "100%", width: "100%", alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    source={ImagePath.button_gradient}>
                                    <Text style={{
                                        fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                        color: Color.white
                                    }}>BUY NOW</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </View>
    )
}