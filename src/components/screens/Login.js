import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

export default function Login(props){

    return(
        <View style = {{flex: 1}}>
            <StatusBar/>
            <SafeAreaView style = {{flex: 1}}>
                <View style = {{flex: 1}}>
                    <Text>Login</Text>
                </View>
            </SafeAreaView>
        </View>
    )
}