import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';
import { thisExpression } from "@babel/types";

class EmailVerificationScreen extends Component {
  static navigationOptions = {
    title: 'E-mail Verification',
    headerStyle: {
      backgroundColor: '#2980b9'
    }
  }


  componentDidMount() {
    const firstName = this.props.navigation.getParam('firstName', 'undefined')
    // // const lastName = this.props.navigation.getParam('lastName', '')
    // // const phoneNumber = this.props.navigation.getParam('phoneNumber', 'undefined')
    // this.setState({
    alert(firstName)
    // })


  }


  // state = {
  //   firstName: '',
  //   lastName: '',
  //   phoneNumber: '',
  // }


  doVerify = () => {

    firebase.auth().currentUser.reload()
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user.emailVerified == true) { this.props.navigation.navigate('AppTab') }
          else { alert('You have not verified your email yet'); }
        })
      })
      .catch(() => { })
  }

  resendCode = () => {
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => alert('Link Sent. Check your mail'))
      .catch((error) => { alert(error.message) })
  }


  render() {
    // const { firstName, lastName, phoneNumber } = this.state
    return (

      <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, textAlign: 'center', width: '90%', marginBottom: 20, marginTop: 20 }}>A link has been sent to your email.{'\n'} Click on link to verify your account</Text>
        <Text>Click below if you have already verified</Text>



        <TouchableOpacity style={{ height: 40, borderRadius: 5, backgroundColor: '#2980b9', width: '90%', justifyContent: 'center', alignItems: 'center' }}
          //onPress={()=>this.props.navigation.navigate('Dashboard')}>
          onPress={() => { this.doVerify() }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Confirm Verification</Text>

        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity style={{ marginHorizontal: 5, height: 40, borderRadius: 5, backgroundColor: '#2980b9', width: '40%', justifyContent: 'center', alignItems: 'center' }}
            //onPress={()=>this.props.navigation.navigate('Dashboard')}>
            onPress={() => {
              // this.props.navigation.navigate('SignUp', { firstName, lastName, phoneNumber })
              this.props.navigation.navigate('SignUp')

              firebase.auth().currentUser.delete()
            }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Change Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 5, height: 40, borderRadius: 5, backgroundColor: '#2980b9', width: '40%', justifyContent: 'center', alignItems: 'center' }}
            //onPress={()=>this.props.navigation.navigate('Dashboard')}>
            onPress={() => { this.resendCode() }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Resend Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default EmailVerificationScreen;
