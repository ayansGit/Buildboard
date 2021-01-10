import React, { useState, useEffect } from "react"
import { View, Image, TouchableOpacity, Text } from "react-native"
import Color from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import PropTypes from "prop-types";
import { connect } from 'react-redux'
var status = ""

export default function Header(props) {

    return (
        <View style={{ width: "100%", height: normalize(50), paddingLeft: normalize(5), paddingRight: normalize(5) }}>
            {
                props.containNavDrawer ?
                    <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <TouchableOpacity style={{
                            width: normalize(40), height: normalize(40),
                            padding: normalize(10)
                        }}
                            onPress={() => {
                                if (props.onDrawerButtonPressed) {
                                    props.onDrawerButtonPressed()
                                }
                            }}>
                            <Image
                                style={{ width: "100%", height: "100%" }}
                                source={ImagePath.navButton}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <Text style={{ fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue }}>{props.title}</Text>

                        <TouchableOpacity style={{ width: normalize(45), height: normalize(45), padding: normalize(10) }}>
                            <Image
                                style={{ width: "100%", height: "100%" }}
                                source={ImagePath.shoppingCart}
                                resizeMode="contain" />
                        </TouchableOpacity>

                    </View> :
                    <View
                        style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity style={{
                            width: normalize(40), height: normalize(40),
                            padding: normalize(10)
                        }}
                            onPress={() => {
                                if (props.onBackPressed) {
                                    props.onBackPressed()
                                }
                            }}>
                            <Image
                                style={{ width: "100%", height: "100%" }}
                                source={ImagePath.leftArrow}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <Text style={{ fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue, marginLeft: normalize(20) }}>{props.title}</Text>
                        </View>
                        
                        <TouchableOpacity style={{ width: normalize(45), height: normalize(45), padding: normalize(10) }}>
                            <Image
                                style={{ width: "100%", height: "100%" }}
                                source={ImagePath.shoppingCart}
                                resizeMode="contain" />
                        </TouchableOpacity>
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
    containNavDrawer: PropTypes.bool
};

Header.defaultProps = {
    title: "",
    navigation: null,
    onBackPressed: null,
    onDrawerButtonPressed: null,
    containNavDrawer: true
};
