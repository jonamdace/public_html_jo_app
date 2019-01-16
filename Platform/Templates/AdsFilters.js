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

export default class AdsFilters extends Component {

    static navigationOptions = ({navigation}) => {
        let handleOpenModal = null;
        if (navigation.state.params && navigation.state.params.hasOwnProperty('handleOpenModal')) {
            handleOpenModal = navigation.state.params.handleOpenModal;
        } else {
            handleOpenModal = () => {};
        }

        return {
            headerRight: <TouchableOpacity
                style={{marginRight: 16}}
                onPress={()=>alert(1)}>
                <Text style={{ paddingRight : 15, color : "#FFF", fontSize : 18}}>Clear</Text>
            </TouchableOpacity>
        }
    }

    constructor(props:Object) {
        var {height, width} = Dimensions.get('window');
        super(props);
        this.state = {
            isLoading: true,
            modalVisible: false,
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.onPressToDone = this.onPressToDone.bind(this);
    }

    async componentDidMount() {

    }

    onPressToDone() {
        this.setState({modalVisible: !this.state.modalVisible,});

        alert("ref" + JSON.stringify(this.refs.adsFilter.returnStateArray()))
    }

    handleOpenModal(keyName){
        this.setState({modalVisible: !this.state.modalVisible, searchName : keyName, searchKey : keyName });
    }

    async componentDidMount() {

    }

    render(){
        var {height, width} = Dimensions.get('window');

        return(
            <View style={{ height : height, width : width, flex : 1}}>
                <View  style={{ height : 100, justifyContent : "center", flex : 100}}>
                    <ScrollView style={{backgroundColor : "#FFF"}}>
                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("city")}>
                            <Text>
                                Select your city to see local ads
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Categories")}>
                            <Text>
                                Browse Categories
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Search")}>
                            <Text>
                                Search for a specific product
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Posted")}>
                            <Text>
                                Posted by
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Condition")}>
                            <Text>
                                Condition
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Brand")}>
                            <Text>
                                Brand
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex : 1, minHeight : 50, justifyContent : "center", padding : 15, borderBottomWidth : 0.5, borderColor : "#C0C0C0"}}
                            onPress={()=>this.handleOpenModal("Price")}>
                            <Text>
                                Price Range
                            </Text>
                        </TouchableOpacity>
                        
                    </ScrollView>
                </View>
                <View  style={{ backgroundColor : "#FFF", borderTopWidth : 1, borderColor : "#C0C0C0", height : 60, alignItems : "center", paddingHorizontal : 10, flexDirection : "row" }}>
                    <View style={{ flex : 100}}>
                        <Text>
                            100 results
                        </Text>
                    </View>
                    <View style={{width : 120}}>
                        <MKButton onPress={()=> alert(2)} style={{backgroundColor : '#59C2AF', borderColor: '#59C2AF', height:40}} textStyle={{color: '#FFF'}} activityIndicatorColor={'orange'} >
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
                            <AdsSubFilters searchKey={this.state.searchKey} searchName={this.state.searchName} ref={"adsFilter"} onPressToDone={this.onPressToDone} onPressToClose={() => { this.setState({modalVisible : !this.state.modalVisible}); }} />
                    </View>
                </Modal>

            </View>
        )
    }
}