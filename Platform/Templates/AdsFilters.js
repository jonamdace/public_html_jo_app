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

export default class AdsFilters extends Component {

    static navigationOptions  = ({navigation}) => {
        return {
            title: "Filters",
            headerRight: <TouchableOpacity
                style={{marginRight: 16}}
                onPress={()=>alert(1)}>
                <Text style={{ paddingRight : 15, color : "#FFF", fontSize : 18}}>Clear</Text>
            </TouchableOpacity>
        }
    };

    async componentDidMount() {

    }

    render(){
        var {height, width} = Dimensions.get('window');

        return(
            <View style={{ height : height, width : width, flex : 1}}>
                <View  style={{ height : 100, justifyContent : "center", flex : 100}}>
                    <ScrollView>

                    </ScrollView>
                </View>
                <View  style={{ backgroundColor : "#FFF", borderTopWidth : 1, borderColor : "#C0C0C0", height : 60, justifyContent : "center", paddingHorizontal : 10}}>
                    <Text>
                        100 results
                    </Text>
                </View>
            </View>
        )
    }
}