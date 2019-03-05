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
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Login from "./Templates/Login";
import Signup from "./Templates/Signup";
import HomeScreen from "./Templates/HomeScreen";
import ForgotPassword from "./Templates/ForgotPassword";
import AuthLoadingScreen from "./Templates/AuthLoadingScreen";


import ViewHistory from "./Templates/ViewHistory";
import AdPostPageOne from "./Templates/AdPostPageOne";
import AdPostPageEdit from "./Templates/AdPostPageEdit";
import ViewAllMyAds from "./Templates/ViewAllMyAds";
import SearchHistory from "./Templates/SearchHistory";
import Search from "./Templates/Search";
import NearByYouAds from "./Templates/NearByYouAds";
import AdsView from "./Templates/AdsView";
import Dashboard from "./Templates/Dashboard";
import MyProfile from "./Templates/MyProfile";
import AdsGallery from "./Templates/AdsGallery";
import ContactUs from "./Templates/ContactUs";
import Bookmarked from "./Templates/Bookmarked";
import ChangePassword from "./Templates/ChangePassword";
import EditMyProfile from "./Templates/EditMyProfile";
import AdsFilters from "./Templates/AdsFilters";
import AdsSubFilters from "./Templates/AdsSubFilters";
import DrawerMenu from "./Component/menu/DrawerMenu";



const AuthStack = createStackNavigator({
        HomeScreen: {
            screen: HomeScreen,
        },
        Login: {
            screen: Login,
            navigationOptions: ({ navigation }) => ({
                title: 'Login',
            })
        },
        Signup: {
            screen: Signup,
            navigationOptions: ({ navigation }) => ({
                title: 'Signup',
            })
        },
        ForgotPassword: {
            screen: ForgotPassword,
            navigationOptions: ({ navigation }) => ({
                title: 'Forgot Password',
            })
        },
    },
    {
        initialRouteName: 'HomeScreen',
	navigationOptions: ({ navigation }) => ({
		headerStyle: { backgroundColor: 'orange' },
		headerTintColor: '#fff',
	})
    }
);

const AppInnerStack = createStackNavigator(
    {
        MyProfile: { 
		screen: MyProfile,
		navigationOptions: ({ navigation }) => ({
			title: 'My Profile',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		})
	},
        AdsGallery: { screen: AdsGallery },
        Dashboard: { 
		screen: Dashboard,
		navigationOptions: ({ navigation }) => ({
			title: 'All Categories',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		})
	},
        ViewHistory: { 
		screen: ViewHistory,
		navigationOptions: ({ navigation }) => ({
			title: 'History',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		})
	},
        AdPostPageOne: { 
		screen: AdPostPageOne,
		navigationOptions: ({ navigation }) => ({
			title: 'Post your ads',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		})

	},
        AdPostPageEdit: { screen: AdPostPageEdit,
		navigationOptions: ({ navigation }) => ({
			title: 'Edit your Ads',
		})
	},
        ViewAllMyAds: { 
		screen: ViewAllMyAds,
		navigationOptions: ({ navigation }) => ({
			title: 'View All My Ads',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		})
	},
        SearchHistory: { screen: SearchHistory },
        NearByYouAds: { screen: NearByYouAds },
        AdsView: { screen: AdsView },
        EditMyProfile: { 
		screen: EditMyProfile,
		navigationOptions: ({ navigation }) => ({
			title: 'Edit My Profile',
		    })
	},
		AdsFilters: {
		screen: AdsFilters,
		navigationOptions: ({ navigation }) => ({
			title: 'Filters',
		    })
	},
		AdsSubFilters: {
		screen: AdsSubFilters,
			headerLeft: null

		},
        ChangePassword: {
		screen: ChangePassword,
		navigationOptions: ({ navigation }) => ({
			title: 'Change Password',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		    })
	},
        ContactUs: { 
		screen: ContactUs,
		navigationOptions: ({ navigation }) => ({
			title: 'Contact Us',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		    })
	},
        Bookmarked: { 
		screen: Bookmarked,
		navigationOptions: ({ navigation }) => ({
			title: 'Bookmarked',
			headerLeft: <Icon name="ios-menu" size={35} color={'#fff'} onPress={()=>navigation.toggleDrawer()} style={{paddingLeft : 20}}/>
		    })
	},
        Search: { 
		screen: Search,
		navigationOptions: ({ navigation }) => ({
			title: 'Ads List',
		})
	},
    }, 
    {
		//initialRouteName: 'AdsSubFilters',
		//initialRouteName: 'Search',
		initialRouteName: 'Dashboard',
	navigationOptions: ({ navigation }) => ({
                headerStyle: { backgroundColor: 'orange' },
                headerTintColor: '#fff',
                //headerRight: <Text navigation={navigation} >test</Text>
            })

    }
);

const AppStack = createDrawerNavigator(
    {
        AppInnerStack: { screen: AppInnerStack },
    }, 
    {
        contentComponent: DrawerMenu,
        drawerWidth: wp('80%'),
        initialRouteName: 'AppInnerStack'
    }
);

const SwitchNavigator = createSwitchNavigator(
  {
    //AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack
  },
  {
    //initialRouteName: 'AuthLoading',
    initialRouteName: 'App',
  }
);

export default class PlatformApp extends Component<{}> {

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
