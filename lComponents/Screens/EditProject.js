import React, { } from 'react';
import { TextInput, View, Text, Button, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import firebase from 'react-native-firebase';


const validationScheme = yup.object().shape({
  PName: yup.string().required('this field is required'),
  PDescription: yup.string().required('this field is required')
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
  <View style={{ width: '50%', marginTop: 20 }}>
    <TouchableOpacity style={{ borderRadius: 5, alignItems: 'flex-end', backgroundColor: '#2980b9', padding: 10, width: '100%', marginBottom: 5 }}
      {...rest}>
      <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>{bottonText}</Text>
    </TouchableOpacity>
  </View>
);


export default class AddProjectScreen extends React.Component {
  static navigationOptions = {
    title: 'Edit Project',
  }

  componentDidMount = () => {

    const progressVal = this.props.navigation.getParam('progressVal', 'undefined')//item routed from Dashboard
    const item = this.props.navigation.getParam('item', 'undefined')//item routed from Dashboard
    const id = this.props.navigation.getParam('id', 'undefined')//item routed from Dashboard
    this.setState({
      progressVal,
      tempProgressVal: progressVal,
      SiteLocation: item.Location,
      ProjectName: item.name,
      Duration: item.Duration,
      Description: item.Description,
      jobId: item.jobId,
      DocId: id,
      item,
    })
  }

  constructor(props) {
    super(props);

    this.state = {
      tempProgressVal: 0,
      inputActive: false,
      leftButtonPress: false,
      progressVal: 0,
      progress: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100',],
      item: '',
      DocId: '',
      ProjectName: '',
      SiteLocation: '',
      Duration: '',
      Description: '',
      jobId: '',
      loading: false,
    }
  }

  checkAndUpdateStatus = () => {
    const { progressVal, DocId } = this.state
    if (progressVal > 100 || isNaN(progressVal)) {
      alert('invalid progress value')
    }
    else {
      this.setState({ inputActive: false })
    }
  }

  UpdateProject = async () => {
    this.setState({ loading: true })
    const id = this.state.DocId;
    await firebase.firestore().collection('Projects').doc(id).set({
      name: this.state.ProjectName,
      Location: this.state.SiteLocation,
      Duration: this.state.Duration,
      Description: this.state.Description,
      jobId: this.state.jobId,
      progressVal: this.state.progressVal,
    },
      { merge: true });
    this.setState({ loading: false })

    if (this.state.leftButtonPress == true) {
      this.props.navigation.navigate('Dashboard', { progressVal: parseInt(this.state.progressVal) })
    }
    else {
      this.props.navigation.navigate('EditStakeholders', { id, item: this.state.item })
    }
  }

  render() {
    return (

      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>

          <Formik
            initialValues={{ PName: '', PDescription: '' }}
            onSubmit={(values, actions) => {
              // alert(JSON.stringify(values));
              setTimeout(() => { actions.setSubmitting(false); }, 1000);
            }}
            validationSchema={validationScheme}
          >


            {formikProps => (
              <React.Fragment>
                <View style={{ marginTop: 10, alignItems: 'center', width: '95%', borderWidth: 1, borderRadius: 1, borderColor: 'silver' }}>

                  <View style={{ width: '90%', marginTop: 20 }}>
                    <Text style={{ color: '#000' }}>Project Name</Text>
                    <TextInput
                      value={this.state.ProjectName}
                      style={{ borderBottomWidth: 2, borderColor: '#3498db', width: '100%', height: 40, padding: 10, marginBottom: 6 }}
                      onChangeText={(ProjectName) => {
                        formikProps.handleChange('PName');
                        this.setState({ ProjectName })
                      }}
                    />
                    <Text style={{ textAlign: 'left', color: 'red' }}>{formikProps.errors.PName}</Text>
                  </View>
                  <FormInput
                    label="Project ID"
                    value={this.state.jobId}
                    formikProps={formikProps}
                    formikKey='PJobId'
                    onChangeText={(jobId) => this.setState({ jobId })}
                  />
                  <FormInput
                    value={this.state.SiteLocation}
                    label="Site Location"
                    formikProps={formikProps}
                    formikKey='PSiteLocation'
                    onChangeText={(SiteLocation) => this.setState({ SiteLocation })}
                  />
                  <FormInput
                    value={this.state.Duration}
                    label='Duration (Weeks)'
                    formikProps={formikProps}
                    formikKey='PDuration'
                    onChangeText={(Duration) => this.setState({ Duration })}

                  />
                  <FormInput
                    value={this.state.Description}
                    label='Description'
                    formikProps={formikProps}
                    formikKey='PDescription'
                    onChangeText={(Description) => this.setState({ Description })}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TextInput
                    maxLength={4}
                    numberOfLines={1}
                    placeholder={this.state.tempProgressVal + '%'}
                    // value={this.state.progressVal.toString()}
                    style={{ borderColor: '#2980b9', fontSize: 30, fontWeight: 'bold' }}
                    onChangeText={(text) => { this.setState({ progressVal: text, inputActive: true }) }} />

                  {(this.state.inputActive == true) && (<TouchableOpacity
                    onPress={() => { this.checkAndUpdateStatus() }}
                    style={{ borderRadius: 5, alignItems: 'center', backgroundColor: '#2980b9', padding: 10, width: '15%', marginLeft: 10 }}>
                    <Text style={{ color: 'white' }}>Done</Text>
                  </TouchableOpacity>)}

                </View>

                <TouchableOpacity style={{ borderRadius: 50, marginVertical: 1, justifyContent: 'center', width: '40%', height: 40, borderTopWidth: 1, borderColor: '#2980b9', borderBottomWidth: 1 }}
                  onPress={() => { }}>
                  <Text style={{ textAlign: 'center', color: '#2980b9' }}>Complete</Text>
                </TouchableOpacity>



                {formikProps.isSubmitting ? (
                  <ActivityIndicator />
                ) : (

                    <View style={{ borderRadius: 30, flexDirection: 'row', width: '70%' }}>
                      <TouchableOpacity style={{ justifyContent: 'center', borderLeftRadius: 15, alignItems: 'flex-start', backgroundColor: '#2980b9', padding: 0, width: '20%', marginBottom: 5 }}
                        onPress={async () => { await this.setState({ leftButtonPress: true }); this.UpdateProject() }}
                      >
                        <Text style={{ fontSize: 15, textAlign: 'center', color: '#fff', flexWrap: 'wrap' }}>Save/Return</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ borderRightRadius: 15, alignItems: 'flex-end', backgroundColor: '#2980b9', padding: 10, width: '80%', marginBottom: 5 }}
                        disabled={!this.state.ProjectName.length}
                        onPress={() => { formikProps.handleSubmit; this.UpdateProject() }}>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff' }}>Next</Text>
                      </TouchableOpacity>
                    </View>

                  )}

                {(this.state.loading == true) && (<ActivityIndicator size='large' color='#2980b9' />)}

              </React.Fragment>
            )}
          </Formik>
        </View>
      </ScrollView>

    );
  }
}



