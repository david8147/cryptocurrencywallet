import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    RefreshControl,
    Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "react-native-axios"
import store from "react-native-simple-store";
import {saveAddedCoin, deleteCoin, getPortfolioValue, formatPrice, getFormattedCoinPrice} from "./../Utils/Utils.js";
import {bittrexAPI, binanceAPI, kucoinAPI, cryptopiaAPI} from "./../Utils/ApiUtils.js";
import CoinBox from "./CoinBox";
import AddCoin from "./AddCoin";
import EditCoinCard from "./EditCoinCard";

const exchanges = ["bittrex", "binance", "kucoin"];
let balances =  [{cur: "BTC", bal: 0}, {cur: "ETH", bal: 0}, {cur: "XRP", bal: 0}, {cur: "LTC", bal: 0}, {cur: "BCH", bal: 0}];

class CryptoCoinsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coinMarketCapData: "",
            percentChange1h: 0,
            percentChange24h: 0,
            percentChange7d: 0,
            portfolioCoins: {dict: {}},
            coinFunc: {
                bittrex: bittrexAPI,
                binance: binanceAPI,
                kucoin: kucoinAPI,
                cryptopia: cryptopiaAPI
            },
            refreshing: false,
            addedCoins: balances,
            portfolioValue: 0,
            isLoading: true,
            modalIsVisible: false,
            editSymbol: "",
            editBalance: 0,
            exchangeBalances: {},
        };
    }

    componentDidMount() {
        this.getStoredData();

    }
    getStoredData=()=>{
        this.loadCoins();
        // AsyncStorage.getAllKeys().then((keyArray) => {
        //     AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        //         let myStorage: any = {};
        //         for (let keyVal of keyValArray) {
        //             myStorage[keyVal[0]] = keyVal[1]
        //         }
        //
        //         console.log('CURRENT STORAGE: ', myStorage);
        //     })
        // }).then(()=>{
        //     this.loadCoins();
        // });
    }
    // load non-exchange coins: manually added
    loadCoins = () => {
        store.get("addedCoins").then(res => {
            let addedCoinList = [];
            if (res != null) {
                Object.keys(res.coinData).forEach(key => {
                    addedCoinList.push(res.coinData[key]);
                    this.setState({
                        addedCoins: addedCoinList
                    });
                });
            }
            if (addedCoinList.length === 0)
                addedCoinList = balances;
            this.setState({
                addedCoins: addedCoinList
            });
            this.loadKeys();
        });
    };
    // get keys from store in heldKeys
    // heldKeys contain exchangeName: keyData(key,secret)
    // only have saved coins and exchange key data so far
    loadKeys = () => {
        let heldKeys = {};
        let promises = [];
        for (let i in exchanges) {
            let exchangePromise = store.get(exchanges[i]);
            promises.push(exchangePromise);
        }
        Promise.all(promises).then(retrievedKeys => {
            for (let i in retrievedKeys) {
                let keyData = retrievedKeys[i];
                console.log(keyData);
                if (keyData != null) {
                    heldKeys[keyData.exchangeName] = keyData;
                }
            }
            this.getCoinMarketCapData(heldKeys);
        });
    };
    // make coin dict from coinmarketcap: coinDict[]
    // heldKeys not changed
    getCoinMarketCapData = heldKeys => {
        axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=1000")
            .then(response => {
                const coinDict = {};
                //Create Dictionary of Coin MarketCap Coins
                Object.keys(response.data).forEach(key => {
                    coinDict[response.data[key].symbol] = response.data[key];
                });
                this.setState({
                    coinMarketCapData: coinDict
                });
                const exchangeBalances = {};

                this.coinCrossRoads(heldKeys, exchangeBalances);
            })
            .catch(error => {
                Alert.alert(
                    "Cant Retrieve CoinMarketCap Data",
                    [{text: "OK", onPress: () => console.log("OK Pressed")}]
                );
                this.setState({
                    refreshing: false,
                    isloading: false
                });
            });
    };
    // have heldKeys and empty exchangeBalances
    // build exchangeBalances from heldKeys values and call updateCoinsWithCoinMarketCapData at the end
    // exchangeBalances contains balance for each coin for every exchange
    // heldKeys no longer needed after this
    coinCrossRoads = (heldKeys, exchangeBalances) => {
        if (Object.keys(heldKeys).length > 0) {
            const exchangeKeys = heldKeys[Object.keys(heldKeys)[0]];
            const exchangeName = heldKeys[Object.keys(heldKeys)[0]].exchangeName;
            delete heldKeys[exchangeName];

            this.state.coinFunc[exchangeKeys.exchangeName](
                heldKeys,
                exchangeBalances,
                exchangeKeys,
                this.coinCrossRoads
            );
        } else {
            this.updateCoinsWithCoinMarketCapData(exchangeBalances);
        }
    };

    // populate heldCoins[] one coin from one exchange by one
    addToHeldCoins = (coinDict,
                      heldCoins,
                      symbol,
                      originalData,
                      addedBalance) => {
        const coinData = coinDict[symbol];
        if (symbol in heldCoins.dict) {
            let newBal = originalData.bal;
            let oldBal = heldCoins.dict[symbol].bal;
            let totalNewBal = newBal + oldBal;
            let heldValue = parseFloat(coinData.price_usd) * totalNewBal;

            heldCoins.dict[symbol].bal = totalNewBal;
            heldCoins.dict[symbol].heldValue = heldValue;
        } else {
            heldCoins.dict[symbol] = originalData;
            heldCoins.dict[symbol].name = coinData.name;
            heldCoins.dict[symbol].priceUSD = parseFloat(coinData.price_usd);
            heldCoins.dict[symbol].percentChange1h = coinData.percent_change_1h;
            heldCoins.dict[symbol].percentChange7d = coinData.percent_change_7d;
            heldCoins.dict[symbol].percentChange24h = coinData.percent_change_24h;
            let heldValue = parseFloat(coinData.price_usd) * heldCoins.dict[symbol].bal; // originalData.bal; adding in balance from exchange
            heldCoins.dict[symbol].heldValue = heldValue;
        }
        heldCoins.dict[symbol].addedBalance = addedBalance;
        return heldCoins;
    };

    // call addToHeldCoins on every coin in every exchange
    // add in manually held coins
    updateCoinsWithCoinMarketCapData = exchangeBalances => {
        console.log("UPDATE DATA");
        const coinDict = this.state.coinMarketCapData;
        const heldCoins = {dict: {}};

        // call addToHeldCoins on every coin in every exchange
        Object.keys(exchangeBalances).forEach(exchange => {
            Object.keys(exchangeBalances[exchange]).forEach(symbol => {
                if (symbol in coinDict) {
                    this.addToHeldCoins(
                        coinDict,
                        heldCoins,
                        symbol,
                        exchangeBalances[exchange][symbol],
                        0
                    );
                } else {
                    delete heldCoins.dict[symbol];
                }
            });
        });
        // add in manually held coins
        const addedCoins = this.state.addedCoins;

        for (let i in addedCoins) {
            let symbol = addedCoins[i].cur;
            let balance = addedCoins[i].bal;

            this.addToHeldCoins(coinDict, heldCoins, symbol, addedCoins[i], balance);
        }

        this.calculateTotalValue(heldCoins);
    };

    // heldCoins of all coins here
    // calculateTotalValue
    // setState heldCoins after finish populating heldCoins
    // no more loading
    calculateTotalValue = heldCoins => {
        let portfolioValue = 0;

        Object.keys(heldCoins.dict).forEach(key => {
            const pricePerCoin = heldCoins.dict[key].priceUSD;
            const coinBalance = heldCoins.dict[key].bal;

            portfolioValue += pricePerCoin * coinBalance;
        });
        this.calculatePercentchange(heldCoins, portfolioValue);
        portfolioValue = getPortfolioValue(portfolioValue, 2);
        this.setState({
            portfolioCoins: heldCoins,
            portfolioValue: portfolioValue,
            refreshing: false,
            isLoading: false
        });


    };

    calculatePercentchange = (heldCoins, portfolioValue) => {
        let prev1hTotal = 0;
        let prev24hTotal = 0;
        let prev7dTotal = 0;
        Object.keys(heldCoins.dict).forEach(key => {
            const change1h = parseFloat(heldCoins.dict[key].percentChange1h);
            const change24h = parseFloat(heldCoins.dict[key].percentChange24h);
            const change7d = parseFloat(heldCoins.dict[key].percentChange7d);

            const priceUSD = heldCoins.dict[key].priceUSD;
            const coinBalance = heldCoins.dict[key].bal;

            const prevVal1h = this.getPrevPrice(priceUSD, change1h) * coinBalance;
            const prevVal24h = this.getPrevPrice(priceUSD, change24h) * coinBalance;
            const prevVal7d = this.getPrevPrice(priceUSD, change7d) * coinBalance;

            prev1hTotal += prevVal1h;
            prev24hTotal += prevVal24h;
            prev7dTotal += prevVal7d;
        });

        this.setState({
            percentChange1h: this.getPercentChange(prev1hTotal, portfolioValue),
            percentChange24h: this.getPercentChange(prev24hTotal, portfolioValue),
            percentChange7d: this.getPercentChange(prev7dTotal, portfolioValue)
        });


    };

    getPercentChange = (prevPrice, newPrice) => {
        if (prevPrice > 0) {
            if (newPrice > prevPrice)
                return 100 * (newPrice - prevPrice) / prevPrice;
            else
                return -100 * (prevPrice - newPrice) / prevPrice;
        }
        return 0;
    };


    getPrevPrice = (newPrice, percentChange) => {
        if (percentChange === 0)
            return newPrice;
        if (percentChange < 0)
            return newPrice * -1 / (-1 * percentChange / 100 - 1);
        return newPrice / (percentChange / 100 + 1);
    }

    cardPressed = (symbol, balance) => {
        this.setState({
            modalIsVisible: true,
            editSymbol: symbol,
            editBalance: balance
        });
    };
    // render held coins from heldCoins:portfolioCoins
    renderCoinCards() {
        const listCoins = [];
        Object.keys(this.state.portfolioCoins.dict).forEach(key => {
            listCoins.push(this.state.portfolioCoins.dict[key]);
        });

        listCoins.sort((a, b) => b.heldValue - a.heldValue);

        return listCoins.map(coin => (
            <CoinBox
                key={coin.cur}
                symbol={coin.cur}
                name={coin.name}
                balance={coin.bal}
                priceUSD={formatPrice(coin.priceUSD)}
                percentChange24h={coin.percentChange24h}
                percentChange7d={coin.percentChange7d}
                percentChange1h={coin.percentChange1h}
                heldValue={formatPrice(coin.heldValue)}
                addedCoinBalance={coin.addedBalance}
                onCardPressed={this.cardPressed}
            />
        ));
    }

    addCoin = (coinName, amountToAdd, id) => {
        // const listCoins = [];
        // Object.keys(this.state.portfolioCoins.dict).forEach(key => {
        //     listCoins.push(this.state.portfolioCoins.dict[key]);
        // });
        // heldCoins.dict[key].bal;
        if(id === 1){
            this.removeCoin(coinName);
        }else{
            var amount =this.state.portfolioCoins.dict[coinName] == undefined? 0: this.state.portfolioCoins.dict[coinName].bal;
            amountToAdd=parseFloat(amountToAdd)+parseFloat(amount);
            saveAddedCoin(coinName, parseFloat(amountToAdd), this.onRefresh, id, this.removeCoin);
        }
    }
    removeCoin = coinName => {

        console.log(coinName);
        // console.log(balances[coinName]);

         balances = balances.filter(function(item) {
            return item.cur!==coinName;
        });

        console.log(balances);
        deleteCoin(coinName, this.onRefresh);
    }

    editCoin = (coinName, newBal, id) => {
        if(newBal !== 0){
            if(id === 0){
                if(this.state.portfolioCoins.dict[coinName].bal > newBal){
                    newBal = newBal*-1;
                    this.addCoin(coinName, newBal,0);
                }else if(this.state.portfolioCoins.dict[coinName].bal === newBal){
                    newBal = newBal*-1;
                    this.addCoin(coinName, newBal,1);
                }
            }else{
                this.addCoin(coinName, newBal,0);
            }
        }
    }
    onRefresh = () => {
        this.setState({refreshing: true});
        this.loadCoins();
    };
    closeEditModal = () => {
        this.setState({
            modalIsVisible: false
        });
    };

    render() {
        const {
            contentContainer,
            headerContainer,
            header,
            coinScroll
        } = styles;

        if (this.state.isLoading) {
            return (
                <View>
                    <Spinner
                        visible={this.state.isLoading}
                        textContent={"Loading"}
                        textStyle={{color: "#a1b5c4"}}
                        animation="fade"
                    />
                </View>
            );
        }

        return (
            <View style={contentContainer}>
                <View style={headerContainer}>
                    <Text style={header}> Total Portfolio Value: ${this.state.portfolioValue}</Text>
                </View>

                <View style={styles.statisticsContainer}>
                    <Text style={styles.timeText}>
                        1h:
                        <Text style={this.state.percentChange1h < 0 ? styles.percentChangeMinus : styles.percentChangePlus} >
                            {" "}
                            {this.state.percentChange1h.toFixed(2)} %{" "}
                        </Text>
                    </Text>
                    <Text style={styles.timeText}>
                        24h:
                        <Text style={this.state.percentChange24h < 0 ? styles.percentChangeMinus : styles.percentChangePlus}>
                            {" "}
                            {this.state.percentChange24h.toFixed(2)} %{" "}
                        </Text>
                    </Text>
                    <Text style={styles.timeText}>
                        7d:
                        <Text style={this.state.percentChange7d < 0 ? styles.percentChangeMinus : styles.percentChangePlus}>
                            {" "}
                            {this.state.percentChange7d.toFixed(2)} %{" "}
                        </Text>
                    </Text>
                </View>
                <EditCoinCard
                    isVisible={this.state.modalIsVisible }
                    symbol={this.state.editSymbol}
                    amountBought={this.state.editBalance}
                    close={this.closeEditModal}
                    remove={this.removeCoin}
                    edit={this.editCoin}
                />
                <ScrollView
                    style={coinScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={()=>this.onRefresh}
                        />
                    }
                >
                    {this.renderCoinCards()}
                </ScrollView>

                <View style={styles.modalButton}>
                    <AddCoin
                        coinDict={this.state.coinMarketCapData}
                        addCoin={this.addCoin}
                        refreshCoins={this.onRefresh}
                    />
                </View>
            </View>
        );
    }
}
const styles = {
    contentContainer: {
        flex: 1,
        top: 30,
    },
    modalButton: {
        position: 'absolute',
        width: '100%',
        height: 390,
        top: 800,
    },
    headerContainer: {
        marginTop: 30,
        marginLeft: 15,
    },
    modalContainer: {
        display: "flex",
        marginRight: 30,
        marginLeft: 30
    },
    statisticsContainer: {
        display: "flex",
        padding: 10,
        paddingBottom: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop:10,
    },
    coinScroll: {
        flex: 1,
    },
    modalChoice: {
        display: "flex",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    timeText: {
        color: "#FFFFFF",
        fontSize: 20,
    },
    buttonContainer: {
        display: "flex",
        alignItems: "flex-end",
        marginRight: 20,
        flex: 1
    },
    header: {
        display: 'flex',
        fontWeight: "bold",
        fontSize: 22,
        color: "#feff47"
    },
    percentChangePlus: {
        color: "#44CF6C",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 5,
    },
    percentChangeMinus: {
        color: "#cf4d44",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: 20,
    }
};

export default CryptoCoinsContainer;
