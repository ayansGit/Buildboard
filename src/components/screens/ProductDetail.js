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
    ImageBackground,
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
    const [product, setProduct] = useState(null)
    const [assemble, setAssemble] = useState(false)
    const [careInstruction, setCareInstruction] = useState(false)
    const [feature, setFeature] = useState(false)
    const [isAddedToWishlist, setAddToWishlist] = useState(false)
    const [pincode, setPincode] = useState("")
    const [pincodeCheking, setPincodeCheking] = useState("")
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
            let response = await getRequest(`user/product/${props.route.params.productId}/details`)
            console.log("RESPONSE", response)
            setProduct(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
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
                    vendor_id: product.product_id,
                    product_id: product.product_id,
                    quantity: 1,
                    image: product.image
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
        let tempProduct = product
        tempProduct.quantity = 1
        tempProduct.vendor_id = product.product_id
        cart.push(tempProduct)
        dispatch(addToCartRequest(cart))
        props.navigation.navigate("OrderSummary", { cartList: cart })
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
        }else{
            showAlert("Insert a pincode to check")
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
                    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            ref={scrollViewRef}
                            style={{ width: "100%" }}>

                            <View style={{ width: "100%", alignItems: "center" }}>

                                {product ?
                                    <View style={{
                                        width: "90%", height: normalize(200), alignSelf: "center",
                                        elevation: normalize(8), shadowColor: Color.black, shadowOpacity: 0.3,
                                        shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                                        backgroundColor: Color.white, marginTop: normalize(15), marginBottom: normalize(20)
                                    }}>
                                        <ViewPager
                                            pageMargin={normalize(5)}
                                            initialPage={0}
                                            style={{
                                                width: "100%", height: "100%", backgroundColor: Color.white
                                            }}>
                                            <View
                                                collapsable={false}
                                                key={0}
                                                style={{
                                                    flex: 1, alignItems: "center", alignSelf: "center",
                                                }}>
                                                <Image
                                                    style={{ width: "100%", height: "100%", }}
                                                    source={{ uri: product.image }}
                                                    resizeMode="contain" />
                                            </View>
                                        </ViewPager>

                                        <View style={{ flexDirection: "row", alignSelf: "center", marginTop: normalize(10) }}>
                                            <TouchableOpacity style={{
                                                height: normalize(15), width: normalize(15),
                                                borderRadius: normalize(10), backgroundColor: Color.black, margin: normalize(5)
                                            }} />
                                            <TouchableOpacity style={{
                                                height: normalize(15), width: normalize(15),
                                                borderRadius: normalize(10), backgroundColor: Color.red, margin: normalize(5)
                                            }} />
                                            <TouchableOpacity style={{
                                                height: normalize(15), width: normalize(15),
                                                borderRadius: normalize(10), backgroundColor: Color.navyBlue, margin: normalize(5)
                                            }} />
                                            <TouchableOpacity style={{
                                                height: normalize(15), width: normalize(15),
                                                borderRadius: normalize(10), backgroundColor: Color.black, margin: normalize(5)
                                            }} />
                                        </View>

                                        <TouchableOpacity
                                            style={{ position: "absolute", bottom: normalize(9), right: normalize(10) }}
                                            onPress={() => {
                                                setAddToWishlist(!isAddedToWishlist)
                                            }}>
                                            <Image
                                                style={{ height: normalize(16), width: normalize(16), margin: normalize(5) }}
                                                source={isAddedToWishlist ? ImagePath.heart : ImagePath.heart_outline} />
                                        </TouchableOpacity>
                                    </View> : null}


                                {product ?

                                    <View style={{ width: "90%", marginTop: normalize(20) }}>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            color: Color.darkGrey,
                                        }}>{product.name}</Text>

                                        <Text style={{
                                            fontFamily: "Roboto-Bold", fontSize: normalize(20),
                                            color: Color.navyBlue, marginTop: normalize(5)
                                        }}>{`₹${product.price}`}</Text>
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

                                                <Text style={{
                                                    fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>12 Months</Text>
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
                                                }}>Ships in</Text>
                                                <Text style={{
                                                    fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                                    color: Color.darkGrey
                                                }}>1 Day</Text>
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

                                        {feature && product.description ? <ScrollView style={{
                                            width: "100%", height: normalize(130),
                                            borderBottomWidth: normalize(1), borderTopColor: Color.darkGrey
                                        }}>
                                            <HTML source={{ html: product.description }} contentWidth={contentWidth} containerStyle={{ marginLeft: normalize(10), marginRight: normalize(10) }} />
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

                                        {assemble ? <ScrollView style={{
                                            width: "100%", height: normalize(130), borderBottomWidth: normalize(1),
                                            borderBottomColor: Color.darkGrey, padding: normalize(15)
                                        }}>
                                            <Text style={{ fontFamily: "Roboto-Regular", fontSize: normalize(14) }}></Text>
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

                                        {careInstruction ? <ScrollView style={{
                                            width: "100%", height: normalize(130),
                                            borderBottomWidth: normalize(1),
                                            borderBottomColor: Color.darkGrey, padding: normalize(15)
                                        }}>
                                            <Text style={{ fontFamily: "Roboto-Regular", fontSize: normalize(14) }}></Text>
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
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}