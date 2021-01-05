import React, {useEffect} from "react"
import { View, SafeAreaView, StatusBar, ImageBackground, Image } from "react-native"
import normalize from "../../utils/dimen";
import ImagePath from "../../assets/ImagePath"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';


export default function Splash(props) {

    useEffect(() => {
        immersiveModeOn()
        navigate()
    }, [])

    function navigate() {
        setTimeout(async () => {
            props.navigation.replace("SignedOutNavigator")
        }, 3000)
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