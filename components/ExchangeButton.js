import React,{Component} from "react";

import {
    View,
    Text,
    Button,
    TextInput,
} from "react-native";
import {saveSecrets} from "./../Utils/Utils.js";

class ExchangeButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            apiKey: "",
            secretKey: ""
        };
    }

    _openTextField = () => {
        console.log(this.props.exchangeName);
        this.props.whichExchange(this.props.exchangeName);
    };
    // _saveKeys = () => {
    //     const {apiKey, secretKey} = this.state;
    //     if (apiKey.length > 0 && secretKey.length > 0) {
    //         saveSecrets(this.props.exchangeName, apiKey, secretKey, this.props.refreshCoins);
    //     }
    //     this.props.closeExchangeButton(this.props.exchangeName);
    // };

    _saveKeys = () => {
        const {apiKey, secretKey} = this.state;
        console.log("new key " +apiKey+" "+secretKey)
        if (apiKey.length > 0 && secretKey.length > 0) {
            saveSecrets(this.props.exchangeName, apiKey, secretKey, this.props.refreshCoins);
        }
        this.props.hide();
        this._openTextField();
        // this.props.closeExchangeButton(this.props.exchangeName);
    };

    render() {
        return (
            <View>
                <View style={styles.buttonBorder}>
                    <Button title={this.props.exchangeName} color={this.props.color} onPress={this._openTextField}/>
                </View>
                {this.props.isOpen && (
                    <View>
                        <View style={styles.addInfoBox}>
                            <Text style={styles.keyText}> API KEY</Text>
                            <TextInput
                                style={styles.textBox}
                                editable={true}
                                onChangeText={apiKey => this.setState({apiKey:apiKey})}
                            />
                            <Text style={styles.keyText}> Secret KEY</Text>
                            <TextInput
                                style={styles.textBox}
                                editable={true}
                                onChangeText={secretKey => this.setState({secretKey:secretKey})}
                            />
                            <Text>{""}</Text>
                        </View>
                        <View style={styles.buttonBorder}>
                            <Button title="Submit" color="#2b9b6c" onPress={this._saveKeys}/>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = {
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30
    },
    modalScrollView: {},
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    addInfoBox: {
        // backgroundColor: "#1b3a6b",
        marginTop: 5,
        marginBottom: 5,
        borderColor:'#4287f5',
        borderWidth:2,
        paddingTop:10,
        paddingBottom:10,
    },
    keyText: {
        display: "flex",
        marginTop: 15,
        marginLeft: 10,
        fontSize: 16,
        // fontWeight:'bold',
        color:'#feff47',

    },
    textBox: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        paddingTop:5,
        borderBottomColor:'#feff47',
        borderBottomWidth:1,
        color:"#fff",
        fontSize:20,
    },
    amountBoughtText: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: "center"
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20
    },
    buttonBorder: {
        borderWidth: 2,
        borderColor: "#4287f5"
    },
};

export default ExchangeButton;
