import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Components/Posts/Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar, Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import FlipMove from "react-flip-move";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '300px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // If displayname present, then do not updata it, else updata it.
        } else {
          return authUser.updateProfile({
            displayName: userName,
          });
        }
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      // Perform some cleanup actions before firing useEffect()
      unsubscribe();
    }
  }, [user, userName]);

  // useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // Every time a post is added, this code is fired.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      {/* Signing up for new user */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram logo" className="app__headerImage" />
            </center>
            <Input
              type='text'
              placeholder='Username'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>Sign Up</Button>

          </form>

        </div>
      </Modal>

      {/* Signing In for already registered user */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form action="" className='app__signup'>
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram logo" className="app__headerImage" />
            </center>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>

          </form>

        </div>
      </Modal>


      {/* Header */}
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram logo" className="app__headerImage" />

        {
          user?.displayName ? (
            <div className="app__headerRight">
              <Button className='app__headerButton' onClick={() => auth.signOut()}>Logout</Button>
              <Avatar className='app__headerAvatar' alt={user.displayName} src='/static/images/avatar/1.jpg' />
            </div>
          ) : (
            <form className="app__loginHome">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </form>
          )
        }

      </div>

      {/* Posts */}

      <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {
              posts.map(({ id, post }) => (
                <Post key={id} postId={id} user={user} userName={post.userName} caption={post.caption} imageUrl={post.imageUrl} />
              ))
            }
          </FlipMove>
        </div>

        <div className='app__postsRight'>
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4'
            clientAccessToken='123|456'
            maxWidth={320}
            haideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>

      </div>

      {
        user?.displayName ? (
          <div className="app__upload">
            <ImageUpload userName={user.displayName} />
          </div>
        ) : (
          <center>
            <h3>Login to Upload!!</h3>
          </center>
        )
      }
    </div>
  );
}

export default App;