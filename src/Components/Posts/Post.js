import React, { useState, useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../../firebase';
import firebase from 'firebase';

function Post({ postId, user, userName, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            userName: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className='post'>
            {/* header -> Avatar + Username */}
            <div className="post__header">
                <Avatar className='post__avatar' alt={userName} src='/static/images/avatar/1.jpg' />
                <h3>{userName}</h3>
            </div>

            {/* Image */}
            <img className='post__image' src={imageUrl} alt="Post" />

            {/* Username + Caption */}
            <h4 className='post__text' ><strong>{userName}</strong>: {caption}</h4>

            {/* Posted comments */}
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.userName}</strong>: {comment.text}
                        </p>
                    ))
                }
            </div>

            {/* Adding comment form */}
            {user && (
                <form className='post__commentBox'>
                    <input type="text" className='post__input' placeholder='Add a comment...' value={comment} onChange={(e) => setComment(e.target.value)}
                    />
                    <button style={{ cursor: 'pointer' }} disabled={!comment} className='post__button' type='submit' onClick={postComment}>
                        Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post
