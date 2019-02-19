import React, {Component} from "react";
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList,
    AsyncStorage
} from "react-native";
import MKButton from "../Component/MKButton";

import CheckBox from 'react-native-check-box';
import { doPost } from "../Component/MKActions";
import Icon from 'react-native-vector-icons/Ionicons';

export default class AdsSubFilters extends Component {

    static navigationOptions  = ({navigation}) => {
        return {
            header : null
        }
    };

    constructor(props:Object) {
        super(props);
        this.state = {
            stateId : null,
            cityId : null,
            stateAndCityJson : null,
            subCategoryJson : null,
            categoryJson : null,
            radioSelected: "",
            radioSelectedValue: "",
            searchKey : "",
            searchName : "",
            stateArray : [],
            noOfItemSelected : 0,
            dataArray : { "owner" : false, "Business": false }
        }
    }

    radioClick(id, value) {
        this.setState({
            radioSelected: id,
            radioSelectedValue: value
        })
    }

    returnStateArray(){
        return {
            radioSelectedValue : this.state.radioSelectedValue,
            radioSelected : this.state.radioSelected,
            dataArray : this.state.dataArray,
            searchKey : this.state.searchKey,
            searchName : this.state.searchName,
        };
    }

    async componentWillReceiveProps(){
        this.pageInit();
    }

    pageInit(){
        this.setState({
            searchKey : this.props.searchKey,
            searchName : this.props.searchName
        })

        if(this.props.searchKey == "categoryId"){
            this.getCategoryJson();
        }

        if(this.props.searchKey == "subCategoryId" && this.props.stateArray.categoryId != null && this.props.stateArray.categoryId!=""){
            this.subCategoryJson();
        }

        if(this.props.searchKey == "city"){
            this.getState();
        }

    }

    async componentDidMount() {
        this.pageInit();
    }

    async clearState(){

    }

    async updateState(key){
        var dataArray = this.state.dataArray;
        var noOfItemSelected = this.state.noOfItemSelected;

        var value = !dataArray[key];

        if(value){
            noOfItemSelected++;
        } else {
            noOfItemSelected--;
        }


        dataArray[key] = value;

        await this.setState({
            dataArray : dataArray,
            noOfItemSelected : noOfItemSelected
        })
    }

    async getCategoryJson(){
        var that = this;
        var categoryJson = await AsyncStorage.getItem('categoryJson');
        if(categoryJson == null){
            var subUrl = "getCategoryListFromApps";
            categoryJson = await doPost(subUrl, null);
            if(categoryJson != null){
                categoryJson = categoryJson.sort(function(a, b) {
                    return parseInt(a.categoryId) - parseInt(b.categoryId);
                });
                that.setState({
                    categoryJson : categoryJson
                });
                await AsyncStorage.setItem('categoryJson', JSON.stringify(categoryJson));
            }
        } else {
            this.setState({
                categoryJson : JSON.parse(categoryJson)
            })
        }

    }

    async getState(){
        var that = this;
        var stateAndCityJson = await AsyncStorage.getItem('stateAndCityJson');
        if(stateAndCityJson == null){
            var subUrl = "Apps/getStateAndCityFromApps";

            var postJson = new FormData();
            postJson.append("title", "State Master");

            stateAndCityJson = await doPost(subUrl, postJson);
            if(stateAndCityJson != null){
              var stateArray =
                that.setState({
                    stateAndCityJson : stateAndCityJson
                });
                await AsyncStorage.setItem('stateAndCityJson', JSON.stringify(stateAndCityJson));
            }
        } else {
            this.setState({
                stateAndCityJson : JSON.parse(stateAndCityJson)
            })
        }
    }


    async subCategoryJson(){
        var that = this;
        var subUrl = "Frontend/getCommonJsonData";
        var postJson = new FormData();
        postJson.append("categoryId", that.props.stateArray.categoryId);
        //postJson.append("categoryId", 1);
        postJson.append("subCategoryId", "0");
        postJson.append("divId", "subCategoryIdDiv");
        var data = await doPost(subUrl, postJson);
        if(data != null){
            var subCategoryJson = data['jsonArrayData'];
            subCategoryJson = subCategoryJson.sort(function (a, b) {
                return parseInt(a.subCategoryId) - parseInt(b.subCategoryId);
            });
            that.setState({
                subCategoryJson : subCategoryJson
            });
        }
    }

    render(){

        var that = this;
        var {height, width} = Dimensions.get('window');
        var returnContent = [];
        var dataArray = this.state.dataArray;

        Object.keys(dataArray).forEach(function(key) {
            returnContent.push(
                <View key={key} style={{ flexDirection : "row",minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}>
                    <Text style={{flex : 100}}>
                        {key}
                    </Text>
                    <View style={{width : 50, alignItems : "flex-end"}}>
                        <CheckBox
                            onClick={()=>{
                                        that.updateState(key)
                                    }}
                            isChecked={dataArray[key]}
                            />
                    </View>
                </View>
            );
        });

        var listData = null;

        if(that.state.categoryJson != null){
            listData = that.state.categoryJson.map((val) => {
                return (
                    <TouchableOpacity key={val.categoryId} onPress={that.radioClick.bind(that, val.categoryId, val.category)} style={{ flex:1, alignItems : "center", flexDirection : "row",minHeight : 50, justifyContent : "center", borderBottomWidth : 0.5, borderColor : "#C0C0C0", paddingHorizontal : 15}}>
                        <Text style={{flex : 100,  alignItems : "center", justifyContent : "center",}}>

                            {val.category}
                        </Text>
                            {
                                val.categoryId == that.state.radioSelected ? <Icon name="md-checkmark" size={25} color={'#000'} style={{alignItems : "flex-end",marginRight : 5}} /> : null
                            }
                    </TouchableOpacity>
                )
            });
        }

        if(that.state.subCategoryJson != null){
            listData = <Text>{JSON.stringify(that.state.subCategoryJson)}</Text>
            listData = that.state.subCategoryJson.map((val) => {
                return (
                    <TouchableOpacity key={val.subCategoryId} onPress={that.radioClick.bind(that, val.subCategoryId, val.subCategory)} style={{ flex:1, alignItems : "center", flexDirection : "row",minHeight : 50, justifyContent : "center", borderBottomWidth : 0.5, borderColor : "#C0C0C0", paddingHorizontal : 15}}>
                        <Text style={{flex : 100,  alignItems : "center", justifyContent : "center",}}>

                            {val.subCategory}
                        </Text>
                        {
                            val.subCategoryId == that.state.radioSelected ? <Icon name="md-checkmark" size={25} color={'#000'} style={{alignItems : "flex-end",marginRight : 5}} /> : null
                        }
                    </TouchableOpacity>
                )
            });
        }

        if(that.state.stateAndCityJson != null){
            listData = <Text>{JSON.stringify(that.state.stateAndCityJson)}</Text>
            var stateAndCityJson = this.state.stateAndCityJson
            var citylist = stateAndCityJson['citylist'];
            var stateArray = stateAndCityJson['stateArray'];

            listData = stateArray.map((val) => {
              var stateId = val['stateId'];
              var stateName = val['state'];

              var cityInnerList = citylist[stateId];

              var cityNameList = cityInnerList['cityName'];
              var cityIdList = cityInnerList['cityId'];

              return cityNameList.map((cityName, index) => {
                var cityId = cityIdList[index];

                var headerRow = null;
                var optionRow= null;

                var selectedStateStyle = {};
                var selectedStateTextStyle = {color : "gray"};
                var textColor = "gray";

                if(stateId == that.state.stateId){
                  selectedStateStyle = {backgroundColor : "#59C2AF"}
                  selectedStateTextStyle = {color : "#FFF", fontWeight : "bold"}
                  textColor = "#FFF";

                  optionRow= <TouchableOpacity onPress={that.radioClick.bind(that, cityId, cityName)} style={{ flex:1, alignItems : "center", flexDirection : "row",minHeight : 50, justifyContent : "center", borderBottomWidth : 0.5, borderColor : "#C0C0C0", paddingHorizontal : 15}}>
                  <Text style={{color : "#000", flex : 100,  alignItems : "center", justifyContent : "center",}}>
                        {cityName}
                        </Text>
                        {
                        cityId == that.state.radioSelected ? <Icon name="md-checkmark" size={25} color={'#000'} style={{alignItems : "flex-end",marginRight : 5}} /> : null
                        }
                  </TouchableOpacity>;
                }

                if (index == 0) {
                  headerRow= <TouchableOpacity onPress={()=>that.setState({stateId : stateId, radioSelected : null})} style={[{ flex:1, alignItems : "center", flexDirection : "row",minHeight : 50, justifyContent : "center", borderBottomWidth : 0.5, borderColor : "#C0C0C0", paddingHorizontal : 15,}, selectedStateStyle]}>
                    <Text style={[{color : textColor, flex : 100,  alignItems : "center", justifyContent : "center",}, selectedStateTextStyle]}>
                    {stateName}
                    </Text>
                    <Icon name="ios-arrow-dropdown" size={25} color={textColor} style={{alignItems : "flex-end",marginRight : 5}} />
                    </TouchableOpacity>;
                }
                return (<View key={stateId + '-' + cityId} >{headerRow}
                  {optionRow}</View>)
              });
            });
        }


        return(
            <View style={{ height : height, width : width, flex : 1}}>
                <View style={{height : 50, backgroundColor: 'orange',width : width,  paddingHorizontal : 15, justifyContent : "center" }}>
                       <Text style={{alignItems : "center", fontWeight : "bold", color : "#FFF"}}>{that.state.searchName}</Text>
                </View>
                <View  style={{ justifyContent : "center", flex : 100}}>
                    <ScrollView style={{backgroundColor : "#FFF"}}>
                        {listData != null ? listData : <View  style={{ justifyContent : "center", alignItems :"center",flex : 1, width : width, height : height - 110}}><ActivityIndicator
                            color={"#59C2AF"}
                            size={20}
                            /></View>}
                    </ScrollView>
                </View>
                <View  style={{ backgroundColor : "#FFF", borderTopWidth : 1, borderColor : "#C0C0C0", height : 60, alignItems : "center", paddingHorizontal : 10, flexDirection : "row" }}>
                    <View style={{ flex : 100}}>
                        <Text>
                            {this.state.noOfItemSelected} selected
                        </Text>
                    </View>
                    <View style={{width : 120}}>
                        <MKButton onPress={()=> this.props.onPressToDone() } style={{backgroundColor : '#000', borderColor: '#59C2AF', height:40}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
                            DONE
                        </MKButton>
                    </View>
                </View>
            </View>
        )
    }
}
