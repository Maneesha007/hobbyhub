import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      image_url: imageUrl,
      upvotes: 0,
      user_id: null, // No user authentication for now
    };
  
    try {
      await addPost(newPost); // Add the post and update state
      console.log('Post added, navigating to home...');

      setTitle('');
      setContent('');
      setImageUrl('');
      navigate('/');  // Navigate to the homepage after the post is added
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('There was an issue creating your post. Please try again.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostForm;
