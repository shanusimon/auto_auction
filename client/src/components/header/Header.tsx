import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, LogOut, UserIcon } from 'lucide-react';
import Logo from './Logo';
import { useDispatch } from 'react-redux';
import { userLogout } from '@/store/slices/user.slice';
import { useLogout } from '@/hooks/auth/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { deleteToken } from 'firebase/messaging';
import { messaging } from '@/services/firebase/firebase.config';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const logoutUser = useLogout();
  const user = useSelector((state: RootState) => state.user.user)


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      try {
        await deleteToken(messaging);
        localStorage.removeItem("fcmToken");
        console.log("FCM token deleted on logout");
      } catch (err) {
        console.warn("Failed to delete FCM token (proceeding anyway):", err);
      }

      const response = await logoutUser.mutateAsync();
      console.log("Logout response:", response);
  
      dispatch(userLogout());
  
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(userLogout());

    }
  };

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: "#000000",
        borderBottom: "1px solid #222222"
      }}
    >
      {/* Left side - Logo and navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Logo />

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/auctions"
            className="text-sm font-medium hover:opacity-80 transition-opacity text-white"
          >
            Auctions
          </Link>
          <Link
            to="/user/sellerapplication"
            className="text-sm font-bold rounded-full px-5 py-2 transition-all duration-200 hover:opacity-90 bg-[#3BE188] text-black"
          >
            Sell a Car
          </Link>
          <Link
            to="/community"
            className="text-sm font-medium hover:opacity-80 transition-opacity text-white"
          >
            Community
          </Link>
          <Link
            to="/bids"
            className="text-sm font-medium hover:opacity-80 transition-opacity text-white"
          >
            What's AutoBid?
          </Link>
        </nav>
      </div>

      {/* Right side - Search, notifications, and user */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <div className="relative w-64 lg:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for cars (ex. BMW, Audi, Ford)"
              className="w-full h-9 pl-10 pr-4 rounded-md bg-zinc-800 text-white border-none outline-none"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2">
          <Bell size={20} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3BE188]"></span>
        </button>

        {/* Username Display with Dropdown */}
        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
        <div
  className="flex items-center cursor-pointer"
  onClick={() => setShowDropdown(!showDropdown)}
>
  <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden mr-2">
    {user?.profileImage ? (
      <Avatar className="w-full h-full">
        <AvatarImage
          src={user.profileImage}
          alt={user.name}
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-zinc-700 flex items-center justify-center w-full h-full">
          <UserIcon size={16} className="text-gray-400" />
        </AvatarFallback>
      </Avatar>
    ) : (
      <User size={16} className="text-white" />
    )}
  </div>
  <span className="text-sm font-medium text-white">{user?.name}</span>
</div>


          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 w-40 rounded-md shadow-lg z-50 bg-zinc-800">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link
                  to="/user/profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-zinc-700 transition-all duration-200 text-white"
                >

                  <User size={16} className="mr-2 text-gray-400" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-zinc-700 transition-all duration-200 text-white"
                >
                  <LogOut size={16} className="mr-2 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;