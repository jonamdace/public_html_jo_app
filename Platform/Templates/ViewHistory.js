import React, {Component} from "react";
import {View, ActivityIndicator, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage, Image, ListView} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { doPost, guid } from "../Component/MKActions";
import MKButton from "../Component/MKButton";
import MKAdsBanner from "../Component/MKAdsBanner";

export default class ViewHistory extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.fetchMore = this._fetchMore.bind(this);
	this.navigate=this.props.navigation.navigate;
        this.state = {
		height: height,
		width: width,
		dataSource: null,
		isLoading: true,
		isLoadingMore: false,
		_data: null,
		page : '0',
		leftRecord: 0,
        };
    }

    async componentDidMount() {
	this.fetchMore()
    }


    renderRow(item) {
        if(item != undefined){

		if(item.id != "ads"){
            return <View style={{padding: 5, margin: 5, backgroundColor: '#E9E5BE'}}>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Date</Text></View>
                    <View><Text>: {item.createdAt}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Action</Text></View>
                    <View><Text>: {item.action}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Page Name</Text></View>
                    <View><Text>: {item.pageName}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>From IP</Text></View>
                    <View><Text>: {item.fromIp}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Description</Text></View>
                    <View><Text>: {item.description}</Text></View>
                </View>
            </View>;

		} else {
			var gid= guid();
			return <View style={{padding : 5}}><MKAdsBanner /></View>;
		}
        }
    }

	async _fetchMore() {
        	var userid = await AsyncStorage.getItem('userid');

		var stateLeftRecord = this.state.leftRecord;
		if(this.state.isLoading || stateLeftRecord >0 ){

		var postJson = new FormData();
		postJson.append("page", this.state.page);
		postJson.append("getListFromPage", "View My History");
		postJson.append("rf", "json");
		postJson.append("userid", userid);
		postJson.append("rec_limit", 10);

		var subUrl = "getHistoryList";
		var responseJson = await doPost(subUrl, postJson);


		if (responseJson != null) {
			var searchData = responseJson['historyArray'];
			var page = parseInt(responseJson['page']);
			var nextPage = page + 1;
			var previousPage = page - 1;
			var leftRecord = parseInt(responseJson['left_rec']);

		        if (leftRecord > 0)
		            await this.setState({page : nextPage });

			    if (searchData != null) {
				if(this.state.isLoading){
					let dataSource = new ListView.DataSource({
						rowHasChanged: (r1, r2) => r1 !== r2,
					});

					await this.setState({
						dataSource: dataSource.cloneWithRows(searchData),
						isLoadingMore: false,
						_data: searchData,
						leftRecord : leftRecord,
						nextPage : nextPage
					});
					await this.setState({
						isLoading : false
					});
				} else {
					const data = this.state._data.concat(searchData);
					data.push({"id" : "ads"})
					await this.setState({
						dataSource: this.state.dataSource.cloneWithRows(data),
						isLoadingMore: false,
						_data: data,
						leftRecord : leftRecord,
						nextPage : nextPage
					});
				}
			    }
				else {
			await this.setState({isLoadingMore : false});
				}
			};

		} else {
			await this.setState({isLoadingMore : false});
		}
	}

    async loadsearchData(page){

        var that = this;
        var userid = await AsyncStorage.getItem('userid');
        //that.props.updateLoading(true);

        var postJson = new FormData();
        postJson.append("getListFromPage", "View My History");
        postJson.append("rf", "json");
        postJson.append("userid", userid);
        postJson.append("rec_limit", 10);
        postJson.append("page", page);
        var subUrl = "getHistoryList";
        var response = await doPost(subUrl, postJson);
        if(response != null && response != "" && response != undefined){
            var left_rec = response['left_rec'];
            var page = response['page'];
            var rec_limit = response['rec_limit'];
            var historyArray = response['historyArray'];

            that.setState({
                page : page,
                left_rec : left_rec,
                rec_limit : rec_limit,
                historyArray : historyArray,
                listItems : that.state.ds.cloneWithRows(historyArray)
            });
        }
        //that.props.updateLoading(false);

    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

	render() {
		if (this.state.isLoading) {
		    return (
			<View style={{        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1'}}>
			    <ActivityIndicator size="large" />
			</View>
		    );
		} else {
			return (
				<View style={{ height : this.state.height - 80, paddingBottom : 20 }}>
					{

					//this.state._data.length > 0 ? <Text>{JSON.stringify(this.state._data[0])}</Text> : null

					}
					
					<ListView
						dataSource={this.state.dataSource}
						renderRow={(item) => this.renderRow(item)}
						onEndReached={() =>
						this.setState({ isLoadingMore: true }, () => this.fetchMore())}
						renderFooter={() => {
							return (
								this.state.isLoadingMore &&
								<View style={{ flex: 1, padding: 10, height : 50 }}>
								<ActivityIndicator size="small" />
								</View>
							);
						}
					}
					/>
				</View>
			);
		}
	}

}
