import React, { Component } from "react";
import firebase from 'react-native-firebase';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
/*Example of Making PDF from HTML in React Native*/

import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Image,
    Picker,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


export default class Report extends Component {
    static navigationOptions = {
        title: 'Generate Report'
    }

    state = {
        taskData: [],
        targetSnapshot: [],
        taskSnapshot: [],
        projects: [],
        filePath: '',
        table: 'state has been read',
        isCalendarOverlayVisible: false,
        isCalendarOverlay2Visible: false,
        firstTimeStamp: '',
        lastTimeStamp: '',
        date: '',
        selectedDate1: '',
        selectedDate2: '',
        day: '',
        month: '',
        year: '',
        lastDate: '',
        lastDay: '',
        lastMonth: '',
        lastYear: '',
        projId: '',
        projIndex: '',
        projItem: '',
        projLocation: '',
        projDescription: '',
        client: '',
        addedTask: '',
        dateIndex: '',
        // datess: [['23Sep2019', '24Sep2019', '25Sep2019'], ['26Sep2019', '27Sep2019', '28Sep2019']],
        // dates: [],
        tasksNumber: 0,
        Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false,
        monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '',
        subArr: [],
        mainArr: [],
        pDStmp: '0',
        maxDStmpDif: '0',
        genIndicator: false,
        html: '', htmll: '', cellColor: '',
    };

    constructor(props) {
        super(props);
    }

    onUpdate = (querySnapshot) => {
        this.setState({ projects: querySnapshot.docs });
    }
    componentDidMount() {

        const projId = this.props.navigation.getParam('projId', 'undefined')
        const projItem = this.props.navigation.getParam('projItem', 'undefined')

        firebase.firestore().collection('Projects').doc(projId).get()
            .then((doc) => this.setState({ projItem: doc.data(), projId }))
    }

    dynamicMargin = () => {
        if (this.state.genIndicator == true) return { marginTop: 70 }
    }



    onGenerate0 = async () => {

        const { projId, projIndex, projItem, firstDate, lastDate, firstTimeStamp, lastTimeStamp, projects } = this.state
        const projLocation = projItem.Location
        const projDescription = projItem.Description
        const client = projItem.ClientName

        this.setState({
            genIndicator: true,
            addedTask: '<h1 style="text-align: center;"><strong>Weekly Project Report</strong></h1>' +
                '<p style="text-align:left;"> <strong> project Name  :</strong> <span>' + projId + '</span> </p>' +
                '<p style="text-align:left;"> <strong>Project Loction:</strong> <span>' + projLocation + '</span> </p>' +
                '<p style="text-align:left;"> <strong>Client Name:</strong> <span>' + client + '</span></p>' +
                '<p style="text-align:left;"> <strong>Description:</strong> <span>' + projDescription + '</span></p>' +
                '<p style="text-align:left;"><strong>Report Date:</strong> <span>' + firstDate + ' - ' + lastDate + '</span> </p>' +
                '<p style="text-align:center;"><strong>Planned Vrs Actual Work Progress</strong></p>'
        })

        await firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
            .where('dateStamp', '>=', firstTimeStamp).where('dateStamp', '<=', lastTimeStamp).onSnapshot((querySnapshot) => {
                this.setState({ dates: querySnapshot.docs })
                querySnapshot.docs.map(async (val, key) => {
                    const v = val.data();
                    const cDStmp = val.data().dateStamp
                    const pDStmp = this.state.pDStmp
                    const DStmpDif = cDStmp - pDStmp;
                    console.log(val.data().dayOfWeek)
                    console.log(DStmpDif)
                    console.log('current', cDStmp)
                    console.log('prev', pDStmp)


                    console.log(this.state.subArr)


                    if (v.dayOfWeek == 'Mon') {
                        const maxDStmpDiff = '518400000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })

                    }

                    else if (v.dayOfWeek == 'Tue') {
                        const maxDStmpDiff = '432000000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })
                    }

                    else if (v.dayOfWeek == 'Wed') {
                        const maxDStmpDiff = '345600000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })

                    }

                    else if (v.dayOfWeek == 'Thu') {
                        const maxDStmpDiff = '259200000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })
                    }

                    else if (v.dayOfWeek == 'Fri') {
                        const maxDStmpDiff = '172800000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })

                    }

                    else if (v.dayOfWeek == 'Sat') {
                        const maxDStmpDiff = '86400000'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })
                    }

                    else {
                        const maxDStmpDiff = '0'
                        console.log(this.state.maxDStmpDif)
                        if (key !== 0) {
                            console.log(this.state.maxDStmpDif)
                            if (DStmpDif > this.state.maxDStmpDif) {

                                const mainArr = [...this.state.mainArr, this.state.subArr]
                                this.setState({ mainArr, subArr: [] });
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })

                            }
                            else {
                                const subArr = [...this.state.subArr, val]
                                this.setState({ subArr })
                            }
                        }
                        else {
                            const subArr = [...this.state.subArr, val]
                            this.setState({ subArr })
                        }

                        this.setState({ pDStmp: cDStmp, maxDStmpDif: maxDStmpDiff })
                    }


                })
                const mainArr = [...this.state.mainArr, this.state.subArr]
                this.setState({ mainArr, subArr: [] })
                console.log(this.state.mainArr)

            })
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.onGenerate1();
    }

    onGenerate1 = async () => {
        const { projId, firstTimeStamp, lastTimeStamp, day, month, year } = this.state


        for (const dateArr of this.state.mainArr) {

            this.onGenerate2(dateArr);
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.setState({ addedTask: this.state.addedTask + '</table> <br><br>' })
            // console.log(dateArr)
            // console.log('check')
        }

        this.setState({ addedTask: this.state.addedTask + '</table>' })
        // console.log(this.state.addedTask)
        this.askPermission();
        console.log('done')

    }





    onGenerate2 = async (dateArr) => {
        await this.setState({ monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' })

        dateArr.map(async (val, index) => {
            if (val.data().dayOfWeek == 'Mon') { this.setState({ monday: val.data().day + ' ' + val.data().month }) }
            else if (val.data().dayOfWeek == 'Tue') { this.setState({ tuesday: val.data().day + ' ' + val.data().month }) }
            else if (val.data().dayOfWeek == 'Wed') { this.setState({ wednesday: val.data().day + ' ' + val.data().month }) }
            else if (val.data().dayOfWeek == 'Thu') { this.setState({ thursday: val.data().day + ' ' + val.data().month }) }
            else if (val.data().dayOfWeek == 'Fri') { this.setState({ friday: val.data().day + ' ' + val.data().month }) }
            else if (val.data().dayOfWeek == 'Sat') { this.setState({ saturday: val.data().day + ' ' + val.data().month }) }
            else { this.setState({ sunday: val.data().day + val.data().month }) }
        });

        this.setState({
            addedTask: this.state.addedTask +
                '<table style="width:100%; border-collapse:collapse">' +

                '<tr>' +
                '<th></th>' +
                '<th></th>' +
                '<th colspan="2" >' + this.state.monday + '</th>' +
                '<th colspan="2" >' + this.state.tuesday + '</th>' +
                '<th colspan="2" >' + this.state.wednesday + '</th>' +
                '<th colspan="2" >' + this.state.thursday + '</th>' +
                '<th colspan="2" >' + this.state.friday + '</th>' +
                '<th colspan="2" >' + this.state.saturday + '</th>' +
                '<th colspan="2" >' + this.state.sunday + '</th>' +
                '</tr>' +

                '<tr>' +
                '<th rowspan="2" style="border:1px solid black">No</th>' +
                '<th rowspan="2" style="border:1px solid black">ACTIVITIES</th>' +
                '<th colspan="2" style="border:1px solid black">MON</th>' +
                '<th colspan="2" style="border:1px solid black">TUE</th>' +
                '<th colspan="2" style="border:1px solid black">WED</th>' +
                '<th colspan="2" style="border:1px solid black">THUR</th>' +
                '<th colspan="2" style="border:1px solid black">FRI</th>' +
                '<th colspan="2" style="border:1px solid black">SAT</th>' +
                '<th colspan="2" style="border:1px solid black">SUN</th>' +
                '</tr>' +

                '<tr style="">' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '<td style="border:1px solid black;">T(%)</th>' +
                '<td style="border:1px solid black;">A(%)</th>' +
                '</tr>',
        });


        const { projId, firstTimeStamp, lastTimeStamp, day, month, year } = this.state
        const tEC = '<td style="border:1px solid black;"></th>' +
            '<td style="border:1px solid black;"></th>'

        for (const dateVal of dateArr) {
            await (firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateVal.id)
                .collection('Reporting').onSnapshot(async (querySnapshot) => {
                    await this.setState({ taskSnapshot: querySnapshot.docs })
                    // console.log('taskSnapshot')
                    // console.log(querySnapshot.docs)

                    this.onGenerate3(querySnapshot.docs, dateVal.id)
                    await new Promise(resolve => setTimeout(resolve, 1000))

                }))

        };
    }

    onGenerate3 = async (taskSnapshot, dateVal) => {
        const { projId, firstTimeStamp, lastTimeStamp, day, month, year } = this.state
        const tEC = '<td style="border:1px solid black;"></th>' +
            '<td style="border:1px solid black;"></th>'

        for (const task of taskSnapshot) {
            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateVal)
                .collection('Reporting').doc(task.id).collection('Updates').limit(7).onSnapshot(async (querySnapshot) => {

                    await this.setState({ targetSnapshot: querySnapshot.docs, tasksNumber: this.state.tasksNumber + 1 })
                    // console.log('targetSnapshot')
                    // console.log(this.state.targetSnapshot)

                    for (const target of this.state.targetSnapshot) {

                        if (target.data().completed == true) { this.setState({ cellColor: "#badc58" }) }
                        else { this.setState({ cellColor: "#ffffff" }) }

                        //    Monday
                        if (target.data().dayOfWeek == 'Mon') {
                            this.setState({ Mon: true })
                            if (this.state.targetSnapshot.length == 1) {
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC + tEC + tEC + tEC + tEC + tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                                // console.log('mon addOn', addOn)
                                // console.log('mon addedTask', this.state.addedTask)
                            }

                            else {
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                        }



                        // Tuesday
                        else if (target.data().dayOfWeek == 'Tue') {
                            this.setState({ Tue: true })

                            if (this.state.targetSnapshot.length == 1) {
                                // print entire Tuesday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC + tEC + tEC + tEC + tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Mon == true) {
                                    // add only tuesday
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else {
                                    // entire row to Tuesday
                                    const addOn = '<tr>' +
                                        '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                        tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                            }
                        }



                        // Wednesday
                        else if (target.data().dayOfWeek == 'Wed') {
                            this.setState({ Wed: true })
                            if (this.state.targetSnapshot.length == 1) {
                                // print Entire Wednesday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC + tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC + tEC + tEC + tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Tue == true) {
                                    // print only wednesday
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Tue == false && this.state.Mon == true) {
                                    // print tuesday and Wednesday
                                    const addOn =
                                        tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else {
                                    // print all to Wednesday
                                    const addOn = '<tr>' +
                                        '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                        tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                            }
                        }




                        // thursday
                        else if (target.data().dayOfWeek == 'Thu') {
                            this.setState({ Thu: true })
                            if (this.state.targetSnapshot.length == 1) {
                                // print entire row with only thursday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC + tEC + tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC + tEC + tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Wed == true) {
                                    // print only thursday
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Wed == false) {
                                    if (this.state.Tue == true) {
                                        const addOn =
                                            tEC +
                                            '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                            '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                        this.setState({ addedTask: this.state.addedTask + addOn })
                                    } else if (this.state.Tue == false) {
                                        if (this.state.Mon == true) {
                                            const addOn =
                                                tEC + tEC +
                                                '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                                '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                            this.setState({ addedTask: this.state.addedTask + addOn })
                                        }
                                        else {
                                            const addOn = '<tr>' +
                                                '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                                '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                                tEC + tEC + tEC +
                                                '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                                '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                            this.setState({ addedTask: this.state.addedTask + addOn })
                                        }
                                    }
                                }
                            }

                        }




                        // Friday
                        else if (target.data().dayOfWeek == 'Fri') {
                            this.setState({ Fri: true })
                            if (this.state.targetSnapshot.length == 1) {
                                // print Entire Thursday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC + tEC + tEC + tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC + tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Thu == true) {
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Thu == false && this.state.Wed == true) {
                                    const addOn =
                                        tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Thu == false && this.state.Wed == false && this.state.Tue == true) {
                                    const addOn =
                                        tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Thu == false && this.state.Wed == false && this.state.Tue == false && this.state.Mon == true) {
                                    const addOn =
                                        tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else {
                                    const addOn =
                                        '<tr>' +
                                        '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                        tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                            }


                        }





                        // Saturday
                        else if (target.data().dayOfWeek == 'Sat') {
                            this.setState({ Sat: true })
                            if (this.state.targetSnapshot.length == 1) {
                                // print Entire Saturday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC + tEC + tEC + tEC + tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    tEC +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Fri == true) {
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Fri == false && this.state.Thu == true) {
                                    const addOn =
                                        tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Fri == false && this.state.Thu == false && this.state.Wed == true) {
                                    const addOn =
                                        tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Fri == false && this.state.Thu == false && this.state.Wed == false && this.state.Tue == true) {
                                    const addOn =
                                        tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Fri == false && this.state.Thu == false && this.state.Wed == false && this.state.Tue == false && this.state.Mon == true) {
                                    const addOn =
                                        tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else {
                                    const addOn =
                                        '<tr>' +
                                        '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                        tEC + tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                            }

                        }




                        // Sunday
                        else {
                            if (this.state.targetSnapshot.length == 1) {
                                // print Entire Sunday
                                const addOn = '<tr>' +
                                    '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                    '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                    tEC + tEC + tEC + tEC + tEC + tEC +
                                    '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                    '<td style="border:1px solid black;">' + target.data().achieved + '</td>' +
                                    '</tr>'
                                this.setState({ addedTask: this.state.addedTask + addOn })
                            }
                            else {
                                if (this.state.Sat == true) {
                                    const addOn =
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Sat == false && this.state.Fri == true) {
                                    const addOn =
                                        tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Sat == false && this.state.Fri == false && this.state.Thu == true) {
                                    const addOn =
                                        tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Sat == false && this.state.Fri == false && this.state.Thu == false && this.state.Wed == true) {
                                    const addOn =
                                        tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Sat == false && this.state.Fri == false && this.state.Thu == false && this.state.Wed == false && this.state.Tue == true) {
                                    const addOn =
                                        tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else if (this.state.Sat == false && this.state.Fri == false && this.state.Thu == false && this.state.Wed == false && this.state.Tue == false && this.state.Mon == true) {
                                    const addOn =
                                        tEC + tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                                else {
                                    const addOn =
                                        '<tr>' +
                                        '<td style="border:1px solid black;">' + this.state.tasksNumber + '</td>' +
                                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + target.data().title + '</td>' +
                                        tEC + tEC + tEC + tEC + tEC + tEC +
                                        '<td style="border:1px solid black;">' + target.data().target + '</td>' +
                                        '<td style="border:1px solid black;">' + target.data().achieved + '</td>'
                                    this.setState({ addedTask: this.state.addedTask + addOn })
                                }
                            }
                        }
                    }; this.setState({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false })
                })


        };


        // console.log(this.state.addedTask);
        // this.setState({ addedTask: this.state.addedTask + '</table>' })
        // console.log('function2 complete')

    }



    monthConvert = (num) => {
        const name = ['err', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }

    onDateChange = this.onDateChange.bind(this);
    onDateChange2 = this.onDateChange2.bind(this);


    onDateChange(date) {
        // const d = date.format('YYYY, MM, DD');
        // // const d = 2019, 5, 23
        // alert(date.format('x'))
        // alert(new Date().setFullYear(date.format('DD'), date.format('MM'), date.format('YYYY')))
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        this.setState({
            firstTimeStamp: date.format('x'),
            selectedDate1: date ? date.format('DDMM_') : '',
            firstDate: date ? date.format('DD/MM/YYYY') : '',
            date: date ? date.format('YYYY MM DD') : '',
            day: date ? date.format('DD') : '',
            month: date ? month : '',
            year: date ? date.format('YYYY') : '',
            addedTask: '',


            lastDay: date ? date.format('DD') : '',
            lastMonth: date ? month : '',
            lastYear: date ? date.format('YYYY') : '',

        });
        // alert(date.format('x'))
    }
    onDateChange2(date) {
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        this.setState({
            lastTimeStamp: date.format('x'),
            selectedDate2: date ? date.format('DDMM_YYYY') : '',
            lastDate: date ? date.format('DD/MM/YYYY') : '',
            lastDay: date ? date.format('DD') : '',
            lastMonth: date ? month : '',
            lastYear: date ? date.format('YYYY') : '',
            addedTask: '',
        });
    }

    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
    }

    onToggleCalendarOverlay2 = () => {
        this.setState({ isCalendarOverlay2Visible: !this.state.isCalendarOverlay2Visible })
    }

    askPermission = () => {
        var that = this;
        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'CameraExample App External Storage Write Permission',
                        message:
                            'CameraExample App needs access to Storage data in your SD Card ',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //If WRITE_EXTERNAL_STORAGE Permission is granted
                    //changing the state to show Create PDF option
                    that.createPDF();
                } else {
                    alert('WRITE_EXTERNAL_STORAGE permission denied');
                }
            } catch (err) {
                alert('Write permission err', err);
                console.warn(err);
            }
        }
        //Calling the External Write permission function
        if (Platform.OS === 'android') {
            requestExternalWritePermission();
        } else {
            this.createPDF();
        }
    }

    createPDF = async () => {
        const { selectedDate1, day, month, lastDay, lastMonth, lastYear, projItem, selectedDate2, projects, projId, projIndex, firstDate, lastDate, date, addedTask } = this.state

        const projLocation = projItem.Location
        const projDescription = projItem.Description
        const client = projItem.ClientName

        let options = {
            //Content to print
            html: this.state.addedTask,

            //File Name
            fileName: day + month + '_' + lastDay + lastMonth + '_' + lastYear,
            //File directory
            directory: 'docs',
        };
        this.setState({ htmll: options.html })
        let file = await RNHTMLtoPDF.convert(options);
        console.log(file.filePath);
        this.setState({ filePath: file.filePath, genIndicator: false });
    }

    onOpenFile = () => {
        const path = this.state.filePath
        FileViewer.open(path)
            .then(() => {
                consol.log('pdf opened')
            })
            .catch(error => {
                alert(error.message)
            });
    }

    render() {
        // const { options } = this.createPDF
        console.log(this.state.htmll)


        const { projects } = this.state
        return (
            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                    <View style={{ justifyContent: 'center', width: '85%' }}>
                        <Text style={{ marginBottom: 20, fontSize: 18, color: '#2980b9', fontWeight: 'bold' }}>REPORT: Planned Vrs Actual Work Progress</Text>
                        <Text style={{}}>Project</Text>
                        <Picker
                            selectedValue={this.state.projId}
                            style={{ color: '#2980b9', height: 50, width: 300 }}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ projId: itemValue, projIndex: itemIndex, addedTask: '' });
                            }}>

                            <Picker.Item label={this.state.projId} value={this.state.projId} />

                        </Picker>
                    </View>

                </View>
                <View style={{ marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                    <View style={{ justifyContent: 'center', width: '85%' }}>
                        <Text style={{}}>Start Date</Text>
                        <Text style={{ color: '#2980b9', textAlign: 'center', lineHeight: 40, fontSize: 18, marginRight: 1, borderColor: '#ededed', borderWidth: 2 }} >
                            {this.state.day} {this.state.month} {this.state.year}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 10, marginBottom: -10 }}>
                        <Icon name='md-calendar' color={'#2980b9'} size={40} onPress={() => { this.onToggleCalendarOverlay() }} />
                    </View>
                </View>
                <View style={{ marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                    <View style={{ justifyContent: 'center', width: '85%' }}>
                        <Text style={{}}>End Date</Text>
                        <Text style={{ color: '#2980b9', textAlign: 'center', lineHeight: 35, fontSize: 18, marginRight: 1, borderColor: '#ededed', borderWidth: 2 }} >
                            {this.state.lastDay} {this.state.lastMonth} {this.state.lastYear}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 10, marginBottom: -10 }}>
                        <Icon name='md-calendar' color={'#2980b9'} size={40} onPress={() => { this.onToggleCalendarOverlay2() }} />
                    </View>
                </View>

                <View style={this.dynamicMargin()}>
                    {(this.state.genIndicator == false) && (<TouchableOpacity onPress={() => { this.onGenerate0(); }}>
                        <View>
                            <Image
                                source={{
                                    uri:
                                        'https://firebasestorage.googleapis.com/v0/b/wbslinux.appspot.com/o/PDF.jpg?alt=media&token=e9aeba93-ce27-422f-bf59-8c069cd4cd7a',
                                }}
                                style={styles.ImageStyle}
                            />
                            <Text style={styles.texts}>Generate PDF</Text>
                        </View>
                    </TouchableOpacity>)}
                    {(this.state.genIndicator == true) && (<ActivityIndicator size={'large'} color={'#2980b9'} />)}
                </View>

                <View style={{}}>
                    <TouchableOpacity onPress={() => this.onOpenFile()}>
                        <Text style={styles.text}>{this.state.filePath}</Text>
                    </TouchableOpacity>
                </View>


                <Overlay isVisible={this.state.isCalendarOverlayVisible}
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


                <Overlay isVisible={this.state.isCalendarOverlay2Visible}
                    fullScreen={true}
                    onBackdropPress={() => { this.setState({ isCalendarOverlay2Visible: false }); }}
                    overlayStyle={{ height: 300, flex: 1, alignItems: 'center' }}
                    overlayBackgroundColor="#FFF"
                    width='95%'
                    height={300}
                    animationType={'slide'}>
                    <View style={{ flex: 1, paddingTop: '10%', width: '100%' }}>
                        <View style={styles.container}>
                            <CalendarPicker
                                onDateChange={this.onDateChange2}
                            />
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10, padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { this.onToggleCalendarOverlay2() }}>
                            <Text style={{ fontSize: 17, textAlign: 'center', color: '#2980b9' }}>OK</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{ marginTop: 10, padding: 10, width: '40%', marginBottom: 10 }}
                            onPress={() => { }}>
                            <Text style={{ fontSize: 17, textAlign: 'center', color: '#2980b9' }}>OK</Text>
                        </TouchableOpacity> */}
                    </View>
                </Overlay>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    MainContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ededed',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000',
    },
    text: {
        color: '#2980b9',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 16,
    },
    texts: {
        textAlign: 'center',
        fontSize: 25,
        marginTop: 16,
    },
    ImageStyle: {
        height: 150,
        width: 150,
        resizeMode: 'stretch',
    },
});




