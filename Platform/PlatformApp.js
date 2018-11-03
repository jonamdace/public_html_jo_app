/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createDrawerNavigator,TabNavigator, createSwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Login from "./Templates/Login";
import Signup from "./Templates/Signup";
import HomeScreen from "./Templates/HomeScreen";
import ForgotPassword from "./Templates/ForgotPassword";
import AuthLoadingScreen from "./Templates/AuthLoadingScreen";


import Dashboard from "./Templates/Dashboard";
import MyProfile from "./Templates/MyProfile";
import ContactUs from "./Templates/ContactUs";
import Bookmarked from "./Templates/Bookmarked";
import ChangePassword from "./Templates/ChangePassword";
import EditMyProfile from "./Templates/EditMyProfile";
import DrawerMenu from "./Component/menu/DrawerMenu";



const AuthStack = createStackNavigator({
        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: 'Three',
                tabBarIcon: ({ tintColor }) => <Icon name="favorite-border" size={35} color={tintColor} />,
                title: 'HomeScreen',
                headerStyle: { backgroundColor: 'orange' },
                headerTintColor: '#fff',
                //headerRight: <Text navigation={navigation} >test</Text>
            })
        },
        Login: {
            screen: Login,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: 'Three',
                tabBarIcon: ({ tintColor }) => <Icon name="favorite-border" size={35} color={tintColor} />,
                title: 'Login',
                headerStyle: { backgroundColor: 'orange' },
                headerTintColor: '#fff',
                //headerRight: <Text navigation={navigation} >test</Text>
            })
        },
        Signup: {
            screen: Signup,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: 'Three',
                tabBarIcon: ({ tintColor }) => <Icon name="favorite-border" size={35} color={tintColor} />,
                title: 'Signup',
                headerStyle: { backgroundColor: 'orange' },
                headerTintColor: '#fff',
                //headerRight: <Text navigation={navigation} >test</Text>
            })
        },
        ForgotPassword: {
            screen: ForgotPassword,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: 'Three',
                tabBarIcon: ({ tintColor }) => <Icon name="favorite-border" size={35} color={tintColor} />,
                title: 'Forgot Password',
                headerStyle: { backgroundColor: 'orange' },
                headerTintColor: '#fff',
                //headerRight: <Text navigation={navigation} >test</Text>
            })
        },
    },
    {
        initialRouteName: 'HomeScreen'
    }
);

const AppStack = createDrawerNavigator(
    {
        MyProfile: { screen: MyProfile },
        Dashboard: { screen: Dashboard },
        EditMyProfile: { screen: EditMyProfile },
        ChangePassword: { screen: ChangePassword },
        ContactUs: { screen: ContactUs },
        Bookmarked: { screen: Bookmarked },
    }, 
    {
        contentComponent: DrawerMenu,
        drawerWidth: wp('80%'),
        initialRouteName: 'Dashboard'
    }
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

type Props = {};
export default class PlatformApp extends Component<Props> {

	constructor(props) {
		super(props);
		this.state = {
			loginStatus : [ {
					loggedStatus:'',
					loggedUserType:''
					}],
			cancelable : true,
			isLoading : false,
			checkLoggedUserType : '',
		}
		this.updateLoginStatus = this.updateLoginStatus.bind(this);
	}

	async updateLoginStatus(data,userType){
		var subUsertype="";
		if(userType=="user") {
			subUsertype = await AsyncStorage.getItem("loggedSubUserType");
		}
		this.setState({
			loginStatus : [ { loggedStatus:data, loggedUserType:userType,subUsertype:subUsertype }] 
		});
	}

  render() {
    return (
	<SwitchNavigator screenProps={{updateLoginStatus:this.updateLoginStatus }} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
