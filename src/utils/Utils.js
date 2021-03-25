import React from "react"
import { ToastAndroid, Platform } from "react-native"

export function showAlert(message) {

    if (Platform.OS == "android")
        ToastAndroid.show(message, ToastAndroid.SHORT)
    else alert(message)
}
