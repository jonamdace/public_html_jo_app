'use strict';
import React, {Component} from "react";
import {Picker, View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import PickerModal from 'react-native-picker-modal';
import MKAdsBanner from "../Component/MKAdsBanner";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class ContactUs extends Component {

    constructor(props: Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            height : height,
            width : width,
            errorsJson:{
                description : null,
                categoryId : null,
                mobileNumber : null,
                emailId : null,
                name : null
            },
            description : '',
            categoryId : '',
            mobileNumber : '',
            emailId : '',
            name : '',
            categoryList : []
        };
        this.navigate=this.props.navigateTo;
    }


    async getCategoryList(){
        var subUrl="getCategoryListFromApps";
        var postJson = new FormData();
        var response = await doPost(subUrl, null);
        if(response != null && response != "" && response != undefined){
            this.setState({
                categoryList : response
            });
        }
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        this.getCategoryList();
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
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

    focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    async sendContactUs(){
        var that = this;
        var isValid = 1;
        var stateArray = that.state;
        var errorsJson = that.state.errorsJson;
        var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        Object.keys(errorsJson).forEach(function(key) {
            var stateArrayValue = stateArray[key];
            if(stateArrayValue == null || stateArrayValue==""){
                errorsJson[key] = "This field is required";
                isValid = 0;
            } else if( key == 'emailId' && emailReg.test(stateArrayValue) === false){
                errorsJson[key] = "Invalid Email Address";
                isValid = 0;
            }  else if( key == 'mobileNumber' && stateArrayValue.length!=10){
                errorsJson[key] = "Length should not be less than 10";
                isValid = 0;
            } else if( key == 'mobileNumber' && isNaN(stateArrayValue)){
                errorsJson[key] = "Invalid Mobile Number";
                isValid = 0;
            } else {
                errorsJson[key] = null;
            }
        });
        await that.updateMyState(errorsJson, 'errorsJson');
        if(isValid == 1){
            //that.props.updateLoading(true);

            var postJson = new FormData();
            postJson.append("name", that.state.name);
            postJson.append("email", that.state.emailId);
            postJson.append("mobileNumber", that.state.mobileNumber);
            postJson.append("categoryId", that.state.categoryId);
            postJson.append("description", that.state.description);
            postJson.append("rf", "json");
            var subUrl="sendContactUsDetails";
            var response = await doPost(subUrl, postJson);
            if(response != null && response != "" && response != undefined){
                var status = response.status;
                var message = response.message;
                var alertType = "";
                var title = "";
                if(status == 1){
                    alertType = 'success';
                    title = "Success!";
                } else {
                    title = "Error";
                    alertType = 'error';
                }
                MessageBarManager.showAlert({
                    title: title,
                    message: message,
                    alertType: alertType,
                    position: 'bottom',
                });
            }
            //that.props.updateLoading(false);
        }
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

    render() {
        var inputWidth = this.state.width-30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";

        var inputNameError = null;
        if(this.state.errorsJson.name != null){
            inputNameError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.name}</Text>;
        }

        var inputEmailError = null;
        if(this.state.errorsJson.emailId != null){
            inputEmailError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.emailId}</Text>;
        }

        var inputMobileNumberError = null;
        if(this.state.errorsJson.mobileNumber != null){
            inputMobileNumberError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.mobileNumber}</Text>;
        }

        var inputCategoryIdError = null;
        if(this.state.errorsJson.categoryId != null){
            inputCategoryIdError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.categoryId}</Text>;
        }

        var inputDescriptionError = null;
        if(this.state.errorsJson.description != null){
            inputDescriptionError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.description}</Text>;
        }

        var dynamicBtn = <MKButton onPress={()=> this.sendContactUs()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
            Submit
        </MKButton>;



        var pickerItem = [];

        var categoryList = this.state.categoryList;
        Object.keys(categoryList).forEach(function(index){
            var categoryId = categoryList[index].categoryId;
            var category = categoryList[index].category;
            pickerItem.push(
                <Picker.Item label={category} value={categoryId} key={index} />
            );
        });
        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]} onLayout={()=> this.updateLayout()}>
                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>

                        <MKTextInput label={'Name'} highlightColor={inputHighlightColor}
                                     onChangeText={(name) => this.updateMyState(name, 'name')}
                                     value = {this.state.name}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth,paddingBottom : -10}}
                                     returnKeyType={'next'} ref="name"
                                     onSubmitEditing={(event) => this.focusNextField('emailId')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputNameError }

                        <MKTextInput label={'Email'} highlightColor={inputHighlightColor}
                                     onChangeText={(emailId) => this.updateMyState(emailId, 'emailId')}
                                     value = {this.state.emailId}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth, paddingBottom : -10}}
                                     returnKeyType={'next'} ref="emailId"
                                     onSubmitEditing={(event) => this.focusNextField('mobileNumber')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputEmailError }

                        <MKTextInput label={'Mobile Number'} highlightColor={inputHighlightColor}
                                     onChangeText={(mobileNumber) => this.updateMyState(mobileNumber, 'mobileNumber')}
                                     value = {this.state.mobileNumber}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth, paddingBottom : -10}}
                                     keyboardType={'numeric'} maxLength={10} returnKeyType={'next'} ref="mobileNumber"
                                     onSubmitEditing={(event) => this.focusNextField('description')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputMobileNumberError }

                        <MKTextInput label={'Description'} highlightColor={inputHighlightColor}
                                     onChangeText={(description) => this.updateMyState(description, 'description')}
                                     value = {this.state.description}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth, paddingBottom : -10}}
                                     returnKeyType={'done'} ref="description"
                            />
                        { inputDescriptionError }
                        <View style={{paddingTop : 25}}>
                            <PickerModal
                                selectedValue={this.state.categoryId}
                                onValueChange={(itemValue, itemIndex) => this.updateMyState(itemValue, 'categoryId')}>
                                {pickerItem}
                            </PickerModal>
                            { inputCategoryIdError }
                        </View>

                        <View style={{paddingTop: 30}}></View>
			<MKAdsBanner />
                    </View>
                </ScrollView>
                {dynamicBtn}
                <MessageBarAlert ref="alert" />
            </View>
        );
    }
}
