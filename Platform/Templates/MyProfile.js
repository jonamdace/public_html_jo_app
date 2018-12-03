'use strict';
import React, {Component} from "react";
import {View, Image, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage} from "react-native";
import CommonStyle from "../Styles/CommonStyle";
import MKButton from "../Component/MKButton";
import MKTextInput from "../Component/MKTextInput";
import { doPost } from "../Component/MKActions";
import ConfigVariable from '../Component/config/ConfigVariable';
import Icon from 'react-native-vector-icons/Ionicons';
import noimage from '../images/noimage.jpg';
import MKAdsBanner from "../Component/MKAdsBanner";
import MKSpinner from "../Component/MKSpinner";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class MyProfile extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
		height: height,
            	width: width,
		isLoading : false,
            	errorsJson: {
                inputPassword: null,
                inputRePassword: null
            },
            mobileNumber: '',
            address: '',
            cityName: '',
            stateName: '',
            emailId: '',
            name: '',
            userid: '',
            userCode: '',
            userImage: '',
        };
	this.navigate=this.props.navigation.navigate;
    }

	componentWillUnmount() {
		MessageBarManager.unregisterMessageBar();
	}

    async componentDidMount() {
	MessageBarManager.registerMessageBar(this.refs.alert);

        var that = this;
        var userid = await AsyncStorage.getItem('userid');

	await this.setState({isLoading : true});
        var postJson = new FormData();
        postJson.append("userid", userid);
        postJson.append("rf", "json");
        var subUrl = "getUserDetailsFromApps";
        var response = await doPost(subUrl, postJson);
        if (response != null && response != "" && response != undefined) {
            this.setState({
                userCode: response.userCode,
                userImage: response.img,
                mobileNumber: response.mobile,
                address: response.address,
                cityName: response.cityName,
                stateName: response.stateName,
                emailId: response.email,
                name: response.name,
                userid : userid
            });
        }

	await this.setState({isLoading : false});
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

    onPressRedirect(routes, postJson) {
        this.navigate(routes, postJson);
    }


    renderRowData(inputWidth, label, value) {
        return <View style={{flexDirection: 'row', padding: 5}}>
            <View style={{width : 60}}>
                <Text style={{ fontSize: 14, fontWeight : 'bold', color : '#16a085'}}>{label}</Text>
            </View>
            <View style={{width: 10}}>
                <Text style={{ fontSize: 14, color:'grey'}}>:</Text>
            </View>
            <View style={{width: inputWidth - 70}}>
                <Text style={{ fontSize: 14, color:'grey'}}>{value}</Text>
            </View>
        </View>;
    }

    render() {
        var inputWidth = this.state.width - 30;
        var layoutWidth = this.state.width;
        var inputHeight = 38;
        var inputFontSize = 16;
        var inputHighlightColor = "#00BCD4";

        var filePath = ConfigVariable.uploadedUserProfileFilePath;
        var srcImg = noimage;
        var userImage = this.state.userImage;
        if (userImage != "" && userImage != null) {
            srcImg = {uri: filePath + this.state.userCode + '/' + userImage}
        }
        var imgContent = <Image source={srcImg}
                                style={{width: 120, height: 120, alignSelf:'center', justifyContent :'center', borderRadius:20}}></Image>;
        var username = this.state.username;

        var dynamicBtn = <MKButton onPress={()=> this.onPressRedirect("EditMyProfile", {userid : this.state.userid})}
                                   style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF',width: 80, height:40, borderRadius:5}}
                                   textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}><Icon name="md-checkbox-outline" size={20} color={"#FFF"} style={{paddingRight : 10}}/> Edit
        </MKButton>;


        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth,  backgroundColor:'#FFF'}]}
                  onLayout={()=> this.updateLayout()}>
                <ScrollView >
                    <View style={{flex: 1, width:inputWidth, alignSelf:'center'}}>
                        <View
                            style={{justifyContent :'center', overflow:'hidden',width: inputWidth, height: 150, alignSelf:"center", marginTop: 10, marginBottom: 10}}>
                            {imgContent}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: inputWidth - 100}}>

                            </View>
                            <View style={{width: 80}}>
                                {dynamicBtn}
                            </View>
                        </View>

                        { this.renderRowData(inputWidth, "Mobile", this.state.mobileNumber) }
                        { this.renderRowData(inputWidth, "Email", this.state.emailId) }
                        { this.renderRowData(inputWidth, "State", this.state.stateName) }
                        { this.renderRowData(inputWidth, "City", this.state.cityName) }
                        { this.renderRowData(inputWidth, "Address", this.state.address) }

                        <View style={{paddingTop: 30}}></View>
                    </View>
			<MKAdsBanner />
<MKSpinner visible={this.state.isLoading} updateParentState={this.updateParentState} textContent={"Please wait"} cancelable={true} textStyle={{color: '#FFF'}} />
			<MessageBarAlert ref="alert" />
                </ScrollView>
            </View>
        );
    }
}
