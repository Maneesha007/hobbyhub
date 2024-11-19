import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);
  

  return (
    <div>
      <h1>HobbyHub: Movie Reviews</h1>
      <Link to="/create">Create New Post</Link>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <Link to={`/post/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>Upvotes: {post.upvotes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostFeed;
