import React, { Component } from "react";
import { Text, View, FlatList, TextInput, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card } from "react-native-elements";
import moment from 'moment';
import firebase from "react-native-firebase";
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign'
import DateTimePicker from "react-native-modal-datetime-picker";



const AttendanceForm = ({ name, timeIn, timeOut, popClockIn, popClockOut }) => (
    <View>

        <Text style={{
            color: '#2980b9', fontWeight: 'bold', fontSize: 20, borderTopWidth: 1,
            borderTopColor: '#ededed',
        }}>{name}</Text>

        {/* // <Card title={'Lukman Mohammed'}
        //     titleStyle={{ color: '#2980b9', marginVertical: 0, paddingVertical: 0 }}
        // > */}

        <View style={styles.projectV}>

            <View style={{ width: '35%', flexDirection: 'row', }}>
                <View style={{ paddingTop: 0, paddingBottom: 0, width: '30%', justifyContent: 'center', }}>
                    <TouchableOpacity activeOpacity={5} onPress={popClockIn}>
                        <Icon name={'clockcircle'} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 0, paddingBottom: 0, width: '70%', paddingHorizontal: '5%', }}>
                    <TouchableOpacity activeOpacity={.8} onPress={popClockIn}>
                        <TextInput
                            editable={false}
                            style={{ color: '#000' }}
                            placeholder={'Time In'}
                            value={timeIn ? timeIn.toString() : ''}
                        />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={{ marginVertical: 0, width: '35%', flexDirection: 'row', }}>
                <View style={{ paddingTop: 0, paddingBottom: 0, width: '30%', justifyContent: 'center', }}>
                    <TouchableOpacity activeOpacity={.8} onPress={popClockOut}>
                        <Icon name={'clockcircleo'} size={25} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingTop: 0, paddingBottom: 0, width: '70%', paddingHorizontal: '5%', }}>
                    <TouchableOpacity activeOpacity={.8} onPress={popClockOut}>
                        <TextInput
                            editable={false}
                            style={{ color: '#000' }}
                            placeholder={'Time Out'}
                            value={timeOut ? timeOut.toString() : ''}
                        />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    </View>
    // {/* </Card> */}

);





export default class Attendance extends Component {
    static navigationOptions = {
        title: 'Personnel Attendance',
        headerStyle: {
            backgroundColor: '#2980b9'
        }
    }




    componentDidMount = () => {
        const today = new Date()
        const month = this.monthConvert(today.getMonth())//converts eg 07 to July
        const acDate = today.getDate() + month + today.getFullYear()
        const acDatex = today.getDate() + ' ' + month + ' ' + today.getFullYear()
        const dateStamp = new Date(acDatex).getTime();
        const projId = this.props.navigation.getParam('projId', 'undefined')
        firebase.firestore().collection('Projects').doc(projId).collection('Clocking').doc(acDate).get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({ technicians: doc.data().attendance ? doc.data().attendance : [] })
                }
                else {
                    firebase.firestore().collection('Projects').doc(projId).get()
                        .then((doc) => {
                            this.setState({ technicians: doc.data().technicians })
                        })
                        .catch((error) => { })
                }
            })
        this.setState({ projId, dateSelected: acDate, dateStamp })
    }

    state = {
        projId: '',
        dateSelected: '',
        dateStamp: '',
        isDateVis: false,
        isStartTimeVis: false,
        isEndTimeVis: false,
        technicians: [],
        timeOut: '',
        timeIn: '',
        selIndex: 0,
        loading: false,
    }

    dayConvert = (num) => {
        const name = ['err', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return name[num]
    }

    monthConvert = (num) => {
        const name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }

    handleDatePicked = (date) => {
        // const dayOfWeek = this.dayConvert(date.format('E'))//converts eg 07 to Sun
        const month = this.monthConvert(date.getMonth())//converts eg 07 to July
        const acDate = date.getDate() + month + date.getFullYear()
        const acDatex = date.getDate() + ' ' + month + ' ' + date.getFullYear()
        const dateStamp = new Date(acDatex).getTime();
        // alert(dateStamp)
        this.setState({ dateSelected: acDate, isDateVis: false, dateStamp })
        firebase.firestore().collection('Projects').doc(this.state.projId).collection('Clocking').doc(acDate).get()
            .then((doc) => {
                if (doc.exists) {
                    this.setState({ technicians: doc.data().attendance })
                }
                else {

                    firebase.firestore().collection('Projects').doc(this.state.projId).get()
                        .then((doc) => {
                            this.setState({ technicians: doc.data().technicians })
                        })
                        .catch((error) => { })

                }
            })
            .catch((error) => { })
    }

    calcNoOfHours = (timeIn, timeOut) => {
        const totalHours = (timeOut - timeIn) / 60

        // alert(totalHours)
    }

    handleTimeIn = (time) => {
        const { selIndex, technicians } = this.state
        const acTime = time.getHours() + ':' + time.getMinutes()
        const totalInMins = (time.getHours() * 60) + (time.getMinutes())
        const totalOutMins = technicians[selIndex].totalOutMins ? technicians[selIndex].totalOutMins : 1020
        technicians[selIndex].timeIn = acTime
        technicians[selIndex].totalInMins = totalInMins
        const totalHours = ((totalOutMins - totalInMins) / 60).toFixed(2)
        technicians[selIndex].hours = (totalHours == Infinity) ? totalHours : Math.abs(totalHours)
        this.setState({ technicians, isStartTimeVis: false })

        // alert(totalOutMins + '  -  ' + totalInMins + ' = ' + Math.abs(totalHours))
    }

    handleTimeOut = (time) => {
        const { selIndex, technicians } = this.state
        const acTime = time.getHours() + ':' + time.getMinutes()
        const totalOutMins = (time.getHours() * 60) + (time.getMinutes())
        // const totalInMins = technicians[selIndex].totalInMins ? technicians[selIndex].totalInMins : Infinity
        const totalInMins = technicians[selIndex].totalInMins
        const totalHours = ((totalOutMins - totalInMins) / 60).toFixed(2)


        technicians[selIndex].timeOut = acTime
        technicians[selIndex].totalOutMins = totalOutMins
        technicians[selIndex].hours = (totalHours == (-Infinity)) ? '-Infinity' : Math.abs(totalHours)
        this.setState({ technicians, isEndTimeVis: false })
        // alert(totalOutMins + '  -  ' + totalInMins + ' = ' + totalHours)
    }

    onSave = () => {
        this.setState({ loading: true })
        const { dateSelected, projId } = this.state
        firebase.firestore().collection('Projects').doc(projId).collection('Clocking').doc(dateSelected)
            .set({ 'attendance': this.state.technicians, 'dateStamp': this.state.dateStamp })
            .then(() => this.setState({ loading: false }))
    }

    render() {
        return (
            <View style={{ width: '100%', alignItems: 'center', flex: 1, marginVertical: 5, marginHorizontal: 5, }}>

                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        editable={false}
                        style={{ color: '#000', fontWeight: 'bold', fontSize: 18, alignItems: 'center', width: '70%', marginVertical: 10, borderBottomWidth: 1 }}
                        placeholder={'select Date'}
                        value={this.state.dateSelected.toString()}
                    />
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ isDateVis: true })}>
                            <Icon name={'calendar'} size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 8, alignContent: 'center' }}>
                    <ScrollView>

                        {this.state.technicians.map((item, index) => {
                            { (this.state.loading == true) && (<ActivityIndicator size='large' color='#fff' />) }
                            { (this.state.loading == false) && (<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save Attendance</Text>) }
                            return (
                                <View key={index}>

                                    <AttendanceForm
                                        timeIn={item.timeIn}
                                        timeOut={item.timeOut}
                                        popClockIn={() => this.setState({ isStartTimeVis: true, selIndex: index })}
                                        popClockOut={() => {
                                            if (this.state.technicians[index].timeIn == undefined) {

                                                ToastAndroid.showWithGravity(
                                                    'Set TIME IN first',
                                                    ToastAndroid.SHORT,
                                                    ToastAndroid.TOP,
                                                );
                                            }

                                            else {
                                                this.setState({ isEndTimeVis: true, selIndex: index })
                                            }
                                        }}
                                        name={item.name} />
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>

                <TouchableOpacity style={{ width: '100%', backgroundColor: '#2980b9', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.onSave()}>
                    <View>

                        {(this.state.loading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                        {(this.state.loading == false) && (<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save Attendance</Text>)}

                    </View>
                </TouchableOpacity>




                <DateTimePicker
                    mode={'date'}
                    isVisible={this.state.isDateVis}
                    onConfirm={this.handleDatePicked}
                    onCancel={() => this.setState({ isDateVis: false })}
                />
                <DateTimePicker
                    mode={'time'}

                    isVisible={this.state.isStartTimeVis}
                    onConfirm={this.handleTimeIn}
                    onCancel={() => this.setState({ isStartTimeVis: false })}
                />
                <DateTimePicker
                    mode={'time'}
                    isVisible={this.state.isEndTimeVis}
                    onConfirm={this.handleTimeOut}
                    onCancel={() => this.setState({ isEndTimeVis: false })}
                />

            </View>
        );
    }
}

styles = StyleSheet.create({
    butnView: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'space-between',
        height: 50,
        borderWidth: 2,
        width: '30%',
        borderColor: '#2980b9',
    },
    projectV: {
        // alignItems: 'center',
        // position: 'relative',
        zIndex: 1,
        flexDirection: 'row',
        // padding: 20,
        // paddingRight: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        width: '90%', justifyContent: 'space-around',
    },
    projectT: {
        // paddingLeft:20,
        // borderLeftWidth:10,
        // borderLeftColor:'#2980b9',
        // fontWeight:'bold',
        // fontSize:15
        textAlign: 'center',
    },
    butn: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    buttnText: {
        textAlign: 'center',
        color: '#2980b9'
    }
})

