'use strict';
import React, {Component, PropTypes} from "react";
import {
    View,
    ToastAndroid,
    StyleSheet,
    Animated,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    ListView,
    AsyncStorage
} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Search extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            height: height,
            width: width,
            searchText: '',
            searchTextList: [],
            ds: ds,
            listItems: ds.cloneWithRows([])
        };
	this.navigate=this.props.navigation.navigate;
    }

    async componentDidMount() {
        var that = this;
        var searchTextList = await AsyncStorage.getItem('listItems');
        if (searchTextList != null) {
            await that.updateMyState(that.state.ds.cloneWithRows(JSON.parse(searchTextList)), 'listItems');
            await that.updateMyState(JSON.parse(searchTextList), 'searchTextList');
        }
    }

    async updateMyState(value, keyName) {
        await this.setState({
            [keyName]: value
        });
    }

    onPressRedirectToPassData(routes, searchData) {
        this.navigate(routes, {'searchText': searchData});
    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    onPressRedirectToGoBack(routes) {
        this.props.navigator.pop();
    }

    async onPressSearch() {
        var searchText = this.state.searchText;
        var listItems = null;
        var that = this;
        if (searchText.length > 0) {
            listItems = await AsyncStorage.getItem('listItems');
            if (listItems == null) {
                listItems = [];
            } else {
                listItems = JSON.parse(listItems);
            }
            listItems.push(searchText);

            that.updateMyState(that.state.ds.cloneWithRows(listItems), 'listItems');
            await AsyncStorage.setItem('listItems', JSON.stringify(listItems));
            await that.updateMyState(listItems, 'searchTextList');
            await this.onPressRedirectToPassData('Search', searchText);
        }
    }

    async onPressToClear() {
        var listItems = [];
        var that = this;
        await AsyncStorage.removeItem('listItems');
        await AsyncStorage.setItem('listItems', JSON.stringify(listItems));
        that.updateMyState(that.state.ds.cloneWithRows([]), 'listItems');
        await that.updateMyState([], 'searchTextList');

    }

    renderGridItem(item, layoutWidth) {
        return (

            <View style={{alignItems:'center', marginTop: 5}}>
                <View style={{width: layoutWidth, height: 50, borderRadius: 3, backgroundColor: '#FFF'}}>
                    <TouchableOpacity style={styles.button}
                                      onPress={()=>this.onPressRedirectToPassData('Search', item)}>
                        <View style={{padding:15, flexDirection:'row'}}>
                            <Icon name='search' color='#a6a6a6' size={18}/>
                            <Text style={{color:'#a6a6a6',fontSize:14, paddingLeft:15}}>{item}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    render() {
        var inputWidth = this.state.width - 30;
        var layoutWidth = this.state.width;
        var clearBtn = null;
        if (this.state.searchTextList.length > 0) {
            clearBtn = <TouchableOpacity onPress={()=>this.onPressToClear()}>
                <Text style={styles.textHeader}>
                    Clear
                </Text>
            </TouchableOpacity>;
        }

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]}
                  onLayout={()=> this.updateLayout()}>
                
                <ScrollView style={{ flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.textHeader, {width : layoutWidth - 80}]}>
                            Recent Searches
                        </Text>
                        { clearBtn }
                    </View>
                    <ListView dataSource={this.state.listItems}
                              renderRow={(item) => this.renderGridItem(item, layoutWidth)}
                              enableEmptySections={true}/>

                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    textHeader: {
        fontSize: 16,
        padding: 10,
        paddingTop: 20,
        paddingLeft: 20,
        textAlign: 'left',
        color: '#FFF'
    },
    textRow: {
        fontSize: 16,
        padding: 10,
        height: 40,
        backgroundColor: '#FFF',
        color: '#a6a6a6',
        paddingLeft: 20,
        textAlign: 'left'
    },
    grid: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    gridItem: {
        margin: 5,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemImage: {
        width: 100,
        height: 100,
        borderWidth: 1.5,
        borderColor: 'white',
        borderRadius: 50,
    },
    gridItemText: {
        marginTop: 5,
        textAlign: 'center',
    },
});
