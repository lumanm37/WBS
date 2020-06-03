import React, { Component } from 'react';
import {
    Text, View, TextInput, ActivityIndicator, FlatList,
    StyleSheet, ScrollView, TouchableOpacity, Image
} from "react-native";
import UnitProject from '../UnitProject';
import firebase from 'react-native-firebase';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


export default class MainDashbodScreenC extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Completed Projects',
        headerRight: <View style={{ flexDirection: 'row' }}>

            <Menu
                ref={navigation.getParam('setMenuRef')}
                button={< MaterialIcon name='sort' color={'#fff'} size={25} style={{ marginRight: 25 }}
                    onPress={navigation.getParam('showMenu')} />}
                style={{ marginTop: 40 }}
            >
                <MenuItem onPress={navigation.getParam('hideMenu')}
                    style={{ backgroundColor: '#3a91ca' }}
                    textStyle={{ color: '#fff', fontWeight: 'bold' }}>All Projects</MenuItem>
                <MenuDivider color={'#fff'} />
                <MenuItem onPress={navigation.getParam('hideMenuO')}
                    style={{ backgroundColor: '#3a91ca' }}
                    textStyle={{ color: '#fff', fontWeight: 'bold' }} >Ongoing</MenuItem>
                <MenuDivider color={'#fff'} />
                <MenuItem onPress={navigation.getParam('hideMenuC')}
                    style={{ backgroundColor: '#3a91ca' }}
                    textStyle={{ color: '#fff', fontWeight: 'bold' }}>Completed</MenuItem>
                {/* <MenuItem onPress={this.hideMenu}>Menu item 4</MenuItem> */}
            </Menu>


            < AntDesignIcon name='setting' color={'#fff'} size={25} style={{ marginRight: 15 }}
                onPress={() => { navigation.navigate('Settings') }} />
        </View>

    })

    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    };
    hideMenu = async () => {
        await this._menu.hide();
        this.props.navigation.navigate('Dashbod')
    };
    hideMenuO = async () => {
        await this._menu.hide();
        this.props.navigation.navigate('DashbodO')
    };
    hideMenuC = async () => {
        await this._menu.hide();
        this.props.navigation.navigate('DashbodC')
    };

    showMenu = () => {
        this._menu.show();
    };





    state = {
        showTwoButtons: false,
        projects: [],
        error: '',
        loading: true,
        role: '',
        no: [],
        projectsPM: [],
        projectsSE: [],
        projectsPC: [],
        name: '',
    }



    onUpdate = (querySnapshot) => {
        this.setState({ projects: querySnapshot.docs, loading: false });
    }

    componentDidMount() {

        this.props.navigation.setParams({
            setMenuRef: this.setMenuRef,
            hideMenu: this.hideMenu,
            hideMenuO: this.hideMenuO,
            hideMenuC: this.hideMenuC,
            showMenu: this.showMenu
        });


        firebase.auth().onAuthStateChanged((user) => {
            (user) && (firebase.firestore().collection('Users').doc(user.email).onSnapshot((querySnapshot) => {

                const role = querySnapshot.data().role
                const firstName = querySnapshot.data().firstName
                const lastName = querySnapshot.data().lastName
                const name = firstName + ' ' + lastName
                if (role == 'ADMIN') {
                    firebase.firestore().collection('Projects').where('progressVal', '=', 100).onSnapshot(this.onUpdate)
                    this.setState({ role, name })
                }

                else if (role == 'PM' || role == 'SE' || role == 'PC') {
                    firebase.firestore().collection('Projects').where('PC', '==', name).onSnapshot((querySnapshot) => {
                        this.setState({ role, projectsPC: querySnapshot.docs, name })
                    })

                    firebase.firestore().collection('Projects').where('PM', '==', name).onSnapshot((querySnapshot) => {
                        this.setState({ role, projectsPM: querySnapshot.docs, name })
                    })

                    firebase.firestore().collection('Projects').where('SE', '==', name).onSnapshot((querySnapshot) => {
                        this.setState({ projectsSE: querySnapshot.docs, name })
                    })

                }

                else { this.setState({ projects: [], role }) }

            }))
        })

    }



    render() {
        const { projects, projectsPM, projectsSE, projectsPC, error, loading, name } = this.state
        const projectss = [...projects, ...projectsPM, ...projectsSE, ...projectsPC]

        // onUpdate = (querySnapshot) => {
        //     const arr = querySnapshot.docs
        //     const sorted = arr.sort((a, b) => {
        //         return (b.data().dateStamp - a.data().dateStamp)
        //     })
        //     this.setState({ tasks: sorted });
        // }

        return (
            <View style={{ flex: 1 }} >
                <FlatList
                    data={projectss}
                    renderItem={({ item }) =>

                        <UnitProject userName={name} item={item} navigation={this.props.navigation} role={this.state.role} />
                    }
                    keyExtractor={(item, index) => index.toString()}
                />


                {(this.state.role == 'ADMIN') && (< TouchableOpacity style={styles.butn}
                    onPress={() => this.props.navigation.navigate('AddProject')}>
                    <Text style={styles.butntxt}>+</Text>
                </TouchableOpacity >)}


            </View >
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
        elevation: 10
    },
    butntxt: {
        color: '#fff',
        fontSize: 30,
        marginBottom: 5
    },
    subButn1: {
        position: 'absolute',
        zIndex: 2,
        right: 100,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
    },
    subButnTxt1: {
        color: '#fff',
        fontSize: 15,
        marginBottom: 5
    },
    subButn2: {
        position: 'absolute',
        zIndex: 2,
        right: 20,
        bottom: 100,
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: '#2980b9',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    subButnTxt2: {
        color: '#2980b9',
        fontSize: 25,
        marginBottom: 5
    },

});