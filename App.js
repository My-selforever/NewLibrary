import * as React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createAppContainer ,createSwitchNavigator} from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Transaction from "./Screens/Transaction";
import Search from "./Screens/Search";
import Login from "./Screens/login"

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const Navtab = createBottomTabNavigator(
  {
  Transaction: { screen:Transaction },
    Search: { screen: Search },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const root = navigation.state.routeName;
        if (root === "Transaction") {
          return (
            <Image
              source={require("./Images/assets/booklogo.jpg")}
              style={{ width: 50, height: 50 }}
            ></Image>
          );
        } else if (root === "Search") {
          return (
            <Image
              source={require("./Images/assets/book.png")}
              style={{ width: 50, height: 50 }}
            ></Image>
          );
        }
      },
      tabBarOptions: {
        activeTintColor: "#ff99cc",
        inactiveTintColor: "#ff0066",
        style: {
          backgroundColor: "#66ccff",
        },
      },
    }),
  }
);


const Appnav = createSwitchNavigator({
  Login:{screen:Login},
  Nav:{screen:Navtab},

}) 

const AppContainer = createAppContainer(Appnav);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
