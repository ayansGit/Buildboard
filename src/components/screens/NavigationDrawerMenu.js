import React from "react"
import { View, TouchableOpacity, Text, Image, SafeAreaView, Linking } from "react-native"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';


export default function NavigationDrawerMenu(props) {


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, alignItems: "center" }}>

                <Image
                    style={{ width: normalize(160), height: normalize(140) }}
                    source={ImagePath.chooseIcon}
                    resizeMode="contain" />

                <Text style={{
                    color: Color.darkGrey, fontSize: normalize(16),
                    fontFamily: "Roboto-Bold"
                }}>Jon Doe</Text>

                <Text style={{
                    color: Color.darkGrey, fontSize: normalize(12),
                    fontFamily: "Roboto-Regular"
                }}>jon.doe@yopmail.com</Text>


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

                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("My Orders") }}
                    style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>MY ORDERS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { props.navigation.navigate("Settings") }}
                    style={{ width: "100%", alignItems: "center", borderBottomWidth: normalize(1), borderBottomColor: Color.darkGrey }}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>SETTINGS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async() => { await Linking.openURL("http://buildboardfurnishers.com/about-us"); }}
                    style={{ width: "100%", alignItems: "center",}}>
                    <Text style={{
                        color: Color.darkGrey, fontSize: normalize(12),
                        fontFamily: "Roboto-Medium", padding: normalize(15)
                    }}>ABOUT US</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )


}