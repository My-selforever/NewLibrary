import * as React from "react";
import { StyleSheet, Text, View,TextInput,TouchableOpacity } from "react-native";
import DB from '../Config';
import fb from 'firebase'


export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      pass: "",
    };
  }

  login = async ()=>{
    const {user} = this.state
    const {pass} = this.state
    
    if(user  && pass)
    {
      try{
     const response=   fb.auth().signInWithEmailAndPassword(user,pass)
     if(response){
     this.props.navigation.navigate('Transaction',{u:user})  
     }
     }
     catch(error){
    console.log(error.code)       
     }
    }

  }

  render() {
    return (
      <View style={style.container}>
        <Text style={style.title}>Login</Text>
        <TextInput
          placeholder="EmailID"
          onChangeText={(txt) => {
            this.setState({ user: txt });
          }}
          value={this.state.user}
          style={style.input}
          keyboardType="email-address"
        ></TextInput>

        <TextInput
          placeholder="Password"
          onChangeText={(txt) => {
            this.setState({ pass: txt });
          }}
          value={this.state.pass}
          style={style.input}
          secureTextEntry={true}
        ></TextInput>

        <TouchableOpacity style={style.submit} onPress={()=>{this.login()}}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  title: {
    marginTop: 75,
    marginLeft: 0,
    fontSize: 20,
  },
  container: {
    alignItems: "center",
  },

  input: {
    borderStyle: "dotted",
    borderWidth: 2,
    width: 200,
    marginTop: 100,
    marginLeft: 50,
  },
  
  submit:{
    marginTop:20,
    backgroundColor: "#dd00ff",
    width:75,
    height:30,
    borderRadius:10,
    alignItems:'center',
    marginLeft:40
  } 

});
