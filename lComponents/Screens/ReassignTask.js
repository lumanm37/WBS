import React, { Component } from 'react';
import {
    Text, View, TextInput, ActivityIndicator, FlatList,
    StyleSheet, ScrollView, TouchableOpacity, Image
} from "react-native";
import firebase from 'react-native-firebase';
import { Overlay, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import moment from 'moment';




export default class ReassignTask extends Component {
    static navigationOptions = {
        title: 'Reassign Task',
        headerStyle: {
            backgroundColor: '#2980b9'
        }
    }
    componentDidMount() {
        const dates = this.props.navigation.getParam('dates', 'undefined')
        const title = this.props.navigation.getParam('title', 'undefined')
        const task = this.props.navigation.getParam('task', 'undefined')
        const target = this.props.navigation.getParam('target', 'undefined')
        const achieved = this.props.navigation.getParam('achieved', 'undefined')
        const date = this.props.navigation.getParam('date', 'undefined')
        const day = this.props.navigation.getParam('day', 'undefined')
        const month = this.props.navigation.getParam('month', 'undefined')
        const year = this.props.navigation.getParam('year', 'undefined')
        const projId = this.props.navigation.getParam('projId', 'undefined')
        const dateId = this.props.navigation.getParam('dateId', 'undefined')
        const parentDateId = this.props.navigation.navigate('parentDateId', 'undefined')
        const timeId = this.props.navigation.getParam('timeId', 'undefined')
        const acTimeId = this.props.navigation.getParam('acTimeId', 'undefined')
        const prevDateId = this.props.navigation.getParam('prevDateId', 'undefined')
        const prevTimeId = this.props.navigation.getParam('prevTimeId', 'undefined')
        const assignedTo = this.props.navigation.getParam('assignedTo', 'undefined')
        const sTechnicians = this.props.navigation.getParam('sTechnicians', 'undefined')
        this.setState({
            parentDateId, dates, acTimeId, prevDateId, prevTimeId, selectedDate: prevDateId,
            oldDay: day, oldMonth: month, oldYear: year, achieved, sTechnicians, sTechniciansString: assignedTo,
            title, task, target: target.toString(), prevTarget: target.toString(), date, day, month, year, projId, dateId, timeId
        })
        // alert(prevDateId + ' ' + prevTimeId)
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
        dates: [],
        dayOfWeek: '',
        day: '',
        oldDay: '',
        oldMonth: '',
        oldYear: '',
        firstTaskNo: true,
        isResourceOVis: false,
        month: '',
        year: '',
        dateStamp: '',
        prevDateId: '',
        prevTimeId: '',
        projId: '',
        dateId: '',
        parentDateId: '',
        timeId: '',
        acTimeId: '',
        achieved: '',
        saveLoading: false,
        technicians: [],
        sTechniciansString: '',
        sTechnicians: [],
    }

    dayConvert = (num) => {
        const name = ['err', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return name[num]
    }
    monthConvert = (num) => {
        const name = ['err', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }

    onDateChange = this.onDateChange.bind(this);

    onDateChange(date) {
        // const { selectedDate } = this.state
        const dayOfWeek = this.dayConvert(date.format('E'))//converts eg 07 to Sun
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        const day = date ? date.format('DD') : ''
        const year = date ? date.format('YYYY') : ''
        const selectedDate = day + month + year

        if (selectedDate == this.state.prevDateId) {
            alert('Tasks cannot be reassigned to the same date. Select a new date')
        }
        else {
            this.setState({
                selectedDate,
                dateStamp: date ? date.format('x') : '',
                date: date ? date.format('DD MM YYYY') : '',
                day,
                month: date ? month : '',
                year,
                dayOfWeek: date ? dayOfWeek : '',
            });

        }

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

    validateTarget = async () => {
        const { target, prevTarget, prevDateId, selectedDate, projId, day, month, year, firstTaskNo } = this.state
        if (target < 1 || target > 100) { this.setState({ target: prevTarget }); alert('Target value must be between 1-100%') }
        else if (isNaN(target)) { this.setState({ target: prevTarget }); alert('value can only be a number') }
        else {
            if (prevDateId == selectedDate) {
                alert('Tasks cannot be reassigned to the same date. Select a new date')
            }
            else {
                this.onEditTask();
            }
        }

    }

    //ON REASSIGN
    onEditTask = async () => {
        this.setState({ saveLoading: true })
        const { oldDay, dateStamp, dayOfWeek, oldMonth, oldYear, prevDateId, prevTimeId, day, month, year, projId, timeId } = this.state
        // const HMS = moment().format('kkmmss').toString()
        const HMS = new Date().getTime().toString()
        const dates = this.state.dates.concat({ date: prevDateId, timeId: prevTimeId })
        await firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(day + month + year)
            .set({ day, month, year, dateStamp, dayOfWeek }, { merge: true })


        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(day + month + year)
            .update({ noOfTasks: firebase.firestore.FieldValue.increment(1) });

        //parent timestamp doesnt have a child timestamp until reassigned, disable
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(prevDateId)
            .collection('Tasks').doc(prevTimeId).set({ editEnable: false, childTimeStamp: prevTimeId }, { merge: true })


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
                'achieved': this.state.achieved,
                'parentMonth': oldMonth,
                'parentDay': oldDay,
                'parentYear': oldYear,
                'parentTimeStamp': timeId,
                'dates': dates,
                'childTimeStamp': HMS,
                'parentDateId': oldDay + oldMonth + oldYear,
                'sTechnicians': this.state.sTechnicians,
                'assignedTo': this.state.sTechniciansString,
                prevDateId, prevTimeId,
            },
                { merge: true })




        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(oldDay + oldMonth + oldYear).collection('Reporting').doc(timeId).collection('Updates').doc(HMS)
            .set({
                'task': this.state.task,
                'timeStamp': HMS,
                'target': this.state.target,
                'achieved': this.state.achieved,
                'dayOfWeek': this.state.dayOfWeek,
                'title': this.state.title,


            },
                { merge: true })


        firebase.firestore().collection('Activities').doc(projId).collection('Summary')
            .doc(oldDay + oldMonth + oldYear).collection('All Activities').doc(timeId)
            .set({
                'title': this.state.title,
                'task': this.state.task,
                'target': this.state.target,
                'achieved': this.state.achieved,
            },
                { merge: true })

        firebase.firestore().collection('Activities').doc(projId).collection('Summary')
            .doc(oldDay + oldMonth + oldYear).collection('All Activities').doc(timeId)
            .update({ noOfDays: firebase.firestore.FieldValue.increment(1) })

        this.setState({ saveLoading: false })
        this.props.navigation.navigate('DaysTask')
    }

    // onToggleEditTaskOverlay = async () => {
    //     //await this.setState({ title: '', task: '' })
    //     this.setState({
    //         isEditTaskOverlayVisible: !this.state.isEditTaskOverlayVisible,
    //         deleteOverlayVisible: false
    //     })
    // }

    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
    }


    render() {
        const { ...s } = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>




                <ScrollView style={{ flex: 1, paddingTop: '10%', width: '95%' }}>
                    <Text style={{ fontSize: 21, color: '#2980b9', marginBottom: 20, fontWeight: 'bold' }}>Re-assign this Task to a new Date </Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', width: '100%' }}>

                        <View style={{ width: '85%' }}>
                            <Text style={{ color: '#2980b9' }}>NewDate</Text>
                            <TextInput
                                editable={false}
                                placeholder={this.state.day + this.state.month + this.state.year}
                                placeholderTextColor={'black'}
                                value={this.state.day + this.state.month + this.state.year}
                                style={{ marginRight: 1, borderColor: '#ededed', borderWidth: 2, width: '100%' }} />
                        </View>

                        <View style={{ marginLeft: 10, marginBottom: -10 }}>
                            <Icon name='md-calendar' color={'#2980b9'} size={40} onPress={() => { this.onToggleCalendarOverlay() }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, width: '85%' }}>
                        <Text style={{ color: '#2980b9' }}>Target</Text>
                        <TextInput
                            value={this.state.target}
                            onChangeText={(target) => { this.setState({ target: parseInt(target) }) }}
                            style={{ paddingHorizontal: 2, textAlignVertical: 'center', marginRight: 1, borderColor: '#ededed', borderWidth: 2, width: '20%' }} />
                    </View>

                    <View>

                        <TouchableOpacity style={{ borderRadius: 50, marginVertical: 25, justifyContent: 'center', width: '40%', height: 40, borderWidth: 1, borderColor: '#2980b9' }}
                            onPress={() => { this.setState({ isResourceOVis: true }) }}>
                            <Text style={{ textAlign: 'center', color: '#2980b9' }}>Assign To</Text>
                        </TouchableOpacity>

                        <Text>{this.state.sTechniciansString}</Text>

                    </View>
                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                        onPress={() => { this.validateTarget() }}
                        disabled={(!s.title.length) || (!s.task.length)}>
                        {(this.state.saveLoading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                        {(this.state.saveLoading == false) && (<Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Save</Text>)}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                        onPress={() => { this.props.navigation.navigate('DaysTask') }}>
                        <Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Exit</Text>
                    </TouchableOpacity>
                </ScrollView>



                <Overlay isVisible={s.isCalendarOverlayVisible}
                    fullScreen={true}
                    onBackdropPress={() => { this.setState({ isCalendarOverlayVisible: false }); }}
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
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}> Technicians On This Project</Text>
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
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}> Selected Technicians</Text>
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