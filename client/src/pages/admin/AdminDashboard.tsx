import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { BarChart, UsersRound, ShoppingCart, CreditCard } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const dashboardMetrics = [
    { icon: UsersRound, label: 'Total Customers', value: '1,243', change: '+12.5%', color: '#9b87f5' },
    { icon: ShoppingCart, label: 'Total Orders', value: '8,594', change: '+23.1%', color: '#22C55E' },
    { icon: CreditCard, label: 'Revenue', value: '$253,098', change: '+18.3%', color: '#3B82F6' },
    { icon: BarChart, label: 'Conversion Rate', value: '24.8%', change: '+4.6%', color: '#F59E0B' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Sidebar />
      
      <div 
        style={{
          marginLeft: '250px',
          width: 'calc(100% - 250px)',
          transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}
      >
        <Header title="Dashboard" />
        
        <main 
          style={{
            padding: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          <h2 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}
          >
            Overview
          </h2>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}
          >
            {dashboardMetrics.map((metric, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#6B7280'
                    }}
                  >
                    {metric.label}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: `${metric.color}10`
                    }}
                  >
                    <metric.icon size={20} style={{ color: metric.color }} />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  >
                    {metric.value}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#22C55E',
                      marginBottom: '4px'
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#6B7280'
            }}
          >
            <BarChart size={48} style={{ marginBottom: '16px', color: '#9b87f5' }} />
            <p>Analytics and chart data will appear here</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;