import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { AdminLogout } from '@/store/slices/adminSlice';
import { useadminLogout } from '@/hooks/admin/adminAuth';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const logoutAdmin = useadminLogout();

  const handleLogout =async() => {
    try {
      const response = await logoutAdmin.mutateAsync();
      dispatch(AdminLogout());
      console.log(response)
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.log("error on handle logout")
    }
    
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '70px',
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        width: '100%',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</h1>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            position: 'relative'
          }}
        >
          <Bell size={20} style={{ color: '#555' }} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: '#9b87f5',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          ></span>
        </button>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#9b87f5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <User size={16} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left'
            }}
          >
            <span style={{ fontWeight: '500', fontSize: '14px' }}>Admin User</span>
            <span style={{ color: '#8E9196', fontSize: '12px' }}>Administrator</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(155, 135, 245, 0.1)',
            color: '#9b87f5',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;