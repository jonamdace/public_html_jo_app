'use strict';
import React, { Component } from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import MKSpinner from "../Component/MKSpinner";

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class Login extends Component {

  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
	    	super(props);
		this.state = {
			height : height,
			width : width,
			isLoading : false,
			errorsJson:{
				inputMobileNumber : null,
				inputPassword : null							
			},
			inputMobileNumber : '',
			inputPassword : ''
		};
		this.navigate=this.props.navigation.navigate;
		this.onFocus = this.onFocus.bind(this);
		this.focusNextField = this.focusNextField.bind(this);
		this.updateParentState = this.updateParentState.bind(this);
	}

	updateParentState(obj){
		this.setState(obj);
	}

	focusNextField(nextField) {
		this.refs[nextField].focus(); 
	}

	onFocus() {
		let errorsJson = this.state.errorsJson; 
		var that = this;
		for (let name in errorsJson) {
			let ref = this.refs[name];
			if (ref && ref.isFocused()) {
				errorsJson[name] = null;
			}
		}
		that.updateMyState(errorsJson, 'errorsJson');
	}

	componentDidMount() {
		MessageBarManager.registerMessageBar(this.refs.alert);
	}

	componentWillUnmount() {
		MessageBarManager.unregisterMessageBar();
	}

	async getLogin(){
		var that = this;
		var inputMobileNumberValue = that.state.inputMobileNumber;
		var inputPassword = that.state.inputPassword;
		var isValid = 1;
		var stateArray = that.state;
		var errorsJson = that.state.errorsJson;
		Object.keys(errorsJson).forEach(function(key) {
			var stateArrayValue = stateArray[key];
			if(stateArrayValue == null || stateArrayValue==""){
				errorsJson[key] = "This field is required";
				isValid = 0;
			}  else if( key == 'inputMobileNumber' && stateArrayValue.length!=10){
				errorsJson[key] = "Length should not be less than 10";
				isValid = 0;
			} else if( key == 'inputMobileNumber' && isNaN(stateArrayValue)){
				errorsJson[key] = "Invalid Mobile Number";
				isValid = 0;
			} else {
				errorsJson[key] = null;
			}
		});
		await that.updateMyState(errorsJson, 'errorsJson');
		if(isValid == 1){
			var postJson = new FormData();
			postJson.append("username", that.state.inputMobileNumber);
			postJson.append("password", that.state.inputPassword);
			var subUrl = "getLoginFromApps";
			await this.setState({isLoading : true});
			var response = await doPost(subUrl, postJson);
			if(response != null){

				var status = "";
				var message = "";
				var alertType = "";
				var title = "";

				var active = response['active'];
				if(active!=null && (active == "active" ||  active == "InActive")){
					var userid = response['userid']; var userCode = response['userCode']; var name = response['name'];
					var lastlogin = response['lastlogin']; var img = response['img'];
					await AsyncStorage.setItem('userid', userid); await AsyncStorage.setItem('userCode', userCode);
					await AsyncStorage.setItem('active', active); await AsyncStorage.setItem('name', name);
					await AsyncStorage.setItem('lastlogin', lastlogin); await AsyncStorage.setItem('img', img);

					await AsyncStorage.setItem('username', that.state.inputMobileNumber);
					await AsyncStorage.setItem('password', that.state.inputPassword);

    					await AsyncStorage.setItem('userToken', that.state.inputMobileNumber);
					//that.props.updateLoading(false);
					await that.setState({isLoading : false});
					alertType = 'success';
					title = "Success!";
					MessageBarManager.showAlert({
						title: title,
						message: "Successfully logged in!",
						alertType: alertType,
						position: 'bottom',
					});

					setTimeout(function(){
						that.onPressRedirect("App");
					}, 1000);
				} else if(active == "InActive"){
					//that.props.updateLoading(false);
					alertType = 'error';
					title = "Error!";
					message="Your Profile was not activated!";
					await that.setState({isLoading : false});
					MessageBarManager.showAlert({
						title: title,
						message: message,
						alertType: alertType,
						position: 'bottom',
					});
				} else {
					//that.props.updateLoading(false);
					alertType = 'error';
					title = "Error!";
					message="Username/Password is incorrect";
					await that.setState({isLoading : false});
					MessageBarManager.showAlert({
						title: title,
						message: message,
						alertType: alertType,
						position: 'bottom',
					});
				}



			}
		}
	}

	updateMyState(value, keyName){
		this.setState({
			[keyName] : value
		});
	}

	updateLayout(){
		var {height, width} = Dimensions.get('window');
		this.setState({height : height, width : width});
	}

	onPressRedirect(routes){
		this.navigate(routes);
	}

	render() { 
		var inputWidth = this.state.width-30;
		var layoutWidth = this.state.width;
		var inputHeight = 38;
		var inputFontSize = 16;
		var inputHighlightColor = "#00BCD4";

		//Error Block Code start
		var inputMobileNumberError = null;
		if(this.state.errorsJson.inputMobileNumber != null){
			inputMobileNumberError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.inputMobileNumber}</Text>;
		}
		var inputPasswordError = null;
		if(this.state.errorsJson.inputPassword != null){
			inputPasswordError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.inputPassword}</Text>;
		}
		//Error Block Code end

		return (
		<View style={[{height : this.state.height, flex: 1, width : layoutWidth}]} onLayout={()=> this.updateLayout()}>
			<ScrollView >
		      		<View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
					<View style={{paddingTop: 5}}></View>
					<MKTextInput label={'Mobile Number'} highlightColor={inputHighlightColor}
						onChangeText={(inputMobileNumber) => this.updateMyState(inputMobileNumber, 'inputMobileNumber')}
						value = {this.state.inputMobileNumber}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth, paddingBottom : -10}}
						keyboardType={'numeric'} maxLength={10} returnKeyType={'next'} ref="inputMobileNumber" 
						onSubmitEditing={(event) => this.focusNextField('inputPassword')}
						onFocus={()=>this.onFocus()}
						/>
						{ inputMobileNumberError }

					<MKTextInput label={'Password'} highlightColor={inputHighlightColor}  
						onChangeText={(inputPassword) => this.updateMyState(inputPassword, 'inputPassword')}
						value = {this.state.inputPassword}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						secureTextEntry={true} returnKeyType={'go'} ref="inputPassword"
						onFocus={()=>this.onFocus()}
						/>
						{ inputPasswordError }

					<View style={{paddingTop: 30}}></View>
					<TouchableOpacity onPress={()=> this.onPressRedirect('ForgotPassword')}>					
						<Text style={{textAlign:'right', color: '#60AAC6', fontSize: 14}}>FORGOT PASSWORD?</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
            <MKButton onPress={()=> this.getLogin()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
				LOGIN
			</MKButton>
<MKSpinner visible={this.state.isLoading} updateParentState={this.updateParentState} textContent={"Please wait"} cancelable={true} textStyle={{color: '#FFF'}} />
			<MessageBarAlert ref="alert" />
		</View>
		);
	}
}
