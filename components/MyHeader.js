import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import firebase from 'firebase';
import db from '../config.js'

export default class MyHeader extends Component{
  constructor(props){
    super(props)
    this.state = {
      userId: firebase.auth().currentUser.email,
      value: ""
    }
  }

  getNumberofUnreadNotifications(){
    db.collection('all_notifications').where('notification_status','==',"unread").where('targeted_user_id','==',this.state.userId)
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
      this.setState({value: unreadNotifications.length})
    });
  }
  componentDidMount(){
    this.getNumberofUnreadNotifications()
  }
  
  
  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='bell' type='font-awesome' color='#F7A3A0' size={25}
          onPress={() => this.props.navigation.navigate('Notifications')}/>
        <Badge value={this.state.value}
        containerStyle={{position: 'absolute', top: -4, right: -4}}/>
      </View>
    )
  }

  render(){
    return(
      <Header
        centerComponent={{ text: this.props.title, style: { color: '#F7A3A0', fontSize:20,fontWeight:"bold", } }}
        leftComponent={<Icon name='bars' type='font-awesome' color='#F7A3A0' 
          onPress={() => this.props.navigation.toggleDrawer()}/>}
        backgroundColor = "#B0F5B2"
        rightComponent={<this.BellIconWithBadge {...this.props}/>}
  
      />
    );
  }
  
}



