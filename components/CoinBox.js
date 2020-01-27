import React from "react";
import {View, Text, TouchableOpacity} from "react-native";

const CoinBox = ({
                      symbol,
                      name,
                      priceUSD,
                      percentChange24h,
                      percentChange7d,
                      percentChange1h,
                      balance,
                      heldValue,
                      addedCoinBalance,
                      onCardPressed,
                  }) => {
    cardPressed = () => {
        onCardPressed(symbol, addedCoinBalance);
    };
    return (
        <TouchableOpacity onPress={this.cardPressed}>
            <View style={container}>
                <View style={upperRow}>
                    <Text style={coinSymbol}>{symbol}</Text>
                    <Text style={seperator}>|</Text>
                    {balance > 0 && <Text style={bal}>{balance.toFixed(7)}</Text>}
                    <Text style={coinName} >{name}</Text>
                    <Text style={usd}>(${priceUSD})</Text>
                    {balance > 0 && (
                        <Text style={coinPrice}>
                            <Text style={moneySymbol}> $</Text>
                            {Number(heldValue).toFixed(2)}
                        </Text>
                    )}
                </View>

                <View style={statisticsContainer}>
                    <Text style = {styles.timeText}>
                        1h:
                        <Text style={percentChange1h < 0 ? percentChangeMinus : percentChangePlus}>
                            {" "}
                            {percentChange1h} %{" "}
                        </Text>
                    </Text>
                    <Text style = {styles.timeText}>
                        24h:
                        <Text style={percentChange24h < 0 ? percentChangeMinus : percentChangePlus}>
                            {" "}
                            {percentChange24h} %{" "}
                        </Text>
                    </Text>
                    <Text style = {styles.timeText}>
                        7d:
                        <Text style={percentChange7d < 0 ? percentChangeMinus : percentChangePlus}>
                            {" "}
                            {percentChange7d} %{" "}
                        </Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const coinColor = "#a1b5c4";
const percentSize = 14;
const letterSize = 14;

const styles = {
    container: {
        display: "flex",
        marginBottom: 5,
        borderTopColor: "#e5e5e5",
        borderTopWidth: 2,
        padding: 10,
        borderColor:"#FFFFFF"
    },
    upperRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15,
    },
    timeText:{
        color: `${coinColor}`,
        fontSize: letterSize,
    },
    coinSymbol: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        fontWeight: "bold",
        color:"#FFFFFF",
        fontSize: letterSize,

    },
    coinName: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        color:"#feff47",
        fontSize: letterSize,

    },
    bal: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        color:"#feff47",
        fontSize: letterSize,
    },
    usd: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        color:"#a1b5c4",
        fontSize: letterSize,
    },
    heldValue: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        fontSize: letterSize,
    },
    seperator: {
        marginTop: 10,
        color:"#FFFFFF",
        fontSize: letterSize,

    },
    moneySymbol: {
        fontWeight: "bold",
        fontSize: letterSize,
    },
    coinPrice: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: 10,
        fontWeight: "bold",
        color:"#FFFFFF",
        fontSize: letterSize,
    },
    statisticsContainer: {
        display: "flex",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    percentChangePlus: {
        color:"#44CF6C",
        fontSize: percentSize,
        fontWeight: "bold",
        marginLeft: 5,
    },
    percentChangeMinus: {
        color: "#cf4d44",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: percentSize,
    }
};

const {
    container,
    image,
    moneySymbol,
    upperRow,
    coinSymbol,
    coinName,
    coinPrice,
    heldValue,
    bal,
    usd,
    statisticsContainer,
    seperator,
    percentChangePlus,
    percentChangeMinus
} = styles;

export default CoinBox;
