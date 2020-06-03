import React, { Component } from "react";
import { Text, View, FlatList, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-elements";
import firebase from "react-native-firebase";
import { Overlay } from 'react-native-elements';
import { UnitBudget } from '../UnitProject';
import Icon from 'react-native-vector-icons/AntDesign'
import ProgressCircle from 'react-native-progress-circle'



class Dashboard extends Component {
    static navigationOptions = {
        title: 'Project Analysis',
        headerStyle: {
            backgroundColor: '#2980b9'
        }
    }





    componentDidMount = () => {
        const role = this.props.navigation.getParam('role', 'undefined')
        const userName = this.props.navigation.getParam('userName', 'undefined')
        const item = this.props.navigation.getParam('item', 'undefined');//params from unitProject
        const id = this.props.navigation.getParam('id', 'undefined');
        const jobId = this.props.navigation.getParam('jobId', 'undefined');
        this.setState({ id, item, userName, jobId, role });
        firebase.firestore().collection('Projects').doc(id).onSnapshot((querySnapshot) => {
            console.log(querySnapshot)
            if (querySnapshot.exists) {
                this.setState({
                    PCname: querySnapshot ? querySnapshot.data().PC : '',
                    PMname: querySnapshot ? querySnapshot.data().PM : '',
                    SEname: querySnapshot ? querySnapshot.data().SE : '',
                    technicians: querySnapshot.data().technicians ? querySnapshot.data().technicians : [],
                })
            }
        })

    }

    state = {
        userName: '',
        PCname: '',
        PMname: '',
        SEname: '',
        id: '',
        jobId: '',
        role: '',
        budget: [],
        item: '',
        isOverlayVisible: false,
        reportTypeOverlay: false,
        DeletedProject: '',
        technicians: [],
    }

    onToggleOverlay = () => {
        this.setState({ isOverlayVisible: !this.state.isOverlayVisible })
    }
    onToggleReportType = () => {
        this.setState({ reportTypeOverlay: !this.state.reportTypeOverlay })
    }

    onDelete = () => {
        const { item, DeletedProject } = this.state
        if (DeletedProject == item.name) {
            firebase.firestore().collection('Projects').doc(this.state.id).delete()
                .then(() => { this.onToggleOverlay(); this.props.navigation.navigate('Dashbod'); })
                .catch((error) => { alert(error.message) })
        }
    }

    render() {

        const { item, id, jobId, budget, role, userName, PCname, PMname, SEname } = this.state
        const progressVal = this.props.navigation.getParam('progressVal', 'undefined')
        parseInt(progressVal)
        return (
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ededed' }}>
                    <View style={{ flex: 5, borderTopWidth: 2, borderTopColor: '#ededed' }}>
                        <Card containerStyle={{ borderRadius: 10 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', backgroundColor: '#2980b9', borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>Project Profile</Text>
                            <Text style={{ marginBottom: 5, }}><Text style={{ fontWeight: 'bold' }}>Project ID: </Text><Text>{jobId}</Text></Text>
                            <Text style={{ marginBottom: 5, }}><Text style={{ fontWeight: 'bold' }}>Project Name: </Text><Text>{item.name}</Text></Text>
                            <Text style={{ marginBottom: 5, }}><Text style={{ fontWeight: 'bold' }}>Project Location: </Text><Text>{item.Location}</Text></Text>
                            <Text style={{ marginBottom: 5, }}><Text style={{ fontWeight: 'bold' }}>Duration: </Text><Text>{item.Duration}</Text></Text>
                            <Text style={{ marginBottom: 5, }}><Text style={{ fontWeight: 'bold' }}>Description: </Text><Text>{item.Description}</Text></Text>
                            <Text></Text>
                        </Card>
                        <Card containerStyle={{ borderRadius: 10 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', backgroundColor: '#2980b9', borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>Client</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Name: </Text><Text>{item.ClientName}</Text></Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Address: </Text><Text>{item.ClientAddress}</Text></Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Email: </Text><Text>{item.ClientEmail}</Text></Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Tel no: </Text><Text>{item.ClientTel}</Text></Text>
                            <Text></Text>
                        </Card>
                        <Card containerStyle={{ borderRadius: 10 }}>
                            <Text style={{ textAlign: 'center', color: '#fff', backgroundColor: '#2980b9', borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>Project Team</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Project Consultant: </Text><Text>{item.PC}</Text></Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Project Manager: </Text><Text>{item.PM}</Text></Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Site Engineer: </Text><Text>{item.SE}</Text></Text>
                        </Card>

                        <Card containerStyle={{ borderRadius: 10 }}>
                            <View>
                                <Text style={{ textAlign: 'center', color: '#fff', backgroundColor: '#2980b9', borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>Personnel</Text>

                                {(this.state.technicians.length !== 0) && (this.state.technicians.map((item, index) =>
                                    <View key={index}>
                                        <Text key={index} style={styles.projectT}>{item.name}</Text>
                                    </View>
                                ))}

                            </View>

                        </Card>
                        <Card containerStyle={{ borderRadius: 10 }}>
                            <View>
                                <Text style={{ marginBottom: 10, textAlign: 'center', color: '#fff', backgroundColor: '#2980b9', borderRadius: 10, fontSize: 18, fontWeight: 'bold' }}>Status</Text>

                                <ProgressCircle
                                    percent={progressVal}
                                    radius={100}
                                    borderWidth={50}
                                    color="#2980b9"//progress color
                                    shadowColor="#fff"
                                    bgColor="#999"
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>{progressVal}%</Text>
                                </ProgressCircle>



                            </View>

                        </Card>






                    </View>
                    <View style={{ flex: 1, marginVertical: 20, width: '100%', flexDirection: 'row', justifyContent: 'center', alignContent: 'space-between' }}>
                        <TouchableOpacity style={[styles.butnView, { borderBottomLeftRadius: 50, borderTopLeftRadius: 50 }]}
                            onPress={() => (this.state.role == 'ADMIN') && (this.props.navigation.navigate('EditProject', { item, id, progressVal }))}>
                            <Text style={styles.buttnText}>Edit Project</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.butnView, { marginHorizontal: 2 }]}
                            onPress={() => this.props.navigation.navigate('AppTab', { id, role, userName, PCname, PMname, SEname })}>
                            <Text style={styles.buttnText}>Tasks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.butnView, { borderBottomRightRadius: 50, borderTopRightRadius: 50 }]}
                            onPress={() => (this.state.role == 'ADMIN') && (this.onToggleOverlay())}>
                            <Text style={styles.buttnText}>Delete Project</Text>
                        </TouchableOpacity>

                    </View>


                    <View style={{ flex: 1, marginVertical: 5, width: '100%', flexDirection: 'row', justifyContent: 'center', alignContent: 'space-between' }}>
                        <TouchableOpacity style={[styles.butnView, { width: '40%', borderWidth: 0, borderColor: '#fff', backgroundColor: '#2980b9', borderBottomLeftRadius: 50, borderTopLeftRadius: 50 }]}
                            onPress={() => this.props.navigation.navigate('Attendance', { item, projId: id })}>
                            <Text style={[styles.buttnText, { color: '#fff' }]}>Attendance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.butnView, { width: '40%', borderWidth: 0, borderColor: '#fff', backgroundColor: '#2980b9', borderBottomRightRadius: 50, borderTopRightRadius: 50 }]}
                            onPress={() => this.onToggleReportType()}>
                            <Text style={[styles.buttnText, { color: '#fff' }]}>Report</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{ flex: 3, height: 400, marginHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderTopWidth: 2, borderColor: '#ededed' }}>
                        <Text>Graphs of Budget and schedule will be here</Text>
                    </View> */}


                    <Overlay isVisible={this.state.isOverlayVisible}
                        fullScreen={true}
                        overlayStyle={{ flex: 1, height: '50%', borderRadius: 50, justifyContent: 'center' }}
                        overlayBackgroundColor="#FFF"
                        onBackdropPress={async () => { await this.setState({ isOverlayVisible: false }); }}
                        width='80%'
                        height='50%'
                        animationType={'fade'}>
                        <View style={{ flex: 1, height: '50%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Confirm that you want to delete this project by typing below its name: {item.name} </Text>
                            <TextInput
                                onChangeText={(DeletedProject) => this.setState({ DeletedProject })}
                                placeholder='Project name'
                            />

                            <TouchableOpacity style={{ marginTop: 10, borderRadius: 50, backgroundColor: '#2980b9', padding: 10, width: '90%', marginBottom: 10 }}
                                onPress={() => { this.onToggleOverlay() }}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ marginTop: 10, borderRadius: 50, backgroundColor: '#2980b9', padding: 10, width: '90%', marginBottom: 10 }}
                                onPress={() => { this.onDelete() }}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>Confirm Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Overlay>

                    <Overlay
                        fullScreen={true}
                        isVisible={this.state.reportTypeOverlay}
                        windowBackgroundColor={'#ffFFFFFF'}
                        onBackdropPress={async () => { await this.setState({ reportTypeOverlay: false }); }}
                        overlayStyle={{ width: '100%' }}
                        animationType={'fade'}
                        containerStyle={{ width: '100%' }}
                    >

                        <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                            <View style={{ width: '100%', flex: 1, backgroundColor: '#2980b9', flexDirection: 'row' }}>
                                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', }}>
                                    <TouchableOpacity onPress={() => this.onToggleReportType()}>
                                        < Icon name='back' color={'#fff'} size={35} style={{ marginRight: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity style={{}}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>SELECT REPORT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('Report', { projId: id }); this.onToggleReportType() }}>
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        flexDirection: 'row',
                                        padding: 20,
                                        paddingRight: 100,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#ededed'
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#2980b9',
                                        }}>
                                            Planned Vrs Actual Work Progress</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('Report2', { projItem: item, projId: id }); this.onToggleReportType() }}>
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        flexDirection: 'row',
                                        padding: 20,
                                        paddingRight: 100,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#ededed'
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#2980b9',
                                        }}>
                                            Personnel and Working Hours</Text>
                                    </View>
                                </TouchableOpacity>


                                {/* <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('Report3', { projItem: item, projId: id }); this.onToggleReportType() }}>
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        flexDirection: 'row',
                                        padding: 20,
                                        paddingRight: 100,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#ededed'
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#2980b9',
                                        }}>
                                            Status Report</Text>
                                    </View>
                                </TouchableOpacity> */}
                            </View>

                        </View>
                    </Overlay>



                </View>
            </ScrollView >
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
        width: '100%',
        alignItems: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        flexDirection: 'row',
        padding: 20,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed'
    },

    projectT: {
        // paddingLeft:20,
        // borderLeftWidth:10,
        // borderLeftColor:'#2980b9',
        // fontWeight:'bold',
        // fontSize:15
        textAlign: 'center',
        color: '#2980b9',

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
export default Dashboard;
