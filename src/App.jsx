import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import { posts as initialPosts } from './data';

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [sortType, setSortType] = useState('createdTime');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting logic
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortType === 'upvotes') return b.upvotes - a.upvotes;
    return new Date(b.createdTime) - new Date(a.createdTime);
  });

  // Filtering posts by search query
  const filteredPosts = sortedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  const upvotePost = (id) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        post.upvotes += 1;
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <Router>
      <div>
        <h1>HobbyHub: Movie Reviews</h1>
        <Link to="/create">Create New Post</Link>
        <div>
          <input
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSortType('createdTime')}>Sort by Time</button>
          <button onClick={() => setSortType('upvotes')}>Sort by Upvotes</button>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {filteredPosts.map((post) => (
                  <div key={post.id}>
                    <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                      <h2>{post.title}</h2>
                    </Link>
                    <p>Created: {new Date(post.createdTime).toLocaleString()}</p>
                    <p>Upvotes: {post.upvotes}</p>
                  </div>
                ))}
              </div>
            }
          />
          <Route
            path="/create"
            element={<PostForm addPost={addPost} />}
          />
          <Route
            path="/posts/:id"
            element={<PostDetail posts={posts} upvotePost={upvotePost} deletePost={deletePost} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
