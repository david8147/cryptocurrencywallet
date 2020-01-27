import React from "react";
import Modal from "react-native-modal";

import {
    ScrollView,
    View,
    Text,
    Button,
    TextInput,
} from "react-native";

class EditCoinCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            coinAmountBought: 0
        };
    }

    _removeCoin = (symbol,amountSold) => {
        this.props.edit(symbol, amountSold,0);
        this.setState({coinAmountBought:0});
        this.props.close()
    };

    _editCoin = (symbol, amountBought) => {
        this.props.edit(symbol, amountBought,1);
        this.setState({coinAmountBought:0});
        this.props.close()
    };
    deleteCoin =(symbol)=>{
        this.props.remove(symbol);
        this.props.close()
    }

    render() {
        return (
            <View>
                <Modal style={styles.modalContainer} isVisible={this.props.isVisible}>
                    <View style={styles.modalContainer}>
                        <View>
                            <View style={styles.modalChoice}>
                                <View style={styles.addInfoBox}>
                                    <Text style={styles.keyText}> {this.props.symbol} Amount Bought Or Sold</Text>
                                    <TextInput
                                        style={styles.amountBoughtText}
                                        keyboardType="numeric"
                                        placeholder={"0"}
                                        maxLength={20}
                                        onChangeText={coinAmountBought =>
                                            this.setState({coinAmountBought})
                                        }
                                    />
                                    <Text style={{marginBottom:10}}>{" "}</Text>

                                </View>

                                <View style={styles.both}>
                                    <View style={styles.individual}>
                                        <Button style={styles.individual} color="#2b9b6c" title="Add Coin" onPress={() => {
                                            this._editCoin(this.props.symbol, parseFloat(this.state.coinAmountBought));
                                        }}/>
                                    </View>
                                    <View style={styles.individual}>
                                        <Button title="Remove Coin" color="#077187" onPress={() => {
                                            this._removeCoin(this.props.symbol, parseFloat(this.state.coinAmountBought));
                                        }}/>
                                    </View>
                                </View>

                                <View style={styles.cancelButton}>
                                    <View style={styles.buttonBorder}>
                                        <Button
                                            style={styles.buttonContainer}
                                            title="Delete Coin"
                                            color="#F03A47"
                                            onPress={()=>this.deleteCoin(this.props.symbol)}
                                        />
                                    </View>
                                </View>
                                <View style={styles.cancelButton}>
                                    <View style={styles.buttonBorder}>
                                        <Button
                                            style={styles.buttonContainer}
                                            title="Cancel"
                                            // color="#2b9b6c"
                                            color="#F03A47"
                                            onPress={this.props.close}
                                        />
                                    </View>
                                </View>
                                <View>
                                </View>

                            </View>

                        </View>

                    </View>

                </Modal>
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
    both: {
        display: "flex",
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        // justifyContent: 'center',
        // justifyContent: 'space-between'

    },
    individual: {
        width: "50%",
        borderWidth: 2,
        borderColor: "#feff47",
    },
    modalScrollView: {},
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    addInfoBox: {
        // backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems:'center',
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: "#feff47",
    },
    keyText: {
        textAlign:'center',
        display: "flex",
        marginTop: 18,
        fontWeight:'bold',
        fontSize: 15,
        color:'#feff47',
        marginBottom:5,
    },
    symbolText: {
        display: "flex",
        marginTop: 10,
        marginLeft: 10,
        fontWeight: "bold"
    },
    amountBoughtText: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: "center",
        marginTop: 10,
        fontSize: 20,
        color:'#fff',
        borderBottomColor:'#feff47',
        borderWidth:1,
        width: '80%',
        paddingBottom:7,
    },
    cancelButton: {
        marginTop:5,
        borderWidth: 2,
        borderColor: "#feff47"
    },
    buttonBorder: {
        // borderWidth: 5,
        // borderColor: "#FFFFFF"
    },
    twoButtons: {
        display: "flex",
        // flex: 1,
        flexDirection: "row",
        // width:"100%",
        // justifyContent: "space-around",
        // margin: 10
    },
    buttonContainer: {
        display: "flex",

    }
};

export default EditCoinCard;
