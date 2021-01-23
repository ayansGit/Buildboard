import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    Image, ImageBackground, Platform
} from 'react-native';
import Color from '../../assets/Color';
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';


export default function Login(props) {

    useEffect(() => {
        immersiveModeOff()
    }, [])

    const [loginRequest, setLoginRequest] = useState({
        mobile_no: ""
    })

    function doLogin(){

        props.navigation.navigate("OtpVerification", {mobileNo: loginRequest.mobile_no})
    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == "android" ?
                <StatusBar hidden={false} barStyle="dark-content" backgroundColor={Color.white} /> :
                <StatusBar hidden={false} />}

            <SafeAreaView style={{ flex: 1 }}>
                <View style={Platform.OS == "android" ? { flex: 1, alignItems: "center", backgroundColor: Color.white } :
                    { flex: 1, alignItems: "center" }}>

                    <Image
                        style={{ width: normalize(250), height: normalize(194), marginTop: normalize(25) }}
                        source={ImagePath.chooseIcon}
                        resizeMode="contain" />
                    <View style={{
                        width: "90%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(20)
                    }}>
                        <TextInput
                            placeholder={"Mobile number"}
                            placeholderTextColor={Color.grey}
                            value={loginRequest.mobile_no}
                            keyboardType="number-pad"
                            maxLength={10}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setLoginRequest({
                                    ...loginRequest,
                                    mobile_no: text
                                })
                            }} />
                    </View>

                    <TouchableOpacity
                        onPress={() => doLogin()}
                        style={{ width: "90%", height: normalize(45), marginTop: normalize(20) }}>
                        <ImageBackground
                            style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                            source={ImagePath.gradientButton}
                            resizeMode="stretch">
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontFamily: "Roboto-Medium",
                                    color: Color.white
                                }}>LOGIN</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: "row", justifyContent: "center", position: "absolute",
                        bottom: normalize(25), alignItems: "center"
                    }}>
                        <Text style={{
                            fontFamily: "Roboto-Regular", fontSize: normalize(14),
                            color: Color.grey
                        }}>Not a user yet?</Text>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate("Signup")
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold", fontSize: normalize(14),
                                color: Color.navyBlue, margin: normalize(2)
                            }}> Sign up </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}