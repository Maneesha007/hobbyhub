import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = ({ posts, upvotePost, deletePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((post) => post.id === parseFloat(id));
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);

  if (!post) return <p>Post not found!</p>;

  const handleUpvote = () => {
    upvotePost(post.id);
  };

  const handleDelete = () => {
    deletePost(post.id);
    navigate('/');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    post.comments.push(newComment);
    setNewComment('');
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    // Logic to save the edit (e.g., updating post title and review)
    setEditMode(false);
  };

  return (
    <div>
      {editMode ? (
        <div>
          <input
            type="text"
            value={post.title}
            onChange={(e) => post.title = e.target.value}
          />
          <textarea
            value={post.review}
            onChange={(e) => post.review = e.target.value}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      ) : (
        <div>
          <h1>{post.title}</h1>
          <img src={post.image} alt={post.title} />
          <p>{post.review}</p>
          <p>Upvotes: {post.upvotes}</p>
          <button onClick={handleUpvote}>Upvote</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleEdit}>Edit</button>

          <h3>Comments</h3>
          {post.comments.map((comment, index) => (
            <p key={index}>{comment}</p>
          ))}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
