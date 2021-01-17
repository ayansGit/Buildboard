import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Choose from "../components/screens/Choose"
import Login from "../components/screens/Login"
import Signup from "../components/screens/Signup"

const Stack = createStackNavigator();

export default function SignedOutNavigator() {
  return (
      <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="Choose" component={Choose} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
  );
}