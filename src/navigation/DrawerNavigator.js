import React from "react"
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "../components/screens/Home"
import Settings from "../components/screens/Settings"

const Drawer = createDrawerNavigator();

export default function DrawerNavigator(){
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component = {Home} />
            <Drawer.Screen name="Settings" component = {Settings} />
        </Drawer.Navigator>
    )
}