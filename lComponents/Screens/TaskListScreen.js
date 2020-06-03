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
import { UnitTaskDate } from '../UnitProject';



export default class TaskListScreen extends Component {
    static navigationOptions = {
        title: 'Outstanding',
    }

    onUpdate = (querySnapshot) => {
        const arr = querySnapshot.docs
        const sorted = arr.sort((a, b) => {
            return (b.data().dateStamp - a.data().dateStamp)
        })
        this.setState({ tasks: sorted });
    }



    componentDidMount() {
        const PCname = this.props.navigation.getParam('PCname', 'undefined')
        const PMname = this.props.navigation.getParam('PMname', 'undefined')
        const SEname = this.props.navigation.getParam('SEname', 'undefined')
        const role = this.props.navigation.getParam('role', 'undefined')
        const userName = this.props.navigation.getParam('userName', 'undefined')
        const projId = this.props.navigation.getParam('id', 'undefined')
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .where('noOfTasks', '>', 0).onSnapshot(this.onUpdate)
        this.setState({ projId, role, userName, PCname, PMname, SEname })

        firebase.firestore().collection('Projects').doc(projId).get()
            .then((doc) => {
                this.setState({ technicians: doc.data().technicians ? doc.data().technicians : [] })
            })


    }


    state = {
        technicians: [],
        sTechnicians: [],
        sTechniciansString: '',
        role: '',
        userName: '',
        PCname: '',
        PMname: '',
        SEname: '',
        projId: '',
        tasks: [],
        task: '',
        date: '',
        day: '',
        month: '',
        year: '',
        target: '',
        title: '',
        error: '',
        dateStamp: '',
        dayOfWeek: '',
        loading: true,
        isNewTaskOverlayVisible: false,
        isCalendarOverlayVisible: false,
        isResourceOVis: false,
        selectedDate: null,
        saveLoading: false,

    }


    // Momt = () => {
    //     const d = moment().format('DD MM YY').toString()
    //     return d;
    // }

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
        const { selectedDate } = this.state
        const dayOfWeek = this.dayConvert(date.format('E'))//converts eg 07 to Sun
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        this.setState({
            selectedDate: date,
            dateStamp: date ? date.format('x') : '',
            date: date ? date.format('DD MM YYYY') : '',
            dayOfWeek: date ? dayOfWeek : '',
            day: date ? date.format('DD') : '',
            month: date ? month : '',
            year: date ? date.format('YYYY') : '',

        });
    }



    validateTarget = async () => {
        const { target, projId, day, month, year } = this.state
        if (target < 1 || target > 100) { this.setState({ target: '0%' }); alert('Target value must be between 1-100%') }
        else if (isNaN(target)) { this.setState({ target: '0%' }); alert('target value can only be a number') }
        else {

            this.onAddTask();
        }
    }


    onAddTask = async () => {
        this.setState({ saveLoading: true })
        const { day, month, year, projId, dateStamp, dayOfWeek } = this.state
        // const HMS = moment().format('kkmmss').toString()
        const HMS = new Date().getTime().toString()

        const fbDateRef = firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .doc(day + month + year)

        const fbDateRef2 = firebase.firestore().collection('Activities').doc(projId).collection('Summary')
            .doc(day + month + year)

        await fbDateRef.set({ day, month, year, dateStamp, dayOfWeek }, { merge: true })

        fbDateRef.update({ noOfTasks: firebase.firestore.FieldValue.increment(1) });

        fbDateRef.collection('Tasks').doc(HMS) //for UI
            .set({
                'title': this.state.title,
                'date': this.state.date,
                'day': this.state.day,
                'month': this.state.month,
                'year': this.state.year,
                'task': this.state.task,
                'target': this.state.target,
                'achieved': 0,
                'assignedTo': this.state.sTechniciansString,
                'sTechnicians': this.state.sTechnicians,
                'dates': [],
                'parentTimeStamp': HMS,
                // 'childTimeStamp': HMS,
                'editEnable': true,
            },
                { merge: true })

        fbDateRef.collection('Reporting').doc(HMS) //for reporting
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



        fbDateRef.collection('Reporting').doc(HMS).collection('Updates').doc(HMS) //for reporting
            .set({
                'title': this.state.title,
                'task': this.state.task,
                'timeStamp': HMS,
                'target': this.state.target,
                'achieved': 0,
                'completed': false,
                'dayOfWeek': this.state.dayOfWeek,
            },
                { merge: true })

        fbDateRef2.set({
            dateStamp
        }, { merge: true })

        fbDateRef2.collection('All Activities').doc(HMS)//for reporting 2,time spent on activites
            .set({
                'title': this.state.title,
                'task': this.state.task,
                'timeStamp': HMS,
                'target': this.state.target,
                'achieved': 0,
                'completed': false,
                'dayOfWeek': this.state.dayOfWeek,
                'noOfDays': 1
            },
                { merge: true })
        this.setState({ saveLoading: false })
        this.onToggleNewTaskOverlay();
    }



    onToggleNewTaskOverlay = async () => {
        await this.setState({ title: '', task: '' })
        this.setState({ isNewTaskOverlayVisible: !this.state.isNewTaskOverlayVisible })
    }
    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
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

    render() {
        const { ...s } = this.state
        return ( // firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            //     .where('noOfTasks', '>', 0).orderBy('noOfTasks').onSnapshot(this.onUpdate)
            // this.setState({ projId, role, userName, PCname, PMname, SEname })
            <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>

                <View style={{ width: '97%' }}>


                    <FlatList
                        data={s.tasks}
                        renderItem={({ item }) =>
                            <UnitTaskDate
                                item={item}
                                projId={s.projId}
                                navigation={this.props.navigation}
                                role={s.role}
                                userName={s.userName}
                                PMname={s.PMname}
                                PCname={s.PCname}
                                SEname={s.SEname} />

                        }
                        keyExtractor={(item, index) => index.toString()}
                    />



                </View>
                {(s.PMname == s.userName || s.SEname == s.userName) &&

                    (<TouchableOpacity style={styles.butn}
                        onPress={() => this.onToggleNewTaskOverlay()}>
                        <Text style={styles.butntxt}>+</Text>
                    </TouchableOpacity>)
                }

                <Overlay isVisible={s.isNewTaskOverlayVisible}
                    fullScreen={true}
                    onBackdropPress={() => { this.setState({ isNewTaskOverlayVisible: false }); }}
                    overlayStyle={{ borderWidth: 2, borderColor: '#ededed', flex: 1, alignItems: 'center' }}
                    containerStyle={{ borderWidth: 2, borderColor: '#ededed', flex: 1, alignItems: 'center' }}
                    overlayBackgroundColor="#FFF"
                    width='80%'
                    height='50%'
                    animationType={'slide'}>
                    <View style={{ flex: 1, width: '100%' }}>

                        <View style={{ height: 45, width: '100%', backgroundColor: '#2980b9', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>ASSIGN TASK TO SPECIFIC DAYS</Text>
                        </View>

                        <View style={{ marginTop: 30, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                            <View style={{ width: '95%' }}>
                                {/* <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Title</Text> */}
                                <TextInput
                                    onChangeText={(title) => { this.setState({ title }) }}
                                    style={{ fontSize: 15, paddingVertical: 3, marginRight: 1, borderColor: '#2980b9', borderBottomWidth: 1, width: '100%' }} />
                                <Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Title</Text>
                            </View>

                        </View>

                        <View style={{ marginTop: 30, width: '95%' }}>
                            <TextInput
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
                        </View >

                        <TouchableOpacity style={{ marginTop: 35, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { this.validateTarget() }}
                            maxLength={3}
                            disabled={(!s.title.length) || (!s.task.length)}>

                            {(this.state.saveLoading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                            {(this.state.saveLoading == false) && (<Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Save</Text>)}


                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#2980b9', padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { this.onToggleNewTaskOverlay() }}>
                            <Text style={{ fontSize: 17, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Exit</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>

                <Overlay isVisible={s.isCalendarOverlayVisible}
                    fullScreen={true}
                    onBackdropPress={() => { this.setState({ isCalendarOverlayVisible: false }); }}
                    overlayStyle={{ flex: 1, alignItems: 'center' }}
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








            </View >
        );
    }

}

const styles = StyleSheet.create({
    butn: {
        position: 'absolute',
        zIndex: 2,
        right: 15,
        bottom: 10,
        backgroundColor: '#2980b9',
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 50
    },
    butntxt: {
        color: '#fff', fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 5
    },
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





