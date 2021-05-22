import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class HomeScreen extends Component{
  constructor(){
    super()
    this.state = {
        allRequests : []
    }
  this.requestRef= null
  }

  getRequestedToysList =()=>{
    this.requestRef = db.collection("exchange_requests")
    .onSnapshot((snapshot)=>{
      var requestedToysList = snapshot.docs.map(document => document.data());
      this.setState({
        allRequests : requestedToysList
      });
    })
  }

  componentDidMount(){
    this.getRequestedToysList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>(
    <ListItem bottomDivider> 
    {item.genreEdu === true?(<Icon reverse name="shapes" type="font-awesome-5" color ='#696969'/>):(null)}
    {item.genreAction === true?(<Icon reverse name="gamepad" type="font-awesome-5" color ='#696969'/>):(null)}
    {item.genreBaby === true?(<Icon reverse name="baby" type="font-awesome-5" color ='#696969'/>):(null)}
    <Image style={{height:50,width:50}} source={{uri: item.image}}/>
      <ListItem.Content> 
        <ListItem.Title style={{ color: 'orange', fontWeight: 'bold' }}> {item.toy_name} </ListItem.Title> 
        <ListItem.Subtitle> {item.description} </ListItem.Subtitle> 
        <Text style={{ color: 'orange'}}>0-3 yrs</Text>
        <ListItem.Subtitle style={{color: '#71B2C6'}}> {item.zero_three !== false?(<Text>Targeted Ages</Text>):(<Text>Non-Targeted Ages</Text>)} </ListItem.Subtitle> 
        <Text style={{ color: 'orange'}}>4-6 yrs</Text>
        <ListItem.Subtitle style={{color: '#71B2C6'}}> {item.four_six !== false?(<Text>Targeted Ages</Text>):(<Text>Non-Targeted Ages</Text>)} </ListItem.Subtitle> 
        <Text style={{ color: 'orange'}}>7-10 yrs</Text>
        <ListItem.Subtitle style={{color: '#71B2C6'}}> {item.seven_ten !== false?(<Text>Targeted Ages</Text>):(<Text>Non-Targeted Ages</Text>)} </ListItem.Subtitle> 
      </ListItem.Content> 
      <TouchableOpacity style={styles.button}
            onPress ={()=>{
              this.props.navigation.navigate('RecieverDetails', {'details': item})
            }}> 
        <Text style={{color:'#F4433D'}}>Give Toy</Text> 
      </TouchableOpacity> 
    </ListItem>
  )
   

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Exhange With Toy Requests" navigation={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allRequests.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested Toys</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allRequests}
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
    backgroundColor:"#7FF596",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})