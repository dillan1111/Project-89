import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceivedToysScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedToysList : []
    }
  this.requestRef= null
  }

  getReceivedToysList =()=>{
    this.requestRef = db.collection("exchange_requests")
    .where('username','==',this.state.userId)
    .where("toy_status", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedToysList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedToysList : receivedToysList
      });
    })
  }

  componentDidMount(){
    this.getReceivedToysList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem bottomDivider>
          <ListItem.Content>
              <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}>{item.toy_name}</ListItem.Title>
              <ListItem.Subtitle>{item.toyStatus}</ListItem.Subtitle>
          </ListItem.Content>
      </ListItem>
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received Books" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedToysList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Received Toys</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedToysList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
