import React, { Component } from "react";
import { Text, ToastAndroid, View, FlatList, Picker, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign'


export default class SettingsScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Personnel',
        headerRight:
            <TouchableOpacity onPress={navigation.getParam('addResourceOvis')}>
                < Icon name='adduser' color={'#fff'} size={25} style={{ marginRight: 10 }} />
            </TouchableOpacity>,
    })

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            (user) && (firebase.firestore().collection('Users').doc(user.email).onSnapshot((querySnapshot) => {
                this.setState({ role: querySnapshot.data().role })
            }))
        })

        //parameter given to staticNavigation options
        this.props.navigation.setParams({ addResourceOvis: this.addResourceOvis });
        firebase.firestore().collection('Resources')
            .onSnapshot((querySnapshot) => this.setState({ Resources: querySnapshot.docs }))
    }

    addResourceOvis = () => {
        if (this.state.role == 'ADMIN') {
            this.setState({
                resourceAddOvis: true,
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
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




    onSave = () => {
        const { editRequest, firstName, lastName, email, phoneNumber, prevFirstName, prevLastName, selectedItem } = this.state
        // const name = firstName + ' ' + lastName;
        // const newName = prevFirstName + ' ' + prevLastName;
        // alert(editRequest)

        //when saving a new personnel
        if (editRequest == false) {
            firebase.firestore().collection('Resources').add({ firstName, lastName, email, phoneNumber })
            this.setState({ resourceAddOvis: false })
            // alert(prevFirstName)
        }
        //when editing a personnel
        else {

            firebase.firestore().collection('Resources').doc(selectedItem.id).set({ firstName, lastName, email, phoneNumber }, { merge: true })
            this.setState({ resourceAddOvis: false })
            // alert(prevLastName)

        }
    }

    onView = (item) => {
        const sFirstName = item.data().firstName
        const sLastName = item.data().lastName
        const sName = sFirstName + ' ' + sLastName
        const sEmail = item.data().email
        const sPhoneNumber = item.data().phoneNumber
        this.setState({ resourceViewOvis: true, sName, sFirstName, sLastName, sEmail, sPhoneNumber, selectedItem: item })
    }

    onEdit = () => {
        if (this.state.role == 'ADMIN') {
            this.setState({
                resourceAddOvis: true,
                editRequest: true,
                firstName: this.state.sFirstName,
                lastName: this.state.sLastName,
                prevFirstName: this.state.sFirstName,
                prevLastName: this.state.sLastName,
                email: this.state.sEmail,
                phoneNumber: this.state.sPhoneNumber,
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

    onDelete = () => {
        if (this.state.role == 'ADMIN') {
            firebase.firestore().collection('Resources').doc(this.state.selectedItem.id).delete()
                .then(() => { this.setState({ resourceViewOvis: false }) })
                .catch((error) => { alert(error.message) })
        }
        else {
            ToastAndroid.showWithGravity(
                'Reserved for Admin',
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
        }
    }

    state = {
        resourceAddOvis: false,
        resourceViewOvis: false,
        Resources: [],
        Resoces: ['lukman Mohammmed', 'John Doe', 'Penelope Clearwater'],
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        sName: '',
        sEmail: '',
        sPhoneNumber: '',
        sFirstName: '',
        sLastName: '',
        prevFirstName: '',
        prevLastName: '',
        editRequest: false,
        selectedItem: {},
        role: '',
    }

    render() {
        //Returns this if there are no resources
        if (!this.state.Resources.length) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Resources depleted</Text>
                </View>
            );
        }

        else {
            return (
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <FlatList
                            data={this.state.Resources}
                            renderItem={({ item }) =>

                                <TouchableOpacity
                                    onPress={() => this.onView(item)}>
                                    <View style={styles.projectV}>
                                        <Text style={styles.projectT}>{item.data().firstName + ' ' + item.data().lastName}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>


                    <Overlay
                        fullScreen={true}
                        isVisible={this.state.resourceViewOvis}
                        windowBackgroundColor={'#ffFFFFFF'}
                        onBackdropPress={async () => { await this.setState({ resourceViewOvis: false }); }}
                        overlayStyle={{ width: '100%' }}
                        animationType={'fade'}
                        containerStyle={{ width: '100%' }}
                    >

                        <View style={{ width: '100%', flex: 1, justifyContent: 'center' }}>

                            <View style={{ backgroundColor: '#82ccdd', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', }}>
                                    <TouchableOpacity onPress={() => this.setState({ resourceViewOvis: false })}>
                                        < Icon name='back' color={'#fff'} size={35} style={{ marginRight: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity style={{}} onPress={() => this.onEdit()}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>EDIT</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{}} onPress={() => this.onDelete()}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ paddingBottom: 10, backgroundColor: '#82ccdd', flex: 4, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{this.state.sFirstName + ' ' + this.state.sLastName}</Text>
                                <Text style={{ color: 'white' }}>Technician</Text>
                            </View>
                            <View style={{ flex: 4, alignItems: 'center' }}>
                                <View style={styles.projectV}>
                                    <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Email: </Text><Text>{this.state.sEmail}</Text></Text>
                                </View>
                                <View style={styles.projectV}>
                                    <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Phone no: </Text><Text>{this.state.sPhoneNumber}</Text></Text>
                                </View>
                                <View style={styles.projectV}>
                                    <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Available: </Text>{this.state.sAvailable}<Text></Text></Text>
                                </View>
                            </View>
                        </View>
                    </Overlay>





                    <Overlay
                        fullScreen={true}
                        isVisible={this.state.resourceAddOvis}
                        windowBackgroundColor={'#ffFFFFFF'}
                        animationType={''}
                        onBackdropPress={async () => { await this.setState({ resourceAddOvis: false, editRequest: false }); }}
                        overlayStyle={{}}
                        containerStyle={{}}
                    >

                        <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2980b9' }}>Add New Personnel</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'First Name'}
                                value={this.state.sFirstName}
                                onChangeText={(sFirstName) => this.setState({ sFirstName })} />
                            <Text style={{ color: '#2980b9', alignSelf: 'flex-start' }}>First Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Last Name'}
                                value={this.state.sLastName}
                                onChangeText={(sLastName) => this.setState({ sLastName })} />
                            <Text style={{ color: '#2980b9', alignSelf: 'flex-start' }}>Last Name</Text>


                            <TextInput
                                style={styles.textInput}
                                placeholder={'Email'}
                                value={this.state.sEmail}
                                onChangeText={(sEmail) => this.setState({ sEmail })} />
                            <Text style={{ color: '#2980b9', alignSelf: 'flex-start' }}>Email</Text>


                            <TextInput
                                style={styles.textInput}
                                placeholder={'Phone Number'}
                                value={this.state.sPhoneNumber}
                                onChangeText={(sPhoneNumber) => this.setState({ sPhoneNumber })} />
                            <Text style={{ color: '#2980b9', alignSelf: 'flex-start' }}>Phone Number</Text>


                            <TouchableOpacity onPress={() => this.onSave()}
                                style={{ marginTop: 10, justifyContent: 'center', height: 40, alignItems: 'center', width: '100%', backgroundColor: '#2980b9' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 19, color: '#fff' }}>Save</Text>
                            </TouchableOpacity>

                        </View>

                    </Overlay>

                </View>





            )
        }
    }
}

const styles = StyleSheet.create({
    projectV: {
        width: '100%',
        position: 'relative',
        zIndex: 1,
        flexDirection: 'row',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed'
    },
    textInput: {
        width: '100%',
        marginTop: 5,
        marginBottom: 0,
        borderBottomColor: '#ededed',
        borderBottomWidth: 2,
    },
    projectT: {
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