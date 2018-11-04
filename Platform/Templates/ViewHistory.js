import React, {Component, PropTypes} from "react";
import {View, StyleSheet, Animated, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, AsyncStorage, Image, ListView} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { doPost } from "../Component/MKActions";
import MKButton from "../Component/MKButton";

export default class ViewHistory extends Component {

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        super(props);
        this.state = {
            height: height,
            width: width,
            page : '0',
            left_rec : '',
            rec_limit : '',
            historyArray : [],
            ds: ds,
            listItems: ds.cloneWithRows([])
        };
        this.navigate = this.props.navigateTo;
    }

    async componentDidMount() {
        this.loadsearchData("0");
    }


    renderRow(item) {
        if(item != undefined){
            return <View style={{padding: 5, margin: 5, backgroundColor: '#E9E5BE'}}>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Date</Text></View>
                    <View><Text>: {item.createdAt}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Action</Text></View>
                    <View><Text>: {item.action}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Page Name</Text></View>
                    <View><Text>: {item.pageName}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>From IP</Text></View>
                    <View><Text>: {item.fromIp}</Text></View>
                </View>
                <View style={{flexDirection : 'row', padding:5}}>
                    <View style={{width : 110 }}><Text style={{fontSize : 14, fontWeight:'bold' }}>Description</Text></View>
                    <View><Text>: {item.description}</Text></View>
                </View>
            </View>;
        }
    }

    async loadsearchData(page){

        var that = this;
        var userid = await AsyncStorage.getItem('userid');
        //that.props.updateLoading(true);

        var postJson = new FormData();
        postJson.append("getListFromPage", "View My History");
        postJson.append("rf", "json");
        postJson.append("userid", userid);
        postJson.append("rec_limit", 10);
        postJson.append("page", page);
        var subUrl = "getHistoryList";
        var response = await doPost(subUrl, postJson);
        if(response != null && response != "" && response != undefined){
            var left_rec = response['left_rec'];
            var page = response['page'];
            var rec_limit = response['rec_limit'];
            var historyArray = response['historyArray'];

            that.setState({
                page : page,
                left_rec : left_rec,
                rec_limit : rec_limit,
                historyArray : historyArray,
                listItems : that.state.ds.cloneWithRows(historyArray)
            });
        }
        //that.props.updateLoading(false);

    }

    updateLayout() {
        var {height, width} = Dimensions.get('window');
        this.setState({height: height, width: width});
    }

    render() {
        var previousPage = 0;
        var nextPage = 0;
        var layoutWidth = this.state.width - 30;
        var page = this.state.page;
        if(page != ""){
            page = parseInt(page);
            previousPage = page - 1;
            nextPage =  page + 1;
        }

        var left_rec = this.state.left_rec;
        var rec_limit = this.state.rec_limit;

        var btnPrevious = null;
        var btnNext = null;
        if(previousPage>= 0){
            btnPrevious = <MKButton onPress={()=> this.loadsearchData(previousPage)} style={{backgroundColor : 'orange', borderColor: 'orange', height:50, width:50}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}>
                <Icon name={"arrow-circle-o-left"} color={"#FFF"} size={25} />
            </MKButton>;
                //'&nbsp;<a href="javascript:void(0)" onclick="loadsearchData('.$previousPage.')" class="btn btn-danger btn-sm"><span class="fa fa-arrow-left text-white fa-1x"></span>&nbsp;Previous '.$rec_limit.'</a>';
        }

        if(left_rec>0){
            btnNext = <MKButton onPress={()=> this.loadsearchData(nextPage)} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:50, width:50}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'}>
                <Icon name={"arrow-circle-o-right"} color={"#FFF"} size={25} />
            </MKButton>;
        }


        return (
            <View style={[{height : this.state.height, flex: 1, width : this.state.width}]}
                  onLayout={()=> this.updateLayout()}>
                <ScrollView >
                    <View style={{flex: 1,padding:5, alignSelf:'center'}}>
                        <ListView dataSource={this.state.listItems}
                                  renderRow={(item) => this.renderRow(item)}
                                  enableEmptySections={true}/>
                    </View>
                </ScrollView>
                <View style={{padding : 5}}></View>
                <View style={{flexDirection : 'row', paddingBottom : 30, right: 5, top: this.state.height - 160, position: 'absolute'}}>
                    <View style={{ width : 60}}>{btnPrevious}</View>
                    <View style={{ width : 60}}>{btnNext}</View>
                </View>
            </View>);
    }

}
