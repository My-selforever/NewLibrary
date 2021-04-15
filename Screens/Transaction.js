import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import DB from "../Config";
import firebase from "firebase";
export default class Trans extends React.Component {
  constructor() {
    super();
    this.state = {
      cam: null,
      sdata: "",
      bdata: "",
      success: false,
      buttonS: "Normal",
    };
  }
  starts = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      cam: status === "granted",
      buttonS: id,
      success: false,
    });
  };

  datahandle = async ({ type, data }) => {
    if (this.state.buttonS === "sbutton") {
      this.setState({
        sdata: data,
        success: true,
        buttonS: "Normal",
      });
    } else if (this.state.buttonS === "bbutton") {
      this.setState({
        bdata: data,
        success: true,
        buttonS: "Normal",
      });
    }
  };
  issueB = async () => {
    console.log("Issue");
    DB.collection("Transactions").add({
      studentID: this.state.sdata,
      bookID: this.state.bdata,
      transactionType: "issue",
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    DB.collection("Books").doc(this.state.bdata).update({
      taken: true,
    });
    DB.collection("Students")
      .doc(this.state.sdata)
      .update({
        booksIssued: firebase.firestore.FieldValue.increment(1),
      });

    ToastAndroid.show("Book Issued Successfully", ToastAndroid.SHORT);
    this.setState({
      sdata: "",
      bdata: "",
    });
  };

  returnB = async () => {
    console.log("return");
    DB.collection("Transactions").add({
      studentID: this.state.sdata,
      bookID: this.state.bdata,
      transactionType: "return",
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    DB.collection("Books").doc(this.state.bdata).update({
      taken: false,
    });
    DB.collection("Students")
      .doc(this.state.sdata)
      .update({
        booksIssued: firebase.firestore.FieldValue.increment(-1),
      });

    ToastAndroid.show("Book Returned Successfully", ToastAndroid.SHORT);
    this.setState({
      sdata: "",
      bdata: "",
    });
  };

  finalTransaction = async () => {
    var bookeligblity = await this.checkbookeligiblity();
    console.log("by");
    if (bookeligblity === false) {
      Alert.alert("No such book found");
    } else if (bookeligblity === "issue") {
      var studenteligblity = await this.checkstudenteligiblityissue();
      if (studenteligblity === true) {
        this.issueB();
      }
    } else if (bookeligblity === "return") {
      var studenteligblity = await this.checkstudenteligiblityreturn();
      if (studenteligblity === true) {
        this.returnB();
      }
    }
  };

  checkbookeligiblity = async () => {
    const bref = await DB.collection("Books")
      .where("bookid", "==", this.state.bdata)
      .get();
    console.log(bref.docs.length);
    var transtype;
    if (bref.docs.length === 0) {
      transtype = false;
    } else {
      bref.docs.map((para) => {
        var bookd = para.data();
        if (bookd.taken === true) {
          transtype = "return";
        } else {
          transtype = "issue";
        }
      });
    }
    return transtype;
  };

  checkstudenteligiblityissue = async () => {
    const sref = await DB.collection("Students")
      .where("studentid", "==", this.state.sdata)
      .get();
    var student;
    if (sref.docs.length === 0) {
      student = false;
      Alert.alert("Recheck Student ID");
      this.setState({
        sdata: "",
        bdata: "",
      });
    } else {
      sref.docs.map((para) => {
        var studentd = para.data();
        if (studentd.booksIssued < 2) {
          student = true;
        } else {
          student = false;
          Alert.alert("Max Book Issued. Return Books Before Issuing More");
          this.setState({
            sdata: "",
            bdata: "",
          });
        }
      });
    }
    return student;
  };

  checkstudenteligiblityreturn = async () => {
    const tref = await DB.collection("Transactions")
      .where("studentID", "==", this.state.sdata)
      .limit(2)
      .get();
    var student;
    if (tref.docs.length === 0) {
      student = false;
      Alert.alert("You have not issued this book");
    } else {
      tref.docs.map((para) => {
        var transd = para.data();
        if (
          transd.bookID === this.state.bdata &&
          transd.transactionType === "issue"
        ) {
          student = true;
        } else {
          student = false;
          Alert.alert("You Are Not The Owner This Book");
          this.setState({
            sdata: "",
            bdata: "",
          });
        }
      });
    }
    return student;
  };

  componentDidMount() {
    Alert.alert(this.props.navigation.getParam("u"));
  }

  signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("Login");
      })
      .catch((error)=>{console.log(error.code)})
  };
  render() {
    const cam = this.state.cam;
    const sdata = this.state.sdata;
    const success = this.state.success;
    const buttonS = this.state.buttonS;
    const bdata = this.state.bdata;

    if (this.state.buttonS !== "Normal" && cam) {
      return (
        <BarCodeScanner
          onBarCodeScanned={success ? undefined : this.datahandle}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonS === "Normal") {
      return (
        <KeyboardAvoidingView style={style.main} behavior="padding">
          <View style={style.head}>
            <Text>Do Transactions here. </Text>
            <Image
              source={require("../Images/assets/searchingbook.png")}
              style={{ width: 100, height: 75 }}
            ></Image>
          </View>
          <View style={{ marginTop: 75 }}>
            <TextInput
              placeholder="Student ID"
              onChangeText={(txt) => {
                this.setState({ sdata: txt });
              }}
              value={this.state.sdata}
              style={style.input}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                this.starts("sbutton");
              }}
              style={style.button}
            >
              <Text> Scan StudentID </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              placeholder="Book ID"
              onChangeText={(txt) => {
                this.setState({ bdata: txt });
              }}
              value={bdata}
              style={style.input}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                this.starts("bbutton");
              }}
              style={style.button}
            >
              <Text> Scan BookID</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={style.submitbutton}
            onPress={async () => this.finalTransaction()}
          >
            <Text>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.submitbutton}
            onPress={() => this.signout()}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
  }
}

const style = StyleSheet.create({
  button: {
    marginTop: 50,
    borderRadius: 20,
    borderStyle: "solid",
    backgroundColor: "#ff0000",
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 60,
  },

  input: {
    borderStyle: "dotted",
    borderWidth: 2,
    width: 200,
    marginTop: 100,
    marginLeft: 50,
  },

  head: {
    marginTop: 100,
    alignSelf: "center",
  },

  submitbutton: {
    backgroundColor: "#dd00ff",
    width: 50,
    height: 20,
  },

  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
