import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity, ImageBackground,
    Image,
    TextInput,
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
import { RadioButton, FAB } from 'react-native-paper';

export default function Address(props) {

    const [loading, setLoading] = React.useState(0);

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

                    <View style={{ width: "100%", alignItems: "center" }}>
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

                                        placeholder={"Mobile number"}
                                        textContentType="name"
                                        numberOfLines={1}
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {

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

                                        placeholder={"House or Apartment number"}
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

                                        placeholder={"Street name"}
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

                                        placeholder={"Pincode"}
                                        keyboardType="number-pad"
                                        numberOfLines={1}
                                        returnKeyType="next"
                                        placeholderTextColor={Color.grey}
                                        style={{
                                            width: "95%",
                                            fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                            fontSize: normalize(14)
                                        }}
                                        onChangeText={(text) => {

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

                                        placeholder={"Nearest Landmark"}
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

                                        placeholder={"City or District"}
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

                                        }} />
                                </View>

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => { }}
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

                    </View>

                </View>
            </SafeAreaView>
        </View >
    )
}