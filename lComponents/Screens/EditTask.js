import React, { Component } from 'react';
import {
    Text, View, TextInput, ActivityIndicator, FlatList,
    StyleSheet, ScrollView, TouchableOpacity, Image,
} from "react-native";
import firebase from 'react-native-firebase';
import { Overlay, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import moment from 'moment';




export default class EditTask extends Component {
    static navigationOptions = {
        title: 'Edit Task',
        headerStyle: {
            backgroundColor: '#2980b9'
        }
    }



    componentDidMount() {
        const title = this.props.navigation.getParam('title', 'undefined')
        const task = this.props.navigation.getParam('task', 'undefined')
        const target = this.props.navigation.getParam('target', 'undefined')
        const date = this.props.navigation.getParam('date', 'undefined')
        const day = this.props.navigation.getParam('day', 'undefined')
        const month = this.props.navigation.getParam('month', 'undefined')
        const year = this.props.navigation.getParam('year', 'undefined')
        const projId = this.props.navigation.getParam('projId', 'undefined')
        const dateId = this.props.navigation.getParam('dateId', 'undefined')
        const prevDateId = this.props.navigation.getParam('prevDateId', 'undefined')
        const prevTimeId = this.props.navigation.getParam('prevTimeId', 'undefined')
        const childTimeStamp = this.props.navigation.getParam('childTimeStamp', 'undefined')
        const sTechnicians = this.props.navigation.getParam('sTechnicians', 'undefined')
        const assignedTo = this.props.navigation.getParam('assignedTo', 'undefined')
        const parentDay = this.props.navigation.getParam('parentDay', 'undefined')
        const parentMonth = this.props.navigation.getParam('parentMonth', 'undefined')
        const parentYear = this.props.navigation.getParam('parentYear', 'undefined')
        const parentTimeStamp = this.props.navigation.getParam('parentTimeStamp', 'undefined')
        // alert(prevDateId + '  ' + prevTimeId)
        this.setState({
            childTimeStamp, prevTarget: target.toString(), prevDateId, prevTimeId, selectedDate: prevDateId,
            title, task, target: target.toString(), date, day, month, year, sTechnicians, sTechniciansString: assignedTo,
            parentDay, parentMonth, parentYear, parentTimeStamp, projId, dateId,
        })


        firebase.firestore().collection('Projects').doc(projId).get()
            .then((doc) => {
                this.setState({ technicians: doc.data().technicians ? doc.data().technicians : [] })
            })
    }
    // state={
    //     achieve:this.props.item.data().achieved
    // }
    state = {
        isEditTaskOverlayVisible: false,
        isCalendarOverlayVisible: false,
        selectedDate: '',
        title: '',
        task: '',
        target: '',
        prevTarget: '',
        date: '',
        day: '',
        month: '',
        year: '',
        projId: '',
        prevDateId: '',
        prevTimeId: '',
        dateId: '',
        childTimeStamp: '',
        dateStamp: '',
        dayOfWeek: '',
        parentDay: '',
        assignedTo: '',
        sTechnicians: [],
        sTechniciansString: '',
        isResourceOVis: false,
        parentMonth: '',
        parentYear: '',
        parentTimeStamp: '',
        technicians: [],
        saveLoading: false

    }

    checkTheBox(name, checked) {
        if (checked == true) {
            const sTechnicians = this.state.sTechnicians.filter((technician) => technician !== name)
            const sTechniciansString = this.state.sTechniciansString.replace(name + ',', '')
            this.setState({ sTechnicians, sTechniciansString })
        }

        else {
            const sTechnicians = [...this.state.sTechnicians, name]
            const sTechniciansString = this.state.sTechniciansString + name + ','
            this.setState({ sTechnicians, sTechniciansString })
        }
    }


    monthConvert = (num) => {
        const name = ['err', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }

    dayConvert = (num) => {
        const name = ['err', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return name[num]
    }

    onDateChange = this.onDateChange.bind(this);

    onDateChange(date) {
        const dayOfWeek = this.dayConvert(date.format('E'))//converts eg 07 to Sun
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        this.setState({
            selectedDate: date,
            dayOfWeek: date ? dayOfWeek : '',
            dateStamp: date ? date.format('x') : '',
            date: date ? date.format('DD MM YYYY') : '',
            day: date ? date.format('DD') : '',
            month: date ? month : '',
            year: date ? date.format('YYYY') : ''
        });
    }



    validateTarget = async () => {
        const { target, prevTarget } = this.state
        if (target < 1 || target > 100) { this.setState({ target: prevTarget }); alert('Target value must be between 1-100%') }
        else if (isNaN(target)) { this.setState({ target: prevTarget }); alert('value can only be a number') }
        else {
            this.onEditTask();
        }
    }


    onEditTask = async () => {
        this.setState({ saveLoading: true })
        const { day, month, year, projId, prevDateId, prevTimeId, childTimeStamp, parentDay, dayOfWeek, parentMonth, parentTimeStamp, parentYear } = this.state
        const newDateSelected = day + month + year
        const HMS = new Date().getTime().toString()
        // const HMS = moment().format('kkmmss').toString()
        // alert(HMS)


        const fbDateRef = firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(day + month + year)

        await fbDateRef.set({ day, month, year, dayOfWeek }, { merge: true })




        //IF EDITED WITHOUT CHANGING DATE
        if (newDateSelected == prevDateId) {

            //for UI.Day,month and year changes when new date is selected 
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(day + month + year).collection('Tasks').doc(childTimeStamp)
                .set({
                    'title': this.state.title,
                    'date': this.state.date,
                    'day': this.state.day,
                    'month': this.state.month,
                    'year': this.state.year,
                    'task': this.state.task,
                    'target': this.state.target,
                    'achieved': 0,
                    'sTechnicians': this.state.sTechnicians,
                    'assignedTo': this.state.sTechniciansString,
                },
                    { merge: true })


            //for reporting,
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(parentDay + parentMonth + parentYear).collection('Reporting').doc(parentTimeStamp)
                .set({
                    'title': this.state.title,
                    'date': this.state.date,
                    'day': this.state.day,
                    'month': this.state.month,
                    'year': this.state.year,
                    'task': this.state.task,
                    'target': this.state.target,
                    'achieved': 0,
                },
                    { merge: true })

            //for reporting
            await firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(parentDay + parentMonth + parentYear).collection('Reporting').doc(parentTimeStamp).collection('Updates').doc(childTimeStamp)
                .set({
                    'task': this.state.task,
                    'timeStamp': childTimeStamp,
                    'target': this.state.target,
                    'achieved': 0,
                    'title': this.state.title,
                },
                    { merge: true })

        }

        else {

            //for UI.Day,month and year changes when new date is selected 
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(day + month + year).collection('Tasks').doc(HMS)
                .set({
                    'title': this.state.title,
                    'date': this.state.date,
                    'day': this.state.day,
                    'month': this.state.month,
                    'year': this.state.year,
                    'task': this.state.task,
                    'target': this.state.target,
                    'achieved': 0,
                    'sTechnicians': this.state.sTechnicians,
                    'assignedTo': this.state.sTechniciansString,
                },
                    { merge: true })


            //GO TO NEW DATE AND INCREMENT
            fbDateRef.update({ noOfTasks: firebase.firestore.FieldValue.increment(1) })

            //GO TO OLD UI DATE AND DELETE
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(prevDateId).collection('Tasks').doc(prevTimeId).delete()
                .then(() => {//DECREMENT NOOFTASKS IN PREVIOUS DATE
                    firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                        .doc(prevDateId).update({ noOfTasks: firebase.firestore.FieldValue.increment(-1) })
                })
                .catch((error) => console.log(error.message))



            //GO TO NEW DATE IN REPORTING AND ADD NEW TASK
            //for reporting/ DATE LEVEL
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(newDateSelected).collection('Reporting').doc(HMS)
                .set({
                    'title': this.state.title,
                    'date': this.state.date,
                    'day': this.state.day,
                    'month': this.state.month,
                    'year': this.state.year,
                    'task': this.state.task,
                    'target': this.state.target,
                    'achieved': 0
                },
                    { merge: true })

            //for reporting /TASK LEVEL
            await firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(newDateSelected).collection('Reporting').doc(HMS).collection('Updates').doc(HMS)
                .set({
                    'task': this.state.task,
                    'timeStamp': childTimeStamp,
                    'target': this.state.target,
                    'achieved': 0,
                    'title': this.state.title,
                },
                    { merge: true })

            //GO TO OLD DATE IN REPORTING AND DELETE TASK
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
                .doc(prevDateId).collection('Reporting').doc(prevTimeId).delete()
        }






        this.setState({ saveLoading: false })
        this.props.navigation.navigate('DaysTask');
    }

    onToggleEditTaskOverlay = async () => {
        //await this.setState({ title: '', task: '' })
        this.setState({
            isEditTaskOverlayVisible: !this.state.isEditTaskOverlayVisible,
            deleteOverlayVisible: false
        })
    }
    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
    }


    render() {
        const { ...s } = this.state
        return (
            <View style={{ flex: 1, paddingHorizontal: 10, width: '100%' }}>




                <View style={{ marginTop: 30, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '95%' }}>
                        {/* <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Title</Text> */}
                        <TextInput
                            value={this.state.title}
                            onChangeText={(title) => { this.setState({ title }) }}
                            style={{ fontSize: 15, paddingVertical: 3, marginRight: 1, borderColor: '#2980b9', borderBottomWidth: 1, width: '100%' }} />
                        <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Title</Text>
                    </View>

                </View>
                <View style={{ marginTop: 30, width: '95%' }}>
                    <TextInput
                        value={this.state.task}
                        onChangeText={(task) => { this.setState({ task }) }}
                        multiline={true}
                        numberOfLines={3}
                        style={{ paddingVertical: 3, textAlignVertical: 'top', marginRight: 1, borderColor: '#2980b9', borderBottomWidth: 1, width: '100%' }} />
                    <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Task Detail</Text>
                </View>


                <View>
                    <View style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                        <View style={{ marginTop: 0 }}>
                            <TextInput
                                value={this.state.target}
                                onChangeText={(target) => { this.setState({ target: parseInt(target) }) }}
                                style={{ paddingVertical: 3, textAlignVertical: 'center', marginRight: 1, borderColor: '#2980b9', borderBottomWidth: 1, width: '100%' }} />
                            <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Target(%)</Text>
                        </View>

                        <View style={{ marginLeft: '25%', width: '40%' }}>
                            <TextInput
                                editable={false}
                                placeholder={s.date}
                                onChangeText={(title) => { this.setState({ title }) }}
                                style={{ paddingVertical: 3, marginRight: 1, borderColor: '#2980b9', borderBottomWidth: 1, width: '100%' }} />
                            <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Selected Date</Text>
                        </View>

                        <View style={{ marginLeft: 10, }}>
                            <Icon name='md-calendar' color={'#2980b9'} size={40} onPress={() => { this.onToggleCalendarOverlay() }} />
                        </View>
                    </View>

                    <TouchableOpacity style={{ borderRadius: 50, marginVertical: 25, justifyContent: 'center', width: '40%', height: 40, borderWidth: 1, borderColor: '#2980b9' }}
                        onPress={() => { this.setState({ isResourceOVis: true }) }}>
                        <Text style={{ textAlign: 'center', color: '#2980b9' }}>Assign To</Text>
                    </TouchableOpacity>

                    <Text>{this.state.sTechniciansString}</Text>


                </View>
                <TouchableOpacity style={{ marginTop: 35, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                    onPress={() => { this.validateTarget() }}
                    disabled={(!s.title.length) || (!s.task.length)}>

                    {(this.state.saveLoading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                    {(this.state.saveLoading == false) && (<Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Save</Text>)}


                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                    onPress={() => { this.onToggleNewTaskOverlay() }}>
                    <Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Exit</Text>
                </TouchableOpacity>







                <Overlay isVisible={s.isCalendarOverlayVisible} ///calendar overlay
                    onBackdropPress={() => { this.setState({ isCalendarOverlayVisible: false }); }}
                    fullScreen={true}
                    overlayStyle={{ height: 300, flex: 1, alignItems: 'center' }}
                    overlayBackgroundColor="#FFF"
                    width='95%'
                    height={300}
                    animationType={'slide'}>
                    <View style={{ flex: 1, paddingTop: '10%', width: '100%' }}>


                        <View style={styles.container}>
                            <CalendarPicker
                                onDateChange={this.onDateChange}
                            />
                        </View>


                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10, padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { this.onToggleCalendarOverlay() }}>
                            <Text style={{ fontSize: 17, textAlign: 'center', color: '#2980b9' }}>OK</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={{ marginTop: 10, padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { }}>
                            <Text style={{ fontSize: 17, textAlign: 'center', color: '#2980b9' }}>OK</Text>
                        </TouchableOpacity> */}
                    </View>
                </Overlay>







                <Overlay isVisible={s.isResourceOVis}
                    fullScreen={false}
                    onBackdropPress={() => { this.setState({ isResourceOVis: false }); }}
                    overlayStyle={{ flex: 1, alignItems: 'center' }}
                    overlayBackgroundColor="#FFF"
                    width='95%'
                    height={300}
                    animationType={'slide'}>
                    <View style={{ flex: 1, paddingTop: '10%', width: '100%' }}>

                        <View style={{ backgroundColor: '#2980b9', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{}}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}> Personnel On This Project</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: 6 }}>
                            <ScrollView>
                                {this.state.technicians.map((item, index) => {

                                    const checked = this.state.sTechnicians.includes(item.name);
                                    return (
                                        <View key={index}>
                                            <CheckBox
                                                title={item.name}
                                                checkedIcon='dot-circle-o'
                                                uncheckedIcon='circle-o'
                                                checked={checked}
                                                onPress={() => { this.checkTheBox(item.name, checked) }}
                                            />
                                        </View>
                                    )
                                })

                                }
                            </ScrollView>
                        </View>


                        <View style={{ backgroundColor: '#82ccdd', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity style={{}}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}> Selected Personnel</Text>
                            </TouchableOpacity>

                        </View>


                        <View style={{ flex: 6, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                            <ScrollView>
                                {this.state.sTechnicians.map((item, index) =>

                                    <TouchableOpacity key={index}>
                                        <View style={styles.projectV}>
                                            <Text style={styles.projectT}>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                                }
                            </ScrollView>
                        </View>

                        <TouchableOpacity style={{ backgroundColor: '#2980b9', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.setState({ isResourceOVis: false })}>
                            <View>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Overlay>


            </View>
        );
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
    projectT: {
        width: '100%',
        fontWeight: 'bold',

    },
});
