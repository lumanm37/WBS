import React, { Component } from 'react';
import { Text, View, TextInput, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import firebase from 'react-native-firebase';
import { Overlay } from 'react-native-elements';


class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    headerStyle: {
      backgroundColor: '#99ccee'
    },
    headerTitleStyle: {
      color: 'white',
      textAlign: 'center'
    }
  }
  state = {
    email: '',
    password: '',
    errorMessage: null,
    loading: false,
    forgotPasswordOverlay: false,
    resetEmail: '',
    resetLoading: false,
    resetText: '',

  }

  doLogin = async () => {
    this.setState({ loading: true })
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => { this.props.navigation.navigate('AppStack'); })
      .catch((error) => { this.setState({ errorMessage: error.message, loading: false }) })

  }

  resetPassword = () => {
    this.setState({ resetLoading: true, resetText: '' })
    firebase.auth().sendPasswordResetEmail(this.state.resetEmail)
      .then(() => {
        this.setState({
          resetLoading: false,
          resetText: 'A mail has been sent to ' + '"' + this.state.resetEmail + '"' + ' to reset your password'
        })

      })
      .catch((error) => {
        this.setState({ resetLoading: false });

        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      })
  }

  render() {
    const { errorMessage, loading } = this.state
    const Load = () => {
      if (loading == true) { return <ActivityIndicator size='large' color='#2980b9' /> }
      else { return null; }
    }


    return (
      <View style={{ backgroundColor: '#fff', flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image source={require('./PpaLogo1.png')}
          style={{ marginBottom: 30 }}
        />
        <TextInput
          style={styles.txtinputs}
          placeholder='E-mail'
          onChangeText={(email) => this.setState({ email: email.trim() })}
          value={this.state.email}
        />
        <TextInput
          style={styles.txtinputs}
          placeholder='Password'

          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <View style={{ width: '90%' }}>
          <TouchableOpacity style={styles.buttn}
            onPress={() => this.doLogin()}
            disabled={!(this.state.email.length && this.state.password.length)}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Login</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.buttn}
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={() => this.setState({ forgotPasswordOverlay: true })}>
            <Text style={{ fontSize: 17, textAlign: 'right', fontWeight: 'bold', textDecorationLine: 'underline', color: '#000' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
        <Text style={{ height: 70 }}></Text>
        <Load />



        <Overlay isVisible={this.state.forgotPasswordOverlay}
          fullScreen={true}
          onBackdropPress={() => { this.setState({ forgotPasswordOverlay: false }); }}
          overlayStyle={{ flex: 1, alignItems: 'center' }}
          overlayBackgroundColor="#FFF"
          width='95%'
          height={300}
          animationType={'slide'}>
          <View style={{ flex: 1, alignItems: 'center', paddingTop: '10%', width: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#2980b9', marginBottom: 20, marginTop: 20 }}>
              Enter your account email.</Text>

            <TextInput
              style={styles.txtinputs}
              placeholder='Email '
              onChangeText={(resetEmail) => this.setState({ resetEmail: resetEmail.trim() })}
            />

            <View style={{ width: '90%' }}>
              <TouchableOpacity style={styles.buttn}
                onPress={() => this.resetPassword()}
                disabled={!(this.state.resetEmail.length)}>

                {(this.state.resetLoading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                {(this.state.resetLoading == false) && (<Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Reset Password</Text>)}

              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#2980b9', marginBottom: 20, marginTop: 20 }}>
              {this.state.resetText}</Text>

            <TouchableOpacity onPress={() => this.setState({ forgotPasswordOverlay: false })}>
              <Text style={{ fontSize: 17, alignItems: 'flex-end', textDecorationLine: 'underline', fontWeight: 'bold', textAlign: 'right', color: '#000' }}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Overlay>

      </View>
      //</KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  txtinputs: { borderBottomWidth: 2, borderBottomColor: '#ededed', backgroundColor: '#ededed', padding: 10, marginBottom: 5, width: '90%' },
  buttn: { backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }
});
export default LoginScreen;
