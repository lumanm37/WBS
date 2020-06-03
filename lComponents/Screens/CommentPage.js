import React, { Component } from "react";
import firebase from 'react-native-firebase';
import { Card, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarPicker, { circle } from 'react-native-calendar-picker';
import moment from 'moment';
/*Example of Making PDF from HTML in React Native*/
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    FlatList,

} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


export default class CommentPage extends Component {
    static navigationOptions = {
        title: 'Add Remarks'
    }
    state = {

        date: '',
        day: '',
        month: '',
        year: '',
        noOfLines: '',
        text: '',
        height: '',
        chats: [],
        userName: '',
        currentTime: moment().format('kk:mm').toString(),
        projId: '',
        dateId: '',
        timeId: '',

    };

    componentDidMount() {
        const projId = this.props.navigation.getParam('projId', 'undefined')
        const dateId = this.props.navigation.getParam('dateId', 'undefined')
        const timeId = this.props.navigation.getParam('timeId', 'undefined')
        firebase.auth().onAuthStateChanged((user) => {
            firebase.firestore().collection('Users').doc(user.email).onSnapshot((querySnapshot) => {

                const firstName = querySnapshot.data().firstName
                const lastName = querySnapshot.data().lastName
                const userName = firstName + ' ' + lastName
                this.setState({ userName, projId, dateId, timeId })
            })
        })
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
            .collection('Tasks').doc(timeId).collection('Chats').onSnapshot((querySnapshot) => { this.setState({ chats: querySnapshot.docs }) })
    }


    onAddChat = async () => {
        const { text, projId, dateId, timeId, userName } = this.state
        const currentTime = moment().format('kk:mm:ss').toString()

        this.setState({ text: '' })

        await firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
            .collection('Tasks').doc(timeId).collection('Chats').doc(currentTime).set({
                userName,
                text,
                currentTime,
            })


    }




    monthConvert = (num) => {
        const name = ['err', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return name[num]
    }

    onDateChange = this.onDateChange.bind(this);

    onDateChange(date) {
        const month = this.monthConvert(date.format('M'))//converts eg 07 to July
        this.setState({
            selectedDate: date,
            date: date ? date.format('DD MM YYYY') : '',
            day: date ? date.format('DD') : '',
            month: date ? month : '',
            year: date ? date.format('YYYY') : ''
        });
    }

    onToggleCalendarOverlay = () => {
        this.setState({ isCalendarOverlayVisible: !this.state.isCalendarOverlayVisible })
    }

    render() {
        const { noOfLines, text, height, chats, userName } = this.state
        return (
            <View style={{ backgroundColor: 'silver', width: '100%', flex: 1, justifyContent: "flex-end", alignItems: 'center' }}>

                <View style={{ width: '90%' }}>
                    <FlatList
                        data={chats}
                        renderItem={({ item, index, }) =>
                            <Card containerStyle={styles.comment} >
                                <Text style={{ color: '#2980b9', fontWeight: 'bold' }}>{item.data().userName}</Text>
                                <Text style={styles.commentText}>{item.data().text}</Text>
                                <Text style={styles.commentTime}>{item.data().currentTime}</Text>

                            </Card>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                <View style={{ marginVertical: 5, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                    <View style={{ AmarginVertical: 5, width: '85%', alignItems: 'center' }}>
                        <TextInput
                            {...this.props}
                            multiline={true}
                            onChangeText={async (text) => {
                                await this.setState({ text });
                                // alert(this.state.text)
                            }}
                            onContentSizeChange={(event) => {
                                this.setState({ height: event.nativeEvent.contentSize.height })
                            }}
                            style={[styles.textInput, { height: Math.max(35, this.state.height) }]}
                            value={this.state.text} />
                    </View>
                    <View style={{ marginLeft: 5, marginBottom: 0 }}>
                        <Icon name='md-send' color={'#2980b9'} size={40}
                            onPress={() => { (this.state.text) && (this.onAddChat()) }} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2F4F4F',
        borderWidth: 1,
        borderColor: '#000',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 16,
    },
    textInput: {
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 50,
        marginRight: 1,
        borderColor: '#ededed',
        borderWidth: 2,
        width: '95%'
    },
    comment: {
        borderRadius: 5,
        // flexWrap: 'wrap',
        // alignContent: 'center',
        // justifyContent: 'center',
        // width: '95%',
        padding: 5,
        backgroundColor: '#fff',
        marginBottom: 5,
        // height: 40,
    },
    commentText: {
        paddingLeft: 10,
        // borderLeftWidth: 5,
        // borderLeftColor: '#2980b9',
        // fontWeight: 'bold',
        fontSize: 14,
        width: '90%',
    },

    commentTime: {
        paddingLeft: 5,
        textAlign: 'right',
        marginTop: 5,
        // borderLeftWidth: 5,
        // borderLeftColor: '#2980b9',
        // fontWeight: 'bold',
        fontSize: 12,
        // width: '90%',

    }
}
);


