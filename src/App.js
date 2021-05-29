import React, { useRef } from "react";
import "./index.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAkXy_UXnzNE-KhvKMY7Hlep4OI0fZS110",
  authDomain: "chatting-app-adadf.firebaseapp.com",
  projectId: "chatting-app-adadf",
  storageBucket: "chatting-app-adadf.appspot.com",
  messagingSenderId: "96389856958",
  appId: "1:96389856958:web:c115d819fbc542ee3ea8ef",
  measurementId: "G-QKYBRMQS01"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() 
{
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {user ? <><SignOut/><ChatRoom/> </> : <Signin/>}
    </div>
  );
}
const auth = firebase.auth();
const database = firebase.firestore();

function Signin() {
  function signInWithGoogle()
  {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => console.log('Error Occured', err));  
  }

  return (
  <button onClick={signInWithGoogle}> Sign In with Google </button>
  );
}

function SignOut() {
  return (
    <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
  );
}

function ChatRoom() 
{

  const dummy=useRef();
  const messageRef = database.collection("messages");
  const query = messageRef.orderBy("createdAt");

  const [messages ] = useCollectionData(query, { idField: "id"}); // it is a hook which returns the array of objects
  console.log(messages);
  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      chat: document.getElementById('chatMessage').value,
      uid,
      photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    document.getElementById('chatMessage').value = '';
    dummy.current.scrollIntoView({behaviour:"smooth"});
  }
  return (
    <>
    <main>  
      {messages && messages.map(function(msg){
        return( <ChatMessage message={msg}/>);
        })}
        <div ref={dummy}></div>  
    </main>
    
    <form onSubmit={sendMessage}> 
      <input required id='chatMessage' type="text"></input> 
      <button type="submit">Send</button>
    </form>
    </>

  );
}

function ChatMessage(props) {
  const { chat, uid, photoURL } = props.message;
  console.log(props.message);

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return (
    <div className={`message ${messageClass}`}>
      <img alt="NA" src={photoURL} />
      <p>{chat}</p>;
    </div>
  );
}
export default App;

