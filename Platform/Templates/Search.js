'use strict';
import React, {Component} from "react";
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

import SearchAdsContent from "./SearchAdsContent";
import { doPost } from "../Component/MKActions";
import MKAdsBanner from "../Component/MKAdsBanner";

export default class Search extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            height: height,
            width: width,
            searchText: "",
            ds: ds,
            categoryId: 3,
            listItems: ds.cloneWithRows([]),
            searchResultJson: {},
            page: "0",
            leftRecord: 0,
		searchData : [],
            previousPage: -1,
            bookmarkArray : [],
            nextPage: "",
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

    async componentDidMount() {
        //var paramsArray = this.props.value;
	var paramsArray = this.props.navigation.state.params;
        var searchUserId = await AsyncStorage.getItem('userid');

		
        if (paramsArray != null) {
            var searchText = this.getValueFromArray(paramsArray, 'searchText');
            var categoryId = this.getValueFromArray(paramsArray, 'categoryId');
		//alert("searchText "+ searchText + "categoryId "+ categoryId+ "searchUserId "+ searchUserId)
            await this.setState({categoryId: categoryId, searchText: searchText, searchUserId : searchUserId});
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
        postJson.append("city", "");
        postJson.append("categoryId", this.state.categoryId);
        postJson.append("SubcategoryId", "");
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
                that.updateMyState(response, 'searchResultJson');
                if (leftRecord > 0)
                    that.updateMyState(nextPage, 'page');
                that.updateMyState(previousPage, 'previousPage');
                that.updateMyState(leftRecord, 'leftRecord');

		var searchDataExist = this.state.searchData.concat(searchData)
                that.updateMyState(searchDataExist, 'searchData');

                that.updateMyState(nextPage, 'nextPage');
                that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
            }
        }


    }

    constructTemplate(item) {

        var bookmarkAdd = true;
        var adsId = item['adsId'];

       if(this.state.bookmarkArray.indexOf(adsId) == -1){
           bookmarkAdd = false;
       }
        return <SearchAdsContent imgWidth={this.state.width-50}
                                 imgHeight={150}
                                 navigation={this.navigate}
                                 postJson={item} fromPage="adsList" bookmarkAdd={bookmarkAdd}/>;
    }

    render() {

        var inputWidth = this.state.width - 30;
        var layoutWidth = this.state.width;
        var nextBtn = null;
        var previousBtn = null;
        if (this.state.leftRecord > 0) {
            nextBtn = <TouchableOpacity onPress={()=>this.onNext()}><Text
                style={{textAlign : 'center'}}>Load More</Text></TouchableOpacity>;
        }
        if (this.state.previousPage >= 0) {
            previousBtn =
                <TouchableOpacity onPress={()=>this.onPrevious()}><Text style={{textAlign : 'right'}}>Previous / </Text></TouchableOpacity>;
        }

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]}
                  onLayout={()=> this.updateLayout()}>
                <ScrollView >
                    <ListView style={{paddingBottom:15}} dataSource={this.state.listItems}
                              renderRow={(item) => this.constructTemplate(item)}
                              enableEmptySections={true}/>
                    <View style={{flexDirection:"row", width : layoutWidth, paddingBottom : 20, alignItems : "center"}}>
                        { nextBtn }
                    </View>
			<MKAdsBanner />
                </ScrollView>
            </View>
        );
    }
}
