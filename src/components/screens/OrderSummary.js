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
import { getUserId, getToken, getAddress, getUserName, getPhone, getCompany, getGST, getPincode, getEmail, getCoupon, setCoupon } from "../../utils/storage";
import { showAlert } from "../../utils/Utils"
import RazorpayCheckout from 'react-native-razorpay';

export default function OrderSummary(props) {

    let cartArray = props.route.params.cartList // useSelector(state => state.product.cart)
    let cartVal = props.route.params.cartList
    let productId = props.route.params.productId

    const [cartData, setCart] = useState([])
    const [cartDataWithoutDiscount, setCartDataWithoutDiscount] = useState(props.route.params.cartList)
    const [totalPriceNoDiscount, setTotalPriceWithNoDiscount] = useState(getProductPriceWithoutDiscount())
    const [totalPriceNoDiscountNoOffer, setTotalPriceWithNoDiscountNoOffer] = useState(getProductPriceWithoutDiscountWithoutOffer())
    const dispatch = useDispatch()
    const [isCod, setCod] = useState(false)
    const [loading, setLoading] = useState(false)
    const [couponCheking, setCouponCheking] = useState("")
    const [address, setAddress] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [isOrderPlacable, setOrderPlacable] = useState(false)

    useEffect(() => {
        // getOrderList()
        setCoupon({})
        setTotalPriceWithNoDiscountNoOffer(getProductPriceWithoutDiscountWithoutOffer())
        setTotalPriceWithNoDiscount(getProductPriceWithoutDiscount())
        setCartDataWithoutDiscount(props.route.params.cartList)
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            initialize()
        });
        return unsubscribe
    }, [props.navigation])


    async function initialize() {
        let addressVal = await getAddress()
        let name = await getUserName()
        let phoneVal = await getPhone()
        let pincode = await getPincode()
        console.log("JJ", cartArray)
        // if (cartData.length == 0) {
        //     setCart(cartArray)
        // }
        if (productId == undefined || productId == null) {
            await getCartList()
        } else {
            await getSingleProduct()
        }

        if (addressVal != null && addressVal != undefined && addressVal.length > 0) {
            setAddress(addressVal)
        }
        setName(name)
        setPhone(phoneVal)
        if (pincode != null && pincode != undefined && pincode.length > 0) {
            checkPincode(pincode)
        }


    }

    async function getCartList() {

        let token = await getToken()
        if (token != null && token != undefined && token.length > 0) {
            try {
                let couponData = await getCoupon()
                if (couponData != null)
                    setCouponCheking(true)
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
                let response = await getRequest(`user/cart/list`, header)
                console.log("RESPONSE", response)
                if (response.success) {
                    props.navigation.setParams({ cartList: response.data })
                    setCart(response.data)
                    checkCoupon(response.data)
                }

            } catch (error) {
                console.log("ERROR", error)
            }
        }
        setCouponCheking(false)

    }

    async function getSingleProduct() {
        let token = await getToken()
        if (token != null && token != undefined && token.length > 0) {
            try {
                let couponData =  await getCoupon()
                if (couponData != null)
                    setCouponCheking(true)
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
                console.log("RESPONSE", response)
                let response = await getRequest(`user/product/${productId}/list`)
                let product = response.data
                let cart = []
                let tempProduct = product
                tempProduct.quantity = 1
                tempProduct.vendor_id = product.vendor_id
                cart.push(tempProduct)
                setCart(cart)
                checkCoupon(cart)

            } catch (error) {
                console.log("ERROR", error)
            }
        }
        setCouponCheking(false)

    }


    async function checkPincode(pincode) {

        if (pincode.length > 0) {
            try {
                let response = await getRequest(`user/pincode/${pincode}/list`)
                if (response.success) {
                    setOrderPlacable(true)
                } else {
                    setOrderPlacable(false)
                    showAlert("Product is not available on this pincode")
                }
            } catch (error) {
                alert(error)
            }
        } else {
            showAlert("Insert a pincode to check")
        }
    }

    async function checkCoupon(cartArr) {
        setCouponCheking(true)

        try {
            let couponData = await getCoupon()
            console.log("Applied Coupon: ", couponData)
            if (couponData != null) {
                let couponCode = couponData.name
                let token = await getToken()
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
                let response = await postRequest("user/coupon/check", { name: couponCode }, header)
                console.log(response)
                if (response.success) {
                    console.log("RESPONSE", response)

                    if (response.data.type == "Fixed") {
                        setDiscount(response.data.value)
                        updateCartOnDiscount(response.data.value, cartArr)
                    } else {
                        console.log("Percent Discount1", response.data.value)
                        console.log("Product Price", getProductPrice())
                        let discount = (getProductPrice2() * response.data.value) / 100
                        console.log("Percent Discount2", discount)
                        discount = discount.toFixed(2)
                        discount = (discount % 1 != 0 ? discount : Math.floor(discount))
                        console.log("Percent Discount", discount)
                        setDiscount(discount)
                        updateCartOnDiscount(discount, cartArr)
                    }
                    setCouponCode(couponCode)
                    showAlert(response.data.description)
                } else {
                    alert("Coupon not valid")
                }
            }
        } catch (error) {
            alert(error.message)
        }
        setCouponCheking(false)
    }

    function updateCartOnDiscount(discount, cartArr) {
        console.log("Discount Amount: ", discount)
        let newCart = []
        const tempCartData = cartArr
        console.log("Cart Date: ", cartArr)
        let discountedValue = discount
        for (let i = 0; i < tempCartData.length; i++) {
            let item = tempCartData[i]
            if (discountedValue > 0) {
                let discountedValueRem = item.offer_price ? (item.offer_price - discountedValue) : (item.price - discountedValue)
                if (discountedValueRem >= 0) {
                    item.offer_price ?
                        item.offer_price = discountedValueRem :
                        item.price = discountedValueRem

                    item.discount = discountedValue
                    discountedValue = 0
                } else {
                    discountedValue = (-1) * discountedValueRem
                    item.offer_price ?
                        item.offer_price = 0 :
                        item.price = 0
                    item.discount = item.offer_price ? item.offer_price : item.price
                }
            }
            console.log('CART_ITEM', item)
            newCart.push(item)
        }
        setCart(newCart)

    }

    async function refreshCartList() {

        setCoupon({})
        setCouponCheking(true)
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
                    props.navigation.setParams({ cartList: response.data })
                    // cartVal = response.data
                    setCart(response.data)
                    setCouponCode("")
                    setDiscount(0)
                    dispatch(addToCartRequest(response.data))
                }

            } catch (error) {
                console.log("ERROR", error)
            }
        }
        setCouponCheking(false)

    }

    async function removeDiscountForSingleItem(discount) {
        setCoupon({})
        setCouponCheking(true)
        try {
            let response = await getRequest(`user/product/${productId}/list`)
            console.log("RESPONSE", response)
            let product = response.data
            let cart = []
            let tempProduct = product
            tempProduct.quantity = 1
            tempProduct.vendor_id = product.vendor_id
            cart.push(tempProduct)
            setCart(cart)
            setCouponCode("")
            setDiscount(0)

        } catch (error) {
            console.log("ERROR", error)
        }
        setCouponCheking(false)

    }



    async function placeOrder(transactionId) {
        setLoading(true)
        var userId = parseInt(await getUserId())
        let cartList = cartData

        let gstNumber = await getGST()
        let company = await getCompany()
        let gst_number = null
        let company_name = null
        if (gstNumber != null && gstNumber != undefined && gstNumber.length > 0) {
            gst_number = gstNumber
            company_name = company
        }

        let orderRequest = {
            order: []
        }
        for (let i = 0; i < cartList.length; i++) {
            orderRequest.order.push({
                product_id: cartList[i].product_id,
                vendor_id: cartList[i].vendor_id,
                quantity: cartList[i].quantity,
                product_name: cartList[i].name,
                product_image: cartList[i].image,
                product_price: cartList[i].offer_price ? cartList[i].offer_price : cartList[i].price,
                full_name: name,
                address_id: address,
                phone: phone,
                payment_type: isCod ? "cod" : "razorpay",
                transaction_id: transactionId,
                gst_number: gst_number,
                company_name: company_name
            })
        }

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
            alert(error.message)
        }
        setLoading(false)

    }

    async function openRazorpay() {
        let username = await getUserName()
        let email = await getEmail()
        let phone = await getPhone()
        var options = {
            description: 'Order price',
            image: "https://buildboard-furnishers.web.app/assets/images/logo.png",
            currency: 'INR',
            key: 'rzp_live_NxP4DQL6CRU8MO', //'rzp_test_NIv9pU24SLVgtS',
            amount: `${(getProductPrice()) * 100}`,
            name: 'Buildboard Furnishers',
            prefill: {
                email: email,
                name: username,
                contact: phone
            },
            theme: { color: Color.navyBlue },
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            // alert(`Success: ${data.razorpay_payment_id}`);
            placeOrder(data.razorpay_payment_id)
        }).catch((error) => {
            // handle failure
            alert("Your payment is cancelled");
        });
    }

    function cartItem(data) {

        return (
            <View style={{
                width: "100%", marginTop: normalize(10), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                borderBottomWidth: normalize(1), borderBottomColor: data.index == cartData.length - 1 ? "#00000000" : Color.grey,
                alignItems: "flex-start"
            }}>
                <Image
                    style={{
                        width: "30%", height: normalize(60), borderRadius: normalize(1), borderWidth: normalize(1),
                        borderColor: Color.grey, backgroundColor: Color.white, padding: normalize(1)
                    }}
                    resizeMode="contain"
                    source={{ uri: data.item.image }} />
                <View style={{ width: "50%", paddingTop: normalize(3), marginLeft: normalize(15) }}>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                        color: Color.navyBlue
                    }}
                    >{data.item.name}</Text>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Bold", fontSize: normalize(16),
                        color: Color.navyBlue, marginTop: normalize(2)
                    }}>{data.item.offer_price ? `₹${data.item.offer_price}` : `₹${data.item.price}`}</Text>

                    {data.item.discount != undefined ?
                        <Text style={{
                            width: "100%", fontFamily: "Roboto-Regular", fontSize: normalize(12),
                            color: Color.darkGrey, marginTop: normalize(3), marginLeft: normalize(1)
                        }}>{`Discount: ₹${data.item.discount}`}</Text> : null}

                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Regular", fontSize: normalize(12),
                        color: Color.darkGrey, marginTop: normalize(3), marginLeft: normalize(1)
                    }}
                    >{`Quantity: ${data.item.quantity}`}</Text>

                </View>

            </View>
        )
    }

    function getProductPrice() {
        let price = 0;
        for (let i = 0; i < cartData.length; i++) {
            price += (cartData[i].offer_price ? cartData[i].offer_price : cartData[i].price) * cartData[i].quantity
        }
        return price
    }

    function getProductPrice2() {
        let price = 0;
        for (let i = 0; i < cartArray.length; i++) {
            price += (cartArray[i].offer_price ? cartArray[i].offer_price : cartArray[i].price) * cartArray[i].quantity
        }
        return price
    }

    function getProductPriceWithoutDiscount() {
        let price = 0;
        for (let i = 0; i < cartArray.length; i++) {
            price += (cartArray[i].offer_price ? cartArray[i].offer_price : cartArray[i].price) * cartArray[i].quantity
        }
        return price
    }

    function getProductPriceWithoutDiscountWithoutOffer() {
        let price = 0;
        for (let i = 0; i < cartArray.length; i++) {
            price += cartArray[i].price * cartArray[i].quantity
        }
        return price
    }

    function getCartWithoutDiscount() {
        let cart = []
        cartArray.map((value, index) => {
            cart.push(value)
        })
        return cart
    }

    function getTotalProductQuantity(params) {
        let quantity = 0
        for (let i = 0; i < cartArray.length; i++) {
            quantity = quantity + cartArray[i].quantity
        }
        return quantity
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
                            data={cartData}
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
                            {address.length > 0 ?
                                <Text style={{
                                    width: "80%", fontSize: normalize(12), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular", marginTop: normalize(2)
                                }}>{address}</Text> : null}


                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("AddressList", { isAccount: false })}
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
                                }}>{address.length > 0 ? "CHANGE" : "ADD"}</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{
                            width: "90%", alignSelf: "center", backgroundColor: Color.white, padding: normalize(15),
                            borderRadius: normalize(10), elevation: normalize(8), shadowColor: Color.black,
                            shadowOpacity: 0.3, shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                            alignItems: "flex-start", marginTop: normalize(10)
                        }}>


                            {discount == 0 ?
                                <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>

                                    <Text style={{
                                        width: "100%",
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(14), color: Color.darkGrey, marginTop: Platform.OS == "ios" ? normalize(15) : 0,

                                    }}
                                        // returnKeyType="go"
                                        // onSubmitEditing={() => {
                                        //     checkCoupon(couponCode)
                                        // }}
                                        value={couponCode}
                                        // onChangeText={(text) => setCouponCode(text)}
                                        // placeholder={"Coupon code"}
                                        // placeholderTextColor={Color.grey}
                                        selectionColor={Color.blue}
                                        numberOfLines={1}>Choose a coupon code</Text>

                                    <TouchableOpacity
                                        disabled={couponCheking || loading}
                                        style={{
                                            borderRadius: normalize(5), padding: normalize(4),
                                            paddingLeft: normalize(10), paddingRight: normalize(10),
                                            backgroundColor: Color.blue, right: 0, position: "absolute"
                                        }}
                                        onPress={() => props.navigation.navigate("Coupon")}>
                                        {couponCheking ? <ActivityIndicator size="small" color={Color.white} /> :
                                            <Text style={{
                                                color: Color.white,
                                                fontFamily: "Roboto-Medium",
                                                fontSize: normalize(12)
                                            }}>Add</Text>}

                                    </TouchableOpacity>
                                </View> :
                                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Regular", color: Color.grey }}>
                                        Coupon applied  <Text style={{ fontSize: normalize(13), fontFamily: "Roboto-Bold", color: Color.navyBlue }}>
                                            {couponCode}
                                        </Text>
                                    </Text>

                                    <TouchableOpacity
                                        disabled={couponCheking}
                                        style={{
                                            borderRadius: normalize(5), padding: normalize(4),
                                            paddingLeft: normalize(10), paddingRight: normalize(10),
                                            backgroundColor: Color.blue,
                                        }}
                                        onPress={() => productId == undefined || productId == null ? refreshCartList() : removeDiscountForSingleItem()}>
                                        {couponCheking ? <ActivityIndicator size="small" color={Color.white} /> :
                                            <Text style={{
                                                color: Color.white,
                                                fontFamily: "Roboto-Medium",
                                                fontSize: normalize(12)
                                            }}>Remove</Text>}

                                    </TouchableOpacity>
                                </View>}

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
                                }}>{`MRP (${getTotalProductQuantity()} items):`}</Text>

                                <Text style={{
                                    fontSize: normalize(14), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginTop: normalize(10), marginLeft: normalize(10)
                                }}>{`₹${totalPriceNoDiscountNoOffer}`}</Text>
                            </View>

                            <View style={{
                                alignSelf: "stretch", margin: normalize(10), marginTop: normalize(1), flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <Text style={{
                                    fontSize: normalize(12), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular", marginLeft: normalize(10)
                                }}>{`Offer Price (${getTotalProductQuantity()} items):`}</Text>

                                <Text style={{
                                    fontSize: normalize(14), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                                }}>{`₹${totalPriceNoDiscount}`}</Text>
                            </View>

                            <View style={{
                                alignSelf: "stretch", margin: normalize(10), marginTop: normalize(1), flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <Text style={{
                                    fontSize: normalize(12), color: Color.darkGrey,
                                    fontFamily: "Roboto-Regular", marginLeft: normalize(10)
                                }}>Coupon discount: </Text>

                                <Text style={{
                                    fontSize: normalize(14), color: Color.navyBlue,
                                    fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                                }}>{`₹${discount}`}</Text>
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
                                }}>{`₹${getProductPrice()}`}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("GstForm")}
                            style={{
                                width: "90%", alignSelf: "center", backgroundColor: Color.white, padding: normalize(15),
                                borderRadius: normalize(10), elevation: normalize(8), shadowColor: Color.black,
                                shadowOpacity: 0.3, shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                                alignItems: "center", marginTop: normalize(10)
                            }}>
                            <Text style={{ fontFamily: "Roboto-Regular", fontSize: normalize(12) }}>Use <Text style={{ fontFamily: "Roboto-Bold" }}>GSTIN</Text> for bussiness purchase(Optional)</Text>
                        </TouchableOpacity>

                        <View style={{
                            width: "90%", alignSelf: "center", backgroundColor: Color.white, padding: normalize(15),
                            borderRadius: normalize(10), elevation: normalize(8), shadowColor: Color.black,
                            shadowOpacity: 0.3, shadowRadius: normalize(10), shadowOffset: { height: 0, width: 0 },
                            marginTop: normalize(10), marginBottom: normalize(90)
                        }}>

                            <Text style={{ fontSize: normalize(15), fontFamily: "Roboto-Medium", color: Color.darkGrey }}>Select Payment Option</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setCod(true);
                                }}
                                style={{ width: "100%", flexDirection: "row", alignItems: "center", marginTop: normalize(10) }}>
                                {Platform.OS == "android" ?
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Checkbox
                                            disabled={loading}
                                            status={isCod ? 'checked' : 'unchecked'}
                                        />
                                        <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Regular", color: Color.darkGrey }}>Pay with Cash on Delivery</Text>
                                    </View> :
                                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Regular", color: Color.darkGrey }}>Pay with Cash on Delivery</Text>
                                        <Checkbox
                                            disabled={loading}
                                            status={isCod ? 'checked' : 'unchecked'}
                                        />
                                    </View>}

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setCod(false);
                                }}
                                style={{ width: "100%", flexDirection: "row", alignItems: "center", marginTop: normalize(2) }}>
                                {Platform.OS == "android" ?
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Checkbox
                                            disabled={loading}
                                            status={!isCod ? 'checked' : 'unchecked'}
                                        />
                                        <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Regular", color: Color.darkGrey }}>Pay with Card or UPI</Text>
                                    </View> :
                                    <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Regular", color: Color.darkGrey }}>Pay with Card or UPI</Text>
                                        <Checkbox
                                            disabled={loading}
                                            status={!isCod ? 'checked' : 'unchecked'}
                                        />
                                    </View>}

                            </TouchableOpacity>

                        </View>


                    </ScrollView>

                    {isOrderPlacable ?
                        <View style={{
                            width: "100%", flexDirection: "row", padding: normalize(10), alignItems: "center",
                            justifyContent: "space-between", backgroundColor: Color.white, elevation: normalize(9),
                            position: "absolute", bottom: 0
                        }}>
                            <Text style={{
                                fontSize: normalize(18), color: Color.navyBlue, width: "35%",
                                fontFamily: "Roboto-Medium", marginLeft: normalize(10)
                            }}>{`₹${getProductPrice()}`}</Text>


                            <TouchableOpacity
                                disabled={loading}
                                onPress={() => {
                                    if (isCod)
                                        placeOrder(null)
                                    else openRazorpay()
                                }}
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
                        </View> : null}

                </View>
            </SafeAreaView>
        </View >
    )
}