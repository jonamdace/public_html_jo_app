import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
} from 'react-native';

import {  AdMobBanner } from 'react-native-admob';
export default class MKAdsBanner extends React.Component {
	render() {
		return (
			<View>
				<AdMobBanner
					adSize="fullBanner"
					adUnitID="ca-app-pub-3670807734353712/2715920575"
					testDevices={[AdMobBanner.simulatorId]}
					onAdFailedToLoad={error => alert(error)}
				/>
			</View>
		);
	}
};
