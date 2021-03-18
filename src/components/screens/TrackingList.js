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
    Platform, Alert, ToastAndroid, ActivityIndicator
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { getToken, setToken, } from "../../utils/storage"


export default function TrackingList(props) {

    const [loading, setLoading] = useState(false)


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
                        loading={loading}
                        title={"Track Orders"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    <View style={{ width: "100%", alignItems: "center" }}>

                        <FlatList
                            style={{ width: "100%" }}
                            data={[1, 2, 3, 4, 5]}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(data) => {
                                return (
                                    <View style={{
                                        width: "100%", alignItems: "center", paddingBottom: normalize(10),
                                        borderBottomWidth: normalize(1), borderBottomColor: Color.veryLightGrey, marginTop: normalize(10)
                                    }}>
                                        <View style={{
                                            width: "100%", marginTop: normalize(2), paddingStart: "5%", paddingEnd: "2%", paddingBottom: "5%", flexDirection: "row",
                                            alignItems: "flex-start"
                                        }}>
                                            <Image
                                                style={{
                                                    width: "30%", height: normalize(60), borderRadius: normalize(1), borderWidth: normalize(1),
                                                    borderColor: Color.grey, backgroundColor: Color.white, padding: normalize(3),
                                                }}
                                                resizeMode="contain"
                                                source={ImagePath.dummyProduct} />
                                            <View style={{ width: "55%", marginLeft: normalize(15) }}>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                                    color: Color.black,
                                                }}
                                                >{"3 seater mini sofa"}</Text>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Bold", fontSize: normalize(16),
                                                    color: Color.navyBlue, marginTop: normalize(2)
                                                }}
                                                >{`₹30000`}</Text>
                                                <Text style={{
                                                    width: "100%", fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                                    color: Color.darkGrey, marginTop: normalize(2)
                                                }}
                                                >{`Quantity: ${5}`}</Text>
                                            </View>
                                        </View>
                                        {
                                            ((data.index % 2) != 0) ?
                                                <View style={{ width: "100%", alignItems: "center" }} >
                                                    <Text
                                                        style={{
                                                            width: "90%", fontFamily: "Roboto-Bold", fontSize: normalize(12),
                                                            color: Color.black,
                                                        }}>Status</Text>
                                                    <Text style={{
                                                        width: "90%", fontFamily: "Roboto-Regular", fontSize: normalize(10),
                                                        color: Color.darkGrey, marginTop: normalize(2)
                                                    }}>Order Delivered</Text>
                                                </View>
                                                :
                                                <View style={{ flexDirection: "row", marginTop: normalize(10) }}>
                                                    <TouchableOpacity style={{
                                                        backgroundColor: Color.white, borderRadius: normalize(5),
                                                        marginRight: normalize(15), elevation: normalize(8),
                                                        shadowColor: Color.black, shadowOpacity: 0.3, shadowOffset: { height: 0, width: 0 },
                                                        shadowRadius: normalize(5)
                                                    }}>
                                                        <Text style={{
                                                            fontSize: normalize(10), fontFamily: "Roboto-Regular",
                                                            color: Color.darkGrey, marginTop: normalize(6), marginBottom: normalize(6),
                                                            marginLeft: normalize(18), marginRight: normalize(18),
                                                        }}>CANCEL</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{
                                                        backgroundColor: Color.blue, borderRadius: normalize(5),
                                                        marginLeft: normalize(15), elevation: normalize(8),
                                                        shadowColor: Color.black, shadowOpacity: 0.3, shadowOffset: { height: 0, width: 0 },
                                                        shadowRadius: normalize(5)
                                                    }}
                                                    onPress = {() => props.navigation.navigate("TrackOrder")}>
                                                        <Text style={{
                                                            fontSize: normalize(10), fontFamily: "Roboto-Regular",
                                                            color: Color.white, marginTop: normalize(6), marginBottom: normalize(6),
                                                            marginLeft: normalize(20), marginRight: normalize(20)
                                                        }}>TRACK</Text>
                                                    </TouchableOpacity>
                                                </View>}

                                    </View>
                                )
                            }}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}