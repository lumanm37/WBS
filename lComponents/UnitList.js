import React, { Component } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-elements";

export default class UnitList extends Component {
    render() {

        const End = (parseInt(this.props.item.period) + parseInt(this.props.item.start))

        return (
            <Card containerStyle={{ paddingVertical: 3, borderRadius: 10 }}>
                <TouchableOpacity>
                    <View key={this.props.keyval} style={{}}>
                        <Text style={styles.projectT}> {this.props.item.name}</Text>
                        <Text style={styles.projectT}> Weight:  GHC{this.props.item.weight}</Text>
                        <Text style={styles.projectT}> Period:  {this.props.item.period}weeks</Text>
                        <Text style={styles.projectT}>   start:  week{this.props.item.start}    End:  week{End}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3498db', marginTop: 5, width: 60, borderRadius: 50, marginLeft: '80%' }}
                    onPress={this.props.deleteDeliverable}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
                </TouchableOpacity>
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
        height: 80,
        //width: '100%'

    },
    projectT: {
        paddingLeft: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2980b9',
        fontWeight: 'bold',
        fontSize: 15

    }
});