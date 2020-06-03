import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import firebase from 'react-native-firebase';

class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'SignUp',
    headerStyle: {
      backgroundColor: '#2980b9'
    },
    headerTitleStyle: {
      textAlign: 'center',
      color: '#fff',
      flex: 1
    }
  }

  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      loading: false,
      errorVerify: null,

    }
  }

  componentDidMount() {
    const firstName = this.props.navigation.getParam('firstName', '')
    const lastName = this.props.navigation.getParam('lastName', '')
    const phoneNumber = this.props.navigation.getParam('phoneNumber', '')
    this.setState({
      firstName, lastName, phoneNumber
    })

  }

  onSubmit = () => {
    const { email, firstName, ...s } = this.state
    this.setState({ loading: true })
    if (email.includes('automationghana') || email.includes('lukmanm37') || email.includes('awalmohammed8989')) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.setState({ loading: false });
          firebase.firestore().collection('Users').doc(email).set({
            'firstName': firstName,
            'lastName': s.lastName,
            'email': email,
            'phoneNumber': s.phoneNumber,
            'role': 'NU'
          },
            { merge: true }
          )
          // alert(firstName)
          firebase.auth().currentUser.sendEmailVerification()
            .then(() => { this.props.navigation.navigate('Verify', { firstName }) })
            .catch((error) => { this.setState({ errorVerify: error.message }) })
        })
        .catch((error) => { this.setState({ loading: false, errorMessage: error.message }) });

    }
    else { alert('PPA email required'); this.setState({ loading: false }) }
  }

  render() {
    const { loading, errorVerify, errorMessage, email, password, firstName, lastName } = this.state
    const Load = () => {
      if (loading == true) { return <ActivityIndicator size='large' color='#2980b9' /> }
      else { return null; }
    }

    return (
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('./PpaLogo1.png')}
            style={{ marginBottom: 30 }}
          />
          <Text style={{ fontFamily: 'Cochin', fontSize: 20, color: '#000', fontWeight: 'bold', marginBottom: 30 }}>Create an Account</Text>

          <View style={{ flexDirection: 'row', height: 40, marginBottom: 6, justifyContent: 'space-between', width: '90%' }}>
            <TextInput
              style={{ width: '49%', borderBottomWidth: 2, borderColor: 'silver', height: 40, padding: 10, marginBottom: 6 }}
              placeholder='First Name'
              value={this.state.firstName}
              onChangeText={(firstName) => { this.setState({ firstName }) }}
            />
            <TextInput
              style={{ width: '49%', borderBottomWidth: 2, borderColor: 'silver', height: 40, padding: 10, marginBottom: 6 }}
              placeholder='Last Name'
              value={this.state.lastName}
              onChangeText={(lastName) => this.setState({ lastName })}
            />
          </View>
          <TextInput
            style={styless.txt2input}
            placeholder='PPA E-mail'
            onChangeText={email => this.setState({ email: email.trim() })}
            value={this.state.email}
          />
          <TextInput
            style={styless.txt2input}
            placeholder='Phone Number'
            onChangeText={(phoneNumber) => this.setState({ phoneNumber: phoneNumber.trim() })}
            value={this.state.phoneNumber}
          />
          <TextInput
            style={styless.txt2input}
            placeholder='Password'
            secureTextEntry
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <View style={{ width: '90%' }}>
            <TouchableOpacity style={styless.buttn}
              disabled={!email.length || !password.length || !firstName.length || !lastName.length}
              onPress={() => this.onSubmit()}>
              <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{}}
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={{ fontSize: 18, textAlign: 'center', color: '#2980b9' }}>Have an account already? Go back to login screen</Text>
            </TouchableOpacity>
            <Text style={{ color: 'red' }}>{errorMessage}</Text>
            <Text style={{ color: 'black' }}>{errorVerify}</Text>

            <Load />
            <Text style={{ height: 100 }}></Text>

          </View>
        </View>
      </ScrollView>
    );
  }
}


const styless = StyleSheet.create({
  txt2input: { borderBottomWidth: 2, borderColor: 'silver', width: '90%', height: 40, padding: 10, marginBottom: 6 },
  buttn: { backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }

});
export default SignUpScreen;
