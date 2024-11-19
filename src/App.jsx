import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';

function App() {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) console.error('Error fetching posts:', error);
      else setPosts(data);
    };
    fetchPosts();
  }, []);

  // Sorting logic
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortType === 'upvotes') return b.upvotes - a.upvotes;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Filtering posts by search query
  const filteredPosts = sortedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPost = async (newPost) => {
    try {
      const { data, error } = await supabase.from('Posts').insert([newPost]);
  
      if (error) {
        console.error('Error adding post:', error);
        alert('Error adding post: ' + error.message);
        throw new Error(error.message);
      }
  
      // Ensure post is added to the state before navigating
      setPosts((prevPosts) => [...prevPosts, data[0]]);
      console.log('New post added:', data[0]); 
    } catch (err) {
      console.error('Error in addPost:', err);
      alert('There was an issue creating your post. Please try again.');
    }
  };
  

  return (
    <Router>
      <div>
        <h1>K DRAMA-DIARY</h1>
        <Link to="/create">Create New Post</Link>
        <div>
          <input
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSortType('created_at')}>Sort by Time</button>
          <button onClick={() => setSortType('upvotes')}>Sort by Upvotes</button>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                 <h2>Homepage</h2>  {/* Add this to check if you're on the homepage */}
                 {console.log(filteredPosts)}
                {filteredPosts.map((post) => (
                  <div key={post.id}>
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
                // Add the upvotePost and deletePost methods here
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
