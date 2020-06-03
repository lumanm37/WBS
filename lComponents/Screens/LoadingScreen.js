// Loading.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

export default class LoadingScreen extends React.Component {
  state = {
    user: null,
    email: 'lukman@automationgh.com'
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // alert(user.email)
        if (user.emailVerified) { this.props.navigation.navigate('Dashbod'); }
        else { this.props.navigation.navigate('Verify') }
      }
      else { this.props.navigation.navigate('SignUp') }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
