import { AsyncStorage } from 'react-native';

export const type = {
    token: "buildboard.token",
    userId: "buildboard.userId",
}

export async function setToken(token) {
    try {
        await AsyncStorage.setItem(
            type.token,
            token
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getToken() {
    let token = ""
    try {
        token = await AsyncStorage.getItem(
            type.token
        )
    } catch (error) {
        // Error saving data
    }
    return token
}

export async function setUserId(value) {
    try {
        await AsyncStorage.setItem(
            type.userId,
            value
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getUserId() {
    let value = 0
    try {
        value = await AsyncStorage.getItem(
            type.userId)
    } catch (error) {
        // Error saving data
    }
    return parseInt(value);
}