import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetCarDetails } from "@/hooks/user/useCarDetails";
import Header from "@/components/header/Header";
import {
  DollarSign,
  Users,
  MessageSquare,
  User,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Flag,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionSocket } from "@/services/webSocket/webSockeService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BiddingTermsModal from "@/components/cars/BidTermsAndConditions";
import { useAddCarComment } from "@/hooks/user/useAddCarComment";
import { useCarCommentsAndBids } from "@/hooks/user/useGetAllCommentsAndBids";
import { CombinedItem } from "@/types/CarFormTypes";
import { useConversation } from "@/hooks/user/useConversation";
import { useNavigate } from "react-router-dom";

const CarDetailsPage = () => {
  const { carid } = useParams();
  const { data: carData, isLoading: carLoading, isError: carError, error: carErrorData } = useGetCarDetails(carid);
  const { mutate: getOrCreateConversation} = useConversation();
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("newest");
  const [commentInput, setCommentInput] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [auctionEndTime, setAuctionEndTime] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rulesAccept, setRulesAccept] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.user.user);
  const { mutateAsync: addComment } = useAddCarComment();
  const itemsPerPage = 7;
  

  const [socketConnected, setSocketConnected] = useState(false);
  const socketInitialized = useRef(false);

  const {
    data: commentsAndBidsData,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchCommentsAndBids
  } = useCarCommentsAndBids(carid!);

  useEffect(() => {
    if (carData?.data) {
      setHighestBid(carData.data.highestBid || 0);
      setAuctionEndTime(carData.data.auctionEndTime);
    }
  }, [carData]);


  useEffect(() => {

    const initializeSocket = () => {

      if (!AuctionSocket.connected) {
        AuctionSocket.connect();
        

        AuctionSocket.on('connect', () => {
          console.log('Socket connected');
          setSocketConnected(true);
          
          if (carid) {
            console.log(`Joining auction for car: ${carid}`);
            AuctionSocket.emit("join-auction", { carId: carid });
          }
        });
        
        AuctionSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setSocketConnected(false);
        });
        
        AuctionSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          toast.error("Connection lost. Trying to reconnect...");
          setSocketConnected(false);
        });
      } else if (carid) {
        console.log(`Socket already connected, joining auction for car: ${carid}`);
        AuctionSocket.emit("join-auction", { carId: carid });
        setSocketConnected(true);
      }
    };

    // initialize socket only one time
    if (!socketInitialized.current && carid) {
      initializeSocket();
      socketInitialized.current = true;
    }

    // Handle page visibility changes to manage socket connection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page is visible, checking socket connection');
        if (!AuctionSocket.connected) {
          console.log('Socket not connected, reconnecting...');
          initializeSocket();
        }
      }
    };

    // Event listeners for visibility and focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      if (AuctionSocket.connected && carid) {
        console.log(`Leaving auction for car: ${carid}`);
        AuctionSocket.emit("leave-auction", { carId: carid });
      }
    };
  }, [carid]);


  useEffect(() => {
    if (!carid || !socketConnected) return;

    // bid placement response
    const handleBidPlaced = (data) => {
      setIsBidding(false);
      if (data.success) {
        toast.success("Bid placed successfully");
        setBidAmount("");
        setShowBidModal(false);
        refetchCommentsAndBids();
      } else {
        toast.error(data.message || "Failed to place bid");
      }
    };

    const handleNewBid = (data) => {
      if (data.success) {
        setHighestBid(data.bid.amount);
        if (data.bid.auctionEndTime) {
          setAuctionEndTime(data.bid.auctionEndTime);
        }
        refetchCommentsAndBids();
      }
    };

    console.log('Setting up bid event handlers');
    AuctionSocket.on("bid-placed", handleBidPlaced);
    AuctionSocket.on("new-bid", handleNewBid);

    // Cleanup
    return () => {
      console.log('Removing bid event handlers');
      AuctionSocket.off("bid-placed", handleBidPlaced);
      AuctionSocket.off("new-bid", handleNewBid);
    };
  }, [carid, refetchCommentsAndBids, socketConnected]);

  const reconnectSocket = () => {
    console.log('Manual socket reconnection triggered');
    if (!AuctionSocket.connected) {
      AuctionSocket.connect();
      
      if (carid) {
        setTimeout(() => {
          AuctionSocket.emit("join-auction", { carId: carid });
          toast.success("Reconnected to auction");
        }, 500);
      }
    } else if (carid) {
      AuctionSocket.emit("join-auction", { carId: carid });
      toast.success("Reconnected to auction");
    }
  };

  // Auction timer
  useEffect(() => {
    if (!auctionEndTime) return;

    const endTime = new Date(auctionEndTime).getTime();

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
  }, [auctionEndTime]);

 
  const handleKeyDown = useCallback(
    (e) => {
      if (!showImageModal) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setMainImgIdx((prev) => (prev + 1) % (carData?.data?.images?.length || 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setMainImgIdx(
          (prev) => (prev - 1 + (carData?.data?.images?.length || 1)) % (carData?.data?.images?.length || 1)
        );
      } else if (e.key === "Escape") {
        setShowImageModal(false);
      }
    },
    [showImageModal, carData?.data?.images?.length]
  );

  const handlePostComment = async () => {
    if (commentInput.trim() !== "") {
      try {
        await addComment({
          carId: carid,
          content: commentInput,
        });
        toast.success("Comment posted successfully");
        setCommentInput("");
        refetchCommentsAndBids();
      } catch (error) {
        console.error("Error posting comment:", error);
        toast.error("Failed to post comment");
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    try {

      toast.success("Comment liked");
      refetchCommentsAndBids(); 
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
    }
  };

  const handleReplyComment = (commentId) => {

    toast.info("Reply functionality coming soon");
  };

  const handleFlagComment = (commentId) => {

    toast.info("Comment flagged for review");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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

  const handleBidClick = () => {
    if (isEnded) {
      toast.error("Auction has ended");
      return;
    }

    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }

    // Check socket connection before proceeding
    if (!socketConnected) {
      toast.error("Not connected to auction. Reconnecting...");
      reconnectSocket();
      return;
    }

    if (rulesAccept) {
      setShowBidModal(true);
    } else {
      setRulesOpen(true);
    }
  };

  const handleChatWithSeller = () => {
    getOrCreateConversation(seller._id, {
      onSuccess: (data) => {
        console.log('Conversation started or fetched:', data); 
        navigate(`/user/chats/conversation/${data.conversationId}`, {
          state: { conversationId: data.conversationId },
        });
      },
      onError: (error) => {
        console.error('Failed to start chat:', error);
        alert('Failed to start chat. Please try again.');
      },
    });
  };

  const handleAcceptRules = () => {
    setRulesAccept(true);
    setRulesOpen(false);
    setShowBidModal(true);
  };

  const handleConfirmBid = () => {
    // Double check socket connection before placing bid
    if (!socketConnected) {
      toast.error("Lost connection to auction. Reconnecting...");
      reconnectSocket();
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= highestBid) {
      toast.error(`Bid amount must be higher than ₹${highestBid.toLocaleString()}`);
      return;
    }

    setIsBidding(true);
    const userId = user?.id;
    console.log(`Placing bid: car=${carid}, amount=${amount}, user=${userId}`);
    AuctionSocket.emit("place-bid", { carId: carid, amount, userId });
  };

  if (carLoading) {
    return (
      <div className="min-h-screen bg-[#17191C] text-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading car details...</div>
      </div>
    );
  }

  if (carError) {
    return (
      <div className="min-h-screen bg-[#17191C] text-white flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 max-w-md">
          <div className="text-xl font-bold mb-2">Error Loading Details</div>
          <div className="text-zinc-300">{carErrorData?.message || "Failed to load car details"}</div>
        </div>
      </div>
    );
  }

  const car = carData?.data;
  const seller = carData?.seller;

  const comments = commentsAndBidsData?.data?.comments || [];
  const bids = commentsAndBidsData?.data?.bids || [];
  const numBids = bids.length;
  const numComments = comments.length;

  const sortedItems = (): CombinedItem[] => {
    let items: CombinedItem[] = [];
  
    comments.forEach((comment: any) => {
      items.push({
        ...comment,
        type: 'comment',
      });
    });
  
    bids.forEach((bid: any) => {
      items.push({
        ...bid,
        createdAt: bid.timestamp,
        type: 'bid',
      });
    });
  
    let sortedItems;
    
    switch (activeTab) {
      case "newest":
        sortedItems = items.sort((a, b) => {
          return new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime();
        });
        break;
  
      case "upvoted":
        sortedItems = items
          .filter((item) => item.type === "comment" && (item as any).likes?.length > 0)
          .sort((a, b) => ((b as any).likes?.length || 0) - ((a as any).likes?.length || 0));
        break;
  
      case "seller":
        sortedItems = items.filter((item) => item.userId?.id === seller?.userId?.id);
        break;
  
      case "bid":
        sortedItems = items
          .filter((item) => item.type === "bid")
          .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());
        break;
  
      default:
        sortedItems = items.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());
    }
    
    return sortedItems;
  };

  const getPaginatedItems = () => {
    const allItems = sortedItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allItems.slice(startIndex, endIndex);
  };
  const totalItems = sortedItems().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const detailsRows = [
    [
      {
        label: "Make",
        value: <span className="text-blue-300 hover:underline cursor-pointer">{car.make}</span>,
      },
      { label: "Transmission", value: car.transmission },
    ],
    [
      {
        label: "Model",
        value: <span className="text-blue-300 hover:underline cursor-pointer">{car.model}</span>,
      },
      { label: "Fuel Type", value: car.fuel },
    ],
    [
      { label: "Year", value: car.year },
      { label: "Body Type", value: car.bodyType },
    ],
    [
      { label: "Mileage", value: `${car.mileage} km` },
      { label: "Exterior Color", value: car.exteriorColor || "-" },
    ],
    [
      { label: "Status", value: car.approvalStatus ? "on-going" : "ended" },
      { label: "Interior Color", value: car.interiorColor || "-" },
    ],
    [
      {
        label: "Location",
        value: <span className="text-blue-300 hover:underline cursor-pointer">{car.location}</span>,
      },
      { label: "Reserve Price", value: car.reservedPrice ? "Yes" : "No" },
    ],
    [
      {
        label: "Seller",
        value: (
          <span className="flex items-center gap-2">
            <User className="w-5 h-5 inline text-zinc-400" />
            <span className="font-bold">{seller.userId?.name || "Seller123"}</span>
            <span className="ml-2 px-2 py-0.5 rounded bg-green-900/60 text-xs text-[#38ecb1] border border-green-700">
              Contact
            </span>
          </span>
        ),
      },
      {
        label: "Auction Ends",
        value: car.auctionEndTime ? new Date(car.auctionEndTime).toLocaleString() : "-",
      },
    ],
  ];

  const nextImage = () => {
    setMainImgIdx((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setMainImgIdx((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white flex flex-col py-4 px-0 font-inter">
        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="mb-2">
            <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              {car.title}
            </div>
            <div className="text-base md:text-lg text-zinc-200">
              {car.year} {car.make} {car.model} - {car.location}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="w-full aspect-[16/8] md:aspect-[21/9] h-full rounded-xl overflow-hidden bg-zinc-800 relative shadow-lg border border-zinc-700 cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={car.images[mainImgIdx]}
                alt="Car Main"
                className="object-cover w-full h-full transition-all duration-300"
              />
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

            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 px-1">
              {car.images.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  className={`cursor-pointer relative group rounded-lg overflow-hidden border ${mainImgIdx === idx ? "border-[#3BE188]" : "border-zinc-700/60"
                    } flex-shrink-0`}
                  style={{ width: "120px", height: "80px" }}
                >
                  <img
                    src={src}
                    alt={`Car ${idx + 1}`}
                    className="object-cover w-full h-full transition-all duration-150 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 bg-zinc-900/95 border border-zinc-800 rounded-xl px-5 py-4 shadow-lg">
            <div className="flex items-center gap-4 flex-grow flex-wrap justify-between w-full">
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <Clock className="w-5 h-5 text-[#3BE188]" />
                Time Left <span className="font-extrabold ml-2 text-lg">{formatTimeRemaining()}</span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <DollarSign className="w-5 h-5 text-[#3BE188]" />
                High Bid{" "}
                <span className="font-extrabold ml-2 text-lg">
                  ${highestBid ? highestBid.toLocaleString() : "0"}
                </span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <Users className="w-5 h-5 text-[#3BE188]" />
                Bids <span className="font-extrabold ml-2 text-lg">{numBids}</span>
              </span>
              <span className="flex items-center gap-1 text-base font-medium text-white/90">
                <MessageSquare className="w-5 h-5 text-[#3BE188]" />
                Comments <span className="font-extrabold ml-2 text-lg">{numComments}</span>
              </span>
              <Button
                className="bg-[#3BE188] text-[#222] font-bold rounded-md px-6 py-2 text-base shadow hover:bg-[#58e7a7] transition"
                onClick={handleBidClick}
                disabled={isEnded}
              >
                Place Bid
              </Button>
            </div>
          </div>
        </div>

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

        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="bg-[#191B1E] border border-zinc-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-zinc-200 whitespace-pre-line">{car.description}</p>
          </div>
        </div>

        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4">Seller Information</h2>
          <div className="w-full bg-zinc-900/95 border border-zinc-800 rounded-xl p-6 flex items-center gap-5">
            <div className="bg-zinc-800 rounded-full w-16 h-16 flex items-center justify-center border border-zinc-700 shrink-0">
              <User className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-white">{seller.userId.name || "Seller123"}</span>
                <span className="px-2 py-0.5 rounded bg-green-900/60 text-xs text-[#38ecb1] border border-green-700">
                  Verified
                </span>
              </div>
              <div className="text-sm text-zinc-400 mb-3">
                <span>
                  Member since{" "}
                  {new Date(seller.sellerSince).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  className="px-5 py-2 text-sm bg-[#1EAEDB] hover:bg-[#0990b8] font-semibold rounded shadow transition"
                  variant="default"
                  onClick={handleChatWithSeller}
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

        <div className="w-full max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[1200px] mx-auto mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-3">
            <h2 className="text-lg font-bold text-white">Comments & Bids</h2>
            <div className="flex gap-2 text-zinc-300 text-sm flex-wrap">
              <button
                className={`px-3 py-1 rounded ${activeTab === "newest" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"
                  }`}
                onClick={() => {
                  setActiveTab("newest");
                  setCurrentPage(1);
                }}
              >
                Newest
              </button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "upvoted" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"
                  }`}
                onClick={() => {
                  setActiveTab("upvoted");
                  setCurrentPage(1);
                }}
              >
                Most Upvoted
              </button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "seller" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"
                  }`}
                onClick={() => {
                  setActiveTab("seller");
                  setCurrentPage(1);
                }}
              >
                Seller Comments
              </button>
              <button
                className={`px-3 py-1 rounded ${activeTab === "bid" ? "bg-zinc-800 text-white" : "hover:bg-zinc-700"
                  }`}
                onClick={() => {
                  setActiveTab("bid");
                  setCurrentPage(1);
                }}
              >
                Bid History
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 pr-24 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#3BE188]"
                  placeholder="Add a Comment..."
                />
                <button
                  onClick={handlePostComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#3BE188] text-black text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#32c976] transition-all"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-lg text-zinc-400">Loading comments and bids...</div>
            </div>
          ) : commentsError ? (
            <div className="flex justify-center py-8">
              <div className="text-lg text-red-400">Failed to load comments and bids</div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {getPaginatedItems().map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                    {item.userId?.profileImage ? (
                      <img
                        src={item.userId?.profileImage}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{item.userId?.name || "User"}</span>

                      {/* Show seller badge if applicable */}
                      {item.userId?.id === seller?.userId && (
                        <span className="ml-1 text-xs px-2 py-0.5 rounded bg-green-900/60 text-[#38ecb1] border border-green-700">
                          Seller
                        </span>
                      )}

                      {/* Show if it's a bid */}
                      {item.type === "bid" && (
                        <span className="ml-1 text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                          Bid
                        </span>
                      )}

                      <span className="text-xs text-zinc-400">{formatDate(item.createdAt)}</span>
                    </div>

                    {item.type === "bid" ? (
                      <div className="mt-2 text-base text-zinc-200">
                        <span className="font-bold text-[#3BE188]">Bid: ${item.amount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="mt-2 text-base text-zinc-200">{item.content}</div>
                    )}

                    {/* Show interaction buttons only for comments */}
                    {item.type === "comment" && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{item.likes?.length || 0}</span>
                        </span>
                        <button
                          onClick={() => handleLikeComment(item.id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-white"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Like
                        </button>
                        <button
                          onClick={() => handleReplyComment(item.id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-white"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                        <button
                          onClick={() => handleFlagComment(item.id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-white"
                        >
                          <Flag className="w-4 h-4" />
                          Flag
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sortedItems().length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  {activeTab === "bid" ? "No bids yet" :
                    activeTab === "seller" ? "No seller comments yet" :
                      activeTab === "upvoted" ? "No upvoted comments yet" : "No comments or bids yet"}
                </div>
              )}
              
              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 mb-4">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${currentPage === 1 
                        ? 'text-zinc-600 cursor-not-allowed' 
                        : 'text-zinc-300 hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {/* Show page numbers with ellipsis for many pages */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Always show first, last, current and pages around current
                      if (
                        pageNumber === 1 || 
                        pageNumber === totalPages || 
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              currentPage === pageNumber
                                ? 'bg-[#3BE188] text-black font-bold'
                                : 'text-zinc-300 hover:bg-zinc-800'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      
                      // Show ellipsis instead of many page numbers
                      // but only once for each gap
                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNumber} className="text-zinc-500 px-1">
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${currentPage === totalPages
                        ? 'text-zinc-600 cursor-not-allowed'
                        : 'text-zinc-300 hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>

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
                  {car.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImgIdx(idx)}
                      className={`w-3 h-3 rounded-full ${mainImgIdx === idx ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showBidModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="bg-[#191B1E] border border-zinc-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Place Your Bid</h2>
                <button
                  className="text-zinc-400 hover:text-white"
                  onClick={() => {
                    setShowBidModal(false);
                    setBidAmount("");
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Bid Amount (₹)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3BE188]"
                  placeholder={`Enter amount higher than $${highestBid.toLocaleString()}`}
                />
                {bidAmount && parseFloat(bidAmount) <= highestBid && (
                  <p className="text-red-500 text-sm mt-1">
                    Bid must be higher than ${highestBid.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  className="bg-zinc-700 text-white font-semibold rounded-md px-4 py-2 hover:bg-zinc-600 transition"
                  onClick={() => {
                    setShowBidModal(false);
                    setBidAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#3BE188] text-[#222] font-bold rounded-md px-4 py-2 hover:bg-[#58e7a7] transition"
                  onClick={handleConfirmBid}
                  disabled={isBidding || !bidAmount || parseFloat(bidAmount) <= highestBid}
                >
                  {isBidding ? "Placing Bid..." : "Confirm Bid"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BiddingTermsModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onAccept={handleAcceptRules}
      />
    </>
  );
}

export default CarDetailsPage