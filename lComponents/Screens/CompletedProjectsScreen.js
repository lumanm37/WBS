import React, { Component } from "react";
import { Text, FlatList, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';


export default class CompletedProjectsScreen extends Component {
    static navigationOptions = {
        title: 'Completed'
    }

    onUpdate = (querySnapshot) => {
        const arr = querySnapshot.docs
        const sorted = arr.sort((a, b) => {
            return (b.data().dateStamp - a.data().dateStamp)
        })
        this.setState({ tasks: sorted });
    }

    componentDidMount() {
        const id = this.props.navigation.getParam('id', 'undefined')
        firebase.firestore().collection('Activities').doc(id).collection('Outstanding')
            .where('noOfCompTasks', '>', 0).onSnapshot(this.onUpdate)
        this.setState({ id })
    }

    state = {
        id: '',
        tasks: [],
    }

    render() {
        const { ...s } = this.state
        return (
            <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>

                <View style={{ width: '97%' }}>
                    <FlatList
                        data={s.tasks}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate(
                                'cDaysTask', { dateId: item.id, projId: s.id })}>
                                <View style={{ borderBottomWidth: 2, borderBottomColor: '#ededed', paddingVertical: 5, flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: '#a4a4a4', borderRadius: 10, borderWidth: 2, borderColor: '#c4c4c4', width: '20%', alignItems: 'center', }}>
                                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>{item.data().day}</Text>
                                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>{item.data().month}</Text>
                                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>{item.data().year}</Text>
                                    </View>
                                    <View style={{ marginLeft: 20 }}>
                                        <Text style={{ fontSize: 15 }}> Tasks</Text>
                                        <Text style={{ fontSize: 15 }}>Completed</Text>
                                        <Text style={{ fontSize: 15 }}>Percentage Completed</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />



                </View>

                {!s.tasks && <Text style={{ fontWeight: 'bold', fontSize: 15 }}>No completed tasks yet</Text>}
            </View>
        );
    }
}