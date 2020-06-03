import React from 'react';
import {
    SafeAreaView,
    TextInput, View, Text, FlatList,
    Button, Modal, ScrollView, TouchableOpacity, StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Overlay } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { UnitIncident, UnitChange, UnitIssue, UnitTqnc, UnitPerfomance } from '../UnitIncident';
import Collapsible from 'react-native-collapsible';

const validationScheme = yup.object().shape({
    PC: yup.string().required('*'),
    PM: yup.string().required('*'),
    SE: yup.string().required('*'),

});

const FormInput = ({ label, formikProps, formikKey, ...rest }) => (
    <View style={{ width: '97%', marginTop: 20 }}>
        <Text style={{ color: '#3498db' }}>{label}</Text>
        <TextInput
            style={{ borderColor: '#ededed', borderWidth: 2, width: '100%', height: 40, padding: 10, marginBottom: 6 }}
            onChangeText={formikProps.handleChange({ formikKey })}
            {...rest}
        />
        <Text style={{ textAlign: 'left', color: 'red' }}>{formikProps.errors.formikKey}</Text>
    </View>
);

const FormNavBotton = ({ bottonText, ...rest }) => (
    <View style={{ width: '50%', marginTop: 20, }}>
        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '50%', marginBottom: 5 }}
            onPress={() => navigation.navigate(navScreen)}
            {...rest}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>{bottonText}</Text>
        </TouchableOpacity>
    </View>
);

const PerfIndicator = ({ label, accumulated, ...rest }) => (
    <View style={{ marginBottom: 20 }}>
        <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
        <View style={{ flexDirection: 'row' }}>
            <View>
                <Text style={{ color: '#2980b9' }}>current</Text>
                <TextInput style={{ marginRight: 10, width: 100, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }}
                    {...rest}
                />
            </View>
            <View>
                <Text>Accumulated</Text>
                <Text style={{ paddingTop: 10, textAlign: 'center', height: 40, width: 100, borderWidth: 1, borderColor: 'silver', borderRadius: 5 }}>{accumulated}</Text>
            </View>
        </View>
    </View>
);


export default class Report extends React.Component {
    static navigationOptions = {
        title: 'Add Report'
    }

    componentDidMount = () => {
        const projId = this.props.navigation.getParam('projId', 'undefined')//project id from AddProjectScreen
        this.setState({ projId })
    }

    state = {
        date: this.Date,

        incidents: [],
        incidentDate: '',
        incident: '',
        actionTaken: '',
        isIncidentOverlay1Visible: false,
        isIncidentOverlay2Visible: false,

        changes: [],
        change: '',
        changeDescription: '',
        timeImpact: '',
        costImpact: '',
        isChangeOverlay1Visible: false,
        isChangeOverlay2Visible: false,

        issues: [],
        issue: '',
        issueActionTaken: '',
        issueRemark: '',
        isIssueOverlay1Visible: false,
        isIssueOverlay2Visible: false,

        tqncs: [],
        tqncDate: '',
        tqncNumber: '',
        tqncTaskDescription: '',
        tqncActionTaken: '',
        isTqncOverlay1Visible: false,
        isTqncOverlay2Visible: false,

        tqncs: [],
        tqncDate: '',
        tqncNumber: '',
        tqncTaskDescription: '',
        tqncActionTaken: '',
        isTqncOverlay1Visible: false,
        isTqncOverlay2Visible: false,

        performanceIndicators: '',
        numOfEmployees: '',
        workHours: '',
        nearMiss: '',
        firstAidTreatment: '',
        medicalTreatment: '',
        lostTimeInjury: '',
        workDaysLostToInjury: '',
        fireIncident: '',
        siteSafetyCompliance: '',
        nonSafetyCompliance: '',
        toolBoxMeeting: '',
        vehicleRelatedIncidents: '',
        theftIssues: '',
        isHsseOverlay2Visible: false,

        AperformanceIndicators: '',
        AnumOfEmployees: 10,
        AworkHours: '5',
        AnearMiss: '',
        AfirstAidTreatment: '',
        AmedicalTreatment: '',
        AlostTimeInjury: '',
        AworkDaysLostToInjury: '',
        AfireIncident: '',
        AsiteSafetyCompliance: '',
        AnonSafetyCompliance: '',
        AtoolBoxMeeting: '',
        AvehicleRelatedIncidents: '',
        AtheftIssues: '',

        collapsedMonday: true,
        collapsedTuesday: true,
        collapsedWednesday: true,
        collapsedThursday: true,
        collapsedFriday: true,
        collapsedSaturday: true,
        collapsedSunday: true,
        multipleSelect: false,
        isPwhOverlay2Visible: false,
    }


    toggleIncidentOverlay1 = () => {
        this.setState({ isIncidentOverlay1Visible: !this.state.isIncidentOverlay1Visible })
    }
    toggleIncidentOverlay2 = () => {
        this.setState({ isIncidentOverlay2Visible: !this.state.isIncidentOverlay2Visible })
    }
    toggleChangeOverlay1 = () => {
        this.setState({ isChangeOverlay1Visible: !this.state.isChangeOverlay1Visible })
    }
    toggleChangeOverlay2 = () => {
        this.setState({ isChangeOverlay2Visible: !this.state.isChangeOverlay2Visible })
    }
    toggleIssueOverlay1 = () => {
        this.setState({ isIssueOverlay1Visible: !this.state.isIssueOverlay1Visible })
    }
    toggleIssueOverlay2 = () => {
        this.setState({ isIssueOverlay2Visible: !this.state.isIssueOverlay2Visible })
    }
    toggleTqncOverlay1 = () => {
        this.setState({ isTqncOverlay1Visible: !this.state.isTqncOverlay1Visible })
    }
    toggleTqncOverlay2 = () => {
        this.setState({ isTqncOverlay2Visible: !this.state.isTqncOverlay2Visible })
    }
    toggleHsseOverlay2 = () => {
        this.setState({ isHsseOverlay2Visible: !this.state.isHsseOverlay2Visible })
    }
    togglePwhOverlay2 = () => {
        this.setState({ isPwhOverlay2Visible: !this.state.isPwhOverlay2Visible })
    }


    toggleMonday = () => {
        this.setState({ collapsedMonday: !this.state.collapsedMonday });
    };
    toggleTuesday = () => {
        this.setState({ collapsedTuesday: !this.state.collapsedTuesday });
    };
    toggleWednesday = () => {
        this.setState({ collapsedWednesday: !this.state.collapsedWednesday });
    };
    toggleThursday = () => {
        this.setState({ collapsedThursday: !this.state.collapsedThursday });
    };
    toggleFriday = () => {
        this.setState({ collapsedFriday: !this.state.collapsedFriday });
    };
    toggleSaturday = () => {
        this.setState({ collapsedSaturday: !this.state.collapsedSaturday });
    };
    toggleSunday = () => {
        this.setState({ collapsedSunday: !this.state.collapsedSunday });
    };

    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };



    onAddIncident = () => {
        const incidents = [...this.state.incidents, {
            'date': this.state.incidentDate,
            'incident': this.state.incident,
            'actionTaken': this.state.actionTaken,
        }]
        this.setState({ incidents })
        this.toggleIncidentOverlay2();
    }

    onAddChange = () => {
        const changes = [...this.state.changes, {
            'description': this.state.changeDescription,
            'timeImpact': this.state.timeImpact,
            'costImpact': this.state.costImpact,
        }]
        this.setState({ changes })
        this.toggleChangeOverlay2();
    }

    onAddIssue = () => {
        const issues = [...this.state.issues, {
            'issue': this.state.issue,
            'actionTaken': this.state.issueActionTaken,
            'remark': this.state.issueRemark,
        }]
        this.setState({ issues })
        this.toggleIssueOverlay2();
    }

    onAddTqnc = () => {
        const tqncs = [...this.state.tqncs, {
            'tqncDate': this.state.tqncDate,
            'tqncNumber': this.state.tqncNumber,
            'tqncTaskDescription': this.state.tqncTaskDescription,
            'tqncActionTaken': this.state.tqncActionTaken,
        }]
        this.setState({ tqncs })
        this.toggleTqncOverlay2();
    }

    Date = () => {
        const d = new Date();
        return (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
    }

    render() {
        const { incidents, changes, issues, tqncs } = this.state
        const { ...s } = this.state
        return (

            <ScrollView>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Formik
                        initialValues={{}}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values))
                            navigation.navigate('AddProject')
                        }}
                        validationSchema={validationScheme}
                    >
                        {formikProps => (
                            <React.Fragment>

                                <View style={{ flex: 1, marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderRadius: 20, borderColor: '#3498db' }}>

                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>Weekly Project Report</Text>

                                    <Text>
                                        <Date />
                                    </Text>


                                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleHsseOverlay2()}>
                                        <Text style={{ borderTopLeftRadius: 50, borderBottomLeftRadius: 50, borderColor: '#ededed', borderBottomWidth: 2, textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>HEALTH SAFETY SECURITY ENVIRONMENT (HSSE) PROGRESS AND PLAN </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleIncidentOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>PLANNED VS ACTUAL WORK PROGRESS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.togglePwhOverlay2()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>PERSONNEL and WORKING HOURS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleTqncOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>TECHNICAL QUERIES /NON-CONFORMANCE ISSUES</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleIncidentOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>SAFETY INCIDENT LOG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleChangeOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>CHANGE LOG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleIssueOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>ISSUES /QUERIES LOG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor: '#ededed', borderBottomWidth: 2, borderRadius: 3, padding: 10, width: '97%', marginBottom: 5 }}
                                        onPress={() => this.toggleIncidentOverlay1()}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9', fontSize: 20 }}>PROGRESS PICTURES</Text>
                                    </TouchableOpacity>

                                </View>




                                <Overlay isVisible={this.state.isIncidentOverlay1Visible}  ///////incident overlay 1
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={{ flex: 1, marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderRadius: 20, borderColor: '#3498db' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>SAFETY INCIDENT LOG</Text>

                                        <Text>
                                            <Date />
                                        </Text>

                                        <View style={{ width: '95%', }}>
                                            <FlatList
                                                data={incidents}
                                                renderItem={({ item }) =>
                                                    <UnitIncident deleteDeliverable={() => this.deleteDeliverable(item)} key={item.number} keyval={item.number} item={item} />}
                                                keyExtractor={(index) => index.toString()}
                                            />
                                        </View>

                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.toggleIncidentOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Save or Exit'
                                            onPress={() => this.toggleIncidentOverlay1()}
                                        />

                                    </View>
                                </Overlay>



                                <Overlay isVisible={this.state.isIncidentOverlay2Visible}  /////incident overlay 2
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={{ marginTop: 10, alignItems: 'center', }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>SAFETY INCIDENT LOG</Text>
                                        <FormInput
                                            label="Date of Incident"
                                            formikProps={formikProps}
                                            formikKey='Date'
                                            onChangeText={(incidentDate) => { this.setState({ incidentDate }) }}
                                            value={this.state.date}
                                            placeholder={'DD/MM/YY'}
                                        />
                                        <FormInput
                                            label="Incident"
                                            formikProps={formikProps}
                                            formikKey='Incident'
                                            onChangeText={(incident) => { this.setState({ incident }) }}

                                            placeholder='tell us what happened'
                                        />
                                        <FormInput
                                            label="Action Taken"
                                            formikProps={formikProps}
                                            formikKey='ActionTaken'
                                            onChangeText={(actionTaken) => { this.setState({ actionTaken }) }}

                                            placeholder='what did you do about it'
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Cancel'
                                            onPress={() => this.toggleIncidentOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.onAddIncident()}
                                        />
                                    </View>
                                </Overlay>







                                <Overlay isVisible={this.state.isChangeOverlay1Visible} /////change overlay 1
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={{ flex: 1, marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderRadius: 20, borderColor: '#3498db' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>CHANGE LOG</Text>

                                        <Text>
                                            <Date />
                                        </Text>

                                        <View style={{ width: '95%', }}>
                                            <FlatList
                                                data={changes}
                                                renderItem={({ item }) =>
                                                    <UnitChange deleteDeliverable={() => this.deleteDeliverable(item)} key={item.number} keyval={item.number} item={item} />}
                                                keyExtractor={(index) => index.toString()}
                                            />
                                        </View>

                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.toggleChangeOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Save or Exit'
                                            onPress={() => this.toggleChangeOverlay1()}
                                        />

                                    </View>
                                </Overlay>



                                <Overlay isVisible={this.state.isChangeOverlay2Visible}   /////change overlay 2
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'fade'}>
                                    <View style={{ marginTop: 10, alignItems: 'center', }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>CHANGE LOG</Text>
                                        <FormInput
                                            label="Description"
                                            formikProps={formikProps}
                                            formikKey='Description'
                                            onChangeText={(changeDescription) => { this.setState({ changeDescription }) }}
                                            value={this.state.changeDescription}
                                            placeholder={'Describe the change'}
                                        />
                                        <FormInput
                                            label="Cost Impact"
                                            formikProps={formikProps}
                                            formikKey='Incident'
                                            onChangeText={(costImpact) => { this.setState({ costImpact }) }}
                                            placeholder='effect of change on cost of project'
                                        />
                                        <FormInput
                                            label="Time Impact"
                                            formikProps={formikProps}
                                            formikKey='timeImpact'
                                            onChangeText={(timeImpact) => { this.setState({ timeImpact }) }}
                                            placeholder='effect of change on schedule'
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Cancel'
                                            onPress={() => this.toggleChangeOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.onAddChange()}
                                        />
                                    </View>
                                </Overlay>




                                <Overlay isVisible={this.state.isIssueOverlay1Visible} /////issue overlay 1
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={{ flex: 1, marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderRadius: 20, borderColor: '#3498db' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>ISSUES/QUERIES LOG</Text>

                                        <Text>
                                            <Date />
                                        </Text>

                                        <View style={{ width: '95%', }}>
                                            <FlatList
                                                data={issues}
                                                renderItem={({ item }) =>
                                                    <UnitIssue deleteDeliverable={() => this.deleteDeliverable(item)} key={item.number} keyval={item.number} item={item} />}
                                                keyExtractor={(index) => index.toString()}
                                            />
                                        </View>

                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.toggleIssueOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Save or Exit'
                                            onPress={() => this.toggleIssueOverlay1()}
                                        />

                                    </View>
                                </Overlay>



                                <Overlay isVisible={this.state.isIssueOverlay2Visible}   /////issue overlay 2
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'fade'}>
                                    <View style={{ marginTop: 10, alignItems: 'center', }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>ISSUES/QUERIES LOG</Text>
                                        <FormInput
                                            label="Issue"
                                            formikProps={formikProps}
                                            formikKey='Description'
                                            onChangeText={(issue) => { this.setState({ issue }) }}
                                            value={this.state.issue}
                                            placeholder={''}
                                        />
                                        <FormInput
                                            label="Action Taken"
                                            formikProps={formikProps}
                                            formikKey='Inci'
                                            onChangeText={(costImpact) => { this.setState({ costImpact }) }}
                                            placeholder='what have you done about it'
                                        />
                                        <FormInput
                                            label="Remarks"
                                            formikProps={formikProps}
                                            formikKey='timeImpact'
                                            onChangeText={(timeImpact) => { this.setState({ timeImpact }) }}
                                            placeholder=''
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Cancel'
                                            onPress={() => this.toggleIssueOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.onAddIssue()}
                                        />
                                    </View>
                                </Overlay>




                                <Overlay isVisible={this.state.isTqncOverlay1Visible} /////tqnc overlay 1
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'fade'}>
                                    <View style={{ flex: 1, marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderRadius: 20, borderColor: '#3498db' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>TECHNICAL QUERIES /NON-CONFORMANCE ISSUES</Text>

                                        <Text>
                                            <Date />
                                        </Text>

                                        <View style={{ width: '95%', }}>
                                            <FlatList
                                                data={tqncs}
                                                renderItem={({ item }) =>
                                                    <UnitTqnc deleteDeliverable={() => this.deleteDeliverable(item)} key={item.number} keyval={item.number} item={item} />}
                                                keyExtractor={(index) => index.toString()}
                                            />
                                        </View>

                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.toggleTqncOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Save or Exit'
                                            onPress={() => this.toggleTqncOverlay1()}
                                        />

                                    </View>
                                </Overlay>



                                <Overlay isVisible={this.state.isTqncOverlay2Visible}   /////Tqnc overlay 2
                                    fullScreen={true}
                                    containerStyle={{ height: '90%', flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={{ marginTop: 10, alignItems: 'center', }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>TECHNICAL QUERIES /NON-CONFORMANCE ISSUES</Text>
                                        <FormInput
                                            label="Date"
                                            formikProps={formikProps}
                                            formikKey='Description'
                                            onChangeText={(tqncDate) => { this.setState({ tqncDate }) }}
                                            value={this.state.issue}
                                            placeholder={'DD/MM/YYYY'}
                                        />
                                        <FormInput
                                            label="TQ/NCR Number"
                                            formikProps={formikProps}
                                            formikKey='Inci'
                                            onChangeText={(tqncNumber) => { this.setState({ tqncNumber }) }}
                                            placeholder=''
                                        />
                                        <FormInput
                                            label="Task Description"
                                            formikProps={formikProps}
                                            formikKey='tqncTaskDesription'
                                            onChangeText={(tqncTaskDescription) => { this.setState({ tqncTaskDescription }) }}
                                            placeholder=''
                                        />
                                        <FormInput
                                            label="Action Taken"
                                            formikProps={formikProps}
                                            formikKey='tqncAcionTaken'
                                            onChangeText={(tqncAcionTaken) => { this.setState({ tqncAcionTaken }) }}
                                            placeholder=''
                                        />
                                        <FormNavBotton
                                            style={{ marginTop: -10, marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%' }}
                                            bottonText='Cancel'
                                            onPress={() => this.toggleTqncOverlay2()}
                                        />
                                        <FormNavBotton
                                            style={{ marginLeft: '0%', borderRadius: 3, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                                            bottonText='Add'
                                            onPress={() => this.onAddTqnc()}
                                        />
                                    </View>
                                </Overlay>



                                <Overlay isVisible={this.state.isHsseOverlay2Visible}   /////HSSE overlay 2
                                    fullScreen={true}
                                    containerStyle={{ height: '90%', flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <ScrollView style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2980b9' }}>HEALTH SAFETY SECURITY ENVIRONMENT (HSSE) PROGRESS AND PLAN</Text>
                                        </View>


                                        <PerfIndicator label={'Total number of Employees'}
                                            accumulated={parseInt(s.numOfEmployees) + parseInt(s.AnumOfEmployees)}
                                            onChangeText={(numOfEmployees) => { this.setState({ numOfEmployees }) }}
                                            value={this.state.numOfEmployees} />
                                        <PerfIndicator label={'Work hours'}
                                            accumulated={parseInt(s.workHours) + parseInt(s.AworkHours)}
                                            onChangeText={(workHours) => { this.setState({ workHours }) }}
                                            value={this.state.workHours} />
                                        <PerfIndicator label={'Near Miss'}
                                            accumulated={parseInt(s.nearMiss) + parseInt(s.AnearMiss)}
                                            onChangeText={(nearMiss) => { this.setState({ nearMiss }) }}
                                            value={this.state.nearMiss} />
                                        <PerfIndicator label={'First Aid Treatment'}
                                            accumulated={parseInt(s.firstAidTreatment) + parseInt(s.AfirstAidTreatment)}
                                            onChangeText={(firstAidTreatment) => { this.setState({ firstAidTreatment }) }}
                                            value={this.state.firstAidTreatment} />
                                        <PerfIndicator label={'Medical Treatment'}
                                            accumulated={parseInt(s.medicalTreatment) + parseInt(s.AmedicalTreatment)}
                                            onChangeText={(medicalTreatment) => { this.setState({ medicalTreatment }) }}
                                            value={this.state.medicalTreatment} />
                                        <PerfIndicator label={'Lost Time Injury'}
                                            accumulated={parseInt(s.lostTimeInjury) + parseInt(s.AlostTimeInjury)}
                                            onChangeText={(lostTimeInjury) => { this.setState({ lostTimeInjury }) }}
                                            value={this.state.lostTimeInjury} />
                                        <PerfIndicator label={'Work Days Lost to Injury'}
                                            accumulated={parseInt(s.workDaysLostToInjury) + parseInt(s.AworkDaysLostToInjury)}
                                            onChangeText={(workDaysLostToInjury) => { this.setState({ workDaysLostToInjury }) }}
                                            value={this.state.workDaysLostToInjury} />
                                        <PerfIndicator label={'Fire Incident'}
                                            accumulated={parseInt(s.fireIncident) + parseInt(s.AfireIncident)}
                                            onChangeText={(fireIncident) => { this.setState({ fireIncident }) }}
                                            value={this.state.fireIncident} />
                                        <PerfIndicator label={'Site Safety Compliance                     (PPE,Work Permit)'}
                                            accumulated={parseInt(s.siteSafetyCompliance) + parseInt(s.AsiteSafetyCompliance)}
                                            onChangeText={(siteSafetyCompliance) => { this.setState({ siteSafetyCompliance }) }}
                                            value={this.state.siteSafetyCompliance} />
                                        <PerfIndicator label={'Non-Safety Compliance'}
                                            accumulated={parseInt(s.nonSafetyCompliance) + parseInt(s.AnonSafetyCompliance)}
                                            onChangeText={(nonSafetyCompliance) => { this.setState({ nonSafetyCompliance }) }}
                                            value={this.state.nonSafetyCompliance} />
                                        <PerfIndicator label={'Tool Box Meeting'}
                                            accumulated={parseInt(s.toolBoxMeeting) + parseInt(s.AtoolBoxMeeting)}
                                            onChangeText={(toolBoxMeeting) => { this.setState({ toolBoxMeeting }) }}
                                            value={this.state.toolBoxMeeting} />
                                        <PerfIndicator label={'Vehicle Related Incident'}
                                            accumulated={parseInt(s.vehicleRelatedIncidents) + parseInt(s.AvehicleRelatedIncidents)}
                                            onChangeText={(vehicleRelatedIncidents) => { this.setState({ vehicleRelatedIncidents }) }}
                                            value={this.state.vehicleRelatedIncidents} />
                                        <PerfIndicator label={'Theft and/or Break-In Issues'}
                                            accumulated={parseInt(s.theftIssues) + parseInt(s.AtheftIssues)}
                                            onChangeText={(theftIssues) => { this.setState({ theftIssues }) }}
                                            value={this.state.theftIssues} />

                                        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#2980b9', padding: 10, marginBottom: 5 }}
                                            onPress={() => this.toggleHsseOverlay2()}>
                                            <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}> Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#2980b9', padding: 10, marginBottom: 5 }}
                                            onPress={() => this.toggleHsseOverlay2()}>
                                            <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}> Save</Text>
                                        </TouchableOpacity>

                                    </ScrollView>
                                </Overlay>



                                <Overlay isVisible={this.state.isPwhOverlay2Visible}  /////Personel n Working Hrs overlay 2
                                    fullScreen={true}
                                    containerStyle={{ flex: 1, borderRadius: 3, justifyContent: 'center' }}

                                    overlayBackgroundColor="#FFF"
                                    width='auto'
                                    height='auto'
                                    animationType={'slide'}>
                                    <View style={styles.container}>
                                        <ScrollView contentContainerStyle={{}}>
                                            <Text style={styles.title}>Personnel and Working Hours</Text>

                                            <TouchableOpacity onPress={this.toggleMonday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Monday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedMonday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Holiday?</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Total Hours Worked</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>


                                            <TouchableOpacity onPress={this.toggleTuesday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Tuesday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedTuesday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Holiday?</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Total Hours Worked</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>


                                            <TouchableOpacity onPress={this.toggleWednesday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Wednesday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedWednesday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Holiday?</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Total Hours Worked</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>


                                            <TouchableOpacity onPress={this.toggleThursday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Thursday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedThursday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Holiday?</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Total Hours Worked</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>



                                            <TouchableOpacity onPress={this.toggleFriday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Friday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedFriday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Holiday?</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Total Hours Worked</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>



                                            <TouchableOpacity onPress={this.toggleSaturday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Saturday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedSaturday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Weekend Hours</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>



                                            <TouchableOpacity onPress={this.toggleSunday}>
                                                <View style={styles.header}>
                                                    <Text style={styles.headerText}>Sunday</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <Collapsible collapsed={this.state.collapsedSunday} align="center" style={styles.mainContainer}>
                                                <View style={styles.content}>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Present</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Absent</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Start</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Working Time,Close</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Weekend Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Overtime Hours</Text>
                                                    <Text style={{ fontSize: 15, marginBottom: 15, color: '#2980b9' }}>Persons Who worked Overtime</Text>
                                                </View>
                                                <View>
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                    <TextInput style={{ marginLeft: 0, marginBottom: 5, width: 65, height: 30, borderWidth: 2, borderColor: '#2980b9', borderRadius: 5 }} />
                                                </View>
                                            </Collapsible>

                                            <TouchableOpacity
                                                style={{ borderRadius: 50, borderWidth: 2, borderColor: '#2980b9', padding: 10, marginBottom: 5 }}
                                                onPress={() => this.togglePwhOverlay2()}>
                                                <Text style={{ color: '#2980b9', fontWeight: 'bold' }}> Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ borderRadius: 50, borderWidth: 2, borderColor: '#2980b9', padding: 10, marginBottom: 5 }}
                                                onPress={() => this.togglePwhOverlay2()}>
                                                <Text style={{ color: '#2980b9', fontWeight: 'bold' }}> Save</Text>
                                            </TouchableOpacity>

                                        </ScrollView>
                                    </View>
                                </Overlay>


                            </React.Fragment>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#F5FCFF',
        paddingTop: 5,//vary this
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
        color: '#2980b9'
    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    header: {
        //backgroundColor: '#F5FCFF',
        padding: 5,
    },
    headerText: {
        marginBottom: 10,
        paddingTop: 5,
        borderWidth: 1,
        height: 40,
        borderColor: '#ededed',
        borderRadius: 50,

        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        paddingLeft: 1,
        backgroundColor: '#fff',
    },

});