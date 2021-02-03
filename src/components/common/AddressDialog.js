import React, { useState } from "react"
import { View, TouchableOpacity, Modal, Text, TextInput, ImageBackground, Image, ActivityIndicator } from "react-native"
import Color from "../../assets/Color"
import normalize from "../../utils/dimen"
import ImagePath from "../../assets/ImagePath"
import PropTypes from "prop-types";

export default function AddressDialog(props) {

    const [loading, setLoading] = useState(false)
    const [addressRequest, setAddressRequest] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    })

    return (
        <Modal visible={props.showAddressDialog} transparent={true} >

            <View style={{
                flex: 1, justifyContent: "center", alignItems: "center",
                backgroundColor: Color.shadow,
            }}>
                <View style={{
                    width: "85%", backgroundColor: Color.white, alignItems: "center", borderRadius: normalize(15)
                }}>
                    <TouchableOpacity style={{
                        alignSelf: "flex-end", padding: normalize(10),
                        marginEnd: normalize(5), marginTop: normalize(5)
                    }}>
                        <Image
                            style={{ height: normalize(15), width: normalize(15) }}
                            source={ImagePath.close} />
                    </TouchableOpacity>
                    <View style={{
                        width: "85%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(10)
                    }}>

                        <TextInput
                            editable={!loading}
                            placeholder={"Address Line"}
                            placeholderTextColor={Color.grey}
                            value={addressRequest.address}
                            numberOfLines={1}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setAddressRequest({
                                    ...addressRequest,
                                    address: text
                                })
                            }} />
                    </View>
                    <View style={{
                        width: "85%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(10)
                    }}>
                        <TextInput
                            editable={!loading}
                            placeholder={"City"}
                            placeholderTextColor={Color.grey}
                            value={addressRequest.city}
                            numberOfLines={1}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setAddressRequest({
                                    ...addressRequest,
                                    city: text
                                })
                            }} />
                    </View>
                    <View style={{
                        width: "85%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(10)
                    }}>
                        <TextInput
                            editable={!loading}
                            placeholder={"State"}
                            placeholderTextColor={Color.grey}
                            value={addressRequest.state}
                            numberOfLines={1}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setAddressRequest({
                                    ...addressRequest,
                                    state: text
                                })
                            }} />
                    </View>
                    <View style={{
                        width: "85%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(10)
                    }}>
                        <TextInput
                            editable={!loading}
                            placeholder={"Pincode"}
                            placeholderTextColor={Color.grey}
                            value={addressRequest.pincode}
                            keyboardType="number-pad"
                            numberOfLines={1}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setAddressRequest({
                                    ...addressRequest,
                                    pincode: text
                                })
                            }} />
                    </View>
                    <View style={{
                        width: "85%", height: normalize(45), borderWidth: normalize(1),
                        borderRadius: normalize(25), flexDirection: "row", justifyContent: "center",
                        alignItems: 'center', paddingStart: normalize(15), paddingEnd: normalize(15),
                        marginTop: normalize(10)
                    }}>
                        <TextInput
                            editable={!loading}
                            placeholder={"Address name"}
                            placeholderTextColor={Color.grey}
                            value={addressRequest.name}
                            numberOfLines={1}
                            style={{
                                width: "95%",
                                fontFamily: "Roboto-Regular", color: Color.darkGrey,
                                fontSize: normalize(14)
                            }}
                            onChangeText={(text) => {
                                setAddressRequest({
                                    ...addressRequest,
                                    name: text
                                })
                            }} />
                    </View>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { }}
                        style={{ width: "85%", height: normalize(45), marginTop: normalize(20), marginBottom: normalize(20) }}>
                        <ImageBackground
                            style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
                            source={ImagePath.gradientButton}
                            resizeMode="stretch">
                            {loading ? <ActivityIndicator size="small" color={Color.white} /> :
                                <Text
                                    style={{
                                        fontSize: normalize(14),
                                        fontFamily: "Roboto-Medium",
                                        color: Color.white
                                    }}>ADD ADDRESS</Text>}
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

