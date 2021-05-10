import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    Platform, ActivityIndicator,
    ImageBackground,
    ToastAndroid, Alert, Dimensions
} from 'react-native';
import Header from "../common/Header"
import normalize from "../../utils/dimen"
import Color from '../../assets/Color';
import ImagePath from '../../assets/ImagePath';
import { getRequest, postRequest } from "../../utils/apiRequest"
import { immersiveModeOn, immersiveModeOff } from 'react-native-android-immersive-mode';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ViewPager from '@react-native-community/viewpager';
import { ADD_TO_CART_REQUEST } from "../../actions/types"
import { addToCartRequest } from "../../actions/ProductAction";
import { getToken } from "../../utils/storage";
import HTML from "react-native-render-html";
import ImageZoom from 'react-native-image-pan-zoom';



export default function ProductImage(props) {

    var pager = useRef()
    const [position, setPosition] = useState(0)


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
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }} />
                    <View style={{ flex: 1, width: "100%", alignItems: "center", backgroundColor: Color.white }}>

                        {props.route.params.productImages.length > 0 ?
                            <ViewPager
                                ref={pager}
                                pageMargin={normalize(10)}
                                style={{ width: "100%", height: normalize(300), marginTop: normalize(5), }}>
                                {props.route.params.productImages.map((value, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: Color.white }}>
                                            <ImageZoom
                                                // panToMove={true}
                                                // pinchToZoom={true}
                                                // enableCenterFocus = {true}
                                                // enableSwipeDown={true}
                                                // useNativeDriver={true}
                                                // useHardwareTextureAndroid={true}
                                                cropWidth={Dimensions.get('window').width}
                                                cropHeight={Dimensions.get('window').height}
                                                imageWidth={normalize(250)}
                                                imageHeight={normalize(250)}>
                                                <Image
                                                    style={{ width: normalize(250), height: normalize(250) }}
                                                    resizeMode="contain"
                                                    source={{ uri: value }} />
                                            </ImageZoom>
                                            {/* <Image style={{ width: 200, height: 200 }}
                                                    source={{ uri: value }} /> */}
                                        </View>
                                    )
                                })}

                            </ViewPager> : null}

                        <FlatList
                            style={{ alignSelf: "center", marginTop: normalize(15) }}
                            horizontal={true}
                            data={props.route.params.productImages}
                            renderItem={(data) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setPosition(data.index)
                                            if (pager != null) {
                                                pager.current.setPage(data.index)
                                            }
                                        }}
                                        style={{
                                            height: normalize(60),
                                            width: normalize(60), backgroundColor: Color.white,
                                            marginLeft: normalize(5), marginRight: normalize(5),
                                            borderWidth: 1, borderColor: position == data.index ? Color.veryLightGrey : Color.white
                                        }}>
                                        <Image
                                            style={{ width: "100%", height: "100%" }}
                                            source={{ uri: data.item }}
                                            resizeMode="contain" />
                                    </TouchableOpacity>
                                )
                            }} />


                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}