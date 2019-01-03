'use strict';
import React, {Component} from "react";
import {
	View, 
	Text, 
	TouchableOpacity, 
	StyleSheet,
	Platform,
	Dimensions,
	ScrollView,
	Image,
	ImageBackground,
	ListView
	} from "react-native";
import MKSpinner from "../Component/MKSpinner";

import colors from '../Component/config/colors';
import ConfigVariable from '../Component/config/ConfigVariable';
import CommonStyle from "../Styles/CommonStyle";
import Icon from 'react-native-vector-icons/FontAwesome';
import { doPost } from "../Component/MKActions";

import Swiper from 'react-native-swiper';
var {height, width} = Dimensions.get('window');
export default class AdsView extends Component {
	static navigationOptions = { header: null };
	constructor(props: Object) {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		var {height, width} = Dimensions.get('window');
	    	super(props);
		this.state = {
			isLoading : false,
			height : height,
			width : width,
			singleAdsJson : {},
			similaradsArray : {},
			dynamicAdsDetails : {},
			adsgalleryDetails:{},
			adsViewcount : "0",
			ds : ds
		};
		this.navigate=this.props.navigation.navigate;
		this.updateParentState = this.updateParentState.bind(this);

	}

	updateParentState(obj){
		this.setState(obj);
	}

	updateLayout(){
		var {height, width} = Dimensions.get('window');
		this.setState({height : height, width : width});
	}


	async getAdsDetails(paramsData){
		await this.setState({isLoading : true});
		var singleAdsJson = null;
		var dynamicAdsDetails = null;
		var adsgalleryDetails = null;
		var similaradsArray = {};
		var adsViewcount = "0";
		var that = this;
		if(paramsData != null){
			var adsId = paramsData['adsId'];
			var postJson = new FormData();
			postJson.append("rf", "json");
			var subUrl = "singleItem/"+adsId;
			var response = await doPost(subUrl, postJson);
			if(response != null){
				singleAdsJson = response['adsDetails']
				dynamicAdsDetails = response['dynamicAdsDetails']
				adsgalleryDetails = response['adsgalleryDetails']
				adsViewcount = response['adsViewcount']
				similaradsArray = response['similaradsArray']
			}
		}

		this.setState({adsViewcount : adsViewcount, singleAdsJson : singleAdsJson, adsgalleryDetails : adsgalleryDetails, dynamicAdsDetails : dynamicAdsDetails, similaradsArray : similaradsArray});
		await this.setState({isLoading : false});
	}

	async componentDidMount() {
		var paramsData = this.props.navigation.state.params;
		this.getAdsDetails(paramsData)
		//alert(JSON.stringify(this.state.adsgalleryDetails));
	}

	updateMyState(value, keyName){
		this.setState({
			[keyName] : value
		});
	}

	onPressRedirectToGoBack(){
        	this.props.navigation.goBack();
	}

	onPressRedirectToPassData(routes, postJson){
		this.navigate(routes, postJson);
	}

	renderGridItem(item){

		var fileName = item["file_name"];
		var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
		if(fileName != null)
			filePath = ConfigVariable.uploadedAdsFilePath + '/' + item['userCode'] + '/' + item['adsCode'] + '/' + fileName;

		return (
			<TouchableOpacity onPress={()=> this.getAdsDetails(item)}>
				<View style={{ width: 100, height: 100, borderWidth : 1, borderColor :'#59C2AF', marginRight : 10}}>
				<ImageBackground source={{uri: filePath }}  resizeMode={'stretch'} style={{width: '100%', height: '100%'}} >
					<View style={{flexDirection: "row"}}>
							<Text style={{textAlign : 'left', fontSize : 10, width: 48,  color :'#FFF', backgroundColor: 'orange'}}>{item['adsCode']}</Text>
							<Text style={{textAlign : 'right', fontSize : 10, width: 50, color :'#FFF', backgroundColor: '#59C2AF'}}>{  "₹ " + item['offerPrice']}</Text>
					</View>
				</ImageBackground>
				</View>
			</TouchableOpacity>
		);
	}

	render() { 
		var deviceWidth = this.state.width;

		var adsJson = this.state.singleAdsJson;
		var descContent = null;
		var descDynamicContent = null;
		var fileName = null;
		var fileImage = null;

		var dynamicAdsDetails = this.state.dynamicAdsDetails;
		var dynamicAdsDetailsArray = [];
		if(dynamicAdsDetails != null){

			 Object.keys(dynamicAdsDetails).map((key)=> {
				 var dynamicAdsDetailsSingle = dynamicAdsDetails[key];
				 dynamicAdsDetailsArray.push(<View key={key} style={[CommonStyle.adsViewRow]}>
					 <Text style={[CommonStyle.adsViewHeader]}>
						 {
							 dynamicAdsDetailsSingle['capturedvariablename'] + " :"
						 }
					 </Text>
					 <Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
						 {
							 dynamicAdsDetailsSingle['capturedVariableValue']
						  }
					 </Text>
				 </View>);
			 });

		}


		if(adsJson != null && adsJson.length>0){
			var singleAdsJson = adsJson[0];
		descContent = <View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader, {color : colors.orange}]}>
					Basic Details
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Ads Code :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 } ]}>
					{singleAdsJson['adsCode']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					No.of Views :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{ this.state.adsViewcount }
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Title :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['adsTitle']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow ]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Posted On :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['createdAt']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Price :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{
						singleAdsJson['offerPrice'] > 0 && singleAdsJson['offerPrice']!= singleAdsJson['actualPrice'] ? <Text><Text style={{textDecorationLine : 'line-through'}}>₹ {singleAdsJson['actualPrice']}</Text> <Text> ₹ {singleAdsJson['offerPrice']}</Text></Text> : "₹ "+ singleAdsJson['actualPrice']
					}
				</Text>
			</View>
			{
				dynamicAdsDetailsArray
			}
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Description :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['description']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader, {color : colors.orange}]}>
					Location
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Country :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['country']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					State :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['state']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					City :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['city']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow]}>
				<Text style={[CommonStyle.adsViewHeader, {color : colors.orange}]}>
					Seller Info
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow ]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Name :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['name']}
				</Text>
			</View>
			<View style={[CommonStyle.adsViewRow ]}>
				<Text style={[CommonStyle.adsViewHeader]}>
					Mobile :
				</Text>
				<Text style={[CommonStyle.adsViewText, { width: deviceWidth-100 }]}>
					{singleAdsJson['mobile']}
				</Text>
			</View>
			{
				this.state.similaradsArray.length >0 ? <View>
					<View style={[CommonStyle.adsViewRow]}>
						<Text style={[CommonStyle.adsViewHeader, {color : colors.orange}]}>
							Similar Ads
						</Text>
					</View>
					<ListView
						horizontal={true}
						pageSize = {2}
						style={{flex:1, margin: 10}}
						enableEmptySections={true}
						removeClippedSubviews={true}
						dataSource=	{
				this.state.ds.cloneWithRows(
					this.state.similaradsArray
					//[{adsCode: 'rested'}, {adsCode: 'rested123'}, {adsCode: 'rested123'}, {adsCode: 'rested123'}, {adsCode: 'rested123'}, {adsCode: 'rested123'}, {adsCode: 'rested123'}]
				)
				}
						renderRow={(data) => this.renderGridItem(data)}
						/>
				</View> : null
			}
			<View style={{paddingBottom : 5}}></View>
		</View>;


		}
		var adsgalleryDetails = this.state.adsgalleryDetails; 
		var adsGalleryCount = 0;
		if(adsgalleryDetails != null && adsgalleryDetails != undefined){	
			adsGalleryCount = adsgalleryDetails.length;
			if(adsGalleryCount>0){
				fileName = adsgalleryDetails[0]['file_name'];
			}
		}
		var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
		if(fileName != null){
			filePath = ConfigVariable.uploadedAdsFilePath + '/' + singleAdsJson['userCode'] + '/' + singleAdsJson['adsCode'] + '/' + fileName;
			fileImage = <ImageBackground source={{uri: filePath }}  resizeMode={'stretch'} style={{width: deviceWidth - 100, height: '100%'}}>
<View style={[CommonStyle.slide1, {height : 300}]}>
		</View>
</ImageBackground>
		} else {
			fileImage = <ImageBackground source={{uri: filePath }} style = {{width:deviceWidth - 100}} >
		<View style={[CommonStyle.slide1]}>
		</View>
</ImageBackground>
		}





    		return ( 
<View style={[{height : this.state.height, flex: 1, width : deviceWidth, backgroundColor:'#FFF'}]}
	onLayout={()=> this.updateLayout()} >
	<ScrollView >
		<View style={[CommonStyle.wrapper]} >
<TouchableOpacity style={[CommonStyle.button, {top: 5, left: 0, position:'absolute', width:60, alignItems:'center'}]} onPress={()=>this.onPressRedirectToGoBack()} >
<Icon name='arrow-left' color='#fff' size={18} style={{paddingTop:5}}/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>this.onPressRedirectToPassData('AdsGallery', {data: this.state.adsgalleryDetails, singleAdsJson : this.state.singleAdsJson})}>
{fileImage}
		
</TouchableOpacity>

<View style={[CommonStyle.button, {top: 210, left: 10, position:'absolute', width:70, alignItems:'center', flexDirection:'row'}]} >
<Icon name='camera' color='#fff' size={18} style={{paddingTop:5}}/>
<Text style={{fontWeight:'bold', paddingTop : 5}}>  {adsGalleryCount}</Text>
</View>

		</View>
		{
			descContent
		}
		<MKSpinner visible={this.state.isLoading} updateParentState={this.updateParentState} textContent={"Please wait"} cancelable={true} textStyle={{color: '#FFF'}} />

	</ScrollView>
</View>
		);
	}
}
