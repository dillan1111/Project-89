import React from 'react';
import LottieView from 'lottie-react-native';

export default class ToyAnimation extends React.Component{
    render(){
        return(
            <LottieView source={require('../assets/Toys.json')} 
            style={{width: '60%'}}
            autoPlay loop/>
        );
    }
}