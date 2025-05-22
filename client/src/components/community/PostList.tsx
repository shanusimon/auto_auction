import { PostProps as Post } from '@/types/Post.Types';
import PostItem from './PostItem';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="bg-black rounded-lg p-8 text-center border border-zinc-800 animate-fade-in">
        <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
        <p className="text-zinc-400">Be the first to share something with the community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <PostItem 
          key={post._id} 
          post={post} 
          className={`animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default PostList;