import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity, ImageBackground,
    Image, ActivityIndicator,
    TextInput,
    Platform, KeyboardAvoidingView,
    ToastAndroid,
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import AddressDialog from "../common/AddressDialog"
import { RadioButton, FAB } from 'react-native-paper';
import Picker from "../common/StatePicker"
import { getToken, setUserName, setEmail } from "../../utils/storage";

export default function Address(props) {

    const [loading, setLoading] = React.useState(0);

    const [accountRequest, setAccountRequest] = useState({
        phone: "",
        full_name: "",
        email: "",

    })

    useEffect(() => {
        // getOrderList()
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            initAccount()
        });
        return unsubscribe
    }, [props.navigation])

    function initAccount() {
        let accountDetails = props.route.params.userData
        setAccountRequest({
            ...accountRequest,
            full_name: accountDetails.full_name,
            phone: accountDetails.phone,
            email: accountDetails.email
        })
    }



    function showAlert(message) {
        if (Platform.OS == "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            alert(message)
        }
    }
    async function updateProfile() {

        if (accountRequest.phone.length == 0) {
            showAlert("Enter mobile number")
        } else if (accountRequest.phone.length < 10) {
            showAlert("Enter valid mobile number")
        } else if (accountRequest.full_name.length == 0) {
            showAlert("Enter fullname")
        } else if (accountRequest.email.length == 0) {
            showAlert("Enter email")
        } else {
            try {
                setLoading(true)
                let token = await getToken()
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }

                let response = await postRequest(`user/profile/update`, accountRequest, header)
                console.log("RESPOSNE", response)
                if (response.success) {
                    setUserName(accountRequest.full_name.toString())
                    setEmail(accountRequest.email.toString())
                    if (Platform.OS == "android") {
                        ToastAndroid.show(response.message, ToastAndroid.SHORT)
                    } else {
                        alert(response.message)
                    }
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
                alert(error.message)
            }
            setLoading(false)
        }


    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == "android" ?
                <StatusBar hidden={false} barStyle="dark-content" backgroundColor={Color.white} /> :
                <StatusBar hidden={false} />}
            <SafeAreaView style={{ flex: 1 }}>
                <View style={Platform.OS == "android" ? {
                    flex: 1,
                    backgroundColor: Color.white
                } : { flex: 1 }}>

                    <Header
                        title={"Address"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1, width: "100%", alignItems: "center" }}>
                        <ScrollView style={{ width: "100%" }}>
                            <View style={{ width: "100%", alignItems: "center" }}>
                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(20)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={accountRequest.phone}
                                        placeholder={"Mobile number"}
                                        maxLength={10}
                                        numberOfLines={1}
                                        keyboardType="numeric"
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setAccountRequest({
                                                ...accountRequest,
                                                phone: text
                                            })
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(20)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={accountRequest.full_name}
                                        placeholder={"Full Name"}
                                        textContentType="name"
                                        numberOfLines={1}
                                        returnKeyType="next"
                                        keyboardType="default"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setAccountRequest({
                                                ...accountRequest,
                                                full_name: text
                                            })
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(20)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={accountRequest.email}
                                        placeholder={"Email"}
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        numberOfLines={1}
                                        returnKeyType="done"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setAccountRequest({
                                                ...accountRequest,
                                                email: text
                                            })
                                        }} />
                                </View>

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { updateProfile() }}
                                    style={{
                                        width: "90%", height: normalize(45), marginTop: normalize(20),
                                        marginBottom: normalize(80)
                                    }}>
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
                                                }}>SAVE</Text>}
                                    </ImageBackground>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>

                    </KeyboardAvoidingView>

                </View>
            </SafeAreaView>
        </View >
    )
}