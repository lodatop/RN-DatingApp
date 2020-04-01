import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const config = {
    apiKey: "AIzaSyD1YyQxum0b4bRZ3ZULLcepRv1MBKQte8o",
    authDomain: "allaboutthatace-bh.firebaseapp.com",
    databaseURL: "https://allaboutthatace-bh.firebaseio.com",
    projectId: "allaboutthatace-bh",
    storageBucket: "allaboutthatace-bh.appspot.com",
    messagingSenderId: "1012519144320",
};
class Firebase {
  constructor() {

    app.initializeApp(config);

    this.firestore = app.firestore();

    this.storage = app.storage();
    
    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  
}
export default Firebase;