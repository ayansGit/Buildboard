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
    Image, ActivityIndicator,
    Platform,
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import AddressDialog from "../common/AddressDialog"
import { getToken, getAddress } from "../../utils/storage";

export default function Account(props) {

    const TAG = "Account"
    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState({
        phone: "",
        full_name: "",
        email: "",
        address: ""
    })


    useEffect(() => {
        // getOrderList()
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getAccount()
        });
        return unsubscribe
    }, [props.navigation])



    async function getAccount() {

        setLoading(true)
        try {
            let token = await getToken()
            let addressVal = await getAddress()
            // if (addressVal != null && addressVal != undefined && addressVal.length > 0) {
            //     setAccount({
            //         ...account,
            //         address: addressVal
            //     })
            // }

            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest("user/profile", header)
            console.log(TAG, "-> Account Response: ", JSON.stringify(response))
            setAccount({
                address: (addressVal != null && addressVal != undefined && addressVal.length > 0) ? addressVal: "",
                phone: response.data.phone,
                full_name: response.data.full_name,
                email: response.data.email,
            })
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
                        title={"Account"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    {loading ? <ActivityIndicator size="large" color={Color.navyBlue} /> : null}

                    <View style={{ width: "100%", alignItems: "center" }}>

                        <ScrollView style={{ width: "100%", height: "100%" }}>
                            <View style={{ width: "100%", alignItems: "center" }}>
                                <TouchableOpacity
                                    disabled={loading}
                                    style={{
                                        width: "90%", flexDirection: "row", borderRadius: normalize(4),
                                        padding: normalize(10), marginTop: normalize(20), backgroundColor: Color.white,
                                        elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-between", alignItems: "center",
                                        shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                        marginBottom: normalize(10)
                                    }}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(9), color: Color.darkGrey }}>Mobile No</Text>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            marginTop: normalize(5), color: Color.navyBlue
                                        }}>{account.phone}</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={loading}
                                    style={{
                                        width: "90%", flexDirection: "row", borderRadius: normalize(4),
                                        padding: normalize(10), marginTop: normalize(5), backgroundColor: Color.white,
                                        elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-between", alignItems: "center",
                                        shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                        marginBottom: normalize(10)
                                    }}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(9), color: Color.darkGrey }}>Full Name</Text>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            marginTop: normalize(5), color: Color.navyBlue
                                        }}>{account.full_name}</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={loading}
                                    style={{
                                        width: "90%", flexDirection: "row", borderRadius: normalize(4),
                                        padding: normalize(10), marginTop: normalize(5), backgroundColor: Color.white,
                                        elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-between", alignItems: "center",
                                        shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                        marginBottom: normalize(10)
                                    }}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(9), color: Color.darkGrey }}>Email</Text>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                            marginTop: normalize(5), color: Color.navyBlue
                                        }}>{account.email}</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                {/* <TouchableOpacity
                                    disabled={loading}
                                    style={{
                                        width: "90%", flexDirection: "row", borderRadius: normalize(4),
                                        padding: normalize(10), marginTop: normalize(5), backgroundColor: Color.white,
                                        elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-between", alignItems: "center",
                                        shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                        marginBottom: normalize(20)
                                    }}
                                    onPress={() => {
                                        // if (account.address != undefined) {
                                        //     props.navigation.navigate("AddressList")
                                        // } else {
                                        //     props.navigation.navigate("Address")
                                        // }
                                        props.navigation.navigate("AddressList", {isAccount: true})
                                    }}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(9), color: Color.darkGrey }}>Address</Text>
                                        {account.address != undefined ?
                                            <Text
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                                style={{
                                                    fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                    marginTop: normalize(5), color: Color.navyBlue
                                                }}>{account.address}</Text> : null}
                                    </View>
                                    {((account.address == "") || (account.address == undefined)) ?
                                        !loading ?
                                            <Image
                                                style={{ height: normalize(15), width: normalize(15) }}
                                                source={ImagePath.add} /> : null : null}

                                </TouchableOpacity> */}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}