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



export default function ProductDescription(props) {

    const regex = /(<([^>]+)>)/ig;
    const contentWidth = useWindowDimensions().width;

    const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;

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

                        <ScrollView style={{ width: "100%" }}>


                            <View style={{ margin: normalize(15) }}>
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                    color: Color.darkGrey, marginTop: normalize(15)
                                }}>Feature:</Text>

                                <HTML source={{ html: props.route.params.desc }} contentWidth={contentWidth} />
                            </View>


                        </ScrollView>

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}