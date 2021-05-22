import * as firebase from 'firebase';
  require('@firebase/firestore')
  const firebaseConfig = {
    apiKey: "AIzaSyBTn025kbyDKzMQx1gaHOrQIT2baKg3BiU",
    authDomain: "toy-barter.firebaseapp.com",
    projectId: "toy-barter",
    storageBucket: "toy-barter.appspot.com",
    messagingSenderId: "624644202452",
    appId: "1:624644202452:web:7d4cd270904553e2e00041"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();