import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView} from 'react-native';
import { CheckBox, Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userName : firebase.auth().currentUser.email,
      toyName:"",
      ageGrp1: false,
      ageGrp2: false,
      ageGrp3: false,
      education: false,
      action: false,
      baby: false,
      description:"",
      IsToyRequestActive : "",
      requestedToyName: "",
      toyStatus:"",
      requestId:"",
      userDocId: '',
      docId :'',
      image: "#",
      toyValue:"",
      currencyCode: ""
    }
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userName);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }


  addToy = (toyName, ageGrp1, ageGrp2, ageGrp3, education, action, baby, description, image)=>{
    var userName = this.state.userName
    var requestId  = this.createUniqueId()
    db.collection('exchange_requests').add({
        "username": userName,
        "toy_name":toyName,
        "zero_three": ageGrp1,
        "four_six": ageGrp2,
        "seven_ten": ageGrp3,
        "genreEdu": education,
        "genreAction": action,
        "genreBaby": baby,
        "description": description,
        "request_id": requestId,
        "image": image,
        "toy_status" : "requested",
        "toy_value": this.state.toyValue

     })
    
     this.getToyRequest()
     
    db.collection('users').where('email_id','==',userName).get()
     .then((snapshot)=>{
       snapshot.ForEach((doc)=>{
         db.collection('users').doc(doc.id).update({
           IsToyRequestActive: true
         })
      })

 
    })
    this.setState({
        toyName :'',
        ageGrp1: false,
        ageGrp2: false,
        ageGrp3: false,
        education: false,
        action: false,
        baby: false,
        description : '',
        toyValue:"",
        IsToyRequestActive: true
    })

    return Alert.alert(
        "Toy ready to exchange",
        '',
        [
            {text: 'OK', onPress: () => {
                
                this.props.navigation.navigate('HomeScreen')

            }}
        ]
        )
  }

  receivedToys=(toyName)=>{
    var userName = this.state.userName
    var requestId = this.state.requestId
    db.collection('received_toys').add({
        "username": userName,
        "book_name":toyName,
        "request_id"  : requestId,
        "bookStatus"  : "received",
  
    })
  }
  
  
  
  
  getIsToyRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userName)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsToyRequestActive:doc.data().IsToyRequestActive,
          userDocId : doc.id,
          currencyCode: doc.data().currency_code
        })
      })
    })
  }
  
  

  getToyRequest =()=>{
    // getting the requested toy
  var bookRequest=  db.collection('exchange_requests')
    .where('username','==',this.state.userName)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().toy_status !== "received"){
          this.setState({
            requestId : doc.data().request_id,
            requestedToyName: doc.data().toy_name,
            toyStatus:doc.data().toy_status,
            toyValue: doc.data().toy_value,
            docId     : doc.id
          })
        }
      })
  })}
  
  getData(){
    fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
    .then(response=>{
      return response.json();
    }).then(responseData =>{
      var currencyCode = this.state.currencyCode
      var currency = responseData.rates.first_name
      var value = 69/currency
      console.log(value)
    })
  }
  
  
  sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        // to get the donor id and toy name
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var toyName =  doc.data().toy_name
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the toy " + toyName ,
              "notification_status" : "unread",
              "toy_name" : toyName
            })
          })
        })
      })
    })
  }
  
  componentDidMount(){
    this.getToyRequest()
    this.getIsToyRequestActive()
    this.getData()
    this.fetchImage(this.state.userName);
  
  }
  
  updateToyRequestStatus=()=>{
    //updating the book status after receiving the book
    db.collection('exchange_requests').doc(this.state.docId)
    .update({
      toy_status : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('users').where('email_id','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsToyRequestActive: false
        })
      })
    })

    this.setState({
      IsToyRequestActive: false
    })
  
  
  }

  render(){
    if (this.state.IsToyRequestActive === true){
      return(
      
          // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Toy Name</Text>
            <Text>{this.state.requestedToyName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Toy Value </Text>
            <Text>{this.state.toyValue}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Toy Status </Text>
            <Text>{this.state.toyStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateToyRequestStatus();
            this.receivedToys(this.state.requestedToyName)
          }}>
          <Text>I recieved the toy </Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View style={{flex:1}}>
            <MyHeader title="Request Toy" navigation={this.props.navigation}/>
            <ScrollView>
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <TextInput
                  style ={styles.formTextInput}
                  placeholder={"Enter toy name"}
                  onChangeText={(text)=>{
                      this.setState({
                          toyName:text
                      })
                  }}
                  value={this.state.toyName}
                />
                <Text 
                style={{
                  colour: '#F7A3A0', margin: 20, flex: 0.5, 
                  fontSize:15, fontWeight:'100', justifyContent:'center', alignItems:'center'}}>
                    Age of the child which the Toy is for</Text>
                <CheckBox
                  title='0-3 yrs'
                  onPress={() => this.setState({ageGrp1: !this.state.ageGrp1})}
                  checked={this.state.ageGrp1}
                />
                <CheckBox
                  title='4-6 yrs'
                  onPress={() => this.setState({ageGrp2: !this.state.ageGrp2})}
                  checked={this.state.ageGrp2}
                />
                <CheckBox
                  title='7-10 yrs'
                  onPress={() => this.setState({ageGrp3: !this.state.ageGrp3})}
                  checked={this.state.ageGrp3}
                />
                <Text 
                style={{
                  colour: '#F7A3A0', margin: 20, flex: 0.5, 
                  fontSize:15, fontWeight:'100', justifyContent:'center', alignItems:'center'}}>
                    Genre of toy (Only click one)</Text>
                <CheckBox
                  style={{backgroundColor: '#4C70F4'}}
                  title='Educational'
                  onPress={() => this.setState({education: !this.state.education})}
                  checked={this.state.education}
                />
                <CheckBox
                  style={{backgroundColor: '#F22C2C'}}
                  title='Action'
                  onPress={() => this.setState({action: !this.state.action})}
                  checked={this.state.action}
                />
                <CheckBox
                  style={{backgroundColor: '#F1C2F5'}}
                  title='Baby Toy'
                  onPress={() => this.setState({baby: !this.state.baby})}
                  checked={this.state.baby}
                />
                <TextInput
                  style ={[styles.formTextInput,{height:300}]}
                  multiline={true}
                  numberOfLines ={8}
                  placeholder={"Why do you need the toy, and describe what it essentially is"}
                  onChangeText ={(text)=>{
                      this.setState({
                          description:text
                      })
                  }}
                  value ={this.state.description}
                />
                <TextInput
                  style={styles.formTextInput}
                  placeholder ={"Toy Value"}
                  maxLength ={8}
                  onChangeText={(text)=>{
                    this.setState({
                      toyValue: text
                    })
                  }}
                  value={this.state.toyValue}
                />
                
                  <Avatar
                      rounded
                      source={{
                        uri: this.state.image,
                      }}
                      size="xlarge"
                      title="Take Pic"
                      onPress={() => this.selectPicture()}
                      containerStyle={styles.imageContainer}
                      activeOpacity={2}
                      showEditButton
                    />
                
               
                <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{this.addToy(this.state.toyName, this.state.ageGrp1, this.state.ageGrp2, this.state.ageGrp3,
                     this.state.education, this.state.action, this.state.baby, this.state.description, this.state.image)
                    this.setState({
                      toyValue:""
                    })}}
                  >
                  <Text>Add Toy</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </ScrollView>
        </View>
      )
    }
    
    
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  imageContainer: {
    flex: 0.75,
    width: "60%",
    height: "2%",
    marginLeft: 10,
    marginTop: 50,
    borderRadius: 20,
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#9AE89C',
    borderRadius:10,
    borderWidth:3,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#9AE89C",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)