import React, { useState, useEffect, useRef } from 'react';
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
    Platform, Linking
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { Value } from 'react-native-reanimated';
import { getToken } from "../../utils/storage";




export default function Home(props) {

    var interval = null
    var bannerPager = useRef()
    const [isSignedIn, setSignedIn] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [bannerList, setBannerList] = useState([])
    const [bannerImg, setBannerImg] = useState("")
    const [newArrivalProducts, setNewArrivalProducts] = useState([])
    const [trendingProducts, setTrendingProducts] = useState([])

    useEffect(() => {
        immersiveModeOff()
        initialize()
        getBanner()
        getCategoryList()
        getNewArrivalProducts()
        getTrendingProducts()
        return () => {
            if (interval)
                clearInterval(interval)
        }
    }, [])

    async function initialize() {
        try {
            let token = await getToken()
            if (token != null && token != undefined && token.length > 0) {
                setSignedIn(true)
            } else {
                setSignedIn(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getCategoryList() {
        try {
            let response = await getRequest("user/category")
            console.log("RESPONSE", response)
            let categoryList = []
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].show_on_home == "Yes") {
                    categoryList.push(response.data[i])
                }
            }
            // if (categoryList.length > 9) {
            //     var trimmedCategories = categoryList.slice(0, 9)
            //     trimmedCategories.push({})
            //     setCategoryList(trimmedCategories)
            // } else setCategoryList(categoryList)

            setCategoryList(categoryList)

        } catch (error) {
            console.log("ERROR", error)
        }
    }

    async function getBanner() {
        try {
            let response = await getRequest("user/banners")
            console.log("RESPONSE", response)
        
            let bannerList = []
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].type != "Web") {
                    bannerList.push(response.data[i])
                }
            }
            if (bannerList.length > 0) {
                setBannerImg(bannerList[0].image)
                setBannerList(bannerList)
                console.log('banner list : ', bannerList.length)
                changeBanner(bannerList)
            }

        } catch (error) {
            console.log("ERROR", error)
        }

    }

    function changeBanner(bannerList) {
        var count = 0
        interval = setInterval(function () {
            if (bannerPager!= undefined && bannerPager != null) {
                bannerPager.current.setPage(count)
                if (count == (bannerList.length - 1)) {
                    count = 0
                } else {
                    count++
                }
            }
        }, 3000);
    }

    async function getNewArrivalProducts() {
        try {
            let response = await getRequest("user/products")
            console.log("RESPONSE", response)
            if (response.data.length > 10) {
                var trimmedProducts = response.data.slice(0, 10)
                setNewArrivalProducts(trimmedProducts)
            } else if(response.data.length > 10) {
                setNewArrivalProducts(response.data)
            }

        } catch (error) {
            console.log("ERROR", error)
        }
    }
    async function getTrendingProducts() {
        try {
            let response = await getRequest("user/products")
            console.log("RESPONSE", response)
            if (response.data.length > 10) {
                var trimmedProducts = response.data.slice(0, 10)
                setTrendingProducts(trimmedProducts.reverse())
            } else if(response.data.length > 10) {
                setTrendingProducts(response.data.reverse())
            }

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


    function renderCategoryItem(data) {
        return (
            <TouchableOpacity style={{
                marginTop: normalize(10), marginBottom: normalize(5),
                marginLeft: normalize(12), marginRight: normalize(12), alignItems: "center"
            }}
                onPress={() => {
                    // if (data.index == 9) {
                    //     props.navigation.navigate("All Categories")
                    // } else {
                    //     props.navigation.navigate("ProductList", { categoryId: data.item.id, categoryName: data.item.name })
                    // }
                    props.navigation.navigate("ProductList", { categoryId: data.item.id, categoryName: data.item.name })
                }}>
                <Image
                    style={{ height: normalize(32), width: normalize(32), }}
                    // source={data.index == 9 ? ImagePath.more : ImagePath.cabinet}
                    source={{ uri: data.item.icon }}
                    resizeMode="cover" />
                <Text
                    numberOfLines={2}
                    style={{
                        width: normalize(50), fontFamily: "Roboto-Regular",
                        fontSize: normalize(10), color: Color.navyBlue, textAlign: "center", marginTop: normalize(2)
                    }}>
                    {/* {data.index == 9 ? "MORE" : data.item.name.toUpperCase()} */}
                    {data.item.name.toUpperCase()}
                </Text>

            </TouchableOpacity>
        )
    }

    function renderNewArrivalItem(data) {
        return (
            <TouchableOpacity style={{
                width: normalize(120),
                height: normalize(145),
                backgroundColor: Color.white,
                borderRadius: normalize(8), elevation: normalize(5), shadowColor: Color.black,
                shadowOpacity: 0.3, shadowRadius: normalize(5), shadowOffset: { height: 0, width: 0 },
                marginTop: normalize(10), marginBottom: normalize(20),
                marginLeft: normalize(15), marginRight: normalize(4), alignItems: "center", justifyContent: "center",
                padding: normalize(10)
            }}
                onPress={() => {
                    props.navigation.navigate("ProductList")
                }}>
                <Image
                    style={{ width: "100%", height: normalize(90), borderRadius: normalize(4) }}
                    source={{ uri: data.item.image }}
                    resizeMode="contain" />
                <Text
                    numberOfLines={2}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: normalize(12), color: Color.grey, textAlign: "center", marginTop: normalize(5)
                    }}>
                    {data.item.name.toUpperCase()}
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
                        showWishlist={isSignedIn}
                        isSignedIn={isSignedIn}
                        onDrawerButtonPressed={() => {
                            props.navigation.openDrawer()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <TouchableOpacity style={{
                            width: "90%", height: normalize(45), borderWidth: normalize(1),
                            borderRadius: normalize(25), flexDirection: "row", justifyContent: "space-between",
                            alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                            marginTop: normalize(10), marginBottom: normalize(10)
                        }}
                            onPress={() => props.navigation.navigate("Search")}>
                            <Text style={{
                                fontSize: normalize(14), fontFamily: "Roboto-Regular",
                                color: Color.grey
                            }}>Search</Text>
                            <Image
                                style={{ width: normalize(20), height: normalize(20) }}
                                source={ImagePath.search}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <ScrollView style={{ width: "100%" }}
                            showsVerticalScrollIndicator={false}>

                            {bannerList.length > 0 ?
                                <ViewPager
                                    ref={bannerPager}
                                    pageMargin={normalize(10)}
                                    style={{ width: "100%", aspectRatio: 1 / 0.55, marginTop: normalize(5) }}>
                                    {bannerList.map((value, index) => {
                                        return (
                                            <View
                                                collapsable={false}
                                                key={index}
                                                style={{ width: "100%", height: "100%", marginTop: normalize(10) }}>
                                                <Image
                                                    style={{ width: "100%", height: "100%", }}
                                                    source={{ uri: value.image }} />
                                            </View>
                                        )
                                    })}

                                </ViewPager> : null}

                            {categoryList.length > 0 ? <Text style={{
                                fontFamily: "Roboto-Regular", fontSize: normalize(12),
                                color: Color.darkGrey, marginTop: normalize(5), marginBottom: normalize(5),
                                marginStart: "6%"
                            }}>Categories</Text> : null}

                            <FlatList
                                style={{ alignSelf: "center", }}
                                numColumns={4}
                                data={categoryList}
                                renderItem={(data) => renderCategoryItem(data)}
                                keyExtractor={(item, index) => index.toString()}
                            />

                            {newArrivalProducts.length > 0 ?
                                <Text style={{
                                    fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue,
                                    marginLeft: "6%", marginTop: normalize(20)
                                }}>New Arrivals</Text> : null}

                            {
                                newArrivalProducts.length > 0 ?
                                    <FlatList
                                        horizontal={true}
                                        style={{ width: "100%" }}
                                        data={newArrivalProducts}
                                        renderItem={(data) => renderNewArrivalItem(data)}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false} /> :
                                    null
                            }

                            {trendingProducts.length > 0 ?
                                <Text style={{
                                    fontSize: normalize(14), fontFamily: "Roboto-Medium", color: Color.navyBlue,
                                    marginLeft: "6%", marginTop: normalize(5)
                                }}>Trending</Text> : null}


                            {
                                trendingProducts.length > 0 ?
                                    <FlatList
                                        horizontal={true}
                                        style={{ width: "100%", marginBottom: normalize(120) }}
                                        data={trendingProducts}
                                        renderItem={(data) => renderNewArrivalItem(data)}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false} /> : null
                            }

                        </ScrollView>

                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}