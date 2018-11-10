import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';
import SearchAdsContent from "./SearchAdsContent";
import { doPost } from "../Component/MKActions";
import MKAdsBanner from "../Component/MKAdsBanner";
import { Navbar } from '../Component/navbar-native/index.js';

export default class Application extends Component {
    constructor(props) {
        super(props);
        var {height, width} = Dimensions.get('window');
        this.fetchMore = this._fetchMore.bind(this);
        this.fetchData = this._fetchData.bind(this);
	this.navigate=this.props.navigation.navigate;
        this.state = {
            height: height,
            width: width,
            dataSource: null,
            isLoading: true,
            isLoadingMore: false,
            _data: null,
            searchText: "",
            categoryId: 3,
            page: "0",
            leftRecord: 0,
            previousPage: -1,
            nextPage: "",
            searchUserId : ""
        };
    }

    updateMyState(value, keyName) {
        this.setState({
            [keyName]: value
        });
    }

    _fetchData(callback) {
        //Limits fetches to 15 so there's lesser items from the get go
	var that = this;

	var serverUri = "http://192.168.43.42/public_html1/";
	var postJsonData = new FormData();
        postJsonData.append("page", that.state.page);
        postJsonData.append("getListFromPage", "View All My Ads");
        postJsonData.append("searchUserId", that.state.searchUserId);
        postJsonData.append("rf", "json");

	var url = serverUri + 'searchAdsAjax';
	fetch(url, {
		method: 'POST',
		headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'multipart/form-data;'		
		},
		body: postJsonData
	})
	.then((response) => response.json())
	.then(callback)
	.catch(error => {
                console.error(error);
	});
    }

    _fetchMore() {
	var stateLeftRecord = this.state.leftRecord;
	if(stateLeftRecord >0 ){
		this.fetchData(responseJson => {

		    var searchData = responseJson['searchData'];
		    var page = parseInt(responseJson['page']);
		    var leftRecord = parseInt(responseJson['left_rec']);
		    var nextPage = page + 1;

		    var previousPage = page - 1;
		    if (searchData != null && leftRecord > 0) {
			const data = this.state._data.concat(searchData);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(data),
				isLoadingMore: false,
				_data: data,
				previousPage : previousPage,
				leftRecord : leftRecord,
				nextPage : nextPage
			});

		        if (leftRecord > 0)
		            this.updateMyState(nextPage, 'page');

		    }
			else {
		this.setState({isLoadingMore : false});
			}
		});

	} else {
		this.setState({isLoadingMore : false});
	}
    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    async componentDidMount() {
        //Start getting the first batch of data from reddit
        var userid = await AsyncStorage.getItem('userid');
        this.setState({searchUserId : userid});

	/*
        this.fetchData(responseJson => {
            let ds = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            });
            const data = responseJson.data.children;
            this.setState({
                dataSource: ds.cloneWithRows(data),
                isLoading: false,
                _data: data
            });
        });
	*/

        this.fetchData(responseJson => {

            let ds = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            });

            var searchData = responseJson['searchData'];
            var page = parseInt(responseJson['page']);
            var leftRecord = parseInt(responseJson['left_rec']);
            var nextPage = page + 1;

            var previousPage = page - 1;
            if (searchData != null) {
		const data = searchData;
		this.setState({
			dataSource: ds.cloneWithRows(searchData),
			isLoadingMore: false,
                        isLoading: false,
			_data: data,
			previousPage : previousPage,
			leftRecord : leftRecord,
			nextPage : nextPage
		});

                if (leftRecord > 0)
                    this.updateMyState(nextPage, 'page');

            }
        });

    }

    constructTemplate(item) {
        return <SearchAdsContent imgWidth={this.state.width-50}
                                 imgHeight={150}
                                 navigation={this.navigate}
                                 postJson={item} fromPage="View All My Ads" />;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
		        <View style={{height : 100}}>
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
                        dataSource={this.state.dataSource}
                        renderRow={(item) => this.constructTemplate(item)}
                        onEndReached={() =>
            this.setState({ isLoadingMore: true }, () => this.fetchMore())}
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
