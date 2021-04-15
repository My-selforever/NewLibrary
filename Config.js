import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyCz0DMmi51LKRxrROSkos_XlR1isq2VQy8",
    authDomain: "library-5b2e1.firebaseapp.com",
    databaseURL:"https://library-5b2e1.firebaseio.com",
    projectId: "library-5b2e1",
    storageBucket: "library-5b2e1.appspot.com",
    messagingSenderId: "416250291859",
    appId: "1:416250291859:web:0bf61540b536f6018d0f66"
  };
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}
else{
  firebase.app()
}
  export default firebase.firestore();