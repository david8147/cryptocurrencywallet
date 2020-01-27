import Autocomplete from "react-native-autocomplete-input";
import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View,TextInput} from "react-native";

class CoinAutocomplete extends Component {
    constructor(props) {
        super(props);

        const coinDict = props.coinDict;
        const coinAry = [];
        Object.keys(coinDict).forEach(key => {
            coinAry.push(coinDict[key]);
        });

        this.state = {
            query: "",
            coinArray: coinAry,
            hasFocus: false
        };
    }

    findCoin(query) {
        if (query === "") {
            return [];
        }

        const coinDict = this.props.coinDict;

        const regex = new RegExp(`${query.trim()}`, "i");

        const coinArray = this.state.coinArray;
        const byName = coinArray.filter(coin => coin.name.search(regex) >= 0);
        const bySymbol = coinArray.filter(coin => coin.symbol.search(regex) >= 0);

        const addedLists = byName.concat(bySymbol);

        var duplicatesRemoved = [];
        addedLists.forEach(function (item) {
            if (duplicatesRemoved.indexOf(item) < 0) {
                duplicatesRemoved.push(item);
            }
        });

        return duplicatesRemoved;
    }

    render() {
        const {query} = this.state;
        const coins = this.findCoin(query);
        // console.log(coins);
        const comp = (a, b) =>   a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.container}>
                <Autocomplete
                    inputContainerStyle={styles.back}
                    // containerStyle={styles.autocompleteContainer}
                    autoCapitalize="none"
                    autoCorrect={false}
                    data={coins.length>1 && comp(query, coins[0].name+1) ? [] : coins.splice(0,6)}
                    defaultValue={query}
                    onChangeText={text => this.setState({query: text, hasFocus: true})}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => {
                                console.log(item);
                                console.log(item.symbol);

                                this.setState({query: `${item.symbol} | ${item.name}`, hasFocus: false});
                                this.props.getCoin(item.symbol);
                            }}
                        >
                            <Text style={styles.itemText}>
                                {item.symbol} | {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <View style={styles.descriptionContainer}>
                    {this.state.hasFocus > 0 &&
                    this.state.query.length > 0 && (
                        <Text style={styles.infoText}>No Results Found</Text>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    back:{
        // backgroundColor:'pink',
        // color:'#000'
        // backgroundColor: "green",
        // color:'blue',
        flex: 1,
        paddingTop: 10,
        borderWidth: 0,
        borderBottomWidth:1,
        borderBottomColor:'#feff47',
        // color:"#fff",

        fontSize:30,
        // borderRadius:10,
        zIndex: 10,
        // size: 10,
        width:'90%',
        marginLeft:10,
    },

    container: {
        // backgroundColor: "green",
        // color:'green',
        flex: 1,
        paddingTop: 8,
        // paddingBottom:-10,
        zIndex: 10,
        marginLeft:5,
        width:'100%',
        // position:'absolute',
    },
    autocompleteContainer: {
        zIndex: 10,
        // flex: 1,
        // left: 0,
        // position: "absolute",
        // right: 0,
        // top: 0,
        // marginTop:5,
        // marginLeft:13,
        // width: '90%',
        // backgroundColor: 'blue',
        // color: 'blue',
    },

    itemText: {
        fontSize: 15,
        margin: 10,
        color:'#feff47',
    },
    descriptionContainer: {
        // backgroundColor: "grey",
        marginTop: 25,

    },
    infoText: {
        textAlign: "center",
        paddingBottom: 105,
        color:'#feff47',
    }
});

export default CoinAutocomplete;
