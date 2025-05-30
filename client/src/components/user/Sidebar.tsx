import { Link, useLocation } from 'react-router-dom';
import { User, Package, FileText, Wallet, PersonStanding } from 'lucide-react';

const UserSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/user/profile', 
      name: 'Profile', 
      icon: User 
    },
    { 
      path: '/user/seller-dashboard', 
      name: 'Seller Dashboard', 
      icon: Package 
    },
    { 
      path: '/user/bids', 
      name: 'My Bids', 
      icon: FileText 
    },
    { 
      path: '/user/chats', 
      name: 'Chats', 
      icon: PersonStanding
    },
    { 
      path: '/user/wallet', 
      name: 'Wallet', 
      icon: Wallet 
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-black border-r border-zinc-800 min-h-screen flex flex-col">
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#3BE188]/10 text-[#3BE188]'
                  : 'text-gray-300 hover:bg-zinc-800'
              }`}
            >
              <item.icon 
                size={18} 
                className={`mr-3 ${isActive(item.path) ? 'text-[#3BE188]' : 'text-gray-400'}`} 
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;