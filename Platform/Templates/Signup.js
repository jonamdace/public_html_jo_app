'use strict';
import React, {Component} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity} from "react-native";

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
			errorsJson:{
				inputName : null,
				inputEmail : null,
				inputMobileNumber : null,
				inputPassword : null
			},
			errorsJsonOtp :{
				inputOtp : null
			},
			inputOtp: '',
			otpStatus : '0',
			otpUserId : '0',
			otpMessage: '',
			otpText : '',
			inputName : '',
			inputEmail : '',
			inputMobileNumber : '',
			inputPassword : ''
		};
		this.navigate=this.props.navigation.navigate;
		this.onFocus = this.onFocus.bind(this);
		this.onFocusOtp = this.onFocusOtp.bind(this);
		this.focusNextField = this.focusNextField.bind(this);
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

	onFocusOtp() {
		let errorsJsonOtp = this.state.errorsJsonOtp;
		var that = this;
		for (let name in errorsJsonOtp) {
			let ref = this.refs[name];
			if (ref && ref.isFocused()) {
				errorsJsonOtp[name] = null;
			}
		}
		that.updateMyState(errorsJsonOtp, 'errorsJsonOtp');
	}

	componentDidMount() {
		MessageBarManager.registerMessageBar(this.refs.alert);
	}

	componentWillUnmount() {
		// Remove the alert located on this master page from the manager
		MessageBarManager.unregisterMessageBar();
	}

	async doSignup(){
		var that = this;
		var inputNameValue = this.state.inputName;
		var inputEmailValue = this.state.inputEmail;
		var inputMobileNumberValue = that.state.inputMobileNumber;
		var inputPasswordValue = that.state.inputPassword;

		var isValid = 1;
		var stateArray = that.state;
		var errorsJson = that.state.errorsJson;
		var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		Object.keys(errorsJson).forEach(function(key) {
			var stateArrayValue = stateArray[key];
			if(stateArrayValue == null || stateArrayValue==""){
				errorsJson[key] = "This field is required";
				isValid = 0;
			} else if( key == 'inputEmail' && emailReg.test(stateArrayValue) === false){
				errorsJson[key] = "Invalid Email Address";
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
			that.props.updateLoading(true);

			var postJson = new FormData();
			postJson.append("name", inputNameValue);
			postJson.append("email", inputEmailValue);
			postJson.append("mobileNumber", inputMobileNumberValue);
			postJson.append("password", inputPasswordValue);
			postJson.append("rf", "json");
			var subUrl = "usersRegister";
			var response = await doPost(subUrl, postJson);
			//alert(JSON.stringify(response));
			if(response != null && response != "" && response != undefined){
				var status = response.status;
				var message = response.message;
				var alertType = "";
				var title = "";
				if(status == 1){
					alertType = 'success';
					var otpText = response.otpText;

					title = "Success!";
					that.setState({
						otpStatus : "1",
						otpText : otpText
					})
				} else {
					title = "Error";
					alertType = 'error';
					//that.setState({
					//	otpStatus : "1",
					//	otpText : "123456"
					//})
				}

				MessageBarManager.showAlert({
					title: title,
					message: message,
					alertType: alertType,
					position: 'bottom',
					// See Properties section for full customization
					// Or check `index.ios.js` or `index.android.js` for a complete example
				});

				/*
				that.setState({
					inputName : "",
					inputEmail : "",
					inputMobileNumber : "",
					inputPassword : "",
				});
				*/
			}

			setTimeout(function(){
				that.props.updateLoading(false);
			}, 1000);
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


	async verifyUserAndOtp(){

		var that = this;
		var inputOtp = that.state.inputOtp;
		var isValid = 1;
		var stateArray = that.state;
		var errorsJsonOtp = that.state.errorsJsonOtp;
		var key = 'inputOtp';
		var stateArrayValue = stateArray[key];

		if(stateArrayValue == null || stateArrayValue==""){
			errorsJsonOtp[key] = "This OTP is required";
			isValid = 0;
		}  else if(stateArrayValue.length != 6){
			errorsJsonOtp[key] = "Length should not be less than 6";
			isValid = 0;
		} else if(isNaN(stateArrayValue) || stateArrayValue != this.state.otpText){
			errorsJsonOtp[key] = "Invalid OTP";
			isValid = 0;
		} else {
			errorsJsonOtp[key] = null;
		}

		await that.updateMyState(errorsJsonOtp, 'errorsJsonOtp');
		if(isValid == 1){
			that.props.updateLoading(true);
			that.setState({
				otpStatus : "0",
				inputName : "",
				inputEmail : "",
				inputMobileNumber : "",
				inputPassword : "",
			});

			MessageBarManager.showAlert({
				title: "Mobile Number verification!",
				message: "Your Mobile Number has been Successfully verified! ",
				alertType: "success",
				position: 'bottom',
			});

			setTimeout(function(){
				that.props.updateLoading(false);
				that.onPressRedirect("Login");
			}, 2000);
		}
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
		var inputNameError = null;
		if(this.state.errorsJson.inputName != null){
			inputNameError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.inputName}</Text>;
		}
		var inputEmailError = null;
		if(this.state.errorsJson.inputEmail != null){
			inputEmailError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.inputEmail}</Text>;
		}

		var inputOtpError = null;
		if(this.state.errorsJsonOtp.inputOtp != null){
			inputOtpError = <Text style={CommonStyle.errorText}>{this.state.errorsJsonOtp.inputOtp}</Text>;
		}
		//Error Block Code end

		var otpContent = <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>

			<MKTextInput label={'Name'} highlightColor={inputHighlightColor}
						 onChangeText={(inputName) => this.updateMyState(inputName, 'inputName')}
						 value = {this.state.inputName}
						 inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						 returnKeyType={'next'} ref="inputName"
						 onSubmitEditing={(event) => this.focusNextField('inputEmail')}
						 onFocus={()=>this.onFocus()}
				/>
			{ inputNameError }

			<MKTextInput label={'Email'} highlightColor={inputHighlightColor}
						 onChangeText={(inputEmail) => this.updateMyState(inputEmail, 'inputEmail')}
						 value = {this.state.inputEmail}
						 inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						 returnKeyType={'next'} ref="inputEmail"
						 onSubmitEditing={(event) => this.focusNextField('inputMobileNumber')}
						 onFocus={()=>this.onFocus()}
				/>
			{ inputEmailError }

			<MKTextInput label={'Mobile Number'} highlightColor={inputHighlightColor}
						 onChangeText={(inputMobileNumber) => this.updateMyState(inputMobileNumber, 'inputMobileNumber')}
						 value = {this.state.inputMobileNumber}
						 inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						 keyboardType={'numeric'} maxLength={10} returnKeyType={'next'} ref="inputMobileNumber"
						 onSubmitEditing={(event) => this.focusNextField('inputPassword')}
						 onFocus={()=>this.onFocus()}
				/>
			{ inputMobileNumberError }

			<MKTextInput label={'Password'} highlightColor={inputHighlightColor}
						 onChangeText={(inputPassword) => this.updateMyState(inputPassword, 'inputPassword')}
						 value = {this.state.inputPassword}
						 inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						 secureTextEntry={true} returnKeyType={'done'} ref="inputPassword"
						 onSubmitEditing={(event) => this.doSignup()}
						 onFocus={()=>this.onFocus()}
				/>
			{ inputPasswordError }

			<View style={{paddingTop: 30}}></View>
		</View>;
		var dynamicBtn = <MKButton onPress={()=> this.doSignup()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}>
			SIGN UP
		</MKButton>;

		var responseMsg = null;
		if(this.state.otpStatus == '1'){
			otpContent = <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
				<Text style={CommonStyle.labelText}>OTP has been sent to your registered Mobile Number: {this.state.inputMobileNumber}</Text>
				<MKTextInput label={'OTP'} highlightColor={inputHighlightColor}
							 onChangeText={(inputOtp) => this.updateMyState(inputOtp, 'inputOtp')}
							 value = {this.state.inputOtp}
							 inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
							 keyboardType={'numeric'} maxLength={6} returnKeyType={'go'} ref="inputOtp"
							 onSubmitEditing={(event) => this.verifyUserAndOtp()}
							 onFocus={()=>this.onFocusOtp()}
					/>
				{ inputOtpError }

				<View style={{paddingTop: 10}}></View>
				<Text style={[CommonStyle.errorText, {textAlign : 'right', textDecorationLine: 'underline'}]} onPress={()=> this.confirmUserAndSendOtp()}>Re-Send OTP?</Text>
			</View>;
			dynamicBtn = <MKButton onPress={()=> this.verifyUserAndOtp()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
				VERIFY OTP
			</MKButton>;
		}  else if(this.state.otpStatus == '2' ){
			otpContent = null;
			dynamicBtn = null;
			responseMsg = <Text style={CommonStyle.errorText}>{this.state.otpMessage}</Text>;
		}

		return (
			<View style={[{height : this.state.height, flex: 1, width : layoutWidth}]} onLayout={()=> this.updateLayout()}>
				<ScrollView >
					{otpContent}
				</ScrollView>
				{dynamicBtn}
				<MessageBarAlert ref="alert" />
			</View>
		);
	}
}
