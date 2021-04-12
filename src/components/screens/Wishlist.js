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
    Image, ActivityIndicator,
    Platform
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { getToken } from "../../utils/storage";




export default function Wishlist(props) {

    const [categoryList, setCategoryList] = useState([])
    const [bannerList, setBannerList] = useState([])
    const [bannerImg, setBannerImg] = useState("")
    const [products, setProducts] = useState([])
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("Cat id: ", props.route.params)
        getWishlist()

    }, [])



    async function getWishlist() {
        setLoading(true)
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest("user/wishlist", header)
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
        setLoading(false)
    }

    async function deleteWishlist(id) {

        setLoading(true)
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest(`user/wishlist/${id}/delete`, header)
            console.log("RESPONSE", response)
            if (response.success) {
                getWishlist()
            } else {
                setLoading(false)
            }

        } catch (error) {
            console.log("ERROR", error)
            setLoading(false)
        }

    }



    function renderProductItem(data) {
        return (
            <TouchableOpacity style={{
                width: "40%",
                backgroundColor: Color.white,
                borderRadius: normalize(12), elevation: normalize(5), shadowColor: Color.black,
                shadowOpacity: 0.3, shadowRadius: normalize(5), shadowOffset: { height: 0, width: 0 },
                marginTop: normalize(10),
                marginBottom: ((data.index == products.length - 1) || ((data.index == products.length - 2)
                    && ((products.length - 2) % 2 == 0))) ? normalize(160) : normalize(10),
                marginLeft: normalize(10), marginRight: normalize(10), alignItems: "center",
                padding: normalize(10)
            }}
                onPress={() => {
                    props.navigation.navigate("ProductDetail", { productId: data.item.product.id })
                }}>
                <Image
                    style={{ width: "100%", height: normalize(110), borderRadius: normalize(6) }}
                    source={{ uri: data.item.product.image }}
                    resizeMode="cover" />
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontFamily: "Roboto-Regular",
                        fontSize: normalize(10), color: Color.darkGrey, textAlign: "center", marginTop: normalize(5),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {data.item.product.name.toUpperCase()}
                </Text>

                {/* <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontFamily: "Roboto-Light",
                        fontSize: normalize(7), color: Color.darkGrey, textAlign: "center", marginTop: normalize(2),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {`Category: ${data.item.product.category.name}`}
                </Text> */}

                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: normalize(16), color: Color.navyBlue, textAlign: "center", marginTop: normalize(5),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {`₹${data.item.product.price}`}
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        deleteWishlist(data.item.id)
                    }}
                    style={{ position: "absolute", top: normalize(2), right: normalize(2) }}>
                    <Image
                        style={{ width: normalize(10), height: normalize(15), margin: normalize(5) }}
                        source={ImagePath.delete}
                    />
                </TouchableOpacity>

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
                        title={"Wishlist"}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        {loading ? <ActivityIndicator size="large" color={Color.navyBlue} style={{ marginTop: normalize(10) }} /> : null}

                        <FlatList
                            style={{ width: "100%", }}
                            columnWrapperStyle={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            numColumns={2}
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