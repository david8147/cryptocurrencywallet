import React, {Component} from "react";
import {View} from "react-native";
import CryptoCoinsContainer from "./components/CryptoCoinsContainer";

class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <CryptoCoinsContainer/>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#1b3a6b"
    },
};
export default App;
