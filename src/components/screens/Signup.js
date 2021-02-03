import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, TouchableOpacity,
    Text,
    TextInput,
    StatusBar, ActivityIndicator,
    Image, ImageBackground, Platform, KeyboardAvoidingView
} from 'react-native';
import Color from '../../assets/Color';
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import { FieldType, validate } from "../../utils/validation"


export default function Signup(props) {

    useEffect(() => {
        immersiveModeOff()
    }, [])

    const [signupRequest, setSignupRequest] = useState({
        phone: "",
        full_name: "",
        email: ""
    })
    const [loading, setLoading] = useState(false)

    async function signup() {
        if (validate(FieldType.phone_number, signupRequest.phone).isError) {
            alert(validate(FieldType.phone_number, signupRequest.phone).messageError)
        } else if (validate(FieldType.fullname, signupRequest.full_name).isError) {
            alert(validate(FieldType.fullname, signupRequest.full_name).messageError)
        } else if (validate(FieldType.email, signupRequest.email).isError) {
            alert(validate(FieldType.email, signupRequest.email).messageError)
        } else {
            try {
                setLoading(true)
                let response = await postRequest("user/store", signupRequest)
                console.log("SIGN_UP_RESP", response)
                if (response.success) {
                    props.navigation.navigate("OtpVerification", { mobileNo: signupRequest.phone, user_id: response.data })
                } else if (Array.isArray(response.message)) {
                    var message = ""
                    response.message.map((value) => { message = message + "\n" + value })
                    console.log("MSG", message)
                    alert(message)
                } else {
                    alert(response.message)
                }
            } catch (error) {
                alert(error.message)
            }
        }
        setLoading(false)
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
                    <View style={Platform.OS == "android" ? { flex: 1, alignItems: "center", backgroundColor: Color.white } :
                        { flex: 1, alignItems: "center" }}>

                        <ScrollView style={{ width: "100%" }}>

                            <View style={{ width: "100%", alignItems: "center" }}>
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
                                        editable={!loading}
                                        value={signupRequest.phone}
                                        placeholder={"Mobile number"}
                                        keyboardType="number-pad"
                                        returnKeyType="next"
                                        numberOfLines={1}
                                        maxLength={10}
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setSignupRequest({
                                                ...signupRequest,
                                                phone: text
                                            })
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(10)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={signupRequest.full_name}
                                        placeholder={"Full Name"}
                                        textContentType="name"
                                        numberOfLines={1}
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setSignupRequest({
                                                ...signupRequest,
                                                full_name: text
                                            })
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(10)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={signupRequest.email}
                                        placeholder={"Email"}
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        numberOfLines={1}
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setSignupRequest({
                                                ...signupRequest,
                                                email: text
                                            })
                                        }} />
                                </View>

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { signup() }}
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
                                                }}>SIGN UP</Text>}
                                    </ImageBackground>
                                </TouchableOpacity>

                                <View style={{
                                    flexDirection: "row", justifyContent: "center",
                                    marginTop: normalize(40), marginBottom: normalize(50),
                                    alignItems: "center"
                                }}>
                                    <Text style={{
                                        fontFamily: "Roboto-Regular", fontSize: normalize(14),
                                        color: Color.grey
                                    }}>Already a user?</Text>
                                    <TouchableOpacity
                                        disabled={loading}
                                        onPress={() => { props.navigation.navigate("Login") }}>
                                        <Text style={{
                                            fontFamily: "Roboto-Bold", fontSize: normalize(14),
                                            color: Color.navyBlue, margin: normalize(2)
                                        }}> Login </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>

            </SafeAreaView>
        </View>
    )
}