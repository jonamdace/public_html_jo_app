'use strict';
import React, {Component} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";

import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import MKAdsBanner from "../Component/MKAdsBanner";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;


export default class ChangePassword extends Component {

    constructor(props: Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            height : height,
            width : width,
            errorsJson:{
                inputPassword : null,
                inputRePassword : null
            },
            inputRePassword : '',
            inputPassword : ''
        };
        this.navigate=this.props.navigateTo;
        this.onFocus = this.onFocus.bind(this);
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

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
    }

    componentWillUnmount() {
        // Remove the alert located on this master page from the manager
        MessageBarManager.unregisterMessageBar();
    }

    async changeMyPassword(){
        var that = this;
        var inputRePasswordValue = that.state.inputRePassword;
        var inputPassword = that.state.inputPassword;
        var isValid = 1;
        var stateArray = that.state;
        var errorsJson = that.state.errorsJson;
        Object.keys(errorsJson).forEach(function(key) {
            var stateArrayValue = stateArray[key];
            if(stateArrayValue == null || stateArrayValue==""){
                errorsJson[key] = "This field is required";
                isValid = 0;
            } else {
                errorsJson[key] = null;
            }
        });
        await that.updateMyState(errorsJson, 'errorsJson');
        if(isValid == 1){
           // that.props.updateLoading(true);

            var userid = await AsyncStorage.getItem('userid');
            var postJson = new FormData();
            postJson.append("rePassword", that.state.inputRePassword);
            postJson.append("newPassword", that.state.inputPassword);
            postJson.append("rf", "json");
            postJson.append("userid", userid);
            var subUrl = "updatePassword";
            var response = await doPost(subUrl, postJson);
            if(response != null && response != "" && response != undefined){
                var status = response.status;
                var message = response.message;
                var alertType = "";
                var title = "";
                if(status == 1){
                    alertType = 'success';
                    title = "Success!";

                    that.setState({
                        inputRePassword : '',
                        inputPassword : ''
                    });
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
        var inputRePasswordError = null;
        if(this.state.errorsJson.inputRePassword != null){
            inputRePasswordError = <Text style={CommonStyle.errorText}>{this.state.errorsJson.inputRePassword}</Text>;
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

                        <MKTextInput label={'Password'} highlightColor={inputHighlightColor}
                                     onChangeText={(inputPassword) => this.updateMyState(inputPassword, 'inputPassword')}
                                     value = {this.state.inputPassword}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     secureTextEntry={true}  ref="inputRePassword"
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputPasswordError }


                        <MKTextInput label={'Confirm Password'} highlightColor={inputHighlightColor}
                                     onChangeText={(inputRePassword) => this.updateMyState(inputRePassword, 'inputRePassword')}
                                     value = {this.state.inputRePassword}
                                     inputStyle={{fontSize: inputFontSize,  height: inputHeight, width: inputWidth}}
                                     secureTextEntry={true} returnKeyType={'go'}
                                     ref="inputRePassword"
                                     onSubmitEditing={(event) => this.focusNextField('inputPassword')}
                                     onFocus={()=>this.onFocus()}
                            />
                        { inputRePasswordError }

                        <View style={{paddingTop: 30}}></View>
			<MKAdsBanner />
                    </View>
                </ScrollView>
                <MKButton onPress={()=> this.changeMyPassword()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:60}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
                    Update
                </MKButton>
                <MessageBarAlert ref="alert" />
            </View>
        );
    }
}
