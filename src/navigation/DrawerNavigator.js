import React from "react"
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "../components/screens/Home"
import Settings from "../components/screens/Settings"
import DesignWithUs from "../components/screens/DesignWithUs"
import Order from "../components/screens/Order"
import CategoryList from "../components/screens/CategoryList"
import NavigationDrawerMenu from "../components/screens/NavigationDrawerMenu"
import { Dimensions } from 'react-native';

const Drawer = createDrawerNavigator();

const isLargeScreen = Dimensions.get("window").width >= 768;

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <NavigationDrawerMenu {...props}
            />}
            drawerStyle={isLargeScreen ? { width: '60%' } : null}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Design With Us" component={DesignWithUs} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="My Orders" component={Order} />
            <Drawer.Screen name="All Categories" component={CategoryList} />
        </Drawer.Navigator>
    )
}