import React from "react"
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "../components/screens/Home"
import Settings from "../components/screens/Settings"
import DesignWithUs from "../components/screens/DesignWithUs"
import Order from "../components/screens/Order"
import NavigationDrawerMenu from "../components/screens/NavigationDrawerMenu"

const Drawer = createDrawerNavigator();

export default function DrawerNavigator(){
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent = {(props) => <NavigationDrawerMenu {...props}/>}>
            <Drawer.Screen name="Home" component = {Home} />
            <Drawer.Screen name="Design With Us" component = {DesignWithUs} />
            <Drawer.Screen name="Settings" component = {Settings} />
            <Drawer.Screen name="My Orders" component = {Order}/>
        </Drawer.Navigator>
    )
}