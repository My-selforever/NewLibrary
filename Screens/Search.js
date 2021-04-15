import * as React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DB from "../Config";
import firebase from "firebase";

export default class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      results: [],
      latestdoc:'',
    };
  }
  componentDidMount = async()=> {
    var tref = await DB.collection("Transactions").limit(4).get();
    tref.docs.map((d) => {
      this.setState({
        results: [...this.state.results, d.data()],
          latestdoc:d
      });
    });
  }
  fetchd = async()=>{
    var tref = await DB.collection("Transactions").startAfter(this.state.latestdoc).limit(4).get();
    tref.docs.map((d) => {
      this.setState({
        results: [...this.state.results, d.data()],
        latestdoc:d
      });
    });
  }

  render() {
    return (
      <FlatList
        data={this.state.results}
        renderItem={({ item }) => (
          <View>
            <Text>{item.bookID}</Text>
            {/* <Text>{item.date.toDate()}</Text> */}
             <Text>{item.studentID}</Text>
            <Text>{item.transactionType}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.fetchd() } onEndReachedThreshold={0.75}></FlatList>
    );
  }
}
