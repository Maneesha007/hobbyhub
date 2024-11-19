import React, { useState } from 'react';

const PostForm = ({ addPost }) => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Math.random(), // Use a random id for demo purposes
      title,
      review,
      image,
      upvotes: 0,
      createdTime: new Date().toISOString(),
      comments: []
    };
    addPost(newPost);
    setTitle('');
    setReview('');
    setImage('');
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
        placeholder="Review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
