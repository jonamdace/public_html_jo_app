import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View
} from 'react-native';

export default class MKButton extends Component {

	constructor(props){
		super(props);
	}

	_renderChildren(){
		let childElements = [];
		React.Children.forEach(this.props.children, (item) => {
			if (typeof item === 'string' || typeof item === 'number') {
				const element = (
					<Text
					    style={[styles.textButton, this.props.textStyle]}
					    allowFontScaling={this.props.allowFontScaling}
					    key={item}>
					    {item}
					</Text>
				);
				childElements.push(element);
			} else if (React.isValidElement(item)) {
				childElements.push(item);
			}
		});
		return (childElements);
	}	

	_renderInnerText(){
		if (this.props.isLoading) {
			return (
				<ActivityIndicator
				  animating={true}
				  size='large'
				  style={styles.spinner}
				  color={this.props.activityIndicatorColor || 'black'}
				/>
			);
		}
		return this._renderChildren();
	}

  render() {
	// Extract Touchable props
	let touchableProps = {
		accessibilityLabel: this.props.accessibilityLabel,
		onPress: this.props.onPress,
		onPressIn: this.props.onPressIn,
		onPressOut: this.props.onPressOut,
		onLongPress: this.props.onLongPress,
		activeOpacity: this.props.activeOpacity,
		delayLongPress: this.props.delayLongPress,
		delayPressIn: this.props.delayPressIn,
		delayPressOut: this.props.delayPressOut,
	};
	
    return (
      <View style={styles.container}>
	<TouchableOpacity disabled={this.props.btndisabled}
		{...touchableProps}
		style={[styles.button, this.props.style]}>
		{this._renderInnerText()}
	</TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,

    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontWeight:'bold'
  },
  spinner: {
    alignSelf: 'center',
  },
  opacity: {
    opacity: 0.5,
  },
});

