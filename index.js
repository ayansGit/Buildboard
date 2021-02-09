/**
 * @format
 */
import React from "react"
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Provider as StoreProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import store from './src/Store';
import Color from "./src/assets/Color";
console.disableYellowBox = true;

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Color.navyBlue,
      accent: Color.blue,
    },
  };

const BuildBoard = () => {
    return (
        <StoreProvider store={store}>
            <PaperProvider theme = {theme}>
                <App />
            </PaperProvider>
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => BuildBoard);
