import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, KeyboardAvoidingView,
    Text, TextInput,
    StatusBar,
    FlatList,
    TouchableOpacity, ActivityIndicator,
    Image, ImageBackground,
    Platform,
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { Value } from 'react-native-reanimated';
import { showAlert } from "../../utils/Utils"



export default function FAQ(props) {

    const [loading, setLoading] = useState(false)
    const [position, setPosition] = useState(-1)
    const [faq, setFaq] = useState([])

    useEffect(() => {
        getFAQ()
    }, [])

    async function getFAQ() {

        setLoading(true)
        try {
            let response = await getRequest("user/faqs")
            console.log("Response: ", response)
            setFaq(response.data)
        } catch (error) {
            alert(error)
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
                        navigation={props.navigation}
                        containNavDrawer={false}
                        title={"FAQ"}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />

                    {loading ? <ActivityIndicator size="large" style={{ marginTop: normalize(15) }} /> : null}

                    <FlatList
                        style={{ width: "100%" }}
                        data={faq}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(data) => {
                            return (
                                <View style={{ width: "100%" }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (data.index == position)
                                                setPosition(-1)
                                            else setPosition(data.index)
                                        }}
                                        style={{
                                            flexDirection: "row", width: "100%", justifyContent: "space-between",
                                            alignItems: "center", padding: normalize(15), borderBottomWidth: normalize(1),
                                            borderBottomColor: Color.grey
                                        }}>
                                        <Text style={{ width: "90%", fontFamily: "Roboto-Medium", fontSize: normalize(12), }}>{`${data.index+1}. ${data.item.question}`}</Text>
                                        <Image
                                            style={{ width: normalize(14), height: normalize(14) }}
                                            source={position == data.index ? ImagePath.up_arrow : ImagePath.down_arrow} />
                                    </TouchableOpacity>

                                    {position == data.index ?
                                        <Text style={{
                                            fontFamily: "Roboto-Regular", fontSize: normalize(12), padding: normalize(15), borderBottomWidth: normalize(1),
                                            borderBottomColor: Color.grey
                                        }}>{data.item.answer}</Text> : null}

                                </View>
                            )
                        }}
                    />
                </View>
            </SafeAreaView>
        </View >
    )
}