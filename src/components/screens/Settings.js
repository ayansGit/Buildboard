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


export default function Settings(props) {

    const [loading, setLoading] = useState(false)

    function showLogoutAlert() {
        Alert.alert(
            "Alert",
            "Are you sure you want to logout",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => logout() }
            ],
            { cancelable: false }
        );
    }

    async function logout() {
        setLoading(true)
        let token = await getToken()
        let header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
        try {
            let response = await postRequest("user/logout", null, header)
            setToken("")
            props.navigation.replace("SignedOutNavigator")
            ToastAndroid.show(response.message, ToastAndroid.SHORT);

        } catch (error) {
            alert(error.message)
        }
        setLoading(false)

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
                        loading={loading}
                        title={"Settings"}
                        navigation={props.navigation}
                        onDrawerButtonPressed={() => {
                            props.navigation.openDrawer()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius: normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3,
                                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(5),
                                marginBottom: normalize(10), marginTop: normalize(20),
                                justifyContent: "center", alignItems: "center"
                            }}
                            onPress={() => props.navigation.navigate("Account")}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue,
                            }}>ACCOUNT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius: normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3,
                                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}
                            onPress={() => { props.navigation.navigate("ContactUs") }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue,
                            }}>CONTACT US</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius: normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3,
                                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                color: Color.navyBlue,
                            }}>PRIVACY POLICY</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                width: "90%", height: normalize(45),
                                backgroundColor: Color.white, borderRadius: normalize(5), elevation: normalize(8),
                                shadowColor: Color.black, shadowOpacity: 0.3,
                                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(5),
                                marginBottom: normalize(10),
                                justifyContent: "center", alignItems: "center"
                            }}
                            onPress={() => showLogoutAlert()}>
                            {loading ? <ActivityIndicator size="small" color={Color.navyBlue} /> :
                                <Text style={{
                                    fontFamily: "Roboto-Medium", fontSize: normalize(12),
                                    color: Color.navyBlue,
                                }}>LOGOUT</Text>}

                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}