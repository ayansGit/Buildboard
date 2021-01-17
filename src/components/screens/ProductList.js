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




export default function ProductList(props) {

    const [categoryList, setCategoryList] = useState([])
    const [bannerList, setBannerList] = useState([])
    const [bannerImg, setBannerImg] = useState("")
    const [products, setProducts] = useState([])
    const [title, setTitle] = useState("")

    useEffect(() => {
        console.log("Cat id: ", props.route.params)
        if (props.route.params != undefined) {
            setTitle(props.route.params.categoryName)
            getProductsByCategory(props.route.params.categoryId)
        } else {
            getProducts()
        }
    }, [])



    async function getProducts() {
        try {
            let response = await getRequest("user/products")
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
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
                    props.navigation.navigate("ProductDetail", { productId: data.item.id })
                }}>
                <Image
                    style={{ width: "100%", height: normalize(110), borderRadius: normalize(6) }}
                    source={{ uri: data.item.image }}
                    resizeMode="cover" />
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontFamily: "Roboto-Regular",
                        fontSize: normalize(10), color: Color.darkGrey, textAlign: "center", marginTop: normalize(5),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {data.item.name.toUpperCase()}
                </Text>

                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontFamily: "Roboto-Light",
                        fontSize: normalize(7), color: Color.darkGrey, textAlign: "center", marginTop: normalize(2),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {`Category: ${data.item.category.name}`}
                </Text>

                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: normalize(16), color: Color.navyBlue, textAlign: "center", marginTop: normalize(5),
                        marginStart: normalize(5), marginEnd: normalize(5)
                    }}>
                    {`₹${data.item.price}`}
                </Text>

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
                        title={title}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <TouchableOpacity style={{
                            width: "90%", height: normalize(45), borderWidth: normalize(1),
                            borderRadius: normalize(25), flexDirection: "row", justifyContent: "space-between",
                            alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                            marginTop: normalize(10)
                        }}>
                            <Text style={{
                                fontSize: normalize(14), fontFamily: "Roboto-Regular",
                                color: Color.grey
                            }}>Search</Text>
                            <Image
                                style={{ width: normalize(20), height: normalize(20) }}
                                source={ImagePath.search}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: "row", alignSelf: "flex-end", marginEnd: "5%", marginTop: normalize(10),
                            marginBottom: normalize(10)
                        }}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: normalize(5) }}>
                                <Image
                                    style={{ height: normalize(12), width: normalize(12), alignItems: "center" }}
                                    resizeMode="contain"
                                    source={ImagePath.sort} />
                                <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Medium", color: Color.darkGrey }}>Sort</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: normalize(5) }}>
                                <Image
                                    style={{ height: normalize(14), width: normalize(14), }}
                                    resizeMode="contain"
                                    source={ImagePath.filter} />
                                <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Medium", color: Color.darkGrey, }}>Filter</Text>
                            </TouchableOpacity>
                        </View>
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