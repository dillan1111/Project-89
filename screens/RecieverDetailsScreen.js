import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      userName        : '',
      receiverId      : this.props.navigation.getParam('details')["username"],
      requestId       : this.props.navigation.getParam('details')["request_id"],
      toyName         : this.props.navigation.getParam('details')["toy_name"],
      description     : this.props.navigation.getParam('details')["description"],
      age1:  this.props.navigation.getParam('details')["zero_three"],
      age2:  this.props.navigation.getParam('details')["four_six"],
      age3:  this.props.navigation.getParam('details')["seven_ten"],
      genre1: this.props.navigation.getParam('details')["genreEdu"],
      genre2: this.props.navigation.getParam('details')["genreAction"],
      genre4: this.props.navigation.getParam('details')["genreBaby"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }
getUserDetails=(userId)=>{
  db.collection("users").where('email_id','==', userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        console.log(doc.data().first_name);
        this.setState({
          userName  :doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
}

getRecieverDetails(){
  db.collection('users').where('email_id','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().first_name,
        recieverContact : doc.data().contact,
        recieverAddress : doc.data().address,
      })
    })
  });

  db.collection('exchange_requests').where('request_id','==',this.state.requestId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateBarterStatus=()=>{
  db.collection('all_Barters').add({
    book_name           : this.state.toyName,
    request_id          : this.state.requestId,
    requested_by        : this.state.recieverName,
    donor_id            : this.state.userId,
    request_status      :  "Donor Interested"
  })
}

addNotification=()=>{
  console.log("in the function ",this.state.rec)
  var message = this.state.userName + " has shown interest in exchanging the item"
  db.collection("all_notifications").add({
    "targeted_user_id"    : this.state.receiverId,
    "donor_id"            : this.state.userId,
    "request_d"          : this.state.requestId,
    "toy_name"           : this.state.toyName,
    "date"                : firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status" : "unread",
    "message"             : message
  })
}

componentDidMount(){
  this.getRecieverDetails()
  this.getUserDetails(this.state.userId)
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#F7A3A0'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Item Info", style: { color: '#F7A3A0', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#B0F5B2"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text>Name : {this.state.toyName}</Text>
            </Card>
            <Card>
              <Text>Appearance/description : {this.state.description}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBarterStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyBarters')
                  }}>
                <Text>I want to Give the Toy</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#C8DFF8"
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: '#FCE3A2',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})