import React from 'react';
import {
  SafeAreaView,
  TextInput, View, Text, Picker, FlatList,
  Button, Modal, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Overlay, CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/AntDesign'



const validationScheme = yup.object().shape({
  PC: yup.string().required('*'),
  PM: yup.string().required('*'),
  SE: yup.string().required('*'),

});

const FormInput = ({ label, formikProps, formikKey, ...rest }) => (
  <View style={{ width: '90%', marginTop: 20 }}>
    <Text style={{ color: '#000' }}>{label}</Text>
    <TextInput
      style={{ borderBottomWidth: 2, borderColor: '#3498db', width: '100%', height: 40, padding: 10, marginBottom: 6 }}
      onChangeText={formikProps.handleChange({ formikKey })}
      {...rest}
    />
    <Text style={{ textAlign: 'left', color: 'red' }}>{formikProps.errors.formikKey}</Text>
  </View>
);

const FormNavBotton = ({ bottonText, ...rest }) => (
  <View style={{ width: '50%', marginTop: 20, }}>
    <TouchableOpacity style={{ borderRadius: 5, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
      onPress={() => navigation.navigate(navScreen)}
      {...rest}>
      <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>{bottonText}</Text>
    </TouchableOpacity>
  </View>
);

export default class AddStakeholdersScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Stakeholders'
  }

  componentDidMount = () => {
    const projId = this.props.navigation.getParam('projId', 'undefined')//project id from AddProjectScreen
    this.setState({ projId })

    firebase.firestore().collection('Users').where('role', '==', 'PC').onSnapshot((querySnapshot) => {
      this.setState({ usersPC: querySnapshot.docs })

    })

    firebase.firestore().collection('Users').where('role', '==', 'PM').onSnapshot((querySnapshot) => {
      this.setState({ usersPM: querySnapshot.docs })
    })

    firebase.firestore().collection('Users').where('role', '==', 'SE').onSnapshot((querySnapshot) => {
      this.setState({ usersSE: querySnapshot.docs })
    })
  }

  state = {
    projId: '', usersPC: [], usersPM: [], usersSE: [], isTechOverlayVisible: false,
    ClientName: '', ClientEmail: '', ClientTel: '', ClientAddress: '',
    PC: 'select', SE: 'select', PM: 'select', isOverlayVisible: false,
    checked: [false, false, false, false, false, false, false],
    technicians: ['lukman Mohammed', 'John Doe', 'penelope clearwater', 'second', 'third', 'fourth', 'fifth'],
    sTechnicians: ['for ', 'twelve', 'long', 'years', 'the',]
  }

  checkTheBox(index) {
    const check = this.state.checked
    check[index] = !check[index]
    this.setState({ checked: check })
  }

  toggleOverlay = () => { this.setState({ isOverlayVisible: !this.state.isOverlayVisible }) }

  onAddStakeholders = () => {
    firebase.firestore().collection('Projects').doc(this.state.projId).set({
      ClientName: this.state.ClientName,
      ClientEmail: this.state.ClientEmail,
      ClientTel: this.state.ClientTel,
      ClientAddress: this.state.ClientAddress,
      PC: this.state.PC,
      PM: this.state.PM,
      SE: this.state.SE,
    },
      { merge: true });
    this.toggleOverlay();
    this.props.navigation.navigate('Dashbod')
  }


  render() {
    const { ...st } = this.state
    const PMSE = [...st.usersPM, ...st.usersSE];
    const usersPE = [...PMSE, ...st.usersPC];
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
                <View style={{ marginTop: 10, alignItems: 'center', width: '95%', borderBottomWidth: 0, borderWidth: 2, borderRadius: 20, borderColor: '#3498db' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Client</Text>
                  <FormInput
                    label="ID and Name"
                    formikProps={formikProps}
                    formikKey='CName'
                    onChangeText={(ClientName) => { this.setState({ ClientName }) }}
                    value={st.ClientName}
                  />
                  <FormInput
                    label="Address"
                    formikProps={formikProps}
                    formikKey='CAddress'
                    onChangeText={(ClientAddress) => { this.setState({ ClientAddress }) }}
                    value={st.ClientAddress}
                  />
                  <FormInput
                    label="Email"
                    formikProps={formikProps}
                    formikKey='CEmail'
                    onChangeText={(ClientEmail) => { this.setState({ ClientEmail }) }}
                    value={st.ClientEmail}
                  />
                  <FormInput
                    label="Tel No."
                    formikProps={formikProps}
                    formikKey='CTel'
                    maxLength={10}
                    onChangeText={(ClientTel) => { this.setState({ ClientTel }) }}
                    value={st.ClientTel}
                  />
                </View>

                <View style={{ marginTop: 10, borderTopWidth: 0, borderBottomWidth: 0, alignItems: 'center', width: '95%', borderWidth: 2, borderRadius: 20, borderColor: '#3498db' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Team</Text>

                  <Text style={{}}>Project Consultant</Text>
                  <Picker
                    selectedValue={this.state.PC}
                    style={{ marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#2980b9', color: '#2980b9', height: 50, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ PC: itemValue });
                    }}>
                    {/* <Picker.Item key={0} label={'Not Assigned'} value={'Not Assigned'} /> */}
                    {
                      st.usersPC.sort().map((val, index) => <Picker.Item
                        label={val.data().firstName + ' ' + val.data().lastName}
                        value={val.data().firstName + ' ' + val.data().lastName} key={index} />)
                    }
                  </Picker>

                  <Text style={{}}>Project Manager</Text>
                  <Picker

                    prompt={'select'}
                    mode={'dialog'}
                    selectedValue={this.state.PM}
                    style={{ marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#2980b9', color: '#2980b9', height: 50, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ PM: itemValue });
                    }}>

                    {
                      usersPE.map((val, index) => <Picker.Item
                        label={val.data().firstName + ' ' + val.data().lastName}
                        value={val.data().firstName + ' ' + val.data().lastName} key={index} />)
                    }
                  </Picker>

                  <Text style={{}}>Site Engineer</Text>
                  <Picker
                    selectedValue={this.state.SE}
                    style={{ marginBottom: 10, color: '#2980b9', height: 50, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ SE: itemValue });
                    }}>

                    {
                      usersPE.map((val, index) => <Picker.Item
                        label={val.data().firstName + ' ' + val.data().lastName}
                        value={val.data().firstName + ' ' + val.data().lastName} key={index} />)
                    }
                  </Picker>

                  <TouchableOpacity style={{ borderRadius: 5, backgroundColor: '#2980b9', padding: 10, width: '90%', marginBottom: 5 }}
                    onPress={() => { this.props.navigation.navigate('AddTechnicians', { projId: st.projId }) }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>Add Personnel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, borderTopWidth: 0, alignItems: 'center', width: '95%', borderWidth: 2, borderRadius: 20, borderColor: '#3498db' }}>
                  <TouchableOpacity style={{ marginTop: 10, borderRadius: 5, backgroundColor: '#2980b9', padding: 10, width: '90%', marginBottom: 10 }}
                    onPress={() => { this.toggleOverlay() }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>Save</Text>
                  </TouchableOpacity>

                </View>


                <Overlay isVisible={this.state.isOverlayVisible}
                  fullScreen={true}
                  overlayStyle={{ borderRadius: 50, justifyContent: 'center' }}
                  overlayBackgroundColor="#FFF"
                  onBackdropPress={async () => { await this.setState({ isOverlayVisible: false }); }}
                  width='auto'
                  height='auto'
                  animationType={'fade'}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Client</Text>
                    <Text>Name: {st.ClientName} </Text>
                    <Text>Address: {st.ClientAddress} </Text>
                    <Text>Email: {st.ClientEmail} </Text>
                    <Text>Tel no: {st.ClientTel}{'\n'} </Text>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Team</Text>
                    <Text>Project Consultant: {st.PC} </Text>
                    <Text>Project Manager: {st.PM} </Text>
                    <Text>Site Engineer: {st.SE}</Text>

                    <FormNavBotton
                      style={{ marginLeft: '0%', borderRadius: 50, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                      bottonText='Modify'
                      onPress={() => this.toggleOverlay()}
                    />
                    <FormNavBotton
                      style={{ marginLeft: '0%', borderRadius: 50, backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
                      bottonText='Save and Continue'
                      onPress={() => this.onAddStakeholders()}
                    />
                  </View>
                </Overlay>




                <Overlay
                  fullScreen={true}
                  isVisible={this.state.isTechOverlayVisible}
                  windowBackgroundColor={'#ffFFFFFF'}
                  animationType={'fade'}
                  onBackdropPress={async () => { await this.setState({ isTechOverlayVisible: false }); }}
                  overlayStyle={{}}
                  containerStyle={{}}
                >
                  <View style={{ width: '100%', flex: 1, justifyContent: 'center' }}>

                    <View style={{ backgroundColor: '#82ccdd', flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => this.setState({ isTechOverlayVisible: false })}>
                          < Icon name='back' color={'#fff'} size={35} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                      </View>

                      <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{}}>
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>EDIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{}}>
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>DELETE</Text>
                        </TouchableOpacity>
                      </View>
                    </View>






                    <View style={{ flex: 4 }}>
                      <FlatList
                        data={this.state.technicians}
                        renderItem={({ item, index }) => {


                          // const check = [...this.state.checked, 'false'];
                          // this.setState({ checked: check })


                          return <CheckBox
                            title={item}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.checked[index]}
                            onPress={() => { this.checkTheBox(index) }}
                          />
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>






                    <View style={{ flex: 4, alignItems: 'center' }}>
                      {/* <View style={styles.projectV}>
                        <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Email: </Text><Text>email@email.com</Text></Text>
                      </View>
                      <View style={styles.projectV}>
                        <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Phone no: </Text><Text>0000011111</Text></Text>
                      </View>
                      <View style={styles.projectV}>
                        <Text><Text style={{ fontWeight: 'bold', color: '#2980b9' }}>Available: </Text>no<Text></Text></Text>
                      </View> */}
                      <View>
                        <FlatList
                          data={this.state.sTechnicians}
                          renderItem={({ item }) =>

                            <TouchableOpacity>
                              <View style={styles.projectV}>
                                <Text style={styles.projectT}>{item}</Text>
                              </View>
                            </TouchableOpacity>
                          }
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    </View>
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
  textInput: {
    width: '100%',
    marginVertical: 5,
    borderBottomColor: '#ededed',
    borderBottomWidth: 2,
  },
  projectT: {
    color: '#000',
    // paddingLeft:20,
    // borderLeftWidth:10,
    // borderLeftColor:'#2980b9',
    // fontWeight:'bold',
    // fontSize:15
  },

}); 