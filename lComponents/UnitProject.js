import React, { Component } from "react";
import { Text, View, Alert, TextInput, Button, Modal, TouchableHighlight, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
// import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import moment from 'moment';


export default class UnitProject extends Component {
    render() {


        const { id } = this.props.item
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard',
                {
                    item: this.props.item.data(), id,
                    jobId: this.props.item.data().jobId,
                    progressVal: this.props.item.data().progressVal ? this.props.item.data().progressVal : 0,
                    userName: this.props.userName,
                    role: this.props.role
                }
            )}>
                <View style={styles.projectV}>
                    <Text style={styles.projectT}> {this.props.item.data().name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}




export class UnitBudget extends Component {
    render() {

        const { id } = this.props.item
        return (
            <TouchableOpacity>

                <View style={styles.projectV}>
                    <Text>it works</Text>
                    <Text style={styles.projectT}> {this.props.item.data().deliverable}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}








export class UnitTaskDate extends Component {
    render() {
        const item = this.props.item.data()
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(
                'DaysTask', {
                    dateId: this.props.item.id,
                    projId: this.props.projId,
                    role: this.props.role,
                    userName: this.props.userName,
                    PCname: this.props.PCname,
                    PMname: this.props.PMname,
                    SEname: this.props.SEname,
                })}>
                <View style={{ borderBottomWidth: 2, borderBottomColor: '#ededed', paddingVertical: 5, flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#a4a4a4', borderRadius: 10, borderWidth: 2, borderColor: '#a4a4a4', width: '20%', alignItems: 'center', }}>
                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>{item.day}</Text>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>{item.month}</Text>
                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>{item.year}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: 'gray', fontSize: 18 }}>{item.noOfTasks} Outstanding {item.noOfTasks == 1 ? 'Task' : 'Tasks'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}










export class UnitTask extends Component {
    // state={
    //     achieve:this.props.item.data().achieved
    // }
    componentDidMount() {

    }

    state = {
        deleteOverlayVisible: false,
        modalVisible: false,
    }



    onDeleteTask = () => {
        const { projId, dateId } = this.props
        const timeId = this.props.item.id
        const item = this.props.item.data()
        alert(item.parentTimeStamp + ' ' + item.childTimeStamp + ' ' + timeId)
        const parentTimeStamp = (item.parentTimeStamp) ? item.parentTimeStamp : timeId
        const childTimeStamp = (item.childTimeStamp) ? item.childTimeStamp : timeId
        const parentDateId = (item.parentDateId) ? item.parentDateId : dateId

        //makes the previous task editable after delete
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(item.prevDateId ? item.prevDateId : dateId)
            .collection('Tasks').doc(item.prevTimeId ? item.prevTimeId : timeId).update({ editEnable: true })


        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(parentDateId)
            .collection('Reporting').doc(item.parentTimeStamp).collection('Updates')
            .doc(timeId).delete()
            .then(() => { })
            .catch((error) => { alert(error.message) })



        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
            .collection('Tasks').doc(timeId).delete()
            .then(() => {
                firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
                    .update({ noOfTasks: firebase.firestore.FieldValue.increment(-1) });
            })
            .catch((error) => { alert(error.message) })





        //     alert(item.parentTimeStamp + ' ' + item.childTimeStamp)

        //     //if it has been reassigned,
        //     if (item.parentTimeStamp == item.childTimeStamp) {
        //         this.showAlert()
        //         // firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(parentDateId)
        //         //     .collection('Reporting').doc(parentTimeStamp).delete()
        //         //     .then(() => { })
        //         //     .catch((error) => { alert(error.message) })
        //     }

        //     else {
        //         firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(parentDateId)
        //             .collection('Reporting').doc(item.parentTimeStamp).collection('Updates')
        //             .doc(item.childTimeStamp).delete()
        //             .then(() => { })
        //             .catch((error) => { alert(error.message) })



        //         firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
        //             .collection('Tasks').doc(timeId).delete()
        //             .then(() => {
        //                 firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
        //                     .update({ noOfTasks: firebase.firestore.FieldValue.increment(-1) });
        //             })
        //             .catch((error) => { alert(error.message) })

        //     }
        this.setState({ deleteOverlayVisible: false })
    }


    showAlert = () => {
        this.setState({ deleteOverlayVisible: false })

        Alert.alert(
            'Warning',
            'The task you are about to delete is a parent task. Deleting it will may cause all its updates to be deleted, and will loose its progress ',
            [
                { text: 'Confirm Delete', onPress: () => this.confirmedDelete() },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    confirmedDelete = () => {
        const { projId, dateId } = this.props
        const timeId = this.props.item.id
        const item = this.props.item.data()
        // alert(item.parentTimeStamp + ' ' + item.childTimeStamp + ' ' + timeId)
        // const parentTimeStamp = (item.parentTimeStamp) ? item.parentTimeStamp : timeId
        // const childTimeStamp = (item.childTimeStamp) ? item.childTimeStamp : timeId
        const parentDateId = (item.parentDateId) ? item.parentDateId : dateId

        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(parentDateId)
            .collection('Reporting').doc(item.parentTimeStamp).delete()
            .then(() => { })
            .catch((error) => { alert(error.message) })
    }


    render() {
        const { ...s } = this.state
        const item = this.props.item.data()
        const index = parseInt(this.props.index) + 1
        const timeId = this.props.item.id
        const projId = this.props.projId
        const dateId = this.props.dateId
        return (
            <View>
                <TouchableOpacity onLongPress={() => {
                    (this.props.fromCompletedPage == false) &&
                        (this.setState({ deleteOverlayVisible: true }))
                }}
                    onPress={() => this.props.navigation.navigate('TaskDetail',
                        {
                            item, index, timeId,
                            projId: this.props.projId,
                            dateId: this.props.dateId,
                            achieved: item.achieved,
                            role: this.props.role,
                            userName: this.props.userName,
                            PCname: this.props.PCname,
                            PMname: this.props.PMname,
                            SEname: this.props.SEname,
                            fromCompletedPage: this.props.fromCompletedPage
                        })}>
                    <Card title={index + '. ' + item.title}
                        titleStyle={{ color: '#2980b9' }}
                    >
                        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 5, justifyContent: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}>{item.task}</Text>

                            <Text style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: '#82ccdd' }}>Assigned To: </Text><Text style={{ color: '#82ccdd', fontSize: 15 }}>
                                    {item.assignedTo}
                                </Text>
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ justifyContent: 'center', width: '50%', flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 15, marginRight: 4, textAlign: 'center' }}>Target</Text>
                                    <Text style={{ width: 40, color: '#aa80b9', fontSize: 15, textAlign: 'center' }}>{item.target}%</Text>
                                </View>
                                <View style={{ justifyContent: 'center', width: '50%', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 4, textAlign: 'center', fontSize: 15 }}>Achieved</Text>
                                    <Text style={{ width: 40, color: '#aa80b9', textAlign: 'center', fontSize: 15 }}>{item.achieved}%</Text>
                                </View>
                            </View>

                        </View>
                    </Card>
                </TouchableOpacity>



                <Overlay
                    isVisible={this.state.deleteOverlayVisible}
                    windowBackgroundColor={'#ffFFFFFF'}
                    onBackdropPress={() => { this.setState({ deleteOverlayVisible: false }); }}
                    overlayStyle={{ width: 120, height: 140, justifyContent: 'center', alignItems: 'center' }}
                    containerStyle={{ borderWidth: 2, borderColor: '#ededed', width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View>
                        <TouchableOpacity style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ededed' }}
                            onPress={async () => {
                                // alert(dateId + ' ' + timeId)
                                await this.setState({ deleteOverlayVisible: false });
                                this.props.navigation.navigate('EditTask',
                                    {
                                        title: item.title,
                                        task: item.task,
                                        target: item.target,
                                        date: item.date,
                                        day: item.day,
                                        month: item.month,
                                        prevDateId: dateId,
                                        prevTimeId: timeId,
                                        year: item.year,
                                        assignedTo: item.assignedTo,
                                        sTechnicians: item.sTechnicians,
                                        parentDay: item.parentDay ? item.parentDay : item.day,
                                        parentMonth: item.parentMonth ? item.parentMonth : item.month,
                                        parentYear: item.parentYear ? item.parentYear : item.year,
                                        parentTimeStamp: item.parentTimeStamp ? item.parentTimeStamp : timeId,
                                        childTimeStamp: item.childTimeStamp ? item.childTimeStamp : timeId,
                                        projId,
                                        dateId,
                                    })
                            }}>
                            <Text style={{ color: '#2980b9', fontSize: 18, paddingHorizontal: 5 }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ededed' }}
                            onPress={async () => {
                                await this.setState({ deleteOverlayVisible: false }); this.props.navigation.navigate('ReassignTask',
                                    {
                                        title: item.title,
                                        task: item.task,
                                        target: item.target,
                                        date: item.date,
                                        day: item.parentDay ? item.parentDay : item.day,
                                        month: item.parentMonth ? item.parentMonth : item.month,
                                        year: item.parentYear ? item.parentYear : item.year,
                                        timeId: item.parentTimeStamp ? item.parentTimeStamp : timeId,
                                        prevDateId: dateId,
                                        prevTimeId: timeId,
                                        achieved: item.achieved,
                                        assignedTo: item.assignedTo,
                                        sTechnicians: item.sTechnicians,
                                        projId,
                                        parentDateId: item.parentDateId ? item.parentDateId : dateId,
                                        dateId,
                                        dates: item.dates,
                                    })
                            }}>
                            <Text style={{ color: '#2980b9', fontSize: 18, paddingHorizontal: 5 }}>Re-assign</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 10, borderWidth: 1, borderColor: '#ededed' }}
                            onPress={() => this.onDeleteTask()}>
                            <Text style={{ color: '#2980b9', fontSize: 16, paddingHorizontal: 2 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>











            </View>
        );
    }
}




const styles = StyleSheet.create({
    projectV: {

        padding: 5,
        paddingRight: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
        // height: 60

    },
    projectT: {
        paddingLeft: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2980b9',
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: '#dfe4ea'

    }
});