import React, { Component } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';

import UnitProject from './UnitProject';




export default class fireStoreTest extends Component {


  addUser = () => {


  }
  toggleOverlay = () => { this.setState({ isOverlayVisible: !this.state.isOverlayVisible }) }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


        <TouchableOpacity
          onPress={() => {
            this.setState({ luk: 'man' })
            this.toggleOverlay();
          }}
          style={styles.butn}>

          <Text style={styles.butntxt}>+</Text>

        </TouchableOpacity>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  butn: {
    position: 'absolute',
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: '#c51',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  butntxt: {
    color: '#fff',
    fontSize: 40,
    marginBottom: 5
  }
});