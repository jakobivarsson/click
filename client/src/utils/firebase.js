import Firebase from "firebase";

const config = {
  apiKey: "AIzaSyDbPJRWd9BcNkirK4j7G3WU_KwX7wR9MCA",
  authDomain: "click-9971c.firebaseapp.com",
  databaseURL: "https://click-9971c.firebaseio.com",
  projectId: "click-9971c",
  storageBucket: "click-9971c.appspot.com",
  messagingSenderId: "283373064514",
}

Firebase.initializeApp(config)

const database = Firebase.database()

export default database
