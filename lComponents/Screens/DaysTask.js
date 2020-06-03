import React, { Component } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import firebase from 'react-native-firebase';
import { FlatList } from "react-native-gesture-handler";
import { UnitTask } from "../UnitProject";
// import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';



export default class DaysTask extends Component {
    static navigationOptions = {
        title: 'Tasks List',
    }


    componentDidMount() {

        this.props.navigation.setParams({ dateCaption: this.dateCaption });


        const dateId = this.props.navigation.getParam('dateId', 'undefined')
        const projId = this.props.navigation.getParam('projId', 'undefined')
        const day = this.props.navigation.getParam('day', 'undefined')
        const month = this.props.navigation.getParam('month', 'undefined')
        const year = this.props.navigation.getParam('year', 'undefined')
        this.setState({ day, month, year, projId, dateId })

        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(dateId)
            .collection('Tasks').where("achieved", "<", 100).onSnapshot(this.onUpdate)

    }


    dateCaption = () => {
        const dateId = this.state.dateId
        return dateId
    }

    onUpdate = (querySnapshot) => {
        this.setState({ taskData: querySnapshot.docs })
    }

    state = {
        projId: '',
        dateId: '',
        taskData: [],
        day: '',
        month: '',
        year: '',
    }


    render() {

        const { taskData, projId, dateId } = this.state
        // firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
        //     .set({ noOfTasks: taskData.length }, { merge: true })
        return (
            <View style={{ flex: 1 }}>

                <View style={{ backgroundColor: '#2980b9', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{this.state.dateId}</Text>
                </View>

                <FlatList
                    data={taskData}
                    renderItem={({ item, index, }) =>
                        <UnitTask item={item} projId={projId} dateId={dateId} fromCompletedPage={false}
                            navigation={this.props.navigation} index={index.toString()} />

                    }
                    keyExtractor={(item, index) => index.toString()}
                />

                <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                ><Text style={{ textAlign: 'center', color: '#fff' }}>PPA</Text>
                </TouchableOpacity>



            </View>

        );
    }
}
