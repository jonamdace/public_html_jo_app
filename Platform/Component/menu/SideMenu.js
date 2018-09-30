
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,AsyncStorage, ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationActions} from 'react-navigation';

export default class SideMenu extends Component {

    constructor(props:Object){
        super(props)
        this.state = {
            userName : null,

        }

    }

    async componentDidMount() {
        var that = this;
        var user_id_as_email_id = await AsyncStorage.getItem("user_id_as_mobile");
        this.setState({
            userName : user_id_as_email_id
        })
    }

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    onPressToLogout(){

        AsyncStorage.setItem("user_id_as_mobile", '');

        this.setState({
            userName : null
        })
    }

    render() {

        var styles = {
            container: {
                flex: 1,
                backgroundColor: 'white',
            },
            navItemStyle: {
                padding: 15,
                borderColor : '#006699',
                fontWeight: 'bold',
                borderBottomWidth : 0.3,

            },
            navSectionStyle: {
                backgroundColor: 'white'
            },
            sectionHeadingStyle: {
                height : 180,
                paddingTop : 15,
                backgroundColor: '#006699'

            },
            footerContainer: {
                padding: 20,
                backgroundColor: '#006699'
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

        var returnComp = [];

        if(this.state.userName!= null){
            returnComp.push(
                <View>
                    <View style={styles.navSectionStyle}>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('AddressBook')}>
                            Address Book
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('CreateSurvey')}>
                            Create Survey
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('GetSurveyList')}>
                            Survey List
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('GetMappedSurveyList')}>
                            Mapped Survey List
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('MyProfile')}>
                            My Profile
                        </Text>
                        <Text style={styles.navItemStyle} onPress={()=> this.onPressToLogout()}>
                            Logout
                        </Text>
                    </View>
                </View>
            )
        } else {
            returnComp.push(
                <View>
                    <View style={styles.navSectionStyle}>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                            Home
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Login')}>
                            Login
                        </Text>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Register')}>
                            Register
                        </Text>
                    </View>
                </View>
            );
        }

        var profileImage = <Icon name="ios-contact" size={120} color='#FFF' />;

        return(
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <View style={styles.sectionHeadingStyle}>
                            <View  style={{alignItems:'center'}}>
                                {profileImage}
                                 {
                                    this.state.userName != null ? <Text style={styles.userNameText}> {"Logged in as : " + this.state.userName}</Text> : null
                                 }
                            </View>
                        </View>
                        {
                            returnComp
                        }
                    </View>

                </ScrollView>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Dhek.in Version 1.0</Text>
                </View>
            </View>
        );
    }
}
