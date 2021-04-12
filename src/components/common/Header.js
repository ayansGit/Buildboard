import React, { useState, useEffect } from "react"
import { View, Image, TouchableOpacity, Text, Platform, Alert } from "react-native"
import Color from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import PropTypes from "prop-types";
import { useSelector, connect } from 'react-redux'

var status = ""

function Header(props) {

    var cart = []

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
        <View style={{ width: "100%", height: normalize(50), paddingLeft: normalize(5), paddingRight: normalize(5) }}>
            {
                props.containNavDrawer ?
                    <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                        <Text style={{ width: "100%", fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue, position: "absolute", textAlign: "center" }}>{props.title}</Text>

                        <TouchableOpacity style={{
                            width: normalize(40), height: normalize(40),
                            padding: normalize(10)
                        }}
                            onPress={() => {
                                if (!props.loading) {
                                    if (props.onDrawerButtonPressed) {
                                        props.onDrawerButtonPressed()
                                    }
                                }
                            }}>
                            <Image
                                style={{ width: "100%", height: "100%" }}
                                source={ImagePath.navButton}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {props.showWishlist ? <TouchableOpacity
                                onPress={() => {
                                    if (!props.loading)
                                        props.navigation.navigate("Wishlist")
                                }}
                                style={{ width: normalize(35), height: normalize(35), padding: normalize(5), marginRight: normalize(8), marginBottom: normalize(3) }}>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={ImagePath.heart_outline_blue}
                                    resizeMode="contain" />
                            </TouchableOpacity> : null}


                            <TouchableOpacity
                                onPress={() => {
                                    if (!props.loading){
                                        if(props.isSignedIn){
                                            props.navigation.navigate("TrackingList")
                                        }else{
                                            showLogintAlert()
                                        }
                                    }
                                        
                                }}
                                style={{ width: normalize(45), height: normalize(45), padding: normalize(5), marginRight: normalize(5), marginBottom: normalize(5) }}>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={ImagePath.tracking}
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (!props.loading)
                                        props.navigation.navigate("Cart")
                                }}
                                style={{ width: normalize(35), height: normalize(35), padding: normalize(5), marginEnd: normalize(5) }}>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={ImagePath.shoppingCart}
                                    resizeMode="contain" />
                                {props.product.quantity > 0 ?
                                    <Text
                                        style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(10), color: Color.white,
                                            backgroundColor: Color.red, borderRadius: normalize(10), paddingLeft: normalize(6),
                                            paddingRight: normalize(6), paddingTop: Platform.OS == "ios" ? normalize(4) : normalize(2),
                                            paddingBottom: Platform.OS == "ios" ? normalize(4) : normalize(2),
                                            position: "absolute", top: normalize(2), right: 0, overflow: "hidden"
                                        }}>{props.product.quantity}</Text> : null}
                            </TouchableOpacity>
                        </View>


                    </View> :
                    <View
                        style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity style={{
                                width: normalize(40), height: normalize(40),
                                padding: normalize(10)
                            }}
                                onPress={() => {
                                    if (!props.loading) {
                                        if (props.onBackPressed) {
                                            props.onBackPressed()
                                        }
                                    }
                                }}>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={ImagePath.leftArrow}
                                    resizeMode="contain" />
                            </TouchableOpacity>

                            <Text style={{ fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue, marginLeft: normalize(20) }}>{props.title}</Text>
                        </View>


                        {props.showCart ?
                            <TouchableOpacity
                                onPress={() => {
                                    if (!props.loading)
                                        props.navigation.navigate("Cart")
                                }}
                                style={{ width: normalize(35), height: normalize(35), padding: normalize(5), marginEnd: normalize(5) }}>
                                <Image
                                    style={{ width: "100%", height: "100%" }}
                                    source={ImagePath.shoppingCart}
                                    resizeMode="contain" />
                                {props.product.quantity > 0 ?
                                    <Text style={{
                                        fontFamily: "Roboto-Medium", fontSize: normalize(10), color: Color.white,
                                        backgroundColor: Color.red, borderRadius: normalize(10), paddingLeft: normalize(6),
                                        paddingRight: normalize(6), paddingTop: Platform.OS == "ios" ? normalize(4) : normalize(2),
                                        paddingBottom: Platform.OS == "ios" ? normalize(4) : normalize(2),
                                        position: "absolute", top: normalize(2), right: 0, overflow: "hidden"
                                    }}>{props.product.quantity}</Text> : null}

                            </TouchableOpacity> : null}

                        {props.showOk ?
                            <TouchableOpacity
                                onPress={() => {
                                    if (!props.loading)
                                        if (props.onOkPressed)
                                            props.onOkPressed()
                                }}
                                style={{ padding: normalize(5), marginEnd: normalize(5) }}>

                                <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(12), color: Color.navyBlue }}>OK</Text>

                            </TouchableOpacity> : null}
                    </View>
            }
        </View>
    )
}

Header.propTypes = {
    title: PropTypes.string,
    navigation: PropTypes.object,
    onBackPressed: PropTypes.func,
    onDrawerButtonPressed: PropTypes.func,
    onOkPressed: PropTypes.func,
    showWishlist: PropTypes.bool,
    isSignedIn: PropTypes.bool,
    containNavDrawer: PropTypes.bool,
    showCart: PropTypes.bool,
    showOk: PropTypes.bool,
    loading: PropTypes.bool
};

Header.defaultProps = {
    title: "",
    navigation: null,
    onBackPressed: null,
    onDrawerButtonPressed: null,
    onOkPressed: null,
    containNavDrawer: true,
    showWishlist: false,
    isSignedIn: false,
    showCart: true,
    showOk: false,
    loading: false,
};

const mapStateToProps = state => {
    return {
        product: state.product
    }
}

export default connect(
    mapStateToProps,
    null
)(Header)