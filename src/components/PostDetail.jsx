import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = ({ posts, upvotePost, deletePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((post) => post.id === parseInt(id)); // Use parseInt instead of parseFloat
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(post?.title || '');
  const [editReview, setEditReview] = useState(post?.review || '');

  if (!post) return <p>Post not found!</p>;

  const handleUpvote = () => {
    upvotePost(post.id);
  };

  const handleDelete = () => {
    deletePost(post.id);
    navigate('/'); // Navigate to homepage after deletion
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const updatedComments = [...post.comments, newComment];
    post.comments = updatedComments;
    setNewComment('');
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    post.title = editTitle;
    post.review = editReview;
    setEditMode(false);
  };

  return (
    <div>
      {editMode ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)} // Update the state
          />
          <textarea
            value={editReview}
            onChange={(e) => setEditReview(e.target.value)} // Update the state
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
