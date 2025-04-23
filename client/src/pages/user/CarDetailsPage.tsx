import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useGetCarDetails } from "@/hooks/user/useCarDetails";
import Header from "@/components/header/Header";
import { DollarSign, Users, MessageSquare, User, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_COMMENTS_BIDS = [
  {
    type: "comment",
    user: {
      name: "SellerUser123",
      avatar: null,
      isSeller: true,
    },
    badges: [{ label: "Seller", color: "bg-purple-700" }],
    content: "Thanks for the interest everyone. Car is in excellent condition and ready for a new home.",
    meta: { upvotes: 2, time: "2h" },
    replies: [],
  },
  {
    type: "bid",
    user: {
      name: "CarEnthusiast",
      avatar: null,
      isBidder: true,
      isVerified: true,
    },
    badges: [{ label: "Bidder", color: "bg-green-800" }],
    content: "Bid <span class='text-lg text-white border font-semibold px-2 py-1 rounded bg-zinc-900 ml-1'>₹475,000</span>",
    meta: { upvotes: 1, time: "3h" },
    replies: [],
  },
  {
    type: "comment",
    user: {
      name: "AutoExpert",
      avatar: null,
    },
    content: "Have the brakes been serviced recently? They look quite new in the photos.",
    meta: { upvotes: 0, time: "5h" },
    replies: [],
  },
  {
    type: "bid",
    user: {
      name: "BidMaster99",
      avatar: null,
      isBidder: true,
    },
    badges: [{ label: "Bidder", color: "bg-green-800" }],
    content: "Bid <span class='text-lg text-white border font-semibold px-2 py-1 rounded bg-zinc-900 ml-1'>₹450,000</span>",
    meta: { upvotes: 0, time: "6h" },
    replies: [],
  },
];

function CarDetailsPage() {
  const { carid } = useParams();
  const { data, isLoading, isError, error } = useGetCarDetails(carid!);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("newest");
  const [commentInput, setCommentInput] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!data?.data?.auctionEndTime) return;

    const endTime = new Date(data.data.auctionEndTime).getTime();

    const calculateRemaining = () => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setIsEnded(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ days, hours, minutes, seconds });
    };

    calculateRemaining();

    const timerId = setInterval(calculateRemaining, 1000);

    return () => clearInterval(timerId);
  }, [data?.data?.auctionEndTime]);

  const formatTimeRemaining = () => {
    if (isEnded) return "Ended";

    const { days, hours, minutes, seconds } = remainingTime;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };
  const handleBidClick = async ()=>{
    console.log(carid);

  }

  const handleKeyDown = useCallback((e:any) => {
    if (!showImageModal) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setMainImgIdx(prev => (prev + 1) % (data?.data?.images?.length || 1));
    }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setMainImgIdx(prev => (prev - 1 + (data?.data?.images?.length || 1)) % (data?.data?.images?.length || 1));
    }
    else if (e.key === 'Escape') {
      setShowImageModal(false);
    }
  }, [showImageModal, data?.data?.images?.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#17191C] text-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading car details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#17191C] text-white flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 max-w-md">
          <div className="text-xl font-bold mb-2">Error Loading Details</div>
          <div className="text-zinc-300">{error?.message || "Failed to load car details"}</div>
        </div>
      </div>
    );
  }

  const car = data?.data;
  const seller = data?.seller;
  console.log(seller)

  // Mock counts for stats
  const numBids = MOCK_COMMENTS_BIDS.filter(item => item.type === "bid").length;
  const numComments = MOCK_COMMENTS_BIDS.filter(item => item.type === "comment").length;

  // Car details table data
  const detailsRows = [
    [
      { label: "Make", value: <span className="text-blue-300 hover:underline cursor-pointer">{car.make}</span> },
      { label: "Transmission", value: car.transmission }
    ],
    [
      { label: "Model", value: <span className="text-blue-300 hover:underline cursor-pointer">{car.model}</span> },
      { label: "Fuel Type", value: car.fuel }
    ],
    [
      { label: "Year", value: car.year },
      { label: "Body Type", value: car.bodyType }
    ],
    [
      { label: "Mileage", value: `${car.mileage} km` },
      { label: "Exterior Color", value: car.exteriorColor || "-" }
    ],
    [
      { label: "Status", value: car.approvalStatus ? "on-going" : "ended" },
      { label: "Interior Color", value: car.interiorColor || "-" }
    ],
    [
      { label: "Location", value: <span className="text-blue-300 hover:underline cursor-pointer">{car.location}</span> },
      { label: "Reserve Price", value: car.reservedPrice ? `Yes` : "No" }
    ],
    [
      { label: "Seller", value: (<span className="flex items-center gap-2"><User className="w-5 h-5 inline text-zinc-400" /> <span className="font-bold">{seller.userId?.name || "Seller123"}</span> <span className="ml-2 px-2 py-0.5 rounded bg-green-900/60 text-xs text-[#38ecb1] border border-green-700">Contact</span></span>) },
      { label: "Auction Ends", value: car.auctionEndTime ? new Date(car.auctionEndTime).toLocaleString() : "-" }
    ]
  ];

  // Next image function
  const nextImage = () => {
    setMainImgIdx(prev => (prev + 1) % car.images.length);
  };

  // Previous image function
  const prevImage = () => {
    setMainImgIdx(prev => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white flex flex-col py-4 px-0 font-inter">
        {/* Header - Title & Subtitle */}
        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="mb-2">
            <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white">{car.title}</div>
            <div className="text-base md:text-lg text-zinc-200">{car.year} {car.make} {car.model} - {car.location}</div>
          </div>

          {/* Gallery - Full Width Main Image */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
              className="w-full aspect-[16/8] md:aspect-[21/9] h-full rounded-xl overflow-hidden bg-zinc-800 relative shadow-lg border border-zinc-700 cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={car.images[mainImgIdx]}
                alt="Car Main"
                className="object-cover w-full h-full transition-all duration-300"
              />
          
              {/* Arrow Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 px-1">
              {car.images.map((src:string, idx:number) => (
                <div
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  className={`cursor-pointer relative group rounded-lg overflow-hidden border ${mainImgIdx === idx ? "border-[#3BE188]" : "border-zinc-700/60"} flex-shrink-0`}
                  style={{ width: "120px", height: "80px" }}
                >
                  <img src={src} alt={`Car ${idx + 1}`} className="object-cover w-full h-full transition-all duration-150 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </div>

          {/* Auction Statistics Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 bg-zinc-900/95 border border-zinc-800 rounded-xl px-5 py-4 shadow-lg">
            <div className="flex items-center gap-4 flex-grow flex-wrap justify-between w-full">
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <Clock className="w-5 h-5 text-[#3BE188]" />
                Time Left <span className="font-extrabold ml-2 text-lg">{formatTimeRemaining()}</span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <DollarSign className="w-5 h-5 text-[#3BE188]" />
                High Bid <span className="font-extrabold ml-2 text-lg">₹{car.highestBid ? car.highestBid.toLocaleString() : "-"}</span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <Users className="w-5 h-5 text-[#3BE188]" />
                Bids <span className="font-extrabold ml-2 text-lg">{numBids}</span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <MessageSquare className="w-5 h-5 text-[#3BE188]" />
                Comments <span className="font-extrabold ml-2 text-lg">{numComments}</span>
              </span>
              <Button className="ml-2 bg-[#3BE188] text-[#222] font-bold rounded-md px-6 py-2 text-base shadow hover:bg-[#58e7a7] transition cursor-pointer"
              onClick={handleBidClick}
              >
                Place Bid
              </Button>
            </div>
          </div>
        </div>

        {/* Car Details Table */}
        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="bg-[#191B1E] border border-zinc-800 rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full text-sm md:text-base">
              <tbody>
                {detailsRows.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800 last:border-none">
                    <td className="px-5 py-4 font-medium text-zinc-300 w-[19%]">{row[0].label}</td>
                    <td className="px-5 py-4 font-bold text-white w-[31%]">{row[0].value}</td>
                    <td className="px-5 py-4 font-medium text-zinc-300 w-[19%]">{row[1].label}</td>
                    <td className="px-5 py-4 font-bold text-white w-[31%]">{row[1].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Description */}
        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="bg-[#191B1E] border border-zinc-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-zinc-200 whitespace-pre-line">{car.description}</p>
          </div>
        </div>

        <div className="w-full max-w-[60%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4">Seller Information</h2>
          <div className="w-full bg-zinc-900/95 border border-zinc-800 rounded-xl p-6 flex items-center gap-5">
            {/* Avatar */}
            <div className="bg-zinc-800 rounded-full w-16 h-16 flex items-center justify-center border border-zinc-700 shrink-0">
              <User className="w-8 h-8 text-zinc-400" />
            </div>

            {/* Seller Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-white">{seller.userId.name || "Seller123"}</span>
                <span className="px-2 py-0.5 rounded bg-green-900/60 text-xs text-[#38ecb1] border border-green-700">Verified</span>
              </div>

              <div className="text-sm text-zinc-400 mb-3">
                <span>
                  Member since {new Date(seller.sellerSince).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>


              <div className="flex gap-3">
                <Button
                  className="px-5 py-2 text-sm bg-[#1EAEDB] hover:bg-[#0990b8] font-semibold rounded shadow transition"
                  variant="default"
                >
                  <MessageSquare className="mr-2 w-4 h-4" />
                  Chat with Seller
                </Button>

                <Button
                  className="px-5 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 font-semibold rounded shadow transition"
                  variant="outline"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments & Bids */}
        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-3">
            <h2 className="text-lg font-bold text-white">Comments & Bids</h2>
            <div className="flex gap-2 text-zinc-300 text-sm flex-wrap">
              <button
                className={`px-3 py-1 rounded ${activeTab === "newest" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"}`}
                onClick={() => setActiveTab("newest")}
              >Newest</button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "upvoted" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"}`}
                onClick={() => setActiveTab("upvoted")}
              >Most Upvoted</button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "seller" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"}`}
                onClick={() => setActiveTab("seller")}
              >Seller Comments</button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "bid" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"}`}
                onClick={() => setActiveTab("bid")}
              >Bid History</button>
            </div>
          </div>

          {/* Add Comment */}
          <div className="mb-6">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3BE188]"
              placeholder="Add a Comment..."
            />
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-6">
            {MOCK_COMMENTS_BIDS
              .filter(item => {
                if (activeTab === "seller") return item.user.isSeller;
                if (activeTab === "bid") return item.type === "bid";
                if (activeTab === "upvoted") return item.meta.upvotes > 0;
                return true;
              })
              .map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  {/* Avatar Circle */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <User className="w-7 h-7 text-zinc-400" />
                  </div>
                  {/* Content */}
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{item.user.name}</span>
                      {item.badges?.map((bdg, bidx) => (
                        <span key={bidx} className={`ml-1 text-xs px-2 py-0.5 rounded ${bdg.color} text-white border`}>{bdg.label}</span>
                      ))}
                      <span className="text-xs text-zinc-400">{item.meta.time}</span>
                    </div>
                    {/* Render bid or comment content */}
                    {item.type === "bid" ? (
                      <div
                        className="mt-1 text-base text-zinc-200"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    ) : (
                      <div className="mt-1 text-base text-zinc-200">
                        {item.content}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      <span className="text-zinc-400">{item.meta.upvotes} 👍</span>
                      <span className="cursor-pointer hover:text-white">Reply</span>
                      <span className="cursor-pointer hover:text-white">Flag as inappropriate</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-6xl max-h-[90vh] w-full">
              <img
                src={car.images[mainImgIdx]}
                alt="Car Enlarged"
                className="mx-auto object-contain max-h-[90vh] rounded-lg"
              />

              {/* Arrow Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-4 py-2">
                {car.images.map((_:any, idx:number) => (
                  <button
                    key={idx}
                    onClick={() => setMainImgIdx(idx)}
                    className={`w-3 h-3 rounded-full ${mainImgIdx === idx ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CarDetailsPage;