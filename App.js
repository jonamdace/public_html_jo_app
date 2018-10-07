/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import SplashScreen  from '@remobile/react-native-splashscreen';
//import PlatformApp from "./Platform/PlatformApp";

type Props = {};
export default class App extends Component<Props> {

    componentDidMount() {
        SplashScreen.hide();
    }

  render() {
    return (
      <Text>test</Text>
    );
  }
}
