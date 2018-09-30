import {StyleSheet, Platform, Dimensions} from "react-native";
import normalize from '../Component/helpers/normalizeText';
import fonts from '../Component/config/fonts';
import colors from '../Component/config/colors';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


module.exports = StyleSheet.create({
  	labelText: {
    		backgroundColor: 'rgba(0,0,0,0)',
    		color : '#2B8CB9',
		fontSize : 13,
		paddingTop : 15
	},
	adsViewRow:{
		flexDirection: 'row',
	},
	adsViewHeader:{
 		flexDirection : 'row', 
		backgroundColor: '#FFF',
		minHeight:30,
		justifyContent:'center', 
		textAlign:'right', 
		fontSize: 14, 
		paddingTop:5,
		paddingRight:10,
		fontWeight:'bold',
		color: '#59C2AF',
		width: 100
	},
	adsViewText:{
 		flexDirection : 'row', 
		backgroundColor: '#FFF', 
		minHeight:30,
		padding: 5,
		color: colors.primary,
		alignItems:'center',
	},
	textInput :{
		fontSize: 16,
		height: 38,
		width:200
	},
	errorText : {
		fontSize: 13,
		color: 'red',
		paddingTop : 15
	},
	successText : {
		fontSize: 13,
		color: 'green',
		paddingTop : 15
	},
	cardTitle: {
		fontSize: normalize(14),
		...Platform.select({
			ios: {
				fontWeight: 'bold',
			},
			android: {
				...fonts.android.black,
			},
		}),
		textAlign: 'center',
		marginBottom: 15,
		color: colors.grey1,
	},
	pricingTitle: {
		textAlign: 'center',
		color: colors.primary,
		fontSize: normalize(30),
		...Platform.select({
		ios: {
			fontWeight: '800',
		},
		android: {
			...fonts.android.black,
		},
		}),
	},
	cardInnerTitle: {
		textAlign: 'center',
		color: colors.primary,
		fontSize: normalize(20),
		...Platform.select({
		ios: {
			fontWeight: '800',
		},
		android: {
			...fonts.android.black,
		},
		}),
	},
	imageCardTitle: {
		marginTop: 15,
	},
	wrapper: {
		height: 250,
		alignItems: 'center',
		backgroundColor: '#9DD6EB',
	},
	slide1: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width:250,
		height:200
	},
	slide2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#97CAE5',
	},
	slide3: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#92BBD9',
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
	}
});
