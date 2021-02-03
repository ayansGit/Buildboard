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
import Icon from "react-native-vector-icons/MaterialIcons"

export default function AddressList(props) {

    const [value, setValue] = React.useState(0);

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
                        title={"Choose Address"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    <View style={{ width: "100%", alignItems: "center" }}>
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    style={{ width: "100%" }}
                                    data={[1, 2, 3, 4, 5, 6, 7, 8]}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(data) => {
                                        return (
                                            <TouchableOpacity style={{
                                                width: "95%", flexDirection: "row", borderRadius: normalize(4),
                                                padding: normalize(10), paddingEnd: normalize(5), marginTop: normalize(10), backgroundColor: Color.white,
                                                elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-around",
                                                shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                                marginBottom: data.index == 7 ? normalize(70) : normalize(10), alignItems: "flex-start", alignSelf: "center"
                                            }}
                                            onPress = {() => props.navigation.navigate("Address")}>
                                                <RadioButton value={data.index} />

                                                <View style={{ width: "75%" }}>
                                                    <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(14), color: Color.darkGrey }}>Ayan Chakraborty</Text>
                                                    <Text style={{
                                                        fontFamily: "Roboto-Medium", fontSize: normalize(11),
                                                        marginTop: normalize(5), color: Color.navyBlue
                                                    }}>99/55 MG Road, Kolkata 700041,  West bengal</Text>
                                                </View>

                                                <TouchableOpacity>
                                                    <Image
                                                        style={{ height: normalize(12), width: normalize(12), margin: normalize(5) }}
                                                        source={ImagePath.delete}
                                                        resizeMode="contain" />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }} />

                            </RadioButton.Group>
                        </View>
                    </View>

                    <FAB
                        style={{
                            position: 'absolute',
                            margin: 16,
                            right: 0,
                            bottom: 0,
                        }}
                        label="Add Address"
                        onPress={() => console.log('Pressed')}
                    />
                </View>
            </SafeAreaView>
        </View >
    )
}