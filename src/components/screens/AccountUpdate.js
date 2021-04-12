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
import { getToken } from "../../utils/storage";

export default function Address(props) {

    const [loading, setLoading] = React.useState(0);
    const states = useSelector(state => state.user.stateList)

    const [accountRequest, setAccountRequest] = useState({
        full_name: "",
        
    })

    useEffect(() => {
        // getOrderList()
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            initAddress()
        });
        return unsubscribe
    }, [props.navigation])

    function initAddress() {
        if (props.route.params.forUpdate) {
            let address = props.route.params.addressDetails
            setAccountRequest({
                ...accountRequest,
                full_name: address.full_name,
                pincode: address.pincode,
                house_number: address.house_number,
                area: address.area,
                phone: address.phone,
                landmark: address.landmark,
                city: address.city,
                state_id: address.state_id
            })
        } else
            setAccountRequest({
                ...accountRequest,
                state_id: states[0].state_id
            })
    }



    function showAlert(message) {
        if (Platform.OS == "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            alert(message)
        }
    }
    async function addAddress(params) {

        if (accountRequest.full_name.length == 0) {
            showAlert("Enter fullname")
        } else if (accountRequest.pincode.length == 0) {
            showAlert("Enter pincode")
        } else if (accountRequest.house_number.length == 0) {
            showAlert("Enter house number")
        } else if (accountRequest.area.length == 0) {
            showAlert("Enter street name")
        } else if (accountRequest.phone.length == 0) {
            showAlert("Enter mobile number")
        } else if (accountRequest.city.length == 0) {
            showAlert("Enter city or district")
        } else {
            try {
                setLoading(true)
                let token = await getToken()
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }

                let urlKey = props.route.params.forUpdate ? "update" : "store"

                let request = {}
                if(props.route.params.forUpdate){
                    request = accountRequest
                    request.id = props.route.params.addressDetails.id
                }else{
                    request = accountRequest
                }

                let response =  await postRequest(`user/address/${urlKey}`, request, header)
                console.log("RESPOSNE", response)
                if (response.success) {
                    if (Platform.OS == "android") {
                        ToastAndroid.show("Address added successfully", ToastAndroid.SHORT)
                    } else {
                        alert("Address added successfully")
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
                                        value={accountRequest.full_name}
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
                                            setAccountRequest({
                                                ...accountRequest,
                                                full_name: text
                                            })
                                        }} />
                                </View>

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { addAddress() }}
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