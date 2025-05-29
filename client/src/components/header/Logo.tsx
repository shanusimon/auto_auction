import { CarFront, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  isAdmin?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", isAdmin = false }) => {
  return (
    <Link
      to="/"
      className={`relative z-[100] flex items-center cursor-pointer ${className}`}
    >
      <div 
        className={`rounded-full p-1 mr-2 flex items-center justify-center ${isAdmin ? 'bg-[#9b87f5]' : 'bg-black'}`}
      >
        {isAdmin ? (
          <ShieldCheck size={20} className="text-white" />
        ) : (
          <CarFront size={20} className="text-[#3BE188]" />
        )}
      </div>
      <span className="text-white font-bold">AUTO</span>
      <span className={`font-bold ${isAdmin ? 'text-[#9b87f5]' : 'text-[#3BE188]'}`}>
        {isAdmin ? 'ADMIN' : 'AUCTION'}
      </span>
    </Link>
  );
};

export default Logo;