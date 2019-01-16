import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    AsyncStorage
} from "react-native";
import MKButton from "../Component/MKButton";

import CheckBox from 'react-native-check-box';

export default class AdsSubFilters extends Component {

    static navigationOptions  = ({navigation}) => {
        return {
            header : null
        }
    };

    constructor(props:Object) {
        super(props);
        this.state = {
            searchKey : "",
            searchName : "",
            stateArray : [],
            noOfItemSelected : 0,
            dataArray : { "owner" : false, "Business": false }
        }
    }

    returnStateArray(){
        return {
            dataArray : this.state.dataArray,
            searchKey : this.state.searchKey,
            searchName : this.state.searchName,
        };
    }

    async componentDidMount() {
        this.setState({
            searchKey : this.props.searchKey,
            searchName : this.props.searchName
        })
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
        return(
            <View style={{ height : height, width : width, flex : 1}}>
                <View style={{height : 50, backgroundColor: 'orange',width : width,  paddingHorizontal : 15, justifyContent : "center" }}>
                       <Text style={{alignItems : "center", fontWeight : "bold", color : "#FFF"}}>Posted by</Text>
                </View>

                <View  style={{ justifyContent : "center", flex : 100}}>
                    <ScrollView style={{backgroundColor : "#FFF"}}>
                        {
                            returnContent
                        }
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