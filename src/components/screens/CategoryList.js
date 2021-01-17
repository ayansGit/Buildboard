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




export default function CategoryList(props) {

    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        console.log("Cat id: ", props.route.params)
        getCategoryList()
    }, [])

    async function getCategoryList() {
        try {
            let response = await getRequest("user/category")
            console.log("RESPONSE", response)
            setCategoryList(response.data)

        } catch (error) {
            console.log("ERROR", error)
        }
    }


    function renderCategoryItem(data) {
        return (
            <TouchableOpacity style={{
                alignSelf: "stretch", flexDirection: "row",
                marginStart: "5%", marginEnd: "5%",
                marginTop: normalize(5),
                marginBottom: data.index==categoryList.length-1?normalize(70): normalize(5),
                paddingStart: normalize(10),
                paddingEnd: normalize(5),
                paddingTop: normalize(15),
                paddingBottom: normalize(15),
                borderRadius: normalize(4),
                elevation: normalize(8), shadowColor: Color.black, shadowOpacity: 0.3,
                shadowOffset: { height: 0, width: 0 }, shadowRadius: normalize(4),
                backgroundColor: Color.white, justifyContent: "space-between", alignItems: "center"
            }}
            onPress = {()=>{
                props.navigation.navigate("ProductList", { categoryId: data.item.id, categoryName: data.item.name })
            }}>
                <Text style={{ width: "80%", fontFamily: "Roboto-Medium", color: Color.darkGrey,
            fontSize: normalize(14) }}>{data.item.name}</Text>
                <Image
                    style={{ width: normalize(15), height: normalize(15) }}
                    source={ImagePath.right_arrow} />
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
                        title={"Categories"}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <FlatList
                            style={{ width: "100%", }}
                            data={categoryList}
                            renderItem={(data) => renderCategoryItem(data)}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}