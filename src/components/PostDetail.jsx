import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostDetail = ({ posts, upvotePost, deletePost, updatePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the post based on the ID from the URL
  const post = posts.find((post) => post.id === parseInt(id));

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]); // Store comments for the post
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post?.title,
    content: post?.content,
    image_url: post?.image_url || '', // Add image_url to the editedPost state
  });

  useEffect(() => {
    if (post) {
      setEditedPost({ title: post.title, content: post.content, image_url: post.image_url });
    }
  }, [post]);

  // Fetch comments from Supabase for this post
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id); // Link comments to the current post

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data); // Update state with fetched comments
      }
    };

    if (post) {
      fetchComments();
    }
  }, [post]);

  if (!post) return <p>Post not found!</p>;

  const handleUpvote = () => {
    upvotePost(post.id); // Update the upvote count in the parent component
  };

  const handleDelete = () => {
    deletePost(post.id); // Remove post from parent state and database
    navigate('/');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Insert the new comment into Supabase
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: post.id, // Link comment to the correct post
        content: newComment,
      },
    ]);

    if (error) {
      console.error('Error adding comment:', error);
      return;
    }

    // Update local comments state with the newly added comment
    setComments([...comments, data[0]]);
    setNewComment(''); // Reset the input field
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    const updatedPost = {
      ...post,
      title: editedPost.title,
      content: editedPost.content,
      image_url: editedPost.image_url, // Include the image_url in the update
    };
    updatePost(updatedPost); // Update post in parent state (and database)
    setEditMode(false);
  };

  return (
    <div>
      {editMode ? (
        <div>
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
          />
          <textarea
            value={editedPost.content}
            onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={editedPost.image_url}
            onChange={(e) => setEditedPost({ ...editedPost, image_url: e.target.value })}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      ) : (
        <div>
          <h1>{post.title}</h1>
          <img src={post.image_url || 'default_image_url.png'} alt={post.title} />
          <p>{post.content}</p>
          <p>Upvotes: {post.upvotes}</p>
          <button onClick={handleUpvote}>Upvote</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleEdit}>Edit</button>

          <h3>Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <p key={comment.id}>{comment.content}</p> // Display comments dynamically
            ))
          ) : (
            <p>No comments yet!</p>
          )}

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
