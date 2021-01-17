import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';


export default function Settings(props) {


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
                        title={"Settings"}
                        navigation={props.navigation}
                        onDrawerButtonPressed={() => {
                            props.navigation.openDrawer()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>

                        <TouchableOpacity
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius:normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3, 
                                shadowOffset: {height:0, width:0}, shadowRadius: normalize(5),
                                marginBottom: normalize(10), marginTop: normalize(20),
                                justifyContent: "center", alignItems: "center"
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue, 
                            }}>ACCOUNT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius:normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3, 
                                shadowOffset: {height:0, width:0}, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}
                            onPress = {() => {props.navigation.navigate("ContactUs")}}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue, 
                            }}>CONTACT US</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius:normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3, 
                                shadowOffset: {height:0, width:0}, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue, 
                            }}>PRIVACY POLICY</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius:normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3, 
                                shadowOffset: {height:0, width:0}, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue, 
                            }}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}