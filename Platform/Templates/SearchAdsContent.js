'use strict';
import React, {Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
    AsyncStorage
} from "react-native";

import MKCard from "../Component/MKCard";
import Divider from '../Component/divider/Divider';
import ConfigVariable from '../Component/config/ConfigVariable';
import CommonStyle from "../Styles/CommonStyle";
import { doPost } from "../Component/MKActions";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SearchAdsContent extends Component {

    constructor(props:Object) {

        super(props);
        this.state = {
            bookmarkAdd : this.props.bookmarkAdd
        };

    }

    onPressToShowSingleAds(postJson) {
        this.props.navigation('AdsView', postJson);
    }

    async onPressToRemoveFromBookmark(action){

        var that = this;
        var userid = await AsyncStorage.getItem('userid');

        var postJson = new FormData();
        postJson.append("adsId", this.props.postJson.adsId);
        postJson.append("action", action);
        postJson.append("userid", userid);
        postJson.append("rf", "json");
        var subUrl = "addToMyBookmark";
        var response = await doPost(subUrl, postJson);
        if(response != null && response != "" && response != undefined){
            that.setState({
                bookmarkAdd : !that.state.bookmarkAdd
            })
            alert(response.message);
        }
    }

    async onPressToEdit(){
        var postJson = { adsId : this.props.postJson.adsId};
        this.props.navigation('AdPostPageEdit', postJson);
    }

    render() {

        var adsTitle = this.props.postJson.adsTitle;
        var adsCode = this.props.postJson.adsCode;
        var userCode = this.props.postJson.userCode;
        var adsId = this.props.postJson.adsId;
        var offerPrice = this.props.postJson.offerPrice;
        var actualPrice = this.props.postJson.actualPrice;
        var adsAmt = 0;
        if(offerPrice > 0 && offerPrice!= actualPrice){
            adsAmt = actualPrice + offerPrice;
            adsAmt = <Text style={[ CommonStyle.imageCardTitle, {width: 80, textAlign:'left', fontWeight:'bold', color:'#F9CE0D'}]}><Text style={{textDecorationLine : "line-through"}}>₹{actualPrice}</Text> ₹{offerPrice} </Text>;
        } else {
            adsAmt = <Text style={[ CommonStyle.imageCardTitle, {width: 80, textAlign:'left', fontWeight:'bold', color:'#F9CE0D'}]}>₹{actualPrice}</Text>;
        }
        var adsLocation = this.props.postJson.state + ', ' + this.props.postJson.city;
        var postedDate = this.props.postJson.createdAt;
        var fileName = this.props.postJson.file_name;
        var active = this.props.postJson.active;
        var adsImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
        var filePath = ConfigVariable.uploadedAdsFilePathEmpty;
        var fileImage = <Image source={{uri: filePath}}
                               style={{width: this.props.imgWidth, height: this.props.imgHeight, alignSelf:'center'}}/>
        if (fileName != null) {
            filePath = ConfigVariable.uploadedAdsFilePath + '/' + userCode + '/' + adsCode + '/' + fileName;
            fileImage = <Image source={{uri: filePath}}
                               style={{width: this.props.imgWidth, height: this.props.imgHeight, alignSelf:'center'}}/>

        }

        var dynamicContent = null;
        var editDynamicContent = null;
        if(this.props.fromPage != null && this.props.fromPage != "View All My Ads"){

            if(!this.state.bookmarkAdd){
                if(this.props.loggedInUserId != "" && this.props.loggedInUserId != null){
                    dynamicContent =
                        <TouchableOpacity onPress={()=> this.onPressToRemoveFromBookmark('add')}>
                            <Text
                                style={[ {textAlign:'left', color:'blue', paddingTop :10, paddingBottom:10}]}>
                                Add to Bookmark
                            </Text>
                        </TouchableOpacity>;

                } else {
                    dynamicContent =
                        <TouchableOpacity onPress={()=> this.props.navigation("Login")}>
                            <Text
                                style={[ {textAlign:'left', color:'blue', paddingTop :10, paddingBottom:10}]}>
                                Login to Add Bookmark
                            </Text>
                        </TouchableOpacity>;
                }
            } else {
                dynamicContent =
                    <TouchableOpacity onPress={()=> this.onPressToRemoveFromBookmark('remove')}>
                        <Text
                            style={[ {textAlign:'left', color:'orange', paddingTop : 10, paddingBottom: 10}]}>
                            Remove from Bookmark
                        </Text>
                    </TouchableOpacity>;
            }
        } else if(this.props.fromPage == "View All My Ads"){
            editDynamicContent =
                <TouchableOpacity onPress={()=> this.onPressToEdit()}>
                    <Text
                        style={[ CommonStyle.imageCardTitle, {textAlign:'right', color:'#59C2AF'}]}>
                        Edit <Icon name='edit' color='#59C2AF' size={15} style={{padding :5}}/>
                    </Text>
                </TouchableOpacity>;
        }

        return (
            <MKCard>
                {fileImage}
                <Divider style={CommonStyle.divider}/>
                <Text style={[ CommonStyle.imageCardTitle,{fontWeight:'bold'}]}>{adsTitle}</Text>
                <Text style={[ CommonStyle.imageCardTitle]}>{adsLocation}</Text>
                <View style={{flexDirection:'row'}}>
                    <View style={{width : this.props.imgWidth-130}}>
                        <Text style={[ CommonStyle.imageCardTitle]}>{postedDate} </Text>
                    </View>
                    <View style={{width : 110}}>
                        { editDynamicContent }
                        { this.props.fromPage == "View All My Ads" ? <Text style={{textAlign: 'right', padding:5}} >{this.props.postJson.active}</Text> : null }
                        </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    {adsAmt}
                    <TouchableOpacity onPress={()=> this.onPressToShowSingleAds(this.props.postJson)}>
                        <Text
                            style={[ CommonStyle.imageCardTitle, {width: this.props.imgWidth-100,textAlign:'right', color:'#489FDF'}]}>
                            View More Details »
                        </Text>
                    </TouchableOpacity>
                </View>
                { dynamicContent }
            </MKCard>
        );
    }
}
