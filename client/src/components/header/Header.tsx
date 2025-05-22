import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, LogOut, UserIcon, Menu } from 'lucide-react';
import Logo from './Logo';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '@/store/slices/user.slice';
import { useLogout } from '@/hooks/auth/useAuth';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { deleteToken } from 'firebase/messaging';
import { messaging } from '@/services/firebase/firebase.config';
import { NotificationCenter } from '../user/NotificationModal';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const logoutUser = useLogout();
  const user = useSelector((state: RootState) => state.user.user);
  const [notificationModalOpen,setNotificationModalOpen] = useState(false);

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

  const openNotification = ()=>{
    setNotificationModalOpen(true)
  }

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
      className="w-full bg-gradient-to-r from-black via-zinc-900 to-black border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              <Link
                to="/auctions"
                className="text-gray-300 hover:text-white px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Auctions
              </Link>
              <Link
                to="/user/community"
                className="text-gray-300 hover:text-white px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Community
              </Link>
              <Link
                to="/bids"
                className="text-gray-300 hover:text-white px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200"
              >
                What's AutoBid?
              </Link>
            </nav>
          </div>

          {/* Sell a Car Button - Always visible on desktop */}
          <div className="hidden md:block">
            <Link
              to="/user/sellerapplication"
              className="bg-gradient-to-r from-green-400 to-green-500 text-black font-bold text-sm rounded-full px-5 py-2 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
            >
              Sell a Car
            </Link>
          </div>
          
          {/* Search, Notifications, and User Profile */}
          <div className="flex items-center gap-4">

            
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200" onClick={()=>openNotification()}>
              <Bell size={18} className="text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 ring-2 ring-black"></span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer rounded-full hover:bg-zinc-800 px-3 py-1.5 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600">
                  {user?.profileImage ? (
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={user.profileImage}
                        alt={user.name}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback className="bg-zinc-700 flex items-center justify-center w-full h-full">
                        <UserIcon size={14} className="text-gray-300" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User size={14} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-300">{user?.name}</span>
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-zinc-800 border border-zinc-700 z-50">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <User size={14} className="mr-3 text-gray-400" />
                      Dashboard
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <LogOut size={14} className="mr-3 text-gray-400" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/auctions"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
            >
              Auctions
            </Link>
            <Link
              to="/user/sellerapplication"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600 transition-colors duration-200"
            >
              Sell a Car
            </Link>
            <Link
              to="/community"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              to="/bids"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
            >
              What's AutoBid?
            </Link>
            

          </div>
        </div>
      )}
      <NotificationCenter open={notificationModalOpen} onOpenChange={setNotificationModalOpen}/>
    </header>
  );
};

export default Header;