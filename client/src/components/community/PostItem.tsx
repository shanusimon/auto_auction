import { useState,useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostProps as Post } from '@/types/Post.Types';
import { toast } from 'sonner';
import { useToggleLike } from '@/hooks/user/useAddLikes';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PostItemProps {
  post: Post;
  className?: string;
  style?: React.CSSProperties;
}

const PostItem: React.FC<PostItemProps> = ({ post, className = '', style }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [hasLiked, setHasLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: toggleLike } = useToggleLike();
  const user = useSelector((state:RootState)=>state.user.user);


useEffect(() => {
  if (post.likes && user?.id) {
    const liked = post.likes.includes(user.id);
    setHasLiked(liked);
  }
}, [post.likes, user?.id]);

const handleLike = () => {
  if (hasLiked) {
    setLikes(prev => prev - 1);
    setHasLiked(false);
  } else {
    setLikes(prev => prev + 1);
    setHasLiked(true);
    toast.success('Post liked!');
  }

  toggleLike(post._id, {
    onError: () => {
      if (hasLiked) {
        setLikes(prev => prev + 1);
        setHasLiked(true);
      } else {
        setLikes(prev => prev - 1);
        setHasLiked(false);
      }
      toast.error('Failed to update like, please try again.');
    },
  });
};


   
    const handleShare = () => {
      toast.success('Link copied to clipboard!');
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    };

    const renderMedia = () => {
      if (!post.media) return null;

      if (post.mediaType === 'image') {
        return (
          <div className="mt-4">
            <img
              src={post.media}
              alt="Post media"
              className="w-full rounded-md object-cover max-h-96"
            />
          </div>
        );
      }

      if (post.mediaType === 'video') {
        return (
          <div className="mt-4 aspect-video">
            <iframe
              src={post.media}
              className="w-full h-full rounded-md"
              title="Video content"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return null;
    };

    const contentPreview = post.description.length > 150 && !isExpanded
      ? `${post.description.substring(0, 150)}...`
      : post.description;

    return (
      <div className={`bg-zinc-800 rounded-lg p-4 shadow-md ${className}`} style={style}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userId.profileImage} alt={post.userId.name} />
            <AvatarFallback className="bg-zinc-700 text-zinc-300">
              {getInitials(post.userId.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">{post.userId.name}</h4>
                <p className="text-xs text-zinc-400">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-white">
                {contentPreview}
                {post.description.length > 150 && (
                  <button
                    className="ml-1 text-green-400 hover:underline text-sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>

            {renderMedia()}

            <div className="mt-4 flex items-center space-x-6">
              <button
                className={`flex items-center space-x-1 ${hasLiked ? 'text-green-400' : 'text-zinc-400 hover:text-green-400'}`}
                onClick={handleLike}
              >
                <Heart size={18} className={hasLiked ? 'fill-green-400' : ''} />
                <span>{likes}</span>
              </button>

              <button
                className="flex items-center space-x-1 text-zinc-400 hover:text-white"
                onClick={handleShare}
              >
                <Share size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PostItem;
