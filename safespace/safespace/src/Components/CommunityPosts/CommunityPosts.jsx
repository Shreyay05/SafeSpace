import React, { useState } from 'react';
import backgroundImage from '../Assets/background.png';
import './CommunityPosts.css';

const CommunityPosts = ({ onNavigate }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'User1',
      caption: 'Feeling grateful today!',
      comments: ['Nice!', 'Stay blessed!'],
      reactions: 4,
      liked: false
    },
    {
      id: 2,
      username: 'User2',
      caption: 'Nature always heals 🍃',
      comments: ['Beautiful view!', 'Love this!'],
      reactions: 9,
      liked: false
    }
  ]);

  const [newCaption, setNewCaption] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const handlePost = () => {
    if (newCaption.trim() === '') return;
    const newPost = {
      id: Date.now(),
      username: 'You',
      caption: newCaption,
      comments: [],
      reactions: 0,
      liked: false
    };
    setPosts([newPost, ...posts]);
    setNewCaption('');
  };

  const handleLikeToggle = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              reactions: post.liked ? post.reactions - 1 : post.reactions + 1
            }
          : post
      )
    );
  };

  const handleAddComment = (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="community-container">
      <button className="comm-back-button" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
      <h2>🌟 Community Posts</h2>

      <div className="post-creation">
        <textarea
          placeholder="What's on your mind?"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
        />
        <button className="post-button" onClick={handlePost}>Post</button>
      </div>

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <p className="caption"><strong>{post.username}</strong>: {post.caption}</p>
            <div
              className={`like-btn ${post.liked ? 'liked' : ''}`}
              onClick={() => handleLikeToggle(post.id)}
            >
              <span className="heart">{post.liked ? '❤️' : '🤍'}</span>
              <span className="like-count">{post.reactions} Likes</span>
            </div>
            <div className="comments">
              <strong>Comments:</strong>
              {post.comments.map((comment, i) => (
                <p key={i} className="comment">💬 {comment}</p>
              ))}
              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                />
                <button onClick={() => handleAddComment(post.id)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPosts;
