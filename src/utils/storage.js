import { AsyncStorage } from 'react-native';

export const type = {
    token: "buildboard.token",
    userId: "buildboard.userId",
    userName: "buildboard.userName",
    email: "buildboard.email",
    address: "buildboard.address",
    phone: "buildboard.phone"
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

export async function setUserName(value) {
    try {
        await AsyncStorage.setItem(
            type.userName,
            value
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getUserName() {
    let value = ""
    try {
        value = await AsyncStorage.getItem(
            type.userName)
    } catch (error) {
        // Error saving data
    }
    return value;
}

export async function setEmail(value) {
    try {
        await AsyncStorage.setItem(
            type.email,
            value
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getEmail() {
    let value = ""
    try {
        value = await AsyncStorage.getItem(
            type.email)
    } catch (error) {
        // Error saving data
    }
    return value;
}

export async function setAddress(value) {
    try {
        await AsyncStorage.setItem(
            type.address,
            value
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getAddress() {
    let value = ""
    try {
        value = await AsyncStorage.getItem(
            type.address)
    } catch (error) {
        // Error saving data
    }
    return value;
}


export async function setPhone(value) {
    try {
        await AsyncStorage.setItem(
            type.phone,
            value
        );
    } catch (error) {
        // Error saving data
    }
}

export async function getPhone() {
    let value = ""
    try {
        value = await AsyncStorage.getItem(
            type.phone)
    } catch (error) {
        // Error saving data
    }
    return value;
}



