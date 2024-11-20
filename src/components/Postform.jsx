import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostForm.css';

function PostForm({ addPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      image_url: imageUrl || null, // Ensure null for optional fields
      upvotes: 0,
      user_id: 1 // Static user_id for now
    };

    try {
      console.log('Attempting to add post...');
      const addedPost = await addPost(newPost);

      if (!addedPost) {
        throw new Error('Post addition failed, no data returned');
      }

      console.log('Post successfully added:', addedPost);

      // Reset form fields
      setTitle('');
      setContent('');
      setImageUrl('');

      // Navigate to the home feed
      console.log('Navigating to home feed...');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('There was an issue creating your post. Please try again.');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>
      <div className="form-group">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Text (optional)"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image-url">Image URL (optional)</label>
        <input
          id="image-url"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Paste an image URL"
        />
      </div>
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;
