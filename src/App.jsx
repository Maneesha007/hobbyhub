import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import './app.css'; // Import the CSS file at the top of your App.jsx

function App() {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('Posts').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching posts:', error);
      else setPosts(data);
    };
    fetchPosts();
  }, []);

  const addPost = async (newPost) => {
    try {
      const { data, error: insertError } = await supabase.from('Posts').insert([newPost]).select();
      if (insertError) {
        console.error('Error adding post:', insertError);
        alert('Error adding post: ' + insertError.message);
        return null;
      }

      // Add the new post to the state
      if (data && data.length > 0) {
        setPosts((prevPosts) => [data[0], ...prevPosts]); // Add new post at the top
      }
      return data[0];
    } catch (error) {
      console.error('Unexpected error in addPost:', error);
      alert('Unexpected error: ' + error.message);
      throw error;
    }
  };

  const upvotePost = async (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    );
    setPosts(updatedPosts);

    const { error } = await supabase
      .from('Posts')
      .update({ upvotes: updatedPosts.find((post) => post.id === postId).upvotes })
      .match({ id: postId });

    if (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const deletePost = async (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);

    const { error } = await supabase.from('Posts').delete().match({ id: postId });
    if (error) {
      console.error('Error deleting post:', error);
    }
  };

  const updatePost = async (updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);

    const { error } = await supabase
      .from('Posts')
      .update({ title: updatedPost.title, content: updatedPost.content })
      .match({ id: updatedPost.id });

    if (error) {
      console.error('Error updating post:', error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="app-container">
        <h1>K DRAMA-DIARY</h1>
        <Link to="/create" className="create-post-button">Create New Post</Link>
        <div className="search-sort-container">
          <input
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="sort-buttons">
            <button onClick={() => setSortType('created_at')}>Sort by Time</button>
            <button onClick={() => setSortType('upvotes')}>Sort by Upvotes</button>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="posts-container">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="post-preview">
                    <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                      <h2>{post.title}</h2>
                    </Link>
                    <p>Created: {new Date(post.created_at).toLocaleString()}</p>
                    <p>Upvotes: {post.upvotes}</p>
                  </div>
                ))}
              </div>
            }
          />
          <Route path="/create" element={<PostForm addPost={addPost} />} />
          <Route
            path="/posts/:id"
            element={
              <PostDetail
                posts={posts}
                upvotePost={upvotePost}
                deletePost={deletePost}
                updatePost={updatePost}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
