import React, { Component } from "react";
import { Text, ToastAndroid, View, FlatList, Picker, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';
import { Overlay } from 'react-native-elements';

export default class SettingsScreen extends Component {

    async componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
            (user) && (firebase.firestore().collection('Users').doc(user.email).onSnapshot((querySnapshot) => {
                this.setState({ role: querySnapshot.data().role })
            }))
        })

        await firebase.firestore().collection('Users').onSnapshot((querySnapshot) => {
            querySnapshot.docs.map(async (val, key) => {
                const userRoles = [...this.state.roleSelected, val.data().role ? val.data().role : 'NU']
                await this.setState({ roleSelected: userRoles })
                // alert(JSON.stringify(this.state.roleSelected))
            })
            this.setState({ users: querySnapshot.docs })
        })
    }

    state = {
        users: [],
        roleSelected: [],
        role: '',
        userVal: '',
        nameIndex: '',
        userRoleVisible: false,
        Roles: [
            { 'role': 'ADMIN' },
            { 'role': 'PC' },
            { 'role': 'PM' },
            { 'role': 'SE' },
            { 'role': 'NU' },
        ],

    }
    signOut = () => {
        firebase.auth().signOut()
            .then(this.props.navigation.navigate('Login'))
            .catch()
    }

    assignUserRole = () => {
        if (this.state.role == 'ADMIN') {
            firebase.firestore().collection('Users').onSnapshot((querySnapshot) => {
                this.setState({ userRoleVisible: true })
            })
        }
        else {
            ToastAndroid.showWithGravity(
                'Reserved for Admin',
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
        }
    }

    onRadioClick = async () => {
        const { role, userVal, nameIndex, roleSelected } = this.state
        const list = roleSelected.map((item, key) => {
            if (key == nameIndex) { return role }
            else return item
        })
        await this.setState({ roleSelected: list });
        firebase.firestore().collection('Users').doc(userVal.data().email).set({ 'role': role }, { merge: true })
        // alert(userVal.data().email)

        // alert(this.state.roleSelected[index]);


    }

    render() {



        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.assignUserRole()}>
                    <View style={styles.projectV}>
                        <Text style={styles.projectT}>Assign User Roles</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Resources')}>
                    <View style={styles.projectV}>
                        <Text style={styles.projectT}>Resources</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.signOut()}>
                    <View style={styles.projectV}>
                        <Text style={styles.projectT}>Logout</Text>
                    </View>
                </TouchableOpacity>



                <Overlay
                    fullScreen={true}
                    isVisible={this.state.userRoleVisible}
                    windowBackgroundColor={'#ffFFFFFF'}
                    onBackdropPress={async () => { await this.setState({ userRoleVisible: false }); }}
                    overlayStyle={{}}
                    containerStyle={{}}
                >
                    <ScrollView style={{}}>
                        {this.state.users.map((userVal, index) => {
                            return (<View key={index} style={{ marginBottom: 10, alignItems: 'center', alignContent: 'stretch', flexDirection: 'row', width: '80%' }}>
                                <Text style={{ fontSize: 16, color: '#2980b9' }}>{userVal.data().firstName} {userVal.data().lastName}</Text>

                                <View style={{ marginRight: -100 }}>
                                    {/* <Text style={{}}>Role</Text> */}
                                    <Picker
                                        selectedValue={this.state.roleSelected[index]}
                                        style={{ alignSelf: 'center', marginRight: 10, color: '#aa80b9', width: 120 }}
                                        onValueChange={async (itemValue, itemIndex) => {
                                            await this.setState({ role: itemValue, nameIndex: index, userVal });
                                            this.onRadioClick();
                                        }}>
                                        {
                                            this.state.Roles.map((val, index) => <Picker.Item label={val.role} value={val.role} key={index} />)
                                        }
                                    </Picker>
                                </View>
                            </View>)
                        })}

                    </ScrollView>

                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    projectV: {
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        flexDirection: 'row',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed'
    },
    projectT: {
        color: '#2980b9',
        // paddingLeft:20,
        // borderLeftWidth:10,
        // borderLeftColor:'#2980b9',
        // fontWeight:'bold',
        // fontSize:15
    },
    radioButn: {
        height: 13,
        width: 13,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2980b9',
        alignItems: 'center',
        justifyContent: 'center',
    }
}); 