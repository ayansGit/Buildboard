import React, {useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    Image, ImageBackground, Platform, KeyboardAvoidingView
} from 'react-native';
import Color from '../../assets/Color';
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';


export default function Signup(props) {

    useEffect(() => {
        immersiveModeOff()
    }, [])

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
                                        placeholder={"Mobile number"}
                                        keyboardType="number-pad"
                                        numberOfLines={1}
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(10)
                                }}>
                                    <TextInput
                                        placeholder={"Fullname"}
                                        textContentType="name"
                                        numberOfLines={1}
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(10)
                                }}>
                                    <TextInput
                                        placeholder={"Email"}
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        numberOfLines={1}
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }} />
                                </View>

                                <TouchableOpacity
                                    onPress={() => { props.navigation.navigate("OtpVerification") }}
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
                                            }}>SIGN UP</Text>
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