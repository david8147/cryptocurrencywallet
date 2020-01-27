import React, {Component} from "react";
import Modal from "react-native-modal";
import CoinAutocomplete from "./CoinAutocomplete";
import {
    ScrollView,
    View,
    Text,
    Button,
    TouchableWithoutFeedback,
    TextInput,
} from "react-native";
import ExchangeButton from "./ExchangeButton";

const modalButtons = ["isAddCoinVisible", "Bittrex", "Binance", "Kucoin"];

class AddCoin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            isAddCoinVisible: false,
            coinBought: "",
            coinAmountBought: 0,
            Binance: false,
            Bittrex: false,
            Kucoin: false
        };
    }

    openButton = buttonName => {
        for (let i in modalButtons) {
            if (modalButtons[i] === buttonName) {
                this.setState({
                    [modalButtons[i]]: !this.state[modalButtons[i]]
                });
            }else {
                this.setState({
                    [modalButtons[i]]: false
                });
            }
        }
        this.setState({
            coinBought:'', coinAmountBought:0
        })
    };

    closeExchange = exchangeName => {
        this.setState({
            [exchangeName]: false
        });
    };

    saveNewCoin = (str) => {
        const {coinBought, coinAmountBought} = this.state;

        if (coinBought.length > 0 && coinAmountBought > 0) {
            this.props.addCoin(coinBought, coinAmountBought,0);
            this.setState({
                isModalVisible: false
            },()=>this.openButton(str));
        }
        else
            this.openButton(str)
    };

    getAutocompleteCoin = coin => {
        this.setState({
            coinBought: coin
        });
    };

    showModal = () => this.setState({isModalVisible: true});

    hideModal = () =>
        this.setState({
            isModalVisible: false
        });

    hideModalAll=()=>{
        this.closeAll();
        this.setState({
            isModalVisible: false
        });
    }
    closeAll = () => {
        for (let i in modalButtons) {
            if (this.state[modalButtons[i]] === true) {
                this.setState({
                    [modalButtons[i]]: false
                });
            }
        }
    };

    render() {
        return (
            <View>
                <View style={styles.buttonContainer}>
                    <View style={styles.addButtonBorder}>
                        <Button onPress={this.showModal} title="+ "
                                color={"#feff47"}
                                style={styles.addButton}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={()=>this.hideModal}>
                    <Modal
                        style={styles.modalContainer}
                        isVisible={this.state.isModalVisible}
                    >
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalContainer}>
                                <ScrollView style={styles.modalScrollView}>
                                    {/* ADD COIN */}
                                    <View style={styles.modalChoice}>
                                        <View style={styles.buttonBorder}>
                                            <Button
                                                title="Add Coin"
                                                color="#feff47"
                                                onPress={() =>  this.openButton("isAddCoinVisible")}
                                            />
                                        </View>
                                        {this.state.isAddCoinVisible && (
                                            <View>
                                                <View style={styles.addInfoBox}>
                                                    <Text style={styles.keyText}>Search Coin:</Text>
                                                    <CoinAutocomplete
                                                        coinDict={this.props.coinDict}
                                                        getCoin={this.getAutocompleteCoin}
                                                    />
                                                    <Text style={styles.keyText1}>Amount Purchased:</Text>
                                                    <View style={{flex:1, alignItems:'center'}}>
                                                        <TextInput
                                                            style={styles.amountBoughtText}
                                                            keyboardType="numeric"
                                                            maxLength={20}
                                                            onChangeText={coinAmountBought =>
                                                                this.setState({coinAmountBought})
                                                            }
                                                        />
                                                    </View>
                                                    <Text> {" "}</Text>
                                                </View>
                                                <View style={styles.buttonBorder}>
                                                    <Button
                                                        title="Submit"
                                                        color="#44CF6C"
                                                        onPress={()=>this.saveNewCoin('isAddCoinVisible')}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                    {/* BINANCE */}
                                    <View style={styles.modalChoice}>
                                        <ExchangeButton
                                            exchangeName={"Binance"}
                                            color={"#feff47"}
                                            refreshCoins={this.props.refreshCoins}
                                            whichExchange={this.openButton}
                                            isOpen={this.state.Binance}
                                            closeExchangeButton={this.closeExchange}
                                            hide={this.hideModal}
                                        />
                                    </View>
                                    {/* BITTREX */}
                                    <View style={styles.modalChoice}>
                                        <ExchangeButton
                                            exchangeName={"Bittrex"}
                                            color={"#feff47"}
                                            refreshCoins={this.props.refreshCoins}
                                            whichExchange={this.openButton}
                                            isOpen={this.state.Bittrex}
                                            closeExchangeButton={this.closeExchange}
                                            hide={this.hideModal}
                                        />
                                    </View>
                                    <View style={styles.modalChoice}>
                                        <ExchangeButton
                                            exchangeName={"Kucoin"}
                                            color={"#feff47"}
                                            refreshCoins={this.props.refreshCoins}
                                            whichExchange={this.openButton}
                                            isOpen={this.state.Kucoin}
                                            closeExchangeButton={this.closeExchange}
                                            hide={this.hideModal}
                                        />
                                    </View>
                                    <View style={styles.modalChoice}>
                                        <View style={styles.buttonBorder}>
                                            <Button
                                                title="Close"
                                                color="#F03A47"
                                                onPress={this.hideModalAll}
                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = {
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30,

    },
    modalScrollView: {

    },
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 5,
        marginBottom: 10,

    },
    addInfoBox: {
        // backgroundColor: "red",
        marginTop: 5,
        marginBottom: 5,
        borderColor:'#feff47',
        borderWidth:2,
    },
    keyText: {
        display: "flex",
        marginTop: 20,
        marginLeft: 15,
        marginBottom:-10,
        // fontWeight: 'bold',
        fontSize: 17,
        color:'#feff47',
    },
    keyText1: {
        display: "flex",
        marginTop: 20,
        marginLeft: 15,
        // fontWeight: 'bold',
        fontSize: 17,
        color:'#feff47',
    },
    textBox: {
        marginLeft: 10,
        marginRight: 10
    },
    amountBoughtText: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor:'#feff47',
        height: 40,
        width: '90%',
        marginTop:5,
        color:'#fff',
        fontSize:17,
    },
    buttonBorder: {
        borderWidth: 2,
        borderColor:"#4287f5"
    },
    addButtonBorder:{
        borderWidth: 2,
        borderColor:"#42968e"
    },
    addButton:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        textAlign: 'center',
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20,
        height: 40,

    }
};

export default AddCoin;
