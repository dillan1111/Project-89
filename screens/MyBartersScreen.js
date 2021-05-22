import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, ScrollView } from 'react-native';
import { ListItem, Icon, Card } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyBartersScreen extends Component{

    constructor(){
      super()
      this.state = {
        donorId  : firebase.auth().currentUser.email,
        donorName: "",
        allBarters : []
      }
    this.requestRef= null
    }

    getDonorDetails=(donorId)=>{
      db.collection("users").where("email_id","==", donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          this.setState({
            "donorName" : doc.data().first_name + " " + doc.data().last_name
          })
        });
      })
    }
  
    getAllBarters =()=>{
      this.requestRef = db.collection("all_Barters").where("donor_id","==",this.state.donorId)
      .onSnapshot((snapshot)=>{
        var allBarters = []
       snapshot.docs.map((doc) =>{
         var barters = doc.data()
         barters["doc_id"] = doc.id
         allBarters.push(barters)
       });
        this.setState({
          allBarters : allBarters
        });
      })
    }

    sendToy=(toyDetails)=>{
      if(toyDetails.request_status === "Toy Sent"){
        var requestStatus = "Donor Interested"
        db.collection("all_Barters").doc(toyDetails.doc_id).update({
          "request_status" : "Donor Interested"
        })
        this.sendNotification(bookDetails,requestStatus)
      }
      else{
        var requestStatus = "Toy Sent"
        db.collection("all_Barters").doc(toyDetails.doc_id).update({
          "request_status" : "Toy Sent"
        })
        this.sendNotification(toyDetails,requestStatus)
      }
    }
 
    sendNotification=(toyDetails,requestStatus)=>{
      var requestId = toyDetails.request_id
      var donorId = toyDetails.donor_id
      db.collection("all_notifications")
      .where("request_id","==", requestId)
      .where("donor_id","==",donorId)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var message = ""
          if(requestStatus === "Toy Sent"){
            message = this.state.donorName + " sent you toy"
          }else{
             message =  this.state.donorName  + " has shown interest in donating the toy"
          }
          db.collection("all_notifications").doc(doc.id).update({
            "message": message,
            "notification_status" : "unread",
            "date"                : firebase.firestore.FieldValue.serverTimestamp()
          })
        });
      })
    }
  
    keyExtractor = (item, index) => index.toString()
  
    renderItem = ({ item , i}) => ( 
      <ListItem bottomDivider> 
        {item.genreEdu === true?(<Icon reverse name="shapes" type="font-awesome-5" color ='#696969'/>):(null)}
        {item.genreAction === true?(<Icon reverse name="gamepad" type="font-awesome-5" color ='#696969'/>):(null)}
        {item.genreBaby === true?(<Icon reverse name="baby" type="font-awesome-5" color ='#696969'/>):(null)}
        <ListItem.Content> 
          <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}> {item.book_name} </ListItem.Title> 
          <ListItem.Subtitle> {"Requested By: "+item.requested_by+"\nStatus: "+item.request_status} </ListItem.Subtitle> 
        </ListItem.Content> 
        <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Toy Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendToy(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Toy Sent" ? "Toy Sent" : "Send Toy"
             }</Text>
           </TouchableOpacity>
      </ListItem>
    )

    componentDidMount(){
      this.getDonorDetails(this.state.donorId)
      this.getAllBarters()
    }
  
    componentWillUnmount(){
      this.requestRef();
    }
  
    render(){
      return(
        <View style={{flex:1, backgroundColor:"#0000"}}>
          <MyHeader title="My Barters" navigation={this.props.navigation}/>
          <View style={{flex:1}}>
            {
              this.state.allBarters.length === 0
              ?(
                <View style={styles.subtitle}>
                  <Text style={{ fontSize: 20}}>List Of All Toy Donations</Text>
                </View>
              )
              :(
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allBarters}
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
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })
