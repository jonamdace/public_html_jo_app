'use strict';
import React, {Component} from "react";
import {
    ActivityIndicator,
    View,
    ToastAndroid,
    StyleSheet,
    Animated,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Image,FlatList,
    ListView,Modal,
    AsyncStorage
} from "react-native";

import SearchAdsContent from "./SearchAdsContent";
import { doPost } from "../Component/MKActions";
import MKAdsBanner from "../Component/MKAdsBanner";
import Icon from 'react-native-vector-icons/Ionicons';

export default class Search extends Component {

    static navigationOptions = ({navigation}) => {
        let handleOpenModal = null;
        if (navigation.state.params && navigation.state.params.hasOwnProperty('handleOpenModal')) {
            handleOpenModal = navigation.state.params.handleOpenModal;
        } else {
            handleOpenModal = () => {};
        }

        return {
            headerRight: <TouchableOpacity
                style={{marginRight: 16}}
                onPress={()=>navigation.navigate("AdsFilters")}>
               <Text>   <Icon name="md-funnel" size={35} color={'#fff'} style={{paddingRight : 20}} /></Text>
            </TouchableOpacity>
        }
    }


    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isLoading: true,
            modalVisible: false,
            height: height,
            width: width,
            searchText: "",
            ds: ds,
            city : "",
            amountRange : "",
            categoryId: 3,
            subCategoryId : "",
            listItems: ds.cloneWithRows([]),
            searchResultJson: {},
            page: "0",
            leftRecord: 0,
		    searchData : [],
            previousPage: -1,
            bookmarkArray : [],
            nextPage: "",
            loggedInUserId : "",
            searchUserId : ""
        };
	this.navigate=this.props.navigation.navigate;
    }


    getValueFromArray(arraName, arrayIndex) {
        if (arraName[arrayIndex] != "" && arraName[arrayIndex] != null && arraName[arrayIndex] != "null" && arraName[arrayIndex] != undefined) {
            return arraName[arrayIndex];
        }
        return "";
    }

    handleOpenModal(){
        this.setState({modalVisible: !this.state.modalVisible});
    }

    async componentDidMount() {
        this.props.navigation.setParams({ handleOpenModal: ()=>this.handleOpenModal() });

        //var paramsArray = this.props.value;
    	var paramsArray = this.props.navigation.state.params;
        var searchUserId = await AsyncStorage.getItem('userid');

		this.setState({
            loggedInUserId : searchUserId
        })
        if (paramsArray != null) {
            var searchText = this.getValueFromArray(paramsArray, 'searchText');
            var categoryId = this.getValueFromArray(paramsArray, 'categoryId');
            var subCategoryId = this.getValueFromArray(paramsArray, 'subCategoryId');
            var city = this.getValueFromArray(paramsArray, 'city');
            var amountRange = this.getValueFromArray(paramsArray, 'amountRange');
		    //alert("searchText "+ searchText + "categoryId "+ categoryId+ "searchUserId "+ searchUserId + " amountRange " +amountRange)
            await this.setState({
                amountRange: amountRange,
                city: city,
                categoryId: categoryId,
                searchText: searchText,
                searchUserId : searchUserId,
                subCategoryId : subCategoryId
            });
        }
        await this.dataLoading();
    }

    updateMyState(value, keyName) {
        this.setState({
            [keyName]: value
        });
    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    onPressRedirect(routes) {
        this.navigate(routes);
    }

    onPressRedirectToGoBack() {
        this.props.navigation.goBack();
    }

    async onNext() {
        await this.dataLoading();
    }

    async onPrevious() {
        var previousPage = this.state.previousPage;
        await this.updateMyState(previousPage, 'page');
        await this.dataLoading();
    }

    async dataLoading() {
        var searchResultJson = {};
        var that = this;

        //that.props.updateLoading(true);

        var postJson = new FormData();
        postJson.append("page", that.state.page);
        postJson.append("getListFromPage", "adsList");
        postJson.append("amountRange", this.state.amountRange);
        postJson.append("city", this.state.city);
        postJson.append("categoryId", this.state.categoryId);
        postJson.append("SubcategoryId", this.state.subCategoryId);
        postJson.append("searchText", this.state.searchText);
        postJson.append("searchUserId", "");
        postJson.append("userid", this.state.searchUserId);
        postJson.append("rf", "json");
        var subUrl = "searchAdsAjax";
        var response = await doPost(subUrl, postJson);
        setTimeout(function () {
            //that.props.updateLoading(false);
        }, 1000);

        if (response != null) {
            //alert(JSON.stringify(response));
            var searchData = response['searchData'];
            var bookmarkArray = response['bookmarkArray'];
            var page = parseInt(response['page']);
            var leftRecord = parseInt(response['left_rec']);
            var nextPage = page + 1;
            var previousPage = page - 1;
            if (searchData != null) {
                that.setState({
                    isLoading: false,
                })
                that.updateMyState(response, 'searchResultJson');
                if (leftRecord > 0)
                    that.updateMyState(nextPage, 'page');
                that.updateMyState(previousPage, 'previousPage');
                that.updateMyState(leftRecord, 'leftRecord');

		var searchDataExist = this.state.searchData.concat(searchData)
                searchDataExist.push({"adsId" : "ads"})

                that.updateMyState(searchDataExist, 'searchData');

                that.updateMyState(nextPage, 'nextPage');
                that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
            }
        }


    }

    constructTemplate(item) {

        if(item['adsId'] != "ads"){
            var bookmarkAdd = true;
            var adsId = item['adsId'];

            if(this.state.bookmarkArray.indexOf(adsId) == -1){
                bookmarkAdd = false;
            }
            return <SearchAdsContent imgWidth={this.state.width-50}
                                     loggedInUserId={this.state.loggedInUserId}
                                     imgHeight={150}
                                     navigation={this.navigate}
                                     postJson={item} fromPage="adsList" bookmarkAdd={bookmarkAdd}/>;
        } else {
            return <View style={{ marginTop : 10}}><MKAdsBanner /></View>
        }

    }

	_keyExtractor = (item, index) => item.adsId;

    render() {

        if (this.state.isLoading) {
            return (
                <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    }}>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {

            var inputWidth = this.state.width - 30;
            var layoutWidth = this.state.width;
            var nextBtn = null;
            var previousBtn = null;
            if (this.state.leftRecord > 0) {
                nextBtn = <TouchableOpacity onPress={()=>this.onNext()} style={{height: 30}}>
                    <Text
                        style={[ {marginTop: 15, color:'#FFF',  fontWeight : 'bold'}]}>
                        Load More »
                    </Text>
                </TouchableOpacity>;
            }
            if (this.state.previousPage >= 0) {
                previousBtn =
                    <TouchableOpacity onPress={()=>this.onPrevious()}><Text style={{textAlign : 'right'}}>Previous / </Text></TouchableOpacity>;
            }

            return (
                <View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]}
                      onLayout={()=> this.updateLayout()}>
                    <ScrollView>
                        <FlatList
                            data={this.state.searchData}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={(item) => this.constructTemplate(item['item'])}
                            />
                        <View style={{flex : 1, width : layoutWidth, paddingBottom : 20, alignItems : "center"}}>
                            { nextBtn }
                        </View>

                        <MKAdsBanner />
                    </ScrollView>
                </View>
            );
        }
    }
}
