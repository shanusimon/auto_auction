export const formatTimeLeft = (auctionEndTime:string | Date) => {
    if (!auctionEndTime) return "Unknown";
    
    // Convert to Date object if string is provided
    const endTime = typeof auctionEndTime === 'string' 
      ? new Date(auctionEndTime) 
      : auctionEndTime;
    
    // Get current time
    const now = new Date();
    
    // If auction has ended
    if (endTime <= now) {
      return "Auction ended";
    }
    
    // Calculate time difference in milliseconds
    const timeDiff = endTime.getTime() - now.getTime();
    
    // Convert to days, hours, minutes
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the output
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  };
  
  /**
   * Check if an auction is active
   * @param {string|Date} auctionEndTime - ISO string or Date object for the auction end time
   * @returns {boolean} True if auction is still active
   */
  export const isAuctionActive = (auctionEndTime:string | Date) => {
    if (!auctionEndTime) return false;
    
    const endTime = typeof auctionEndTime === 'string' 
      ? new Date(auctionEndTime) 
      : auctionEndTime;
    
    return new Date() < endTime;
  };