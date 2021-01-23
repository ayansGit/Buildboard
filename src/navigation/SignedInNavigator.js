import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from "./DrawerNavigator"
import ProductList from "../components/screens/ProductList"
import ProductDetail from "../components/screens/ProductDetail"
import CategoryList from "../components/screens/CategoryList"
import ContactUs from "../components/screens/ContactUs"
import Cart from "../components/screens/Cart"

const Stack = createStackNavigator();

export default function SignedInNavigator() {
  return (
      <Stack.Navigator initialRouteName="DrawerNavigator" screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="ProductList" component = {ProductList}/>
        <Stack.Screen name="ProductDetail" component = {ProductDetail}/>
        <Stack.Screen name="CategoryList" component = {CategoryList}/>
        <Stack.Screen name="ContactUs" component = {ContactUs}/>
        <Stack.Screen name="Cart" component = {Cart}/>
      </Stack.Navigator>
  );
}