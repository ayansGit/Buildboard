import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
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
import { getToken, setAddress, setAddressId, setPincode } from "../../utils/storage";

export default function AddressList(props) {

    const [value, setValue] = React.useState(0);
    const [addressList, setAddressList] = useState([])
    const states = useSelector(state => state.user.stateList)
    const [loading, setLoading] = useState(true)
    const [position, setPosition] = useState(-1)
    let isEditable = props.route.params.isAccount

    useEffect(() => {
        // getOrderList()
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            getAddressList()
        });
        return unsubscribe
    }, [props.navigation])

    async function getAddressList() {
        setLoading(true)
        try {
            let token = await getToken()
            let header = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
            let response = await getRequest(`user/address/list`, header)
            console.log("RESPONSE", response)
            if (response.success) {
                setAddressList(response.data)
                // if (response.data.length > 0) {
                //     let address = `${response.data[0].house_number} ${response.data[0].area}, ${response.data[0].landmark}, ${response.data[0].city} ${response.data[0].pincode}, ${getStateName(response.data[0].state_id)}`
                //     setAddress(address)
                // }
            }

        } catch (error) {
            alert(error)
        }
        setLoading(false)
    }

    function getStateName(id) {
        var stateName = ""
        for (let i = 0; i < states.length; i++) {
            if (id == states[i].state_id) {
                stateName = states[i].name
                break
            }
        }
        return stateName
    }

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
                        title={isEditable ? "Address List" : "Choose Address"}
                        navigation={props.navigation}
                        containNavDrawer={false}
                        showCart={isEditable}
                        showOk={!isEditable && (position != -1)}
                        onBackPressed={() => {
                            props.navigation.goBack()
                        }}
                        onOkPressed={() => {
                            props.navigation.goBack()
                        }} />

                    <View style={{ width: "100%", alignItems: "center" }}>
                        <View style={{ width: "100%", alignItems: "center" }}>
                            {loading ? <ActivityIndicator size="large" color={Color.navyBlue} /> : null}

                            <RadioButton.Group
                                onValueChange={newValue => {
                                    console.log("VALUE", newValue)
                                    setPosition(newValue)
                                    let address = `${addressList[newValue].house_number} ${addressList[newValue].area}, ${addressList[newValue].landmark}, ${addressList[newValue].city} ${addressList[newValue].pincode}, ${getStateName(addressList[newValue].state_id)}`
                                    setAddress(address)
                                    setAddressId(addressList[newValue].id.toString())
                                    setPincode(addressList[newValue].pincode)

                                }}
                                value={position}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    style={{ width: "100%" }}
                                    data={addressList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(data) => {
                                        return (

                                            <TouchableOpacity style={{
                                                width: "95%", flexDirection: "row", borderRadius: normalize(4),
                                                padding: normalize(10), paddingEnd: normalize(5), marginTop: normalize(10), backgroundColor: Color.white,
                                                elevation: normalize(8), shadowColor: Color.black, justifyContent: "space-around",
                                                shadowOpacity: 0.1, shadowRadius: normalize(4), shadowOffset: { height: 0, width: 0 },
                                                marginBottom: data.index == addressList.length - 1 ? normalize(120) : normalize(10), alignItems: "flex-start", alignSelf: "center"
                                            }}
                                                onPress={() => {
                                                    if (isEditable)
                                                        props.navigation.navigate("Address", { forUpdate: true, addressDetails: addressList[data.index] })
                                                    else {
                                                        let newValue = data.index
                                                        setPosition(newValue)
                                                        let address = `${addressList[newValue].house_number} ${addressList[newValue].area}, ${addressList[newValue].landmark}, ${addressList[newValue].city} ${addressList[newValue].pincode}, ${getStateName(addressList[newValue].state_id)}`
                                                        setAddress(address)
                                                        setAddressId(addressList[newValue].id.toString())
                                                        setPincode(addressList[newValue].pincode)
                                                    }
                                                }}>
                                                {Platform.OS == "android" && !isEditable ?
                                                    <RadioButton value={data.index} /> : null}


                                                <View style={{ width: isEditable? "95%" : "75%" }}>
                                                    <Text style={{ fontFamily: "Roboto-Medium", fontSize: normalize(14), color: Color.darkGrey }}>{data.item.full_name}</Text>
                                                    <Text style={{
                                                        fontFamily: "Roboto-Medium", fontSize: normalize(11),
                                                        marginTop: normalize(5), color: Color.navyBlue
                                                    }}>{`${data.item.house_number} ${data.item.area}, ${data.item.landmark}, ${data.item.city} ${data.item.pincode}, ${getStateName(data.item.state_id)}`}</Text>
                                                </View>

                                                {/* {isEditable ?
                                                    <TouchableOpacity
                                                        onPress={() => { }}>
                                                        <Image
                                                            style={{ height: normalize(12), width: normalize(12), margin: normalize(5) }}
                                                            source={ImagePath.delete}
                                                            resizeMode="contain" />
                                                    </TouchableOpacity> : Platform.OS == "ios" ?
                                                        <RadioButton value={data.index} /> : null} */}

                                                {Platform.OS == "ios" ?
                                                    <RadioButton value={data.index} /> : null}

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
                        color={Color.white}
                        label="Add Address"
                        onPress={() => props.navigation.navigate("Address", { forUpdate: false })}
                    />

                </View>
            </SafeAreaView>
        </View >
    )
}