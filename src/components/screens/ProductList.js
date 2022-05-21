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
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SortModal, { SortType } from "../common/SortModal"
import NewFilterModal from "../common/NewFilterModal"




export default function ProductList(props) {

    const [categoryList, setCategoryList] = useState([])
    const [bannerList, setBannerList] = useState([])
    const [bannerImg, setBannerImg] = useState("")
    const [products, setProducts] = useState([])
    const [title, setTitle] = useState("")
    const [viewSort, setViewSort] = useState(false)
    const [viewFilter, setViewFilter] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [catId, setCatId] = useState(-1)
    const [showFilterOption, setShowFilterOption] = useState(true)

    useEffect(() => {
        console.log("Cat id: ", props.route.params)
        if (props.route.params != undefined) {
            if (props.route.params.categoryName != undefined) {
                setShowFilterOption(false)
                setTitle(props.route.params.categoryName)
                getProductsByCategory(props.route.params.categoryId)
            } else if (props.route.params.keyword) {
                getProductsBySearch(props.route.params.keyword)
            }

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
        setCatId(id)
        try {
            let response = await getRequest(`user/category/${id}/products`)
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }

    async function getProductsBySearch(keyword) {
        setKeyword(keyword)
        try {
            let response = await postRequest("user/search", { keyword: keyword })
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }

    async function clearFilter() {

        if (keyword.length > 0) {
            try {
                let response = await postRequest("user/search", { keyword: keyword })
                console.log("RESPONSE", response)
                setProducts(response.data)

            } catch (error) {
                console.log("ERROR", error)
            }
        } else if (catId != -1) {
            getProductsByCategory(catId)
        } else {
            getProducts()
        }

    }

    async function getProductsByFilter(value) {
        let request = value
        // if(keyword.length > 0){
        //     request.keyword = keyword
        // }
        request.keyword = keyword
        try {
            let response = await postRequest("user/search", request)
            console.log("RESPONSE", response)
            setProducts(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }


    function sortProduct(sortType) {
        console.log("gg", sortType)
        if (products.length > 0) {

            let productArr = products
            switch (sortType) {

                case 0: {
                    productArr.sort(dynamicSort("name"))
                    break
                }

                case 1: {
                    productArr.sort(dynamicSort("-name"))
                    break
                }

                case 2: {
                    console.log("HTL")
                    let arr = productArr
                    arr.sort(function (product1, product2) { return ( getProductDisplayPrice(product2) - getProductDisplayPrice(product1)) })
                    productArr = arr
                    break

                }

                case 3: {
                    console.log("LTH")
                    let arr = productArr
                    arr.sort(function (product1, product2) { return ( getProductDisplayPrice(product2) - getProductDisplayPrice(product1)) })
                    productArr = arr.reverse()
                    break
                }

            }
            setProducts(productArr)
        }

    }

    function getProductDisplayPrice(product){
        return product.offer_price ? product.offer_price: product.price
    }
    function dynamicSort(property) {
        var sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            if (sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    }


    function renderProductItem(data) {
        return (
            <TouchableOpacity style={{
                width: "40%", height: normalize(200),
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
                    props.navigation.navigate("ProductDetail", { productId: data.item.product_id })
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

                {
                    data.item.offer_price ?
                        <View style={{ flexDirection: "row", marginTop: normalize(2), marginTop: normalize(5), }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: "Roboto-Light",
                                    fontSize: normalize(10), color: Color.grey, textAlign: "center",
                                    marginStart: normalize(5), textDecorationLine: "line-through"
                                }}>
                                {`₹${data.item.price}`}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: "Roboto-Light",
                                    fontSize: normalize(10), color: Color.red, textAlign: "center",
                                    marginStart: normalize(2), marginEnd: normalize(5)
                                }}>
                                {`${data.item.percentage_off}% Off`}
                            </Text>
                        </View> : null
                }

                <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: normalize(16), color: Color.navyBlue, textAlign: "center",
                        marginStart: normalize(5), marginEnd: normalize(5), marginTop: data.item.offer_price? normalize(0):normalize(5)
                    }}>
                    {data.item.offer_price ? `₹${data.item.offer_price}`: `₹${data.item.price}`}
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
                    <SortModal
                        visible={viewSort}
                        onRequestClose={() => setViewSort(false)}
                        onSortItemSelected={(sortType) => {
                            setViewSort(false)
                            console.log("SORT: ", sortType)
                            sortProduct(sortType)

                        }} />

                    <NewFilterModal
                        visible={viewFilter}
                        onRequestClose={() => setViewFilter(false)}
                        clearFilter={() => {
                            setViewFilter(false)
                            clearFilter()
                        }}
                        onFilterApply={(value) => {
                            setViewFilter(false)
                            getProductsByFilter(value)
                        }}
                    />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <TouchableOpacity style={{
                            width: "90%", height: normalize(45), borderWidth: normalize(1),
                            borderRadius: normalize(25), flexDirection: "row", justifyContent: "space-between",
                            alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                            marginTop: normalize(10)
                        }}
                            onPress={() => props.navigation.navigate("Search")}>
                            <Text style={{
                                fontSize: normalize(14), fontFamily: "Roboto-Regular",
                                color: Color.grey
                            }}>{keyword}</Text>
                            <Image
                                style={{ width: normalize(20), height: normalize(20) }}
                                source={ImagePath.search}
                                resizeMode="contain" />
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: "row", alignSelf: "flex-end", marginEnd: "5%", marginTop: normalize(10),
                            marginBottom: normalize(10)
                        }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", padding: normalize(5) }}
                                onPress={() => setViewSort(true)}>
                                <Image
                                    style={{ height: normalize(12), width: normalize(12), alignItems: "center" }}
                                    resizeMode="contain"
                                    source={ImagePath.sort} />
                                <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Medium", color: Color.darkGrey }}>Sort</Text>
                            </TouchableOpacity>
                            {showFilterOption ?
                                <TouchableOpacity
                                    onPress={() => setViewFilter(true)}
                                    style={{ flexDirection: "row", alignItems: "center", padding: normalize(5) }}>
                                    <Image
                                        style={{ height: normalize(14), width: normalize(14), }}
                                        resizeMode="contain"
                                        source={ImagePath.filter} />
                                    <Text style={{ fontSize: normalize(12), fontFamily: "Roboto-Medium", color: Color.darkGrey, }}>Filter</Text>
                                </TouchableOpacity> : null}

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