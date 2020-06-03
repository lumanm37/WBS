import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import LoadingScreen from './lComponents/Screens/LoadingScreen';
import LoginScreen from './lComponents/Screens/LoginScreen';
import MainDashbodScreen from './lComponents/Screens/MainDashbodScreen';
import SignUpScreen from './lComponents/Screens/SignUpScreen';
import EmailVerificationScreen from './lComponents/Screens/EmailVerificationScreen';
import AddProjectScreen from './lComponents/Screens/AddProjectScreen';
import AddStakeholdersScreen from './lComponents/Screens/AddStakeholdersScreen';
import AddBudgetScreen from './lComponents/Screens/AddBudgetScreen';
import AddWbsScreen from './lComponents/Screens/AddWbsScreen';
import SettingsScreen from './lComponents/Screens/SettingsScreen';
import Dashboard from './lComponents/Screens/Dashboard';
import EditProject from './lComponents/Screens/EditProject';
import CompletedProjectsScreen from './lComponents/Screens/CompletedProjectsScreen';
import ReportScreen from './lComponents/Screens/ReportScreen';
import FourButtons from './lComponents/Screens/FourButtons';
import TaskListScreen from './lComponents/Screens/TaskListScreen';
import DaysTask from './lComponents/Screens/DaysTask';
import cDaysTask from './lComponents/Screens/cDaysTask';
import TaskDetail from './lComponents/Screens/TaskDetail';
import CommentPage from './lComponents/Screens/CommentPage';







type Props = {};
export default class App extends Component<Props> {
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
        navigationOptions: { title: 'Work Packages' },

    }
);



const AppStackNavigator = createStackNavigator(
    {
        AppTab: AppTabNavigator,
        Dashbod: MainDashbodScreen,
        AddProject: AddProjectScreen,
        AddStakeholders: AddStakeholdersScreen,
        AddBudget: AddBudgetScreen,
        AddWbs: AddWbsScreen,
        Settings: SettingsScreen,
        Dashboard: Dashboard,
        EditProject: EditProject,
        TaskList: TaskListScreen,
        DaysTask: DaysTask,
        cDaysTask: cDaysTask,
        Report: ReportScreen,
        FourButtons: FourButtons,
        TaskDetail: TaskDetail,
        CommentPage: CommentPage
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
        initialRouteName: 'AppStack'
    }
);


const AppContainer = createAppContainer(AppSwitchNavigator);