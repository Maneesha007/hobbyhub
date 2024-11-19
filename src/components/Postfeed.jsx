import { posts } from '../data';
import { Link } from 'react-router-dom';

function PostFeed() {
  return (
    <div>
      <h1>HobbyHub: Movie Reviews</h1>
      <Link to="/create">Create New Post</Link>
      <div>
        {posts.map(post => (
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
