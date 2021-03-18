import React, { useEffect } from "react"
import { View, SafeAreaView, StatusBar, ImageBackground, Image } from "react-native"
import normalize from "../../utils/dimen";
import ImagePath from "../../assets/ImagePath"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import { getToken } from "../../utils/storage";
import { getRequest } from "../../utils/apiRequest"
import { addToCartRequest } from "../../actions/ProductAction";
import { useSelector, useDispatch } from "react-redux"


export default function Splash(props) {

    const dispatch = useDispatch()

    useEffect(() => {
        immersiveModeOn()
        navigate()
    }, [])

    function navigate() {
        setTimeout(async () => {
            let token = await getToken()
            console.log("TOKEN", token)
            if (token != null && token != undefined && token.length > 0) {
                await getCartList(token)
                props.navigation.replace("SignedInNavigator")
            } else
                props.navigation.replace("SignedOutNavigator")
        }, 2000)
    }

    async function getCartList(token) {
        try {
            let token = await getToken()
                let header = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            let response = await getRequest(`user/cart/list`, header)
            console.log("RESPONSE", response)
            if(response.success){
                dispatch(addToCartRequest(response.data))
            }

        } catch (error) {
            console.log("ERROR", error)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar hidden={true} />
            <ImageBackground
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                source={ImagePath.splash}>
                <Image
                    style={{ width: normalize(250), height: normalize(194) }}
                    source={ImagePath.splashLogo}
                    resizeMode="contain" />
            </ImageBackground>
        </View>
    )
}