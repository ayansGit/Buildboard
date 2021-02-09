import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, KeyboardAvoidingView,
    Text, TextInput,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image, ImageBackground,
    Platform, Animated
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { Value } from 'react-native-reanimated';




export default function DesignWithUs(props) {

    const [bannerList, setBannerList] = useState([])
    const [signupRequest, setSignupRequest] = useState({
        phone: "",
        full_name: "",
        email: ""
    })
    const [loading, setLoading] = useState(false)
    const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0))

    let subs = [];

    useEffect(() => {
        fadeIn()
        getBanner()
    }, [])


    function fadeIn() {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }

    async function getBanner() {
        try {
            let response = await getRequest("user/banners")
            console.log("RESPONSE", response)
            if (response.data.length > 0) {
                setBannerList(response.data)
            }

        } catch (error) {
            console.log("ERROR", error)
        }
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
                    <View style={Platform.OS == "android" ? {
                        flex: 1, alignItems: "center",
                        backgroundColor: Color.white
                    } : { flex: 1 }}>
                        <Header
                            loading={false}
                            title={""}
                            navigation={props.navigation}
                            onDrawerButtonPressed={() => {
                                props.navigation.openDrawer()
                            }} />

                        <ScrollView style={{ width: "100%" }}>
                            <ImageBackground style={{
                                width: "100%", height: normalize(300), justifyContent: "center",
                                alignItems: "center"
                            }}
                                source={ImagePath.contact_us}
                                resizeMode="cover">
                                <View
                                    style={{
                                        width: "100%", height: "100%",
                                        backgroundColor: Color.black, opacity: 0.3
                                    }} />
                                <Animated.Text style={{
                                    opacity: fadeAnimation,
                                    position: "absolute", color: Color.white,
                                    fontFamily: "Roboto-Medium", fontSize: normalize(24), textAlign: "center"
                                }}>{"CUSTOMIZE\n\nYOUR\n\nINTERIOR"}</Animated.Text>
                            </ImageBackground>
                            {bannerList.length > 0 ?
                                <ViewPager
                                    pageMargin={normalize(10)}
                                    style={{ width: "100%", height: normalize(150), }}>
                                    {bannerList.map((value, index) => {
                                        return (
                                            <View
                                                collapsable={false}
                                                key={index}
                                                style={{ width: "100%", height: "100%", marginTop: normalize(10) }}>
                                                <Image
                                                    style={{ width: "100%", height: "100%", }}
                                                    source={{ uri: value.image }}
                                                    resizeMode="cover" />
                                            </View>
                                        )
                                    })}

                                </ViewPager> : null}

                            <View style={{ width: "100%", alignItems: "center" }}>
                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(20)
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

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(10)
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

                                <TouchableOpacity
                                    style={{ width: "90%", height: normalize(45), marginTop: normalize(20), marginBottom: normalize(20) }}>
                                    <ImageBackground
                                        style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                                        source={ImagePath.gradientButton}
                                        resizeMode="stretch">
                                        <Text
                                            style={{
                                                fontSize: normalize(14),
                                                fontFamily: "Roboto-Medium",
                                                color: Color.white
                                            }}>REACH US</Text>
                                    </ImageBackground>
                                </TouchableOpacity>


                            </View>




                            <Text style={{
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

                            </View>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View >
    )
}