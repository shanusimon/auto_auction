import { CarFront, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  isAdmin?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", isAdmin = false }) => {
  return (
    <Link to="/" className={`flex items-center cursor-pointer ${className}`}>
      <div 
        className={`${isAdmin ? 'bg-[#9b87f5]' : 'bg-black'} rounded-full p-1 mr-2 flex items-center justify-center`}
        style={isAdmin ? { backgroundColor: '#9b87f5 !important' } : {}}
      >
        {isAdmin ? (
          <ShieldCheck size={20} className="text-white" style={{ color: 'white !important' }} />
        ) : (
          <CarFront size={20} className="text-[#3BE188]" />
        )}
      </div>
      <span className="text-white font-bold" style={{ color: 'white !important', fontWeight: 'bold !important' }}>AUTO</span>
      <span 
        className={`font-bold ${isAdmin ? 'text-[#9b87f5]' : 'text-[#3BE188]'}`}
        style={isAdmin ? { color: '#9b87f5 !important', fontWeight: 'bold !important' } : {}}
      >
        {isAdmin ? 'ADMIN' : 'AUCTION'}
      </span>
    </Link>
  );
};

export default Logo;