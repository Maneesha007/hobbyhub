import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import './app.css';  // Import the CSS file at the top of your App.jsx

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
      // For now, setting a static user_id to avoid authentication
      const user_id = 1; // Replace with a static user_id or any default value
    
      newPost.user_id = user_id; // Add user_id
    
      const { data, error: insertError } = await supabase.from('Posts').insert([newPost]);
      if (insertError) {
        console.error('Error adding post:', insertError);
        alert('Error adding post: ' + insertError.message);
        return; // Prevent further execution
      }
      console.log('Post added:', data);
      return data[0];
    } catch (error) {
      console.error('Unexpected error in addPost:', error);
      alert('Unexpected error: ' + error.message);
      throw error;
    }
  };

  // Upvote post
  const upvotePost = async (postId) => {
    // Update the local state immediately
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    );
    setPosts(updatedPosts);
  
    // Sync with Supabase
    const { error } = await supabase
      .from('posts')  // Match this table name with your Supabase table
      .update({ upvotes: updatedPosts.find(post => post.id === postId).upvotes })
      .match({ id: postId });
  
    if (error) {
      console.error('Error upvoting post:', error);
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    // Remove the post from local state
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  
    // Remove the post from Supabase
    const { error } = await supabase
      .from('posts')  // Match this table name with your Supabase table
      .delete()
      .match({ id: postId });
  
    if (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Update post
  const updatePost = async (updatedPost) => {
    // Update the post in local state
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
  
    // Sync with Supabase
    const { error } = await supabase
      .from('posts')  // Match this table name with your Supabase table
      .update({ title: updatedPost.title, content: updatedPost.content })
      .match({ id: updatedPost.id });
  
    if (error) {
      console.error('Error updating post:', error);
    }
  };

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


/*
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import './app.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error);
      } else if (data) {
        console.log('Fetched posts:', data);
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  // Listen to authentication changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      console.log('Session fetched:', session);
    };
  
    fetchSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      console.log('Auth state changed:', _event, session);
    });
  
    return () => authListener?.unsubscribe();
  }, []);

  // Add new post
  const addPost = async (newPost) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.from('Posts').insert([{
        ...newPost,
        user_id: user.id,
        upvotes: 0,
      }]);

      if (error) {
        console.error('Error adding post:', error);
        alert('Error adding post: ' + error.message);
        return;
      }
      console.log('Post added:', data);
      setPosts((prevPosts) => [...prevPosts, data[0]]);
      navigate('/');
    } catch (error) {
      console.error('Unexpected error in addPost:', error);
      alert('Unexpected error: ' + error.message);
    }
  };

  // Logout functionality
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  // Filter and sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortType === 'upvotes') return b.upvotes - a.upvotes;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredPosts = sortedPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>K Drama-Diary</h1>
          {user ? (
            <button onClick={handleLogout} className="logout-button">Logout</button>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </header>
        {user && (
          <nav className="nav">
            <Link to="/create" className="create-post-button">Create New Post</Link>
          </nav>
        )}
        <main className="main-content">
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
              element={<PostDetail posts={posts} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Error logging in: ' + error.message);
      return;
    }
    navigate('/');
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Error signing up: ' + error.message);
      return;
    }
    navigate('/');
  };

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default App;
*/
