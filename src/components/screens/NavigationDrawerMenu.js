import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { View, TouchableOpacity, Text, Image, SafeAreaView, ActivityIndicator, Linking, Alert, ScrollView } from "react-native"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getUserName, getEmail, getToken, setAddress, setToken, setUserId, clearAppData } from "../../utils/storage";
import { getRequest, postRequest } from "../../utils/apiRequest"
import { addToCartRequest } from "../../actions/ProductAction";

export default function NavigationDrawerMenu(props) {

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [isSignIn, setSignIn] = useState(false)

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getUserDetails()
        });
        return unsubscribe
    }, [])


    async function getUserDetails() {
        let token = await getToken()
        console.log("TOKEN", token)
        if (token != null && token != undefined && token.length > 0) {
            let userName = await getUserName()
            let email = await getEmail()
            console.log("GGG", userName)
            setUserName(userName)
            setEmail(email)
            setSignIn(true)
        } else {
            setSignIn(false)
        }
    }

    async function logout() {
        setLoading(true)
        let token = await getToken()
        let header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
        try {
            let response = await postRequest("user/logout", null, header)
        } catch (error) {
            console.log(error.message)
        }
        // setToken("")
        // setAddress("")
        // setUserId("")
        dispatch(addToCartRequest([]))
        await clearAppData()
        props.navigation.replace("SignedOutNavigator")
        ToastAndroid.show("You are logged out", ToastAndroid.SHORT);
        setLoading(false)

    }

    function showLogoutAlert() {
        Alert.alert(
            "Alert",
            "Are you sure you want to logout",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => logout() }
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, alignItems: "center" }}>

                <Image
                    style={{ width: normalize(160), height: normalize(120) }}
                    source={ImagePath.chooseIcon}
                    resizeMode="contain" />

                {isSignIn ? <Text style={{
                    color: Color.darkGrey, fontSize: normalize(16),
                    fontFamily: "Roboto-Bold"
                }}>{userName}</Text> : null}


                {isSignIn ?
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Regular"
                    }}>{email}</Text> : null}



                <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { props.navigation.navigate("Home") }}
                        style={{ width: "100%", alignItems: "center", marginTop: normalize(5), borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>HOME</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { props.navigation.navigate("All Categories") }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>ALL CATEGORIES</Text>
                    </TouchableOpacity>

                    {isSignIn ? <TouchableOpacity
                        disabled={loading}
                        onPress={() => { props.navigation.navigate("My Orders") }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>MY ORDERS</Text>
                    </TouchableOpacity> : null}

                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { props.navigation.navigate("Design With Us") }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>DESIGN WITH US</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={async() => { await Linking.openURL("https://buildboard-furnishers.web.app/");  }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>BECOME A SELLER</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { props.navigation.navigate("Settings") }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>SETTINGS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={async () => { await Linking.openURL("http://buildboardfurnishers.com/about-us"); }}
                        style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                        <Text style={{
                            color: Color.darkGrey, fontSize: normalize(12),
                            fontFamily: "Roboto-Medium", padding: normalize(15)
                        }}>ABOUT US</Text>
                    </TouchableOpacity>

                    {isSignIn ?
                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => { showLogoutAlert() }}
                            style={{ width: "100%", alignItems: "center", }}>
                            {
                                loading ? <ActivityIndicator style={{ marginTop: normalize(10) }} size="small" color={Color.navyBlue} /> :
                                    <Text style={{
                                        color: Color.darkGrey, fontSize: normalize(12),
                                        fontFamily: "Roboto-Medium", padding: normalize(15)
                                    }}>LOGOUT</Text>
                            }

                        </TouchableOpacity> :
                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => { props.navigation.navigate("SignedOutNavigator") }}
                            style={{ width: "100%", alignItems: "center", }}>
                            {
                                loading ? <ActivityIndicator style={{ marginTop: normalize(10) }} size="small" color={Color.navyBlue} /> :
                                    <Text style={{
                                        color: Color.darkGrey, fontSize: normalize(12),
                                        fontFamily: "Roboto-Medium", padding: normalize(15)
                                    }}>SIGN IN</Text>
                            }

                        </TouchableOpacity>}

                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: normalize(12), color: Color.grey, textAlign: "center",
                        marginTop: normalize(40),
                    }}>
                        You can follow us on
                            </Text>

                    <View style={{
                        flexDirection: "row", alignSelf: "center", marginTop: normalize(15),
                        alignItems: "center", marginBottom: normalize(20)
                    }}>
                        <TouchableOpacity
                            onPress={() => { Linking.openURL("https://www.facebook.com/buildboardfurnishers/") }}>
                            <Image
                                style={{ height: normalize(40), width: normalize(40) }}
                                source={ImagePath.fbIcon}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { Linking.openURL("https://www.instagram.com/buildboardfurnishers/?igshid=hi8trw08gw3r") }}
                            style={{ marginLeft: normalize(15), marginRight: normalize(15) }}>
                            <Image
                                style={{
                                    height: normalize(33), width: normalize(33),
                                }}
                                source={ImagePath.instaIcon}
                                resizeMode="cover" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => Linking.openURL("https://www.linkedin.com/m/company/buildboard-furnishers/")}>
                            <Image
                                style={{ height: normalize(30), width: normalize(30), }}
                                source={ImagePath.linkedIdIcon}
                                resizeMode="cover" />
                        </TouchableOpacity>

                    </View>
                </ScrollView>

            </View>
        </SafeAreaView>
    )


}