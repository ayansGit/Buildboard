/**
 * @format
 */
import React from "react"
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from "react-native-paper";
import store from './src/Store';
console.disableYellowBox = true;

const BuildBoard = () => {
    return (
        <StoreProvider store={store}>
            <PaperProvider>
                <App />
            </PaperProvider>
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => BuildBoard);
