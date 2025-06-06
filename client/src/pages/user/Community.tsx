import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostList from '@/components/community/PostList';
import { useGetPosts } from '@/hooks/user/useGetPosts';
import { useAddPost } from '@/hooks/user/useCreatePost';
import { useCars } from '@/hooks/user/useGetCars';
import { toast } from 'sonner';
import CarCard from '@/components/cars/Car';
import CarCardSkeleton from '@/components/cars/CarCardSkeleton';
import AuctionSocket from '@/services/webSocket/webSockeService';
import { useAuctionEnd } from '@/hooks/user/useAuctionEnd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CarFilterReturn } from '@/types/CarFormTypes';
import { userAxiosInstance } from '@/api/clientAxios';

interface BidPayload {
  success: boolean;
  bid: {
    carId: string;
    amount: number;
    auctionEndTime?: string;
    userId?: string;
  };
}

interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: posts,
    isLoading: isPostsLoading,
    refetch,
  } = useGetPosts();

  const { mutateAsync: createPost } = useAddPost();
  const [isSubmitting, setIsSubmitting] = useState(false);
const { mutate: endAuction } = useAuctionEnd();

  const { data: cars, isLoading: isCarsLoading } = useCars({
    sort: 'ending-soon',
    limit: 4,
  });

  const [allCars, setAllCars] = useState<CarFilterReturn[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

useEffect(() => {
  const fetchNews = async () => {
    setIsNewsLoading(true);
    try {
      const response = await userAxiosInstance.get('/_us/user/news');
      setNewsArticles(response.data.data);
    } catch (error: any) {
      setNewsError('Failed to fetch car news');
      console.error('News fetch error:', error.response?.data || error.message);
    } finally {
      setIsNewsLoading(false);
    }
  };
  fetchNews();
}, []);

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      setAllCars(cars);
    }
  }, [cars]);


  useEffect(() => {
    const handleNewBid = (data: BidPayload) => {
      console.log('Received new bid:', data);
      if (data.success && data.bid.carId) {
        setAllCars((prevCars) =>
          prevCars.map((car) =>
            car.id.toString() === data.bid.carId.toString()
              ? {
                ...car,
                currentBid: data.bid.amount,
                auctionEndTime: data.bid.auctionEndTime || car.auctionEndTime,
              }
              : car
          )
        );
      } else {
        console.warn('Invalid bid data:', data);
      }
    };

    AuctionSocket.on('new-bid', handleNewBid);
    return () => {
      AuctionSocket.off('new-bid', handleNewBid);
    };
  }, []);

  const handleCreatePost = async (newPost: any) => {
    try {
      setIsSubmitting(true);
      await createPost(newPost);
      await refetch();
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Post creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCarClick = (carId: string) => {
    navigate(`/user/cars/${carId}`);
  };

  const renderCarSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => <CarCardSkeleton key={`skeleton-${index}`} />);
  };

  const renderNewsSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div key={`news-skeleton-${index}`} className="animate-pulse bg-zinc-800 p-4 rounded-lg">
          <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Community Feed */}
        <div className="lg:w-7/12">
          <h1 className="text-2xl font-bold text-white mb-6 animate-fade-in">Community Feed</h1>
          <div className="animate-slide-up">
            <CreatePostForm onPostCreated={handleCreatePost} isSubmitting={isSubmitting} />
          </div>
          <div className="mt-8">
            {isPostsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse text-zinc-400">Loading posts...</div>
              </div>
            ) : posts && posts.data.length > 0 ? (
              <PostList posts={posts.data} />
            ) : (
              <div className="text-center py-10 text-zinc-400">
                No posts yet. Be the first to share something!
              </div>
            )}
          </div>
        </div>


        <div className="lg:w-3/12 ml-10">
          <h2 className="text-xl font-bold text-white mb-6">Auctions Ending Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8">
            {isCarsLoading ? (
              renderCarSkeletons()
            ) : Array.isArray(allCars) && allCars.length > 0 ? (
              allCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => handleCarClick(car.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <CarCard {...car}  endAuction={endAuction}/>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-400">
                No auctions ending soon.
              </div>
            )}
          </div>

          {/* Car News Section */}
          <h2 className="text-xl font-bold text-white mb-4">Recent Car News</h2>
          <div className="grid grid-cols-1 gap-4">
            {isNewsLoading ? (
              renderNewsSkeletons()
            ) : newsError ? (
              <div className="text-center py-10 text-red-500">{newsError}</div>
            ) : newsArticles.length > 0 ? (
              newsArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition"
                >
                  <h3 className="text-white font-semibold">{article.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {article.source.name} •{' '}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </a>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-400">
                No recent car news available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;