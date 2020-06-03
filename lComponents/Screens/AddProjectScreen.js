import React, { } from 'react';
import { TextInput, View, Text, Button, ScrollView, TouchableOpacity, ActivityIndicator, } from 'react-native';
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
    title: 'Create New Project',
  }

  state = {

    ProjectName: '',
    SiteLocation: '',
    Duration: '',
    Description: '',
    jobId: '',
    loading: false,
  }

  storeProject = async () => {
    this.setState({ loading: true })
    await firebase.firestore().collection('Projects').doc(this.state.ProjectName).set({
      name: this.state.ProjectName,
      Location: this.state.SiteLocation,
      Duration: this.state.Duration,
      Description: this.state.Description,
      jobId: this.state.jobId,
      progressVal: 0,
    }, { merge: true });
    this.setState({ loading: false })
    this.props.navigation.navigate('AddStakeholders', { projId: this.state.ProjectName })
  }

  render() {
    return (

      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>

          <Formik
            initialValues={{ PName: '', PDescription: '' }}
            onSubmit={(values, actions) => {
              alert(JSON.stringify(values));
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
                    formikProps={formikProps}
                    formikKey='PJobId'
                    onChangeText={(jobId) => this.setState({ jobId })}
                  />
                  <FormInput
                    label="Site Location"
                    formikProps={formikProps}
                    formikKey='PSiteLocation'
                    onChangeText={(SiteLocation) => this.setState({ SiteLocation })}
                  />
                  <FormInput
                    label='Duration (Days)'
                    formikProps={formikProps}
                    formikKey='PDuration'
                    onChangeText={(Duration) => this.setState({ Duration })}

                  />
                  <FormInput
                    label='Description'
                    formikProps={formikProps}
                    formikKey='PDescription'
                    onChangeText={(Description) => this.setState({ Description })}

                  />
                </View>




                {formikProps.isSubmitting ? (
                  <ActivityIndicator />
                ) : (
                    <FormNavBotton
                      bottonText='Next'
                      disabled={!this.state.ProjectName.length}
                      onPress={() => { formikProps.handleSubmit; this.storeProject() }}
                    />
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