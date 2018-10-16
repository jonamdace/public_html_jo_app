'use strict';
import React, { Component } from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";

export default class Login extends Component {

  	constructor(props: Object) {
		var {height, width} = Dimensions.get('window');
		super(props);
		this.state = {
			height : height,
			width : width,
			errorsJson:{
				inputMobileNumber : null
			},
			errorsJsonOtp :{
				inputOtp : null
			},
			errorsJsonPassword :{
				inputPassword : null,
				inputConfirmPassword : null
			},
			inputMobileNumber : '',
			inputOtp: '',
			otpStatus : '0',
			otpUserId : '0',
			otpMessage: '',
			otpText : '',
			inputPassword : '',
			inputConfirmPassword : ''
		};
		this.navigate=this.props.navigation.navigate;
		this.onFocus = this.onFocus.bind(this);
		this.focusNextField = this.focusNextField.bind(this);
	}

	focusNextField(nextField) {
		this.refs[nextField].focus(); 
	}

	async onFocus() {
		let errorsJson = this.state.errorsJson; 
		var that = this;
		for (let name in errorsJson) {
			let ref = this.refs[name];
			if (ref && ref.isFocused()) {
				errorsJson[name] = null;
			}
		}
		await that.updateMyState(errorsJson, 'errorsJson');
		if(that.state.otpStatus == 2){
			await that.updateMyState('0', 'otpStatus');
		}

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

	onFocusPassword() {
		let errorsJsonPassword = this.state.errorsJsonPassword; 
		var that = this;
		for (let name in errorsJsonPassword) {
			let ref = this.refs[name];
			if (ref && ref.isFocused()) {
				errorsJsonPassword[name] = null;
			}
		}
		that.updateMyState(errorsJsonPassword, 'errorsJsonPassword');
	}


	async componentDidMount() {
	
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
			await that.updateMyState('3', 'otpStatus');
			setTimeout(function(){
				that.props.updateLoading(false);
			}, 200);
		}
	}

	async setPassword(){
		var that = this;
		var isValid = 1;
		var stateArray = that.state;
		var errorsJsonPassword = that.state.errorsJsonPassword;

		Object.keys(errorsJsonPassword).forEach(function(key) {
			var stateArrayValue = stateArray[key];
			var stateInputPasswordValue = stateArray['inputPassword'];
			if(stateArrayValue == null || stateArrayValue==""){
				errorsJsonPassword[key] = "This field is required";
				isValid = 0;
			}  else if( key == 'inputConfirmPassword' && stateInputPasswordValue != stateArrayValue){
				errorsJsonPassword[key] = "Password and Confirm Password";
				isValid = 0;
			} else {
				errorsJsonPassword[key] = null;
			}
		});
		await that.updateMyState(errorsJsonPassword, 'errorsJsonPassword');

		if(isValid == 1){
			var otpUserId = that.state['otpUserId'];
			if(otpUserId > 0){
				that.props.updateLoading(true);

				var postJson = new FormData();
				postJson.append("mobileNumber", that.state['inputMobileNumber']);
				postJson.append("password", that.state['inputPassword']);
				postJson.append("confirmPassword", that.state['inputConfirmPassword']);
				postJson.append("otpText", that.state['inputOtp']);

				var subUrl = "updateMyPasswordFromApps";
				var response = await doPost(subUrl, postJson);
				if(response != null){				
					//alert(JSON.stringify(response));
					that.setState({
						otpStatus : response['status'],
						otpMessage: response['message'],
						inputMobileNumber : '',
						inputOtp: '',
						otpUserId : '0',
						otpText : '',
						inputPassword : '',
						inputConfirmPassword : ''
					});

					setTimeout(function(){
						that.props.updateLoading(false);
					}, 200);
				}
			}
		}
	}

	async confirmUserAndSendOtp(){
		var that = this;
		var inputMobileNumberValue = that.state.inputMobileNumber;
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
			that.props.updateLoading(true);

			var postJson = new FormData();
			postJson.append("mobileNumber", that.state.inputMobileNumber);
			var subUrl = "confirmUserAndSendOtpFromApps";
			var response = await doPost(subUrl, postJson);
			if(response != null){
				that.setState({
					otpStatus : response['status'],
					otpMessage: response['message'],
					otpUserId: response['otpUserId'],
					otpText : response['otp']
				});
			}

			that.props.updateLoading(false);
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

	updateState (data) {
	        this.setState(data);
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

		var inputOtpError = null;
		if(this.state.errorsJsonOtp.inputOtp != null){
			inputOtpError = <Text style={CommonStyle.errorText}>{this.state.errorsJsonOtp.inputOtp}</Text>;
		}

		var inputPasswordError = null;
		if(this.state.errorsJsonPassword.inputPassword != null){
			inputPasswordError = <Text style={CommonStyle.errorText}>{this.state.errorsJsonPassword.inputPassword}</Text>;
		}

		var inputConfirmPasswordError = null;
		if(this.state.errorsJsonPassword.inputConfirmPassword != null){
			inputConfirmPasswordError = <Text style={CommonStyle.errorText}>{this.state.errorsJsonPassword.inputConfirmPassword}</Text>;
		}

		//Error Block Code end
		var editableMobile = true;
		var responseMsg =null;
		var dynamicBtn = <MKButton onPress={()=> this.confirmUserAndSendOtp()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}>
				SEND OTP
			</MKButton>;
		var otpContent = <View><MKTextInput label={'Mobile Number'} highlightColor={inputHighlightColor}
						onChangeText={(inputMobileNumber) => this.updateMyState(inputMobileNumber, 'inputMobileNumber')}
						value = {this.state.inputMobileNumber}
						inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
						keyboardType={'numeric'} maxLength={10} returnKeyType={'go'} ref="inputMobileNumber" 
						onSubmitEditing={(event) => this.confirmUserAndSendOtp()}
						onFocus={()=>this.onFocus()}
						editable={editableMobile}
						/>
						{ inputMobileNumberError }

					<View style={{paddingTop: 10}}></View>
				</View>;

		if(this.state.otpStatus == '1'){
			editableMobile = false;

			otpContent = <View>
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

		} else if(this.state.otpStatus == '2' ){
			responseMsg = <Text style={CommonStyle.errorText}>{this.state.otpMessage}</Text>;
		} else if(this.state.otpStatus == '3' ){
			otpContent = 	<View>
					<Text style={CommonStyle.labelText}>Update your new password</Text>
						<View style={{paddingTop: -30}}></View>
						<MKTextInput label={'Password'} highlightColor={inputHighlightColor}
							onChangeText={(inputPassword) => this.updateMyState(inputPassword, 'inputPassword')}
							value = {this.state.inputPassword}
							inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
							maxLength={6} returnKeyType={'next'} ref="inputPassword" 
							onFocus={()=>this.onFocusPassword()}
							onSubmitEditing={(event) => this.focusNextField('inputConfirmPassword')}
							/>
							{ inputPasswordError }

						<View style={{paddingTop: 10}}></View>
						<MKTextInput label={'Confirm Password'} highlightColor={inputHighlightColor}
							onChangeText={(inputConfirmPassword) => this.updateMyState(inputConfirmPassword, 'inputConfirmPassword')}
							value = {this.state.inputConfirmPassword}
							inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
							maxLength={6} returnKeyType={'go'} ref="inputConfirmPassword" 
							onFocus={()=>this.onFocusPassword()}
							onSubmitEditing={(event) => this.setPassword()}
							/>
							{ inputConfirmPasswordError }

						<View style={{paddingTop: 10}}></View>
					</View>;
			dynamicBtn = <MKButton onPress={()=> this.setPassword()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
				SET PASSWORD
			</MKButton>;
		}

		if(this.state.otpStatus == '0' ){
			responseMsg = null;
		} else if(this.state.otpStatus == '4' ){
			responseMsg = <Text style={CommonStyle.successText}>{this.state.otpMessage}</Text>;
		}

		return (
		<View style={[{height : this.state.height, flex: 1, width : layoutWidth}]} onLayout={()=> this.updateLayout()}>		
			<ScrollView >
		      		<View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>				
					{otpContent}
					{responseMsg}
				</View>
			</ScrollView>
			{dynamicBtn}
		</View>
		);
	}
}
