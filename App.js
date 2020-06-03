import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import LoadingScreen from './lComponents/Screens/LoadingScreen';
import LoginScreen from './lComponents/Screens/LoginScreen';
import MainDashbodScreen from './lComponents/Screens/MainDashbodScreen';
import MainDashbodScreenO from './lComponents/Screens/MainDashbodScreenO';
import MainDashbodScreenC from './lComponents/Screens/MainDashbodScreenC';
import SignUpScreen from './lComponents/Screens/SignUpScreen';
import EmailVerificationScreen from './lComponents/Screens/EmailVerificationScreen';
import AddProjectScreen from './lComponents/Screens/AddProjectScreen';
import AddStakeholdersScreen from './lComponents/Screens/AddStakeholdersScreen';
// import AddBudgetScreen from './lComponents/Screens/AddBudgetScreen';
// import AddWbsScreen from './lComponents/Screens/AddWbsScreen';
import SettingsScreen from './lComponents/Screens/SettingsScreen';
import Dashboard from './lComponents/Screens/Dashboard';
import EditProject from './lComponents/Screens/EditProject';
import CompletedProjectsScreen from './lComponents/Screens/CompletedProjectsScreen';
import ReportScreen from './lComponents/Screens/ReportScreen';
import ReportScreen2 from './lComponents/Screens/ReportScreen2';
import ReportScreen3 from './lComponents/Screens/ReportScreen3'
// import FourButtons from './lComponents/Screens/FourButtons';
import TaskListScreen from './lComponents/Screens/TaskListScreen';
import DaysTask from './lComponents/Screens/DaysTask';
import cDaysTask from './lComponents/Screens/cDaysTask';
import TaskDetail from './lComponents/Screens/TaskDetail';
import EditTask from './lComponents/Screens/EditTask';
import CommentPage from './lComponents/Screens/CommentPage';
import EditStakeholders from './lComponents/Screens/EditStakeholders';
import ReassignTask from './lComponents/Screens/ReassignTask';
import Resources from './lComponents/Screens/Resources';
import AddTechnicians from './lComponents/Screens/AddTechnicians';
import Attendance from './lComponents/Screens/Attendance';

export default class App extends Component {
    render() {
        return (
            <AppContainer />
        );
    }
}

const AppTabNavigator = createBottomTabNavigator(
    {
        OutStandingTasks: TaskListScreen,
        CompletedProjects: CompletedProjectsScreen,
    },
    {
        tabBarOptions: {
            activeTintColor: '#2980b9',
            labelStyle: {
                fontSize: 20, marginBottom: 10
            },

        },
        navigationOptions: { title: 'Work Packages' },
    },

);



const AppStackNavigator = createStackNavigator(
    {
        AppTab: AppTabNavigator,
        Dashbod: MainDashbodScreen,
        DashbodO: MainDashbodScreenO,
        DashbodC: MainDashbodScreenC,
        AddProject: AddProjectScreen,
        AddStakeholders: AddStakeholdersScreen,
        // AddBudget: AddBudgetScreen,
        // AddWbs: AddWbsScreen,
        Dashboard: Dashboard,
        EditProject: EditProject,
        TaskList: TaskListScreen,
        DaysTask: DaysTask,
        cDaysTask: cDaysTask,
        Report: ReportScreen,
        Report2: ReportScreen2,
        Report3: ReportScreen3,
        // FourButtons: FourButtons,
        TaskDetail: TaskDetail,
        EditTask: EditTask,
        CommentPage: CommentPage,
        EditStakeholders,
        ReassignTask,
        Settings: SettingsScreen,
        Resources,
        AddTechnicians,
        Attendance,

    },
    {
        initialRouteName: 'Dashbod',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#2980b9',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignItems: 'center',
                fontWeight: 'bold',
            },
        },
    }
);


const AppSwitchNavigator = createSwitchNavigator(
    {
        Login: LoginScreen,
        Loading: LoadingScreen,
        AppStack: AppStackNavigator,
        SignUp: SignUpScreen,
        Verify: EmailVerificationScreen,

    },
    {
        initialRouteName: 'Loading'
    }
);


const AppContainer = createAppContainer(AppSwitchNavigator);
//  // find=()=>{
//     const arr = ['Lofi', 'Loma', 'kafui', 'nana', 'asante', 'kwabena', 'nadia', 'tako']
//     const searched = arr.filter((item) => item.includes('k'))
//     console.log(searched)
//     // }