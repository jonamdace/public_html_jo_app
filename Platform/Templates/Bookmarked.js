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
import { Navbar } from '../Component/navbar-native/index.js';
import MKAdsBanner from "../Component/MKAdsBanner";
import SearchAdsContent from "./SearchAdsContent";
import { doPost } from "../Component/MKActions";

export default class Bookmarked extends Component {

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
            previousPage: -1,
            nextPage: "",
            searchUserId : ""
        };
		this.navigate=this.props.navigation.navigate;
    }

    async componentDidMount() {
        var userid = await AsyncStorage.getItem('userid');
        this.setState({searchUserId : userid});
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
        var postJson = new FormData();
        postJson.append("page", that.state.page);
        postJson.append("getListFromPage", "View My Bookmarked List");
        postJson.append("searchUserId", that.state.searchUserId);
        postJson.append("rf", "json");
        var subUrl = "searchAdsAjax";
        //that.props.updateLoading(true);
        var response = await doPost(subUrl, postJson);
        //alert(JSON.stringify(postJson))

        setTimeout(function () {
            //that.props.updateLoading(false);
        }, 1000);

        if (response != null) {
            //alert(JSON.stringify(response));
            var searchData = response['searchData'];
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
                that.updateMyState(nextPage, 'nextPage');
                that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
            }
        }


    }

    constructTemplate(item) {
        return <SearchAdsContent imgWidth={this.state.width-50}
                                 imgHeight={150}
                                 navigation={this.navigate}
                                 postJson={item} fromPage="View My Bookmarked List" bookmarkAdd={true} dataLoading = {this.dataLoading}/>;
    }

    render() {

        var inputWidth = this.state.width - 30;
        var layoutWidth = this.state.width;
        var nextBtn = null;
        var previousBtn = null;
        if (this.state.leftRecord > 0) {
            nextBtn = <TouchableOpacity onPress={()=>this.onNext()}><Text
                style={{textAlign : 'left'}}>Next</Text></TouchableOpacity>;
        }
        if (this.state.previousPage >= 0) {
            previousBtn =
                <TouchableOpacity onPress={()=>this.onPrevious()}><Text style={{textAlign : 'right'}}>Previous / </Text></TouchableOpacity>;
        }

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]}
                  onLayout={()=> this.updateLayout()}>
		<Navbar
                    title={"Bookmark"}
                    bgColor={'orange'}
                    left={{
						icon: "ios-menu",
						onPress: () => this.props.navigation.toggleDrawer(),
					}}
                    style={{height:60}}
                    />
                <ScrollView >
                    <ListView style={{paddingBottom:15}} dataSource={this.state.listItems}
                              renderRow={(item) => this.constructTemplate(item)}
                              enableEmptySections={true}/>
			<MKAdsBanner />
                    <View style={{flexDirection:"row", width : layoutWidth, paddingBottom : 20}}>
                        <View style={ {width : layoutWidth/2}}>{ previousBtn }</View>
                        <View style={ {width : layoutWidth/2}}>{ nextBtn }</View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
