import React, { useState, useEffect } from 'react';
import './CommunityPosts.css';

const CommunityPosts = ({ onNavigate, userData }) => {
  const [posts, setPosts] = useState([]);
  const [newCaption, setNewCaption] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [postingComments, setPostingComments] = useState({});
  const [error, setError] = useState('');

  // Fetch posts when component mounts or userData changes
  useEffect(() => {
    fetchPosts();
  }, [userData]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Include the user ID in the request to get personalized like status
      const url = userData?.userid 
        ? `http://localhost:3001/api/community-posts?userid=${userData.userid}`
        : 'http://localhost:3001/api/community-posts';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    if (newCaption.trim() === '' || !userData?.userid) {
      setError('Please enter a message to post');
      return;
    }
    
    try {
      setIsPosting(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/community-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userData.userid,
          caption: newCaption
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const data = await response.json();
      
      // Add the new post to the posts array directly
      if (data.post) {
        setPosts(prevPosts => [data.post, ...prevPosts]);
      } else {
        // If the server implementation doesn't return the full post yet, fetch all posts
        fetchPosts();
      }
      
      setNewCaption('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikeToggle = async (id, currentLiked) => {
    if (!userData?.userid) {
      setError('Please log in to like posts');
      return;
    }
    
    try {
      // Optimistically update UI
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
      
      const response = await fetch(`http://localhost:3001/api/community-posts/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userData.userid,
          liked: !currentLiked
        }),
      });
      
      if (!response.ok) {
        // Revert the change if the server request fails
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  liked: currentLiked,
                  reactions: currentLiked ? post.reactions + 1 : post.reactions - 1
                }
              : post
          )
        );
        throw new Error('Failed to update like status');
      }
      
      // Update with actual count from server
      const data = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                reactions: data.reactions
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Failed to update like status. Please try again.');
    }
  };

  const handleCommentKeyPress = (e, postId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(postId);
    }
  };

  const handleAddComment = async (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment || !userData?.userid) {
      !userData?.userid && setError('Please log in to comment');
      return;
    }

    try {
      // Show comment posting state
      setPostingComments(prev => ({ ...prev, [postId]: true }));
      setError('');
      
      const response = await fetch(`http://localhost:3001/api/community-posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userData.userid,
          comment: comment
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const data = await response.json();
      
      // If the server returns the new comment, update state directly
      if (data.comment) {
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const comments = parseComments(post.comments);
              return {
                ...post,
                comments: JSON.stringify([...comments, data.comment])
              };
            }
            return post;
          })
        );
      } else {
        // Otherwise, fetch all posts (less efficient)
        fetchPosts();
      }
      
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    } finally {
      setPostingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Helper function to parse comments if they are stored as JSON string
  const parseComments = (commentsData) => {
    if (!commentsData) return [];
    if (typeof commentsData === 'string') {
      try {
        return JSON.parse(commentsData);
      } catch (e) {
        console.error('Error parsing comments:', e);
        return [];
      }
    }
    return commentsData;
  };

  return (
    <div className="community-container">
      <button className="comm-back-button" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>
      <h2>🌟 Community Posts</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="post-creation">
        <textarea
          placeholder={userData ? "What's on your mind?" : "Please log in to post"}
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          disabled={!userData || isPosting}
        />
        <button 
          className="post-button" 
          onClick={handlePost}
          disabled={!userData || isPosting}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="post-list">
          {posts.length === 0 ? (
            <div className="no-posts">No posts yet. Be the first to share!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <p className="caption">
                  <strong>{post.username || 'User'}</strong>: {post.caption}
                </p>
                <small className="timestamp">{formatTimestamp(post.created_at)}</small>
                <div
                  className={`like-btn ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(post.id, post.liked)}
                >
                  <span className="heart">{post.liked ? '❤️' : '🤍'}</span>
                  <span className="like-count">{post.reactions || 0} Likes</span>
                </div>
                <div className="comments">
                  <strong>Comments:</strong>
                  {parseComments(post.comments).map((comment, i) => (
                    <p key={i} className="comment">
                      💬 {typeof comment === 'string' ? comment : 
                        <>
                          <strong>{comment.username || 'User'}</strong>: {comment.text}
                          <small className="timestamp">
                            {comment.timestamp ? formatTimestamp(comment.timestamp) : ''}
                          </small>
                        </>
                      }
                    </p>
                  ))}
                  <div className="comment-box">
                    <input
                      type="text"
                      placeholder={userData ? "Add a comment..." : "Please log in to comment"}
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyPress={(e) => handleCommentKeyPress(e, post.id)}
                      disabled={!userData || postingComments[post.id]}
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      disabled={!userData || postingComments[post.id]}
                    >
                      {postingComments[post.id] ? '...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPosts;