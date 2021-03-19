import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { View, TouchableOpacity, Text, Image, SafeAreaView, Linking } from "react-native"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getUserName, getEmail, getToken } from "../../utils/storage";
import { setEnabled } from 'react-native/Libraries/Performance/Systrace';

export default function NavigationDrawerMenu(props) {

    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [isSignIn, setSignIn] = useState(false)

    useEffect(() => {
        getUserDetails()
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


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, alignItems: "center" }}>

                <Image
                    style={{ width: normalize(160), height: normalize(140) }}
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



                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("Home") }}
                    style={{ width: "100%", alignItems: "center", marginTop: normalize(5), borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>HOME</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("Design With Us") }}
                    style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>DESIGN WITH US</Text>
                </TouchableOpacity>

                {isSignIn ? <TouchableOpacity
                    onPress={() => { props.navigation.navigate("My Orders") }}
                    style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>MY ORDERS</Text>
                </TouchableOpacity> : null}


                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("Settings") }}
                    style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>SETTINGS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => { await Linking.openURL("http://buildboardfurnishers.com/about-us"); }}
                    style={{ width: "100%", alignItems: "center", }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>ABOUT US</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )


}