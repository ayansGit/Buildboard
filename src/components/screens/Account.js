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
    Image,
    Platform
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

export default function Account(props) {

    const [showAddressDialog, setShowAddressDialog] = useState(false)

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

                    <View style={{ width: "100%", alignItems: "center" }}>

                        <ScrollView style={{ width: "100%", height: "100%" }}>
                            <View style={{ width: "100%", alignItems: "center" }}>
                                <TouchableOpacity style={{
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
                                        }}>8981170012</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                <TouchableOpacity style={{
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
                                        }}>Jon Doe</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                <TouchableOpacity style={{
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
                                        }}>jon.doe@gmail.com</Text>
                                    </View>

                                    <Image
                                        style={{ height: normalize(20), width: normalize(20) }}
                                        source={ImagePath.edit} />

                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    width: "90%", flexDirection: "row", borderRadius: normalize(4),
                                    padding: normalize(10), marginTop: normalize(5), backgroundColor: Color.white,
                                    elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-between", alignItems: "center",
                                    shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                    marginBottom: normalize(20)
                                }}
                                onPress = {() => props.navigation.navigate("AddressList")}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(9), color: Color.darkGrey }}>Address</Text>
                                        <Text
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                            style={{
                                                fontFamily: "Roboto-Medium", fontSize: normalize(14),
                                                marginTop: normalize(5), color: Color.navyBlue
                                            }}>{"99/55 M.G. Road, Kolkata 700041, West Bengal"}</Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}