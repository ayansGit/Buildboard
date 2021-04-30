import { BASE_URL } from "./constants"
import axios from "axios";
import React from "react"
import NetInfo from "@react-native-community/netinfo";

export const getRequest = async (url, header = { "Content-Type": "application/json" }) => {
    console.log("header", header)
    console.log("url", `${BASE_URL}/${url}`)
    let connection = (await NetInfo.fetch())
    if (connection.isConnected) {
        try {
            let response = await axios.get(`${BASE_URL}/${url}`, { headers: header })
            let responseData = await response.data;
            return responseData;
        } catch (error) {
            if (error.response.status == 401)
                throw { status: 401, message: `${error.response.message}` };
            else
                throw { status: 500, message: `${error}` };
        }
    }else{
        throw { status: 500, message: `No internet connection` };
    }

}

export const postRequest = async (url, param, header = { "Content-Type": "application/json" }) => {
    console.log("url", `${BASE_URL}/${url}`)
    console.log("Param", param)
    console.log("header", header)
    let connection = (await NetInfo.fetch())
    if (connection.isConnected) {
        try {
            let response = await axios.post(`${BASE_URL}/${url}`, param, { headers: header })
            let responseData = await response.data;
            return responseData;
        } catch (error) {
            console.log("ERROR", error)
            if (error.response.status == 401)
                throw { status: 401, message: `${error.response.message}` };
            else
                throw { status: 500, message: `${error}` };
        }
    }else{
        throw { status: 500, message: `No internet connection` };
    }
}