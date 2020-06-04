import React, { Component } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-elements";

export class UnitIncident extends Component {
    render() {
        return (
            <Card containerStyle={{ width: '95%', paddingVertical: 3, borderRadius: 10 }}
                title={<Text style={{ alignText: 'center' }}>{this.props.item.date}</Text>}>
                <View key={this.props.keyval} style={styles.projectV}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.projectT}> Incident:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.incident}</Text>
                        <Text style={styles.projectT}> Action Taken:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.actionTaken}</Text>

                    </View>
                    <View style={{ flex: 1, }}>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                                onPress={this.props.deleteitem}>
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}



export class UnitChange extends Component {
    render() {
        return (
            <Card containerStyle={{ width: '95%', paddingVertical: 3, borderRadius: 10 }}
                title={this.props.item.date}>
                <View key={this.props.keyval} style={styles.projectV}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.projectT}> Description:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.description}</Text>
                        <Text style={styles.projectT}> Cost Impact:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.costImpact}</Text>
                        <Text style={styles.projectT}> Time Impact:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.timeImpact}</Text>

                    </View>
                    <View style={{ flex: 1, }}>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                                onPress={this.props.deleteitem}>
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}


export class UnitIssue extends Component {
    render() {
        return (
            <Card containerStyle={{ width: '95%', paddingVertical: 3, borderRadius: 10 }}
                title={this.props.item.date}>
                <View key={this.props.keyval} style={styles.projectV}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.projectT}> Issue:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.description}</Text>
                        <Text style={styles.projectT}> Action Taken:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.costImpact}</Text>
                        <Text style={styles.projectT}> Remarks:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.timeImpact}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                                onPress={this.props.deleteitem}>
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}


export class UnitTqnc extends Component {
    render() {
        return (
            <Card containerStyle={{ width: '95%', paddingVertical: 3, borderRadius: 10 }}
                title={<Text style={{ alignText: 'center' }}>{this.props.item.tqncDate}</Text>}>
                <View key={this.props.keyval} style={styles.projectV}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.projectT}> TQ/NCR Number:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncNumber}</Text>
                        <Text style={styles.projectT}> Task Description:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncTaskDescription}</Text>
                        <Text style={styles.projectT}> Action Taken:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                                onPress={this.props.deleteitem}>
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}

export class UnitPerfomance extends Component {//not usefull
    render() {
        return (
            <Card containerStyle={{ width: '95%', paddingVertical: 3, borderRadius: 10 }}>
                <View key={this.props.keyval} style={styles.projectV}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.projectT}> Total Number of Employees:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncNumber}</Text>
                        <Text style={styles.projectT}> Total Working Hours:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncTaskDescription}</Text>
                        <Text style={styles.projectT}> Near Miss:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> First Aid Treatment:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Medical Treatment:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Lost Time Injury:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Working days Lost to Injury:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Fire Incident:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Site Safety Compliance (PPE, Work Permit):</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Non-Safety Compliance:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Tool Box Meeting:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Vehicle Related Incidents:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                        <Text style={styles.projectT}> Theft and/or Break-In Issues:</Text>
                        <Text style={{ paddingLeft: 15 }}>{this.props.item.tqncActionTaken}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50 }}
                                onPress={this.props.deleteitem}>
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}
const styles = StyleSheet.create({
    projectV: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
        padding: 5,
        paddingRight: 5,
        //        borderBottomWidth: 2,
        //      borderBottomColor: '#ededed',

        width: '95%'

    },
    projectT: {
        paddingLeft: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2980b9',
        fontWeight: 'bold',
        fontSize: 15

    }
});