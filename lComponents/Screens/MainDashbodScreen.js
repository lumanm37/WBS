import React, { Component } from 'react';
import {
  Text, View, TextInput, ActivityIndicator, FlatList, Button,
  StyleSheet, ScrollView, TouchableOpacity, Image
} from "react-native";
import UnitProject from '../UnitProject';
import firebase from 'react-native-firebase';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import * as Animatable from 'react-native-animatable'


export default class MainDashbodScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'All Projects',
    headerRight: <View style={{ flexDirection: 'row' }}>

      < MaterialIcon name='search' color={'#fff'} size={25} style={{ marginRight: 25 }}
        onPress={navigation.getParam('searchTap')} />

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

  searchTap = () => {
    this.setState({ searchTap: true })
  }





  state = {
    showTwoButtons: false,
    projectss: [],
    b4search: [],
    error: '',
    loading: true,
    role: '',
    no: [],
    projectsPM: [],
    projectsSE: [],
    projectsPC: [],
    name: '',
    searchTap: false,
  }



  onUpdate = (querySnapshot) => {
    this.setState({ projects: querySnapshot.docs, loading: false });
  }

  async componentDidMount() {
    console.log('component mounted')
    this.props.navigation.setParams({
      setMenuRef: this.setMenuRef,
      hideMenu: this.hideMenu,
      hideMenuO: this.hideMenuO,
      hideMenuC: this.hideMenuC,
      showMenu: this.showMenu,
      searchTap: this.searchTap,
    });

    let user = firebase.auth().currentUser;
    if (user) {
      let userSnapshot = await firebase.firestore().collection('Users').doc(user.email).get();
      let userData = userSnapshot.data();
      const role = userData.role
      const firstName = userData.firstName
      const lastName = userData.lastName
      const name = firstName + ' ' + lastName
      console.log(userData)

      let projectss = []
      if (role == 'ADMIN') {
        console.log('Fetch ADMIN started');
        try {
          let querySnapshot = await firebase.firestore().collection('Projects').orderBy('name').get()
          projectss = [...querySnapshot.docs]
        } catch (error) {
          console.log(error)
        }
        console.log('Fetch ADMIN ended');
        this.setState({ projectss, b4search: projectss, role, name, loading: false });
      }

      else if (role == 'PM' || role == 'SE' || role == 'PC') {
        console.log('Fetch PC started');
        try {
          let querySnapshot = await firebase.firestore().collection('Projects')
            .where('PC', '==', name)
            .get();
          projectss = [...projectss, ...querySnapshot.docs]
        } catch (error) {
          console.log(error)
        }
        console.log('Fetch PC ended');

        console.log('Fetch PM started');
        try {
          let querySnapshot = await firebase.firestore().collection('Projects')
            .where('PM', '==', name)
            .get();
          projectss = [...projectss, ...querySnapshot.docs]
        } catch (error) {
          console.log(error)
        }
        console.log('Fetch PM ended');

        console.log('Fetch SE started');
        try {
          let querySnapshot = await firebase.firestore().collection('Projects')
            .where('SE', '==', name)
            .get();
          projectss = [...projectss, ...querySnapshot.docs]
        } catch (error) {
          console.log(error)
        }
        console.log('Fetch SE ended');

        this.setState({ projectss, b4search: projectss, role, name, loading: false });
      }
      else {
        this.setState({ projectss: [], role });
      }

    }

    // firebase.auth().onAuthStateChanged((user) => {
    //   (user) && (firebase.firestore().collection('Users').doc(user.email).onSnapshot(async (querySnapshot) => {
    //     console.log('auth onsnaphot')
    //     const role = querySnapshot.data().role
    //     const firstName = querySnapshot.data().firstName
    //     const lastName = querySnapshot.data().lastName
    //     const name = firstName + ' ' + lastName
    //     var projects = []


    //     if (role == 'ADMIN') {
    //       firebase.firestore().collection('Projects').orderBy('name').onSnapshot((querySnapshot) => {
    //         this.setState({ projectss: querySnapshot.docs, role, name, loading: false });
    //         console.log(querySnapshot.docs)

    //       })
    //     }

    //     else if (role == 'PM' || role == 'SE' || role == 'PC') {

    //       firebase.firestore().collection('Projects').where('PC', '==', name).get()
    //         .then(function (querySnapshot) {
    //           projects = [...projects, ...querySnapshot];

    //           firebase.firestore().collection('Projects').where('PM', '==', name).get()
    //             .then(function (querySnapshot) {
    //               projects = [...projects, ...querySnapshot];
    //               firebase.firestore().collection('Projects').where('SE', '==', name).get()
    //                 .then(function (querySnapshot) {
    //                   projects = [...projects, ...querySnapshot];

    //                 }).catch(function (error) {
    //                   console.log("Error SE getting documents: ", error);
    //                 });
    //             }).catch(function (error) {
    //               console.log("Error PM getting documents: ", error);
    //             });
    //         })
    //         .catch(function (error) {
    //           console.log("Error getting PC documents: ", error);
    //         });

    //       console.log(projects)
    //     }

    //     else { this.setState({ projectss: [], role }) }


    //   }))
    // })
    console.log('component mount ended')
  }


  render() {
    const { name, searchTap, projectss } = this.state

    // const projectss = [...projects, ...projectsPM, ...projectsSE, ...projectsPC]

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        {(this.state.searchTap == true) && (<Animatable.View animation='slideInRight' duration={300}
          style={{ flexDirection: 'row', width: '95%', justifyContent: 'center', alignItems: 'center' }}>

          < MaterialIcon name='keyboard-backspace' color={'black'} size={30} style={{}}
            onPress={() => {
              this.setState({ searchTap: false, projectss: this.state.b4search })
            }} />

          <TextInput style={{ height: 40, marginVertical: 2, marginHorizontal: 5, paddingHorizontal: 15, width: '90%', borderRadius: 50, borderWidth: 1, borderColor: '#999' }}
            onChangeText={(text) => { this.setState({ searchedItem: text }) }}
            onSubmitEditing={() => {

              const searched = this.state.b4search.filter((item) => item.data().name.toLowerCase().includes(this.state.searchedItem.toLowerCase()))
              console.log(searched)
              this.setState({ projectss: searched })
              // projectss = searched
            }}
            autoFocus={true}
            returnKeyType={'search'}
            placeholder={'Search'} />


        </Animatable.View>)}

        {(projectss.length == 0 && searchTap) && (<Text style={{ fontSize: 25, }}>No result found</Text>)}

        <FlatList
          data={this.state.projectss}
          renderItem={({ item }) =>

            <UnitProject userName={name} item={item} navigation={this.props.navigation} role={this.state.role} />
          }
          keyExtractor={(item, index) => index.toString()}
        />


        {(this.state.role == 'ADMIN') && (< TouchableOpacity style={styles.butn}
          onPress={() => this.props.navigation.navigate('AddProject')}>
          <Text style={styles.butntxt}>+</Text>
        </TouchableOpacity >)}

        {/* </View> */}
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