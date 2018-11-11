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
    ActivityIndicator,
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
            isLoading: true,
            isLoadingMore: false,
            height: height,
            width: width,
            searchText: "",
            ds: ds,
            categoryId: 3,
            listItems: ds.cloneWithRows([]),
            searchResultJson: [],
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
	await this.setState({isLoadingMore: true});

	var stateLeftRecord = this.state.leftRecord;
	if(this.state.isLoading || stateLeftRecord >0 ){

        var searchResultJson = [];
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
            if (searchData != null && searchData!=undefined && searchData!="" && searchData.length>0) {

                if (leftRecord > 0)
                    that.updateMyState(nextPage, 'page');

		await this.setState({
			previousPage : previousPage,
			leftRecord : leftRecord,
			nextPage : nextPage
		});

//                that.updateMyState(previousPage, 'previousPage');
//                that.updateMyState(leftRecord, 'leftRecord');
//                that.updateMyState(nextPage, 'nextPage');

		if(this.state.isLoading){
			await this.setState({
				searchResultJson : searchData,
				listItems : that.state.ds.cloneWithRows(searchData)
			});

			//that.updateMyState(searchData, 'searchResultJson');
                	//that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
		} else {
			var searchResultJson = this.state.searchResultJson;

			searchData = searchResultJson.concat(searchData);
			await this.setState({
				searchResultJson : searchData,
				listItems : that.state.ds.cloneWithRows(searchData)
			});

			//that.updateMyState(searchData, 'searchResultJson');
                	//that.updateMyState(that.state.ds.cloneWithRows(searchData), 'listItems');
		}
		await this.setState({isLoadingMore: false});
		await this.setState({isLoading: false});

            }
        }

	} else {
		await this.setState({isLoadingMore : false});
	}

    }

    constructTemplate(item) {
	//return <Text style={{paddingTop : 100}}>{this.state.searchResultJson.length} {JSON.stringify(item)}</Text>;
        return <SearchAdsContent imgWidth={this.state.width-50}
                                 imgHeight={150}
                                 navigation={this.navigate}
                                 postJson={item} fromPage="View My Bookmarked List" bookmarkAdd={true} dataLoading = {this.dataLoading}/>;
    }

 render() {
        if (this.state.isLoading) {
            return (
                <View>
		        <View style={{height : 100}}>
			<Navbar
		            title={"Bookmarked"}
		            bgColor={'orange'}
		            left={{
							icon: "ios-menu",
							onPress: () => this.props.navigation.toggleDrawer(),
						}}
		            style={{height:60}}
		            />
		        </View>
		        <View style={styles.container}>
		            <ActivityIndicator size="large" />
		        </View>
                </View>
            );
        } else {
            return (
                <View>
		        <View style={{height : 60}}>
			<Navbar
		            title={"View All My Ads"}
		            bgColor={'orange'}
		            left={{
							icon: "ios-menu",
							onPress: () => this.props.navigation.toggleDrawer(),
						}}
		            style={{height:60}}
		            />
		        </View>
			<View style={{ height : this.state.height - 80, paddingBottom : 20 }}>
                    <ListView
                        dataSource={this.state.listItems}
                        renderRow={(item) => this.constructTemplate(item)}
                        onEndReached={() => this.dataLoading()}
                        renderFooter={() => {
            return (
              this.state.isLoadingMore &&
              <View style={{ flex: 1, padding: 10 }}>
                <ActivityIndicator size="small" />
              </View>
            );
          }}
                        />
		        </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d6d7da',
        padding: 6,
    },
    imageWrapper: {
        padding: 5,
    },
    title: {
        fontSize: 20,
        textAlign: 'left',
        margin: 6,
    },
    subtitle: {
        fontSize: 10,
        textAlign: 'left',
        margin: 6,
    },
});
