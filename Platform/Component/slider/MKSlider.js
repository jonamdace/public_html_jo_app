import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View
} from 'react-native';

export default class MKSlider extends Component {

	constructor(props){
		super(props);
	}

  render() {
    return (
      <View style={styles.container}>
        <Text>tested</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
