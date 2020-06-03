/*Example of Making PDF from HTML in React Native*/
import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Picker,
    Platform,
    ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';

import { Overlay } from 'react-native-elements';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default class ReportScreen3 extends Component {

    componentDidMount() {

        const projId = this.props.navigation.getParam('projId', 'undefined')
        const projItem = this.props.navigation.getParam('projItem', 'undefined')
        this.setState({ projId, projItem })
        //     firebase.firestore().collection('Projects').doc(projId).get()
        //         .then((doc) => this.setState({ projItem: doc.data(), projId }))
        // }
        // firebase.firestore().collection('Projects').doc(projId).collection('Clocking')
        //         .where('dateStamp', '>=', firstTimeStamp).where('dateStamp', '<=', lastTimeStamp).onSnapshot((querySnapshot) => {
        //             this.setState({ dates: querySnapshot.docs })
        //             querySnapshot.docs.map(async (val, key) => {
    }


    state = {
        projId: '',
        projItem: '',
        filePath: '',
        isCalendarOverlay2Visible: false,
        isCalendarOverlayVisible: false,
        dates: [],
        firstTimeStamp: 0,
        selectedDate1: '',
        firstDate: '',
        date: '',
        day: '',
        month: '',
        year: '',
        lastTimeStamp: 0,
        selectedDate2: '',
        lastDate: '',
        lastDay: '',
        lastMonth: '',
        lastYear: '',
        genIndicator: false,
        addPerson: '',
        taskSummaryDates: [],
        report2String: '',
        addTaskDetail: '',
        cellColor: '',
        taskStatus: '',
    };

    constructor(props) {
        super(props);
    }

    dynamicMargin = () => {
        if (this.state.genIndicator == true) return { marginTop: 70 }
    }

    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
    }

    onToggleCalendarOverlay2 = () => {
        this.setState({ isCalendarOverlay2Visible: !this.state.isCalendarOverlay2Visible })
    }

    onDateChange = this.onDateChange.bind(this);
    onDateChange2 = this.onDateChange2.bind(this);

    monthConvert = (num) => {
        const name = ['err', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }


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
        // const dat = new Date('02 Dec 2019')

        // alert(moment().unix() + '---' + dat.getTime() + '----' + date.format('x'))


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
        // alert(date.format('x'))

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
        const { projId, projItem, firstDate, lastDate } = this.state
        let options = {
            //Content to print

            html: '<h1 style="text-align: center;"><strong>Project Report</strong></h1>' +
                '<p style="text-align:left;"> <strong> project Name  :</strong> <span>' + projId + '</span> </p>' +
                '<p style="text-align:left;"> <strong>Project Loction:</strong> <span>' + projItem.Location + '</span> </p>' +
                '<p style="text-align:left;"> <strong>Client Name:</strong> <span>' + projItem.ClientName + '</span></p>' +
                '<p style="text-align:left;"> <strong>Description:</strong> <span>' + projItem.Description + '</span></p>' +
                '<p style="text-align:left;"><strong>Report Date:</strong> <span>' + firstDate + ' - ' + lastDate + '</span> </p>' +
                '<h3 style="text-align: center;">Personnel and Working Hours<h3>' +

                '<table style="width:100%; border-collapse:collapse">' +

                '<tr>' +
                '<th style="border:1px solid black;" >' + 'Employee' + '</th>' +
                '<th style="border:1px solid black;" >' + 'Total Hours Worked' + '</th>' +
                '</tr>' + this.state.addPerson +

                // '<tr>' +
                // '<td style="border:1px solid black;text-align:center">' + 'Lukman Mohammed' + '</th>' +
                // '<td style="border:1px solid black;text-align:center">' + '5' + '</th>' +
                // '</tr>' +

                '</table><br><br>' + this.state.report2String,
            fileName: 'test',
            //File directory
            directory: 'docs',
        };
        let file = await RNHTMLtoPDF.convert(options);
        console.log(file.filePath);
        this.setState({ filePath: file.filePath, genIndicator: false });
    }


    onOpenFile = () => {
        const path = this.state.filePath
        FileViewer.open(path)
            .then(() => {
                // alert('ok')
            })
            .catch(error => {
                alert(error.message)
            });
    }



    onGenerate = () => {
        this.setState({ genIndicator: true })
        const { projId, firstTimeStamp, lastTimeStamp } = this.state
        // alert(projId + '  ' + firstTimeStamp + '  ' + lastTimeStamp)
        const dates = [[{ 'name': 'luk', hours: 5 }], [{ name: 'lukkk', hours: 4 }]]
        firebase.firestore().collection('Projects').doc(projId).collection('Clocking')
            .where('dateStamp', '>=', parseInt(firstTimeStamp)).where('dateStamp', '<=', parseInt(lastTimeStamp)).onSnapshot(async (querySnapshot) => {
                this.setState({ dates: querySnapshot.docs })

                console.log(querySnapshot.docs)
                let merged = []
                for (const val of querySnapshot.docs) {
                    // alert(val[0].name)
                    // await new Promise(resolve => setTimeout(resolve, 5000))
                    merged = merged.concat(val.data().attendance)
                }
                console.log(merged)

                let summary = []
                for (i = 0; i < merged.length; i += 0) {
                    console.log('mergelength', merged.length)
                    let firstName = merged[0].name
                    let hoursWorked = 0

                    merged.map((val, index) => {
                        //filter here
                        if (val.name == firstName) {
                            hoursWorked += (val.hours == undefined) ? 0 : val.hours
                        }
                    })

                    summary = [...summary, { 'name': firstName, 'hours': hoursWorked }]
                    console.log('summary', summary)

                    this.setState({
                        addPerson: this.state.addPerson +
                            '<tr>' +
                            '<td style="border:1px solid black;text-align:center">' + firstName + '</th>' +
                            '<td style="border:1px solid black;text-align:center">' + hoursWorked + '</th>' +
                            '</tr>'
                    })

                    merged = merged.filter((item) => item.name !== firstName)
                    console.log('merged after filter', merged)

                }

                // merged.map((val, key) => {

                // })
                this.onGenerate2()
                await new Promise(resolve => setTimeout(resolve, 2000))
                this.askPermission();

            })
    }

    onGenerate2 = () => {
        const { projId, firstTimeStamp, lastTimeStamp } = this.state
        // alert(projId + '  ' + firstTimeStamp + '  ' + lastTimeStamp)
        // const dates = [[{ 'name': 'luk', hours: 5 }], [{ name: 'lukkk', hours: 4 }]]

        this.setState({
            report2String:
                '<h3 style="text-align: center;"><strong>Activities Summary</strong></h3>' +
                '<table style="width:80%; border-collapse:collapse">' +
                '<tr>' +
                '<th style="border:1px solid black;" >' + 'Task' + '</th>' +
                '<th style="border:1px solid black;" >' + 'Time Spent(Days)' + '</th>' +
                '<th style="border:1px solid black;" >' + 'Achieved %' + '</th>' +
                '<th style="border:1px solid black;" >' + 'Status' + '</th>' +

                '</tr>'
        })
        console.log(this.state.report2String)
        firebase.firestore().collection('Activities').doc(projId).collection('Summary')
            .where('dateStamp', '>=', firstTimeStamp).where('dateStamp', '<=', lastTimeStamp).onSnapshot(async (querySnapshot) => {
                console.log('dates2', querySnapshot.docs)
                for (const dateVal of querySnapshot.docs) {

                    this.onGenerate3(dateVal);
                    // await new Promise(resolve => setTimeout(resolve, 2000))
                    // this.setState({ addedTask: this.state.addedTask + '</table> <br><br>' })
                    // console.log(dateArr)
                    // console.log('check')
                }
            })


    }

    onGenerate3 = (dateVal) => {
        const { projId } = this.state
        firebase.firestore().collection('Activities').doc(projId).collection('Summary').doc(dateVal.id)
            .collection('All Activities').onSnapshot(async (querySnapshot) => {
                // await this.setState({ taskSnapshot: querySnapshot.docs }) 

                querySnapshot.docs.map((task, key) => {
                    // alert(querySnapshot.docs.length + '  ' + key)
                    // if (querySnapshot.docs.length == key + 1) {


                    if (task.data().achieved == 100) { this.setState({ cellColor: "#badc58", taskStatus: 'COMPLETED' }) }
                    else if (task.data().achieved > 0 && task.data().achieved < 100) { this.setState({ cellColor: "#ffeaa7", taskStatus: 'ONGOING' }) }
                    else { this.setState({ cellColor: "#ffffff", taskStatus: 'NOT STARTED' }) }

                    const addOn = '<tr>' +
                        '<td bgcolor=' + this.state.cellColor + '  style="border:1px solid black;">' + task.data().title + '</td>' +
                        '<td style="border:1px solid black;text-align:center" >' + task.data().noOfDays + '</th>' +
                        '<td style="border:1px solid black;text-align:center" >' + task.data().achieved + '</th>' +
                        '<td style="border:1px solid black;text-align:center" >' + this.state.taskStatus + '</th>' +
                        '</tr>'
                    this.setState({ report2String: this.state.report2String + addOn })

                    // }
                    // else {
                    //     const addOn = '<tr>' +
                    //         '<td style="border:1px solid black;" >' + task.data().title + '</th>' +
                    //         '<td style="border:1px solid black;text-align:center" >' + task.data().noOfDays + '</th>' +
                    //         '<td style="border:1px solid black;text-align:center" >' + task.data().achieved + '</th>' +
                    //         '<td style="border:1px solid black;text-align:center" >' + '' + '</th>' +
                    //         '</tr>'
                    //     this.setState({ report2String: this.state.report2String + addOn })

                    // }

                })
                console.log(this.state.report2String)
            })
    }


    render() {
        return (
            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: '80%' }}>
                    <View style={{ justifyContent: 'center', width: '85%' }}>
                        <Text style={{ marginBottom: 20, fontSize: 18, color: '#2980b9', fontWeight: 'bold' }}>REPORT: Personnel and Working Hours</Text>
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
                    {(this.state.genIndicator == false) && (<TouchableOpacity onPress={() => { this.onGenerate(); }}>
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