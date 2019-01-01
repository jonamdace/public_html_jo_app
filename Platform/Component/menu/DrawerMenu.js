'use strict';
import React, { Component } from "react";
import {View,StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, Image, AsyncStorage} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';
import ConfigVariable from '../config/ConfigVariable';
import {NavigationActions} from 'react-navigation';

const { width, height } = Dimensions.get('screen');


export default class DrawerMenu extends Component {
    constructor(props:Object) {
        super(props);
        var {height, width} = Dimensions.get('window');

        this.state = {
            height: height,
            width: width,
            username: null,
            lastlogin: null,
            name: null,
            img: null,
            userCode : ""
        }
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    onPressToRedirect(routes) {
	this.navigateToScreen(routes);
    }

    async onPressToLogout(){
	AsyncStorage.setItem("userToken", "");
        AsyncStorage.setItem("username", "");
        AsyncStorage.setItem("lastlogin", "");
        AsyncStorage.setItem("name", "");
        AsyncStorage.setItem("img", "");
        this.setStateOftheMenu(null, null, null, null, null);
	this.navigateToScreen("HomeScreen");
	this.props.navigation.navigate("HomeScreen");
    }

    setStateOftheMenu(username, lastlogin, name, img, userCode) {
        this.setState({
            userCode: userCode,
            username: username,
            lastlogin: lastlogin,
            name: name,
            img: img
        });
    }

    async componentDidMount() {

        var username = await AsyncStorage.getItem("username");
        var lastlogin = await AsyncStorage.getItem("lastlogin");
        var name = await AsyncStorage.getItem("name");
        var img = await AsyncStorage.getItem("img");
        var userCode = await AsyncStorage.getItem("userCode");
        this.setStateOftheMenu(username, lastlogin, name, img, userCode);
    }

    render() {
	  var styles = {
            footerContainer: {
                padding: 20,
                backgroundColor: '#16a085'
            },
            footerText: {
                color: '#FFF',
                fontWeight : 'bold',
            },
            userNameText: {
                color: '#FFF',
                fontWeight : 'bold',
            }
        };


        var that = this;
        var {layoutHeight, layoutWidth } = Math.min(height, width) * 0.8;
        var userDispContent = [];
        var dataArray = [
            {'routes': 'Dashboard', title: 'Home', icon : 'home'},
            {'routes': 'Login', title: 'Login', icon : 'sign-in'},
            {'routes': 'Signup', title: 'Signup', icon : 'sign-out'},
            {'routes': 'ContactUs', title: 'Contact Us', icon : 'envelope'}
        ];

        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var srcImg = null;
        if(that.state.img != null){
            filePath = ConfigVariable.uploadedUserProfileFilePath;
            filePath = filePath + that.state.userCode + '/' + that.state.img;

        }

        var imgContent = <Image source={{uri: filePath}} style={{width: 75, height: 75, resizeMode: "contain", alignSelf:'center'}} />
        var username = this.state.username;
        if (username != null) {
            var lastlogin = this.state.lastlogin;
            var name = this.state.name;
            var img = this.state.img;

            if(img != null){
                imgContent = <Image source={{uri: filePath}} style={{width: 100, height: 100, resizeMode: "stretch", alignSelf:'center'}} />            } else {
            }

            userDispContent.push(
                <View key={'userProfile'} >
                    <View style={{justifyContent :'center', overflow:'hidden',width: 100, height:100, borderColor: "#FFF", backgroundColor: "#FFF", borderRadius:50, marginLeft : 30}}>
                        {imgContent}
                    </View>

                    <Text style={{textAlign:"left", paddingLeft : 15, paddingTop : 15, color: '#FFF', fontWeight:'bold'}}>
                        <Text style={{color:'#FFF'}}>Logged in As : </Text>{ this.state.username }
                    </Text>
                    { /* <Text style={{textAlign:"left", paddingLeft : 15, color: '#FFF', fontWeight:'bold'}}>
                     <Text style={{color:'#FFF'}}>Name : </Text>{ this.state.name }
                     </Text> */ }
                    <Text style={{textAlign:"left", paddingLeft : 15, color: '#FFF', fontWeight:'bold'}}>
                        <Text style={{color:'#FFF'}}>Last Login : </Text>{ this.state.lastlogin }
                    </Text>
                </View>
            );

            var dataArray = [
                {'routes': 'Dashboard', title: 'Home', icon : 'home'},
                {'routes': 'AdPostPageOne', title: 'Post Your Ads', icon : 'adn'},
                {'routes': 'ViewAllMyAds', title: 'My Ads', icon : 'list'},
                {'routes': 'Bookmarked', title: 'Bookmark', icon : 'bookmark-o'},
                //{'routes': 'nearByYouAds', title: 'Near By You Ads', icon : 'th-list'},
                {'routes': 'MyProfile', title: 'View My Profile', icon : 'user-circle-o'},
                {'routes': 'ChangePassword', title: 'Change Password', icon : 'key'},
                {'routes': 'ViewHistory', title: 'History', icon : 'history'},
                {'routes': 'ContactUs', title: 'Contact Us', icon : 'envelope'},
                {'routes': 'Logout', title: 'Sign out', icon : 'sign-out'},
            ];
        } else {
        var profileImage = <Icon name="user-circle-o" size={100} color='#FFF' style={{alignSelf: 'center'}} />;
            userDispContent.push(
                <View key={'userProfile'} >
                    <View style={{justifyContent :'center', overflow:'hidden',width: 100, height:100, borderColor: "#FFF", backgroundColor: "#16a085", borderRadius:50, marginLeft : 20}}>
                        {profileImage}
                    </View>
                    <Text style={[{textAlign:"left", paddingLeft : 20, paddingTop : 15, color: 'red'}, styles.userNameText]}>
                        You are not Logged in!
                    </Text>
                </View>
            );
        }

        var objArray = [];
        dataArray.map(function (obj, index) {
            var route = obj.routes;
            var title = obj.title;
            var icon = obj.icon;
            if(route === "Logout"){
                objArray.push(
                    <View key={index}
                          style={{ padding: 15, paddingTop: 15, paddingBottom: 30, }}>
                        <TouchableOpacity onPress={()=>that.onPressToLogout()}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name={icon} size={20} color={"#59C2AF"} style={{ paddingLeft :15, paddingRight :5, paddingTop: 2}}/>
                                <Text style={{ fontWeight : 'bold', color : '#59C2AF', paddingLeft:5, paddingRight :15}}>{title}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                objArray.push(
                    <View key={index}
                          style={{ padding: 15, paddingTop: 15, borderBottomColor : "#59C2AF", borderBottomWidth : 0.25 }}>
                        <TouchableOpacity onPress={that.navigateToScreen(route)} >
                            <View style={{flexDirection: 'row'}}>
                                <Icon name={icon} size={20} color={"#59C2AF"} style={{ paddingLeft :15, paddingRight :5}}/>
                                <Text style={{ fontWeight : 'bold', color : '#59C2AF', paddingLeft:5, paddingRight :15, paddingTop: 2}}>{title}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }

        });

        return (
            <View style={[{height : this.state.height, flex: 1, width : layoutWidth}]}
                  onLayout={()=> this.updateLayout()}>
                <View style={[{height : 180, width : layoutWidth, backgroundColor: "#16a085", paddingTop : 15}]}>
                    {userDispContent}
                </View>
                <ScrollView>
                    <View style={{ minHeight : this.state.height-180,backgroundColor : "#e6e6e6"}}>
                    {objArray}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
