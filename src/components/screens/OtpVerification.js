import React, { useState } from "react"
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, TouchableOpacity,
    Text,
    TextInput,
    StatusBar, ActivityIndicator,
    Image, ImageBackground, Platform, KeyboardAvoidingView
} from "react-native"
import Color from '../../assets/Color';
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';

export default function OtpVerification(props) {

    var otpInput1 = null
    var otpInput2 = null
    var otpInput3 = null
    var otpInput4 = null
    const [otpValue, setOtpValue] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: ""
    })
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)

    async function verify() {
        let otp = otpValue.otp1 + otpValue.otp2 + otpValue.otp3 + otpValue.otp4
        if (otp.length == 4) {
            let request = {
                otp: otp,
                user_id: props.route.params.user_id
            }
            try {
                setLoading(true)
                let response = await postRequest("user/verify", request)
                if (response.success) {
                    props.navigation.replace("SignedInNavigator")
                } else {
                    alert(response.message)
                }

            } catch (error) {
                alert(error.message)
            }
        }
        setLoading(false)
    }

    async function resendOtp() {
        setLoading2(true)
        try {
            let request = {
                user_id: props.route.params.user_id
            }
            let response = await postRequest("user/resend-otp", request)
            if (!response.success) {
                alert(response.message)
            }

        } catch (error) {
            alert(error.message)
        }
        setLoading2(false)
    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == "android" ?
                <StatusBar hidden={false} barStyle="dark-content" backgroundColor={Color.white} /> :
                <StatusBar hidden={false} />}

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: normalize(20), color: Color.navyBlue,
                        textAlign: "center", marginTop: normalize(12), marginBottom: normalize(12)
                    }}>Verification</Text>
                    <View style={Platform.OS == "android" ? { flex: 1, alignItems: "center", backgroundColor: Color.white } :
                        { flex: 1, alignItems: "center" }}>

                        <ScrollView style={{ width: "100%" }}>

                            <View style={{ width: "100%", alignItems: "center" }}>

                                <Text style={{
                                    fontFamily: 'Roboto-Regular', fontSize: normalize(14), color: Color.navyBlue,
                                    textAlign: "center", marginTop: normalize(50)
                                }}>{`Enter the OTP sent to your number\n+91 ${props.route.params.mobileNo}`}</Text>

                                <View style={{ flexDirection: "row", marginTop: normalize(5) }}>
                                    <View style={{
                                        width: normalize(40), height: normalize(50), borderWidth: normalize(1),
                                        borderRadius: normalize(8), flexDirection: "row", justifyContent: "center",
                                        alignItems: 'center', margin: normalize(10)
                                    }}>
                                        <TextInput
                                            editable={!loading && !loading2}
                                            ref={(input) => { otpInput1 = input; }}
                                            value={otpValue.otp1}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={{
                                                width: "100%", textAlign: "center",
                                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                                fontSize: normalize(16)
                                            }}
                                            onChangeText={(text) => {
                                                setOtpValue({
                                                    ...otpValue,
                                                    otp1: text
                                                })
                                                if (text.length > 0)
                                                    otpInput2.focus()
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        width: normalize(40), height: normalize(50), borderWidth: normalize(1),
                                        borderRadius: normalize(8), flexDirection: "row", justifyContent: "center",
                                        alignItems: 'center', margin: normalize(10)
                                    }}>
                                        <TextInput
                                            editable={!loading && !loading2}
                                            ref={(input) => { otpInput2 = input; }}
                                            value={otpValue.otp2}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={{
                                                width: "100%", textAlign: "center",
                                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                                fontSize: normalize(16)
                                            }}
                                            onChangeText={(text) => {
                                                setOtpValue({
                                                    ...otpValue,
                                                    otp2: text
                                                })
                                                if (text.length > 0)
                                                    otpInput3.focus()
                                                else otpInput1.focus()
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        width: normalize(40), height: normalize(50), borderWidth: normalize(1),
                                        borderRadius: normalize(8), flexDirection: "row", justifyContent: "center",
                                        alignItems: 'center', margin: normalize(10)
                                    }}>
                                        <TextInput
                                            editable={!loading && !loading2}
                                            ref={(input) => { otpInput3 = input; }}
                                            value={otpValue.otp3}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={{
                                                width: "100%", textAlign: "center",
                                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                                fontSize: normalize(16)
                                            }}
                                            onChangeText={(text) => {
                                                setOtpValue({
                                                    ...otpValue,
                                                    otp3: text
                                                })
                                                if (text.length > 0)
                                                    otpInput4.focus()
                                                else otpInput2.focus()
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        width: normalize(40), height: normalize(50), borderWidth: normalize(1),
                                        borderRadius: normalize(8), flexDirection: "row", justifyContent: "center",
                                        alignItems: 'center', margin: normalize(10)
                                    }}>
                                        <TextInput
                                            editable={!loading && !loading2}
                                            ref={(input) => { otpInput4 = input; }}
                                            value={otpValue.otp4}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            style={{
                                                width: "100%", textAlign: "center",
                                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                                fontSize: normalize(16)
                                            }}
                                            onChangeText={(text) => {
                                                setOtpValue({
                                                    ...otpValue,
                                                    otp4: text
                                                })
                                                if (text.length == 0)
                                                    otpInput3.focus()
                                            }}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    disabled={loading || loading2}
                                    onPress={() => verify()}
                                    style={{ width: "90%", height: normalize(45), marginTop: normalize(20) }}>
                                    <ImageBackground
                                        style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                                        source={ImagePath.gradientButton}
                                        resizeMode="stretch">
                                        {loading ? <ActivityIndicator size="small" color={Color.white} /> :
                                            <Text
                                                style={{
                                                    fontSize: normalize(14),
                                                    fontFamily: "Roboto-Medium",
                                                    color: Color.white
                                                }}>SUBMIT</Text>}
                                    </ImageBackground>
                                </TouchableOpacity>

                                <View style={{
                                    flexDirection: "row", justifyContent: "center", alignItems: "center",
                                    marginTop: normalize(20)
                                }}>
                                    <Text style={{
                                        fontFamily: 'Roboto-Regular', fontSize: normalize(12), color: Color.navyBlue,
                                        textAlign: "center",
                                    }}>Didn't receive your OTP please</Text>
                                    <TouchableOpacity
                                        onPress={() => resendOtp()}
                                        disabled={loading || loading2}
                                        style={{ padding: normalize(5) }}>
                                        <Text style={{
                                            fontFamily: 'Roboto-Bold', fontSize: normalize(12), color: Color.navyBlue,
                                            textAlign: "center"
                                        }}>Resend</Text>

                                    </TouchableOpacity>

                                    {loading2 ?
                                        <ActivityIndicator size="small" color={Color.navyBlue} /> : null}
                                </View>

                            </View>

                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>

            </SafeAreaView>
        </View>
    )
}