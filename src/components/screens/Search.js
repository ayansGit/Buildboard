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
    Image, TextInput,
    Platform,
    ActivityIndicator
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";




export default function Search(props) {

    const [categoryList, setCategoryList] = useState([])
    const [bannerList, setBannerList] = useState([])
    const [bannerImg, setBannerImg] = useState("")
    const [products, setProducts] = useState([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)



    async function getProducts(keyword) {
        setLoading(true)
        try {
            let response = await postRequest("user/search", { keyword: keyword })
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
        setLoading(false)
    }

    async function getProductsByCategory(id) {
        try {
            let response = await getRequest(`user/category/${id}/products`)
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }


    function renderProductPlaceholder() {
        return (
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center" >
                    <SkeletonPlaceholder.Item
                        marginTop={normalize(10)}
                        marginBottom={normalize(10)}
                        marginLeft={normalize(12)}
                        marginRight={normalize(12)}>
                        <SkeletonPlaceholder.Item
                        />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        )
    }


    function renderProductItem(data) {
        return (
            <TouchableOpacity style={{
                width: "100%",
                marginBottom: data.index == products.length - 1 ? normalize(160) : 0,
                borderBottomWidth: normalize(1),
                borderBottomColor: data.index == products.length - 1 ? 'transparent' : Color.veryLightGrey,
            }}
                onPress={() => {
                    props.navigation.navigate("ProductDetail", { productId: data.item.product_id })
                }}>

                <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(12), color: Color.darkGrey, margin: normalize(15) }}>{data.item.name}</Text>

            </TouchableOpacity>
        )
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
                        title={""}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <View style={{
                            width: "90%", height: normalize(45), borderWidth: normalize(1),
                            borderRadius: normalize(25), flexDirection: "row", justifyContent: "flex-start",
                            alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                            marginTop: normalize(10)
                        }}>
                            <TextInput
                                autoFocus={true}
                                style={{
                                    width: "100%", fontSize: normalize(14), fontFamily: "Roboto-Regular",
                                    color: Color.darkGrey,
                                }}
                                value={keyword}
                                returnKeyType="search"
                                onSubmitEditing={() => {
                                    //getProducts(keyword)
                                    props.navigation.navigate("ProductList", { keyword: keyword })
                                }}
                                onChangeText={(text) => {
                                    setKeyword(text)
                                    if (text.length > 2)
                                        getProducts(text)
                                }}
                                clearButtonMode="while-editing" />

                            {keyword.length == 0 ?
                                <Image
                                    style={{ width: normalize(20), height: normalize(20), position: "absolute", end: normalize(15) }}
                                    source={ImagePath.search}
                                    resizeMode="contain" /> : null}

                        </View>

                        {loading ?
                            <ActivityIndicator style={{ marginTop: normalize(10), marginBottom: normalize(10) }} color={Color.navyBlue} size="large" /> : null}


                        <FlatList
                            style={{ width: "100%", marginTop: normalize(10) }}
                            data={products}
                            renderItem={(data) => renderProductItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}