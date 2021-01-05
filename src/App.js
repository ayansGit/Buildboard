/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createSwitchNavigator } from '@react-navigation/compat';
import SignedInNavigator from "./navigation/SignedInNavigator"
import SignedOutNavigator from "./navigation/SignedOutNavigator"
import Splash from "./components/screens/Splash"
import transitionConfig from "./utils/transitionConfig"
const isLoggedIn = true

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="SignedOutNavigator" component={SignedOutNavigator} />
        <Stack.Screen name="SignedInNavigator" component={SignedInNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


