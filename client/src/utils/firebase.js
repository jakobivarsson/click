import Firebase from "firebase";
import { map } from 'lodash'

const config = {
  apiKey: "AIzaSyDbPJRWd9BcNkirK4j7G3WU_KwX7wR9MCA",
  authDomain: "click-9971c.firebaseapp.com",
  databaseURL: "https://click-9971c.firebaseio.com",
  projectId: "click-9971c",
  storageBucket: "click-9971c.appspot.com",
  messagingSenderId: "283373064514",
}

Firebase.initializeApp(config)

export const database = Firebase.database()

export const saveBuilding = (building) => {
  // Get a key for the new building and write to it
  const buildingKey = Firebase.database().ref().child('building').push().key;
  let updates = {};
  updates['/buildings/' + buildingKey] = building;

  return Firebase.database().ref().update(updates);
}

export const toList = obj => map(obj, (value, key) => ({
  key,
  ...value
}))

export default database
