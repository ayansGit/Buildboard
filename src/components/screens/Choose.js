import React, {useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
    Platform
} from 'react-native';
import { SwitchActions } from "@react-navigation/compat"
import Color from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';


export default function Choose(props) {

    useEffect(() => {
        immersiveModeOff()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == "android" ?
                <StatusBar hidden={false} barStyle="dark-content" backgroundColor={Color.white} /> :
                <StatusBar hidden={false} />}

            <SafeAreaView style={{ flex: 1 }}>
                <View style={Platform.OS == "android" ? { flex: 1, alignItems: "center", backgroundColor: Color.white } :
                    { flex: 1, alignItems: "center" }}>

                    <Image
                        style={{ width: normalize(250), height: normalize(194), marginTop: normalize(40) }}
                        source={ImagePath.chooseIcon}
                        resizeMode="contain" />
                    <TouchableOpacity
                        style={{ width: "80%", height: normalize(45), marginTop: normalize(40) }}>
                        <ImageBackground
                            style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                            source={ImagePath.gradientButton}
                            resizeMode="stretch">
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontFamily: "Roboto-Medium",
                                    color: Color.white
                                }}>LOGIN</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: "80%", height: normalize(45), justifyContent: "center", alignItems: "center",
                            marginTop: normalize(20), borderWidth: normalize(1), borderRadius: normalize(25)
                        }}>
                        <Text
                            style={{
                                fontSize: normalize(14),
                                fontFamily: "Roboto-Medium",
                                color: Color.navyBlue
                            }}>REGISTER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        position: "absolute", right: normalize(12), bottom: normalize(15),
                        marginRight: normalize(15)
                    }}
                        onPress={() => {
                            props.navigation.replace("SignedInNavigator")
                        }}>
                        <Text style={{
                            fontSize: normalize(15),
                            fontFamily: "Roboto-Bold",
                            color: Color.navyBlue
                        }}>SKIP AND EXPLORE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}