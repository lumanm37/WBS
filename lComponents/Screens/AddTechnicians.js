import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import firebase from 'react-native-firebase';
import { CheckBox } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';
// import CalendarPicker, { circle } from 'react-native-calendar-picker';
// import moment from 'moment';
// import { UnitTaskDate } from '../UnitProject';



export default class AddTechnician extends Component {
    static navigationOptions = {
        title: 'Add Personnel to Project',
    }



    componentDidMount() {
        // const PCname = this.props.navigation.getParam('PCname', 'undefined')
        // const PMname = this.props.navigation.getParam('PMname', 'undefined')
        // const SEname = this.props.navigation.getParam('SEname', 'undefined')
        // const role = this.props.navigation.getParam('role', 'undefined')
        // const userName = this.props.navigation.getParam('userName', 'undefined')
        const projId = this.props.navigation.getParam('projId', 'undefined')
        // firebase.firestore().collection('Activities').doc(projId).collection('Outstanding')
        //     .where('noOfTasks', '>', 0).orderBy('noOfTasks').onSnapshot(this.onUpdate)
        // this.setState({ projId, role, userName, PCname, PMname, SEname })

        firebase.firestore().collection('Resources').onSnapshot((querySnapshot) => {
            this.setState({ projId, technicians: querySnapshot.docs ? querySnapshot.docs : [] })
        })

        firebase.firestore().collection('Projects').doc(projId).onSnapshot((querySnapshot) => {

            let arr = []
            if (querySnapshot.data().technicians) {
                querySnapshot.data().technicians.map((item, key) => {
                    let obj = item.name;
                    arr.push(obj)
                })
                this.setState({
                    sTechnicians: arr,
                })
            }
            else { this.setState({ sTechnicians: [] }) }
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
        sTechniciansObj: [],
        loading: false,
    }





    checkTheBox(name, checked) {
        if (checked == true) {
            const sTechnicians = this.state.sTechnicians.filter((technician) => technician !== name)
            const sTechniciansString = this.state.sTechniciansString.replace(name + ',  ', '')
            this.setState({ sTechnicians, sTechniciansString })
        }
        else {
            const sTechnicians = [...this.state.sTechnicians, name]
            const sTechniciansString = this.state.sTechniciansString + name + ','
            this.setState({ sTechnicians, sTechniciansString })
        }
    }

    onSavePersonnel = async () => {
        this.setState({ loading: true })
        const { projId, sTechnicians } = this.state
        let arr = []
        sTechnicians.map((item, key) => {
            let obj = { 'name': item };
            arr.push(obj)
        })

        await new Promise(resolve => setTimeout(resolve, 1000))
        firebase.firestore().collection('Projects').doc(projId).set({ 'technicians': arr }, { merge: true })
        this.setState({ loading: false })
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{ flex: 1, width: '100%' }}>

                <TouchableOpacity style={{ backgroundColor: '#2980b9', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.props.navigation.navigate('Resources')}>
                    <View>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Add New Resource</Text>
                    </View>
                </TouchableOpacity>


                <View style={{ flex: 6 }}>
                    <ScrollView>
                        {this.state.technicians.map((item, index) => {
                            const name = item.data().firstName + ' ' + item.data().lastName
                            const checked = this.state.sTechnicians.includes(name);
                            return (
                                <View key={index}>
                                    <CheckBox
                                        title={name}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={checked}
                                        onPress={() => { this.checkTheBox(name, checked) }}
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
                    onPress={() => this.onSavePersonnel()}>
                    <View>

                        {(this.state.loading == true) && (<ActivityIndicator size='large' color='#fff' />)}
                        {(this.state.loading == false) && (<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Save </Text>)}
                    </View>
                </TouchableOpacity>

            </View>
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





