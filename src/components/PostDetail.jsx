import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = ({ posts, upvotePost, deletePost, updatePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the post based on the ID from the URL
  const post = posts.find((post) => post.id === parseInt(id));

  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: post?.title, content: post?.content });

  useEffect(() => {
    if (post) {
      setEditedPost({ title: post.title, content: post.content });
    }
  }, [post]);

  if (!post) return <p>Post not found!</p>;

  const handleUpvote = () => {
    upvotePost(post.id);  // You need to update the upvote count in parent component
  };

  const handleDelete = () => {
    deletePost(post.id);  // Remove post from parent state and database
    navigate('/');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    // Insert comment into Supabase
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: post.id,  // Make sure this links the comment to the correct post
        content: newComment,
      },
    ]);
  
    if (error) {
      console.error('Error adding comment:', error);
      return;
    }
  
    // Optionally, update the post object in the local state
    const updatedPost = { ...post, comments: [...post.comments, newComment] };
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? updatedPost : p))
    );
  
    setNewComment('');  // Reset the input box after submitting
  };
  

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    const updatedPost = { ...post, title: editedPost.title, content: editedPost.content };
    updatePost(updatedPost);  // Update post in parent state (and database)
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
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => <p key={index}>{comment}</p>)
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
/*

const PostDetail = ({ posts, upvotePost, deletePost, updatePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Error fetching post:', error);
      else setPost(data);
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id);
      if (error) console.error('Error fetching comments:', error);
      else setComments(data);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('comments').insert([
      { post_id: id, content: newComment },
    ]);

    if (error) {
      console.error('Error adding comment:', error);
      return;
    }

    setComments((prevComments) => [...prevComments, data[0]]);
    setNewComment('');
  };

  if (!post) return <p>Post not found!</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.image_url || 'default_image_url.png'} alt={post.title} />
      <p>{post.content}</p>
      <p>Upvotes: {post.upvotes}</p>
      <button onClick={() => upvotePost(post.id)}>Upvote</button>
      <button onClick={() => deletePost(post.id)}>Delete</button>
      <button onClick={() => updatePost(post)}>Edit</button>

      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => <p key={comment.id}>{comment.content}</p>)
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
  );
};
*/