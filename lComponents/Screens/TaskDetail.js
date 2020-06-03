import React, { Component } from "react";
import {
    Text, View, TextInput, Modal, ScrollView, TouchableOpacity,
    Image, Dimensions, TouchableWithoutFeedback, ActivityIndicator,
} from "react-native";
import { Card, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Fontisto'
import firebase from "react-native-firebase";
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';




const options = {
    title: 'Upload Photo',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        noData: true,
        path: 'images',
    },
    quality: 0.6,
    // maxWidth: Dimensions.get('window').width,
    // maxHeight: Dimensions.get('window').height,
};


export default class TaskDetail extends Component {
    static navigationOptions = {
        title: 'Task Detail',
    }
    componentDidMount = async () => {
        const item = this.props.navigation.getParam('item', 'undefined')
        const index = this.props.navigation.getParam('index', 'undefined')
        const projId = this.props.navigation.getParam('projId', 'undefined')
        const dateId = this.props.navigation.getParam('dateId', 'undefined')
        const timeId = this.props.navigation.getParam('timeId', 'undefined')
        const achieved = this.props.navigation.getParam('achieved', 'undefined')
        const fromCompletedPage = this.props.navigation.getParam('fromCompletedPage', 'undefined')
        this.setState({
            picLoading: true,
            item, index, dateId, projId, timeId, achieved, prevAchieved: achieved,
            parentTimeStamp: item.parentTimeStamp ? item.parentTimeStamp : timeId,
            parentDateId: item.parentDateId ? item.parentDateId : dateId
        })
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId).collection('Tasks')
            .doc(timeId).collection('photos').get().then((querySnapshot) => {
                // let pics = []

                querySnapshot.forEach((doc, key) => {
                    const storageLoc = 'Images/' + projId + '/' + dateId + '/' + timeId + '/' + doc.data().fileName
                    firebase.storage().ref().child(storageLoc).getDownloadURL()
                        .then((url) => {
                            const pics = [...this.state.fbPhotos, { fileName: doc.data().fileName, uri: url }];
                            const picss = [...this.state.fbPhotoss, { url: url }];

                            this.setState({ fbPhotos: pics, fbPhotoss: picss, picLoading: false })
                            // alert(JSON.stringify(photos))
                        })
                        .catch((error) => { console.log(error) })

                })
                this.setState({ picLoading: false })

            })

        if (fromCompletedPage == true || item.editEnable == false) { this.setState({ editable: false, disabled: true }) }
        else { this.setState({ editable: true }) }
    }

    state = {
        projId: '',
        dateId: '',
        timeId: '',
        parentTimeStamp: '',
        parentDateId: '',
        item: '',
        index: '',
        achieved: '',
        prevAchieved: '',
        photos: [],
        photo: null,
        fbPhotos: [],
        fbPhotoss: [],
        window: (Dimensions.get('window')),
        isPhotoOverlayVisible: false,
        deleteOverlayVisible: false,
        deleteKey: null,
        deleteVal: null,
        picLoading: false,
        upLoading: false,
        editable: true,
        disabled: false,
    }

    // componentDidMount() {
    //     firebase.auth().onAuthStateChanged((user) => {
    //         if (user) { alert(user.email) }
    //         else { alert('no user') }
    //     })
    // }


    validate = () => {
        const { achieved, projId, dateId, timeId, parentDateId, parentTimeStamp, prevAchieved } = this.state
        if (achieved > 100) { this.setState({ achieved: prevAchieved }); alert('value cannot not exceed 100%') }
        else if (isNaN(achieved)) { this.setState({ achieved: '0%' }); alert('value can only be a number') }
        else {

            if (achieved == 100) {
                firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
                    .update({
                        noOfTasks: firebase.firestore.FieldValue.increment(-1),
                        noOfCompTasks: firebase.firestore.FieldValue.increment(1)
                    });


                this.state.item.dates.map((val, key) => {
                    firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(val.date).collection('Tasks')
                        .doc(val.timeId).update({ achieved: firebase.firestore.FieldValue.increment(101) })

                    firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(val.date)
                        .update({
                            noOfTasks: firebase.firestore.FieldValue.increment(-1)
                        });
                })



            }



            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId)
                .collection('Tasks').doc(timeId).set({ achieved: (achieved.length == 0) ? prevAchieved : parseInt(achieved) }, { merge: true })

            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(parentDateId)
                .collection('Reporting').doc(parentTimeStamp).collection('Updates').doc(timeId)
                .set({ achieved: (achieved.length == 0) ? prevAchieved : parseInt(achieved) }, { merge: true })

            firebase.firestore().collection('Activities').doc(projId).collection('Summary').doc(parentDateId)
                .collection('All Activities').doc(parentTimeStamp)
                .set({ achieved: (achieved.length == 0) ? prevAchieved : parseInt(achieved) }, { merge: true })
        }
    }


    handleChoosePhoto = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // const source = { uri: response.uri };
                // const photos = [...this.state.photos, source]
                const fbPhotos = [...this.state.fbPhotos, { 'uri': response.uri, 'fileName': response.fileName }]
                const fbPhotoss = [...this.state.fbPhotoss, { 'url': response.uri }]
                this.setState({ fbPhotos, fbPhotoss });
            }
        });
    };

    enlargePhoto = (key) => {
        this.setState({ photo: [this.state.fbPhotoss[key]], isPhotoOverlayVisible: true })
    }

    onDeletePhoto = () => {
        const { deleteKey, deleteVal, fbPhotos, projId, dateId, timeId } = this.state
        const storageLoc = 'Images/' + projId + '/' + dateId + '/' + timeId + '/' + deleteVal.fileName
        //delete from ui
        fbPhotos.splice(deleteKey, 1);
        //delete photo name from dbase
        firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId).collection('Tasks')
            .doc(timeId).collection('photos').doc(deleteVal.fileName).get()
            .then((doc) => {
                if (doc.exists) {
                    firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId).collection('Tasks')
                        .doc(timeId).collection('photos').doc(deleteVal.fileName).delete()

                    firebase.storage().ref().child(storageLoc).delete()
                        .then(() => { fbPhotos.splice(deleteKey, 1); alert('Delete Successfull') })
                        .catch((error) => alert(error.message))
                }
                else {
                    fbPhotos.splice(deleteKey, 1); alert('Delete Successfull')
                }
                //delete from storage

            })




        this.setState({ fbPhotos, deleteOverlayVisible: false })
    }

    uploadImages = async () => {
        this.setState({ upLoading: true })
        // alert(this.state.fbPhotos.length)
        const { fbPhotos, projId, dateId, timeId } = this.state
        // const response = fetch(pic)
        // const blob = blob(response)
        fbPhotos.map((val, key) => {
            // alert(location)

            firebase.firestore().collection('Activities').doc(projId).collection('Outstanding').doc(dateId).collection('Tasks')
                .doc(timeId).collection('photos').doc(val.fileName).set({ 'fileName': val.fileName, 'uri': val.uri }, { merge: true })

            const storageLoc = 'Images/' + projId + '/' + dateId + '/' + timeId + '/' + val.fileName
            const dbref = firebase.storage().ref().child(storageLoc);
            dbref.put(val.uri)
                .then(() => {
                    if (key + 1 === fbPhotos.length) {
                        this.setState({ upLoading: false })
                    }

                })
                .catch(async (error) => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    this.setState({ upLoading: false })

                    console.log(error)
                })
        })
        // alert('Upload Complete')
    }


    render() {
        const { isPhotoOverlayVisible, window, fbPhotos, item, index, deleteKey, projId, dateId, timeId } = this.state

        const images = fbPhotos.map((val, key) => {
            return (
                <TouchableOpacity key={key} onLongPress={() => this.setState({ deleteOverlayVisible: true, deleteVal: val, deleteKey: key })}
                    onPress={() => { this.enlargePhoto(key) }}>
                    <View style={{
                        margin: 0, padding: 1,
                        height: (window.height / 3 - 12),
                        width: (window.width / 2 - 20),
                        backgroundColor: '#fff'
                    }}>
                        <Image source={val} style={{ flex: 1, width: null, alignSelf: 'stretch' }} />
                    </View>
                </TouchableOpacity>
            );
        }

        )
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#2980b9', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{this.state.dateId}</Text>
                </View>
                <ScrollView>

                    <Card title={index + '. ' + item.title}
                        titleStyle={{ color: '#2980b9' }}
                    >
                        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 5, justifyContent: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}>{item.task}</Text>

                            <Text style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: '#82ccdd' }}>Assigned To: </Text><Text style={{ color: '#82ccdd', fontSize: 15 }}>
                                    {item.assignedTo}
                                </Text>
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', width: '50%', flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 15, marginRight: 4, textAlign: 'center' }}>Target</Text>
                                    <Text style={{ width: 40, color: '#aa80b9', fontSize: 15, textAlign: 'center' }}>{item.target}%</Text>
                                </View>
                                <View style={{ justifyContent: 'center', width: '50%', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 4, textAlign: 'center', fontSize: 15 }}>Achieved</Text>
                                    <TextInput
                                        style={{ width: 40, color: '#aa80b9', textAlign: 'center', fontSize: 15 }}
                                        placeholder={`${item.achieved}%`}
                                        onChangeText={(achieved) => {
                                            this.setState({ achieved: (achieved.length) ? parseInt(achieved, 10) : '' })
                                        }
                                        }
                                        value={this.state.achieved.toString()}
                                        selectTextOnFocus={true}
                                        maxLength={3}
                                        onBlur={() => this.validate()}
                                        editable={this.state.editable}

                                    />
                                </View>
                            </View>

                        </View>
                    </Card>
                    <View style={{ width: 120, height: 45, marginTop: 20, marginLeft: 15, flexDirection: 'row' }}>
                        <TouchableOpacity
                            disabled={this.state.disabled}
                            onPress={() => this.handleChoosePhoto()}
                            style={{ borderWidth: 2, borderColor: '#2980b9', justifyContent: 'center', alignItems: 'center', width: 35 }}>
                            <Text style={{ fontSize: 25, color: '#2980b9' }}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            // disabled={this.state.disabled}
                            onPress={() => this.handleChoosePhoto()}
                            style={{ justifyContent: 'center', borderWidth: 2, borderColor: '#2980b9', alignItems: 'center', marginLeft: 3 }}>
                            <Text style={{ fontWeight: 'bold', width: 80, paddingLeft: 5, color: '#2980b9' }}>Progress{'\n'}Pics</Text>
                        </TouchableOpacity>
                    </View>
                    <Card containerStyle={{ paddingHorizontal: 2, marginTop: 5 }}>
                        <ScrollView style={{}}>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1, backgroundColor: '#eee' }}>
                                {(this.state.picLoading == true) && (<ActivityIndicator size='large' color='#2980b9' />)}

                                {
                                    fbPhotos && (images)
                                    // (!fbPhotos) && (<Text>No Pictures available</Text>)
                                }
                            </View>

                        </ScrollView>
                    </Card>

                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <View style={{ marginLeft: 15, marginRight: 5 }}>

                            {(this.state.upLoading == true) && (<ActivityIndicator size='large' color='#2980b9' />)}

                            {
                                (this.state.upLoading == false) &&
                                (<Icon name='upload' color={'#2980b9'} size={30} onPress={() => {
                                    // (this.state.disabled == false) &&
                                    (this.uploadImages())
                                }} />)
                            }

                        </View>

                        <View
                            style={{ marginTop: 0, marginLeft: '70%', alignItems: 'flex-end' }}>
                            <Icon name='comments' size={30} onPress={() => this.props.navigation.navigate('CommentPage', { projId, dateId, timeId })} />
                        </View>
                    </View>








                    <Overlay
                        isVisible={this.state.isPhotoOverlayVisible}
                        fullScreen={true}
                        containerStyle={{ flex: 1, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}
                        onBackdropPress={() => { this.setState({ isPhotoOverlayVisible: false }); }}
                    >
                        <ImageViewer imageUrls={this.state.photo} />
                        {/* <Image source={this.state.photo} style={{ alignSelf: 'center', width: window.width, height: window.height, resizeMode: 'contain' }} /> */}
                    </Overlay>


                    <Overlay
                        isVisible={this.state.deleteOverlayVisible}
                        onBackdropPress={() => { this.setState({ deleteOverlayVisible: false }); }}
                        overlayStyle={{ width: 80, height: 40, justifyContent: 'center', alignItems: 'center' }}
                        containerStyle={{ width: 80, height: 40, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <TouchableOpacity onPress={() => this.onDeletePhoto()}>
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </Overlay>
                </ScrollView>
            </View>

        );
    }
}
