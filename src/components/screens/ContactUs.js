import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, KeyboardAvoidingView,
    Text, TextInput,
    StatusBar,
    FlatList,
    TouchableOpacity, ActivityIndicator,
    Image, ImageBackground,
    Platform
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { Value } from 'react-native-reanimated';
import { showAlert } from "../../utils/Utils"



export default function ContactUs(props) {

    const [loading, setLoading] = useState(false)
    const [contactRequest, setContactRequest] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        description: ""
    })

    async function contactUsRequest() {
        setLoading(true)
        if (contactRequest.first_name.length == 0) {
            showAlert("Enter your first name")
        } else if (contactRequest.last_name.length == 0) {
            showAlert("Enter your last name")
        } else if (contactRequest.email.length == 0) {
            showAlert("Enter your email")
        } else if (contactRequest.phone.length == 0) {
            showAlert("Enter your phone number")
        }else if (contactRequest.phone.length < 10) {
            showAlert("Your phone number should contain 10 digit")
        } else if (contactRequest.description.length == 0) {
            showAlert("Enter your details")
        } else {
            try {
                let response = await postRequest("user/contact-us", contactRequest)
                console.log("RESPONSE", response)
                if (response.success) {
                    showAlert(response.message)
                    props.navigation.goBack()
                } else if (Array.isArray(response.message)) {
                    var message = ""
                    response.message.map((value) => { message = message + "\n" + value })
                    console.log("MSG", message)
                    alert(message)
                } else {
                    alert(response.message)
                }
            } catch (error) {
                alert(error)
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
                <View style={Platform.OS == "android" ? {
                    flex: 1, alignItems: "center",
                    backgroundColor: Color.white
                } : { flex: 1 }}>
                    <Header
                        navigation={props.navigation}
                        containNavDrawer={false}
                        title={"Contact Us"}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1, width: "100%", alignItems: "center" }}>

                        <ImageBackground style={{ width: "100%", height: "80%" }}
                            source={ImagePath.contact_us}
                            resizeMode="cover">
                            <View
                                style={{
                                    width: "100%", height: "80%",
                                    backgroundColor: Color.black, opacity: 0.3
                                }} />
                        </ImageBackground>

                        <View style={{
                            width: "80%", backgroundColor: Color.white,
                            borderRadius: normalize(5), elevation: normalize(8),
                            padding: normalize(20), position: "absolute",
                            marginTop: normalize(40), height: "100%"
                        }}>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ width: "100%", }}>
                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: normalize(8), color: Color.blue
                                }}>First Name</Text>
                                <TextInput
                                    value={contactRequest.first_name}
                                    onChangeText={(text) => {
                                        setContactRequest({
                                            ...contactRequest,
                                            first_name: text
                                        })
                                    }}
                                    numberOfLines={1}
                                    style={{
                                        width: "100%", borderBottomWidth: normalize(1),
                                        borderBottomColor: Color.darkGrey,
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(12), color: Color.grey,
                                    }}
                                    selectionColor={Color.blue} />

                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: normalize(8), color: Color.blue,
                                    marginTop: normalize(10)
                                }}>Last Name</Text>
                                <TextInput
                                    value={contactRequest.last_name}
                                    onChangeText={(text) => {
                                        setContactRequest({
                                            ...contactRequest,
                                            last_name: text
                                        })
                                    }}
                                    numberOfLines={1}
                                    style={{
                                        width: "100%", borderBottomWidth: normalize(1),
                                        borderBottomColor: Color.darkGrey,
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(12), color: Color.grey,
                                    }}
                                    selectionColor={Color.blue} />

                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: normalize(8), color: Color.blue,
                                    marginTop: normalize(10)
                                }}>Email</Text>
                                <TextInput
                                    value={contactRequest.email}
                                    onChangeText={(text) => {
                                        setContactRequest({
                                            ...contactRequest,
                                            email: text
                                        })
                                    }}
                                    numberOfLines={1}
                                    style={{
                                        width: "100%", borderBottomWidth: normalize(1),
                                        marginTop: Platform.OS == "android" ? 0.5 : normalize(5),
                                        borderBottomColor: Color.darkGrey,
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(12), color: Color.grey, 
                                    }}
                                    selectionColor={Color.blue} />

                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: normalize(8), color: Color.blue,
                                    marginTop: normalize(10)
                                }}>Phone number</Text>
                                <TextInput
                                    value={contactRequest.phone}
                                    onChangeText={(text) => {
                                        setContactRequest({
                                            ...contactRequest,
                                            phone: text
                                        })
                                    }}
                                    numberOfLines={1}
                                    maxLength={10}
                                    keyboardType="numeric"
                                    style={{
                                        width: "100%", borderBottomWidth: normalize(1),
                                        borderBottomColor: Color.darkGrey,
                                        marginTop: Platform.OS == "android" ? 0.5 : normalize(5),
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(12), color: Color.grey,
                                    }}
                                    selectionColor={Color.blue} />

                                <Text style={{
                                    fontFamily: "Roboto-Regular",
                                    fontSize: normalize(8), color: Color.blue,
                                    marginTop: normalize(10)
                                }}>Message</Text>
                                <TextInput
                                    value={contactRequest.description}
                                    onChangeText={(text) => setContactRequest({
                                        ...contactRequest,
                                        description: text
                                    })}
                                    numberOfLines={1}
                                    style={{
                                        width: "100%", borderBottomWidth: normalize(1),
                                        borderBottomColor: Color.darkGrey,
                                        fontFamily: "Roboto-Regular",
                                        fontSize: normalize(12), color: Color.grey,
                                    }}
                                    selectionColor={Color.blue} />

                                <TouchableOpacity
                                    onPress={() => contactUsRequest()}
                                    style={{ width: "100%", height: normalize(40), marginTop: normalize(20), marginBottom: normalize(20) }}>
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

                                {/* <Text style={{
                                    fontFamily: "Roboto-Medium",
                                    fontSize: normalize(12), color: Color.grey, textAlign: "center", marginTop: normalize(30)
                                }}>You can follow us on</Text>

                                <View style={{
                                    flexDirection: "row", alignSelf: "center", marginTop: normalize(15),
                                    marginBottom: normalize(70), alignItems: "center"
                                }}>
                                    <TouchableOpacity
                                        onPress={() => { Linking.openURL("https://www.facebook.com/buildboardfurnishers/") }}>
                                        <Image
                                            style={{ height: normalize(45), width: normalize(45) }}
                                            source={ImagePath.fbIcon}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => { Linking.openURL("https://www.instagram.com/buildboardfurnishers/?igshid=hi8trw08gw3r") }}
                                        style={{ marginLeft: normalize(15), marginRight: normalize(15) }}>
                                        <Image
                                            style={{
                                                height: normalize(38), width: normalize(38),
                                            }}
                                            source={ImagePath.instaIcon}
                                            resizeMode="cover" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => Linking.openURL("https://www.linkedin.com/m/company/buildboard-furnishers/")}>
                                        <Image
                                            style={{ height: normalize(35), width: normalize(35), }}
                                            source={ImagePath.linkedIdIcon}
                                            resizeMode="cover" />
                                    </TouchableOpacity>

                                </View> */}
                            </ScrollView>

                        </View>

                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </View >
    )
}