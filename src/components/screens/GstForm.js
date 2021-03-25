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
import { getToken, getCompany, getGST, setCompany, setGST } from "../../utils/storage";

export default function GstForm(props) {

    const [loading, setLoading] = React.useState(0);
    const states = useSelector(state => state.user.stateList)

    const [gstRequest, setGstRequest] = useState({
        company_name: "",
        gst_number: "",
    })

    useEffect(() => {
        getSavedGstData()
    }, [])

    async function getSavedGstData() {
        let gstNumber = await getGST()
        let company = await getCompany()

        if (gstNumber != null && gstNumber != undefined && gstNumber.length > 0) {
            setGstRequest({
                ...gstNumber,
                company_name: company,
                gst_number: gstNumber
            })
        }


    }


    function showAlert(message) {
        if (Platform.OS == "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            alert(message)
        }
    }
    async function addGST() {

        if (gstRequest.company_name.length == 0) {
            showAlert("Enter company name")
        } else if (gstRequest.gst_number.length == 0) {
            showAlert("Enter GST number")
        } else {
            setCompany(gstRequest.company_name)
            setGST(gstRequest.gst_number)
            props.navigation.goBack()
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
                        title={"Add GSTIN"}
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
                                        value={gstRequest.company_name}
                                        placeholder={"Company Name"}
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
                                            setGstRequest({
                                                ...gstRequest,
                                                company_name: text
                                            })
                                        }} />
                                </View>

                                <View style={{
                                    width: "90%", height: normalize(45), borderWidth: normalize(1),
                                    borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                                    alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                                    marginTop: normalize(15)
                                }}>
                                    <TextInput
                                        editable={!loading}
                                        value={gstRequest.gst_number}
                                        placeholder={"GST number"}
                                        textContentType="name"
                                        numberOfLines={1}
                                        autoCapitalize={true}
                                        maxLength={10}
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {
                                            setGstRequest({
                                                ...gstRequest,
                                                gst_number: text
                                            })
                                        }} />
                                </View>

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { addGST() }}
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