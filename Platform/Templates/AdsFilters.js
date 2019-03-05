import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,Modal,
    AsyncStorage
} from "react-native";
import MKButton from "../Component/MKButton";
import Icon from 'react-native-vector-icons/Ionicons';
import AdsSubFilters from './AdsSubFilters';
import CommonStyle from "../Styles/CommonStyle";

export default class AdsFilters extends Component {

    static navigationOptions = ({navigation}) => {

        let handleClear = null;
        if (navigation.state.params && navigation.state.params.hasOwnProperty('handleClear')) {
            handleClear = navigation.state.params.handleClear;
        } else {
            handleClear = () => {};
        }
        return {
            headerRight: <TouchableOpacity
                style={{marginRight: 16}}
                onPress={()=>handleClear()}>
                <Text style={{ paddingRight : 15, color : "#FFF", fontSize : 18}}>Clear All</Text>
            </TouchableOpacity>,
            //headerLeft: null
        }
    }

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            amountRange  : null,
            amountRangeDisplay  : null,
            city : null,
            cityDisplay : null,
            categoryId : null,
            categoryIdDisplay : null,
            subCategoryId : null,
            subCategoryIdDisplay : null,
            isLoading: true,
            modalVisible: false,
        }
        this.handleClear = this.handleClear.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.onPressToDone = this.onPressToDone.bind(this);
        this.navigate=this.props.navigation.navigate;
    }

    onPressToApply() {
      var jsondata = {
          amountRange : this.state.amountRange,
          city: this.state.city,
          categoryId: this.state.categoryId,
          searchText: this.state.searchText,
          subCategoryId: this.state.subCategoryId
      };
      this.props.navigation.push("Search", jsondata );
    }

    onPressToDone() {
        this.setState({modalVisible: !this.state.modalVisible,});

        var returnStateArray = this.refs.adsFilter.returnStateArray();
        if(returnStateArray != null){
            var selectedId = returnStateArray.radioSelected;
            var selectedValue = returnStateArray.radioSelectedValue;
            var searchKey = returnStateArray.searchKey;
            var searchName = returnStateArray.searchName;
            if(searchKey == "categoryId"){
                this.setState({
                  categoryIdDisplay : selectedValue,
                  categoryId : selectedId
                })
            }
            if(searchKey == "subCategoryId"){
                this.setState({
                    subCategoryIdDisplay : selectedValue,
                    subCategoryId : selectedId
                })
            }
            if(searchKey == "city"){
                this.setState({
                    cityDisplay : selectedValue,
                    city : selectedId
                })
            }
            if(searchKey == "Price"){
                this.setState({
                    amountRangeDisplay : selectedValue,
                    amountRange : selectedId
                })
            }

            if(searchKey == "searchText"){
                this.setState({
                    searchText : selectedValue,
                })
            }
        }

      //  alert("ref" + JSON.stringify(this.refs.adsFilter.returnStateArray()))
    }

    handleClear(){
        this.setState({
          searchText : null,
            amountRange  : null,
            amountRangeDisplay  : null,
            city : null,
            cityDisplay : null,
            categoryId : null,
            categoryIdDisplay : null,
            subCategoryId : null,
            subCategoryIdDisplay : null,
            isLoading: true,
            modalVisible: false,
        })
    }

    handleOpenModal(searchName, keyName){
        this.setState({modalVisible: !this.state.modalVisible, searchName : searchName, searchKey : keyName });
    }

    async componentDidMount() {
        this.props.navigation.setParams({handleClear : this.handleClear});
    }

    render(){
        var {height, width} = Dimensions.get('window');

        var dynamicContentRowJson = [
            {
                key : 1,
                keyName : "city",
                displayText : "Select your city to see local ads",
                selectedText : "",
                selectedId : "",
            },
            {
                key : 2,
                keyName : "categoryId",
                displayText : "Browse Categories",
                selectedText : "",
                selectedId : "",
            }
        ]
        return(
            <View style={{ height : height, width : width, flex : 1}}>
                <View  style={{ height : 100, justifyContent : "center", flex : 100}}>
                    <ScrollView style={{backgroundColor : "#FFF"}}>
                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("City", "city")}>
                            <Text>
                                Select your city to see local ads
                            </Text>
                            {
                              this.state.cityDisplay != null && this.state.cityDisplay != "" ? <Text style={CommonStyle.selectedAdsFiltersText} >
                                {this.state.cityDisplay}
                              </Text> : null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Category", "categoryId")}>
                            <Text>
                                Browse Categories
                            </Text>
                            {
                              this.state.categoryIdDisplay != null && this.state.categoryIdDisplay != "" ? <Text style={CommonStyle.selectedAdsFiltersText} >
                                {this.state.categoryIdDisplay}
                              </Text> : null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Sub Category", "subCategoryId")}>
                            <Text>
                                Browse Sub Categories
                            </Text>
                            {
                              this.state.subCategoryIdDisplay != null  && this.state.subCategoryIdDisplay != "" ? <Text style={CommonStyle.selectedAdsFiltersText} >
                                {this.state.subCategoryIdDisplay}
                              </Text> : null
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Search", "searchText")}>
                            <Text>
                                Search for a specific product
                            </Text>
                            {
                              this.state.searchText != null && this.state.searchText != "" ? <Text style={CommonStyle.selectedAdsFiltersText} >
                                {this.state.searchText}
                              </Text> : null
                            }
                        </TouchableOpacity>

                        {
                            /*
                             <TouchableOpacity
                             style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                             onPress={()=>this.handleOpenModal("Condition", "Condition")}>
                             <Text>
                             Condition
                             </Text>
                             </TouchableOpacity>
                             */
                        }

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Price", "Price")}>
                            <Text>
                                Price Range
                            </Text>
                            {
                              this.state.amountRangeDisplay != null && this.state.amountRangeDisplay != "" ? <Text style={CommonStyle.selectedAdsFiltersText} >
                                {this.state.amountRangeDisplay}
                              </Text> : null
                            }
                            </TouchableOpacity>

                    </ScrollView>
                </View>
                <View  style={{ backgroundColor : "#FFF", borderTopWidth : 1, borderColor : "#C0C0C0", height : 60, alignItems : "center", paddingHorizontal : 10, flexDirection : "row" }}>
                    <View style={{ flex : 100}}>
                        {
                            /*
                             <Text>
                             100 results
                             </Text>
                             */
                        }
                    </View>
                    <View style={{width : 120}}>
                        <MKButton onPress={()=> this.onPressToApply()} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:40}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
                            APPLY
                        </MKButton>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    style={{ height : height, width : width, flex : 1}}
                    onRequestClose={() => {
                            alert('Modal has been closed.');
                        }}>
                    <View style={{ height : height, width : width, flex : 1}}>
                            <AdsSubFilters stateArray={this.state} searchKey={this.state.searchKey} searchName={this.state.searchName} ref={"adsFilter"} onPressToDone={this.onPressToDone} onPressToClose={() => { this.setState({modalVisible : !this.state.modalVisible}); }} />
                    </View>
                </Modal>

            </View>
        )
    }
}
