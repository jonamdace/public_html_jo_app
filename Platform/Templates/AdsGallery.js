'use strict';
import React, {Component, PropTypes} from "react";
import {
	View, 
	Text, 
	TouchableOpacity, 
	StyleSheet,
	Platform,
	Dimensions,
	ScrollView,
	Image
	} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import ConfigVariable from '../Component/config/ConfigVariable';

import Swiper from 'react-native-swiper';

var styles = StyleSheet.create({
  wrapper: {
	height:200
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
export default class AdsGallery extends Component {
	static navigationOptions = { title: 'AdsGallery', header: null };
  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
	    	super(props);
		this.state = {
			isLoading : false,
			height : height,
			width : width,
			adsgalleryDetails : {},
			adsCode : '',
			userCode :''
		};
		this.navigate=this.props.navigateTo;
	}

	updateLayout(){
		var {height, width} = Dimensions.get('window');
		this.setState({height : height, width : width});
	}

	async componentDidMount() {
		var singleAdsJson = this.props.value['singleAdsJson'];
		this.updateMyState(this.props.value['data'], 'adsgalleryDetails');
		this.updateMyState(singleAdsJson[0].adsCode, 'adsCode');
		this.updateMyState(singleAdsJson[0].userCode, 'userCode');
	}

	updateMyState(value, keyName){
		this.setState({
			[keyName] : value
		});
	}

	render() { 
		var layoutWidth = this.state.width;
		var dispData = null;
		var disp = null;
		if(this.state.adsgalleryDetails != null && this.state.adsgalleryDetails.length > 0){
			var that = this;
			disp = this.state.adsgalleryDetails.map((adsDetails, index) => {
				var fileName = adsDetails['file_name'];
			var filePath = ConfigVariable.uploadedAdsFilePath + '/' + that.state.userCode + '/' + that.state.adsCode + '/' + fileName;
				//var filePath = 'http://192.168.43.42/public_html1/uploads/files/userads/'+that.state.userCode +"/"+ that.state.adsCode+"/"+fileName;
				return <View style={styles.slide3} key={index} >
<Image source={{uri: filePath}} resizeMode={'contain'}>
		<View style={[CommonStyle.slide1, {width:this.state.width }]}>
		</View>
</Image></View>
			});
			dispData = <Swiper style={{height: this.state.height-24, width: this.state.width, justifyContent:'center', alignSelf:'center'}} showsButtons={false}>{disp}</Swiper>;
			
		}
    		return ( 
			<View style={[{height : this.state.height, flex: 1, width : layoutWidth, backgroundColor:'#59C2AF'}]} 
				onLayout={()=> this.updateLayout()} >
				<ScrollView>
					{dispData}
				</ScrollView>
			</View>
		);
	}
}
