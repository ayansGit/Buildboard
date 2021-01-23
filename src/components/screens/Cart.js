import React, { useState, useEffect } from 'react';
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

export default function Cart(props) {

    function cartItem(data) {

        return (
            <View style={{
                width: "100%", marginTop: normalize(10), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                borderBottomWidth: normalize(1), borderBottomColor: Color.grey,
                justifyContent: "space-between", alignItems: "flex-start"
            }}>
                <Image
                    style={{
                        width: "30%", height: normalize(60), borderRadius: normalize(1),
                        borderColor: Color.grey, backgroundColor: Color.white
                    }}
                    source={ImagePath.dummyProduct} />
                <View style={{ width: "50%", paddingTop: normalize(5) }}>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                        color: Color.navyBlue
                    }}
                    >3 seater mini sofa</Text>
                    <Text style={{
                        width: "100%", fontFamily: "Roboto-Bold", fontSize: normalize(16),
                        color: Color.navyBlue, marginTop: normalize(2)
                    }}
                    >₹30000</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: normalize(10) }}>
                        <TouchableOpacity>
                            <Image
                                source={ImagePath.plus}
                                style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: "Roboto-Regular", fontSize: normalize(12),
                            color: Color.grey, marginStart: normalize(3), marginEnd: normalize(3), marginBottom: normalize(1)
                        }}>10</Text>
                        <TouchableOpacity>
                            <Image
                                source={ImagePath.minus}
                                style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>


                    </View>
                </View>
                <TouchableOpacity style={{ padding: normalize(5) }}>
                    <Image
                        source={ImagePath.delete}
                        style={{ height: normalize(10), width: normalize(10) }} />
                </TouchableOpacity>
            </View>
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

                    <FlatList
                        style={{ width: "100%" }}
                        renderItem={(data) => cartItem(data)}
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                        keyExtractor={(item, index) => index.toString()} />

                    <TouchableOpacity style={{
                        width: "100%", height: normalize(40), position: "absolute",
                        bottom: 0
                    }}>
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
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </View>
    )
}