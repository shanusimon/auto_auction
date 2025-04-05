
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  FolderInput
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: FolderInput, label: 'Seller Request', path: '' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      style={{
        width: collapsed ? '80px' : '250px',
        height: '100vh',
        backgroundColor: '#1A1F2C',
        color: 'white',
        transition: 'width 0.3s ease',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '16px 0' : '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          height: '70px'
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Shield size={24} style={{ color: '#9b87f5' }} />
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Portal</span>
          </div>
        )}
        {collapsed && (
          <Shield size={24} style={{ color: '#9b87f5' }} />
        )}
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8E9196',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '4px',
            marginLeft: collapsed ? '0' : 'auto'
          }}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          padding: '20px 10px',
          overflow: 'hidden'
        }}
      >
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '12px' : '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive(item.path) ? 'white' : '#8E9196',
              backgroundColor: isActive(item.path) ? 'rgba(155, 135, 245, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
              marginBottom: '4px',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
          >
            <item.icon size={20} style={{ color: isActive(item.path) ? '#9b87f5' : '#8E9196' }} />
            {!collapsed && (
              <span style={{ fontWeight: isActive(item.path) ? '500' : 'normal' }}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          padding: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#8E9196',
          display: collapsed ? 'none' : 'block'
        }}
      >
        Admin Portal v1.0
      </div>
    </div>
  );
};

export default Sidebar;