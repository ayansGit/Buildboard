import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from "./DrawerNavigator"
import ProductList from "../components/screens/ProductList"
import ProductDetail from "../components/screens/ProductDetail"

const Stack = createStackNavigator();

export default function SignedInNavigator() {
  return (
      <Stack.Navigator initialRouteName="DrawerNavigator" screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="ProductList" component = {ProductList}/>
        <Stack.Screen name="ProductDetail" component = {ProductDetail}/>
      </Stack.Navigator>
  );
}