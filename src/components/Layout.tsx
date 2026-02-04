import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, PieChart, User } from 'lucide-react';

export const Layout = () => {
  const location = useLocation();
  // Hide bottom nav on Onboarding or Chat (since Chat is now a sub-feature of Diary)
  if (location.pathname === '/onboarding' || location.pathname === '/chat') {
    return <Outlet />;
  }

  return (
    <div className="layout-container" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span className="nav-label">Home</span>
        </NavLink>

        <NavLink to="/log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ClipboardList size={24} />
          <span className="nav-label">Diary</span>
        </NavLink>

        <NavLink to="/report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PieChart size={24} />
          <span className="nav-label">Report</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span className="nav-label">Me</span>
        </NavLink>
      </nav>

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 16px 20px 16px;
          box-shadow: 0 -10px 20px rgba(0,0,0,0.02);
          z-index: 100;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--color-text-light);
          text-decoration: none;
          transition: 0.3s;
          width: 60px;
        }

        .nav-item.active {
          color: var(--color-primary);
          transform: translateY(-2px);
        }
        
        .nav-label {
          font-size: 10px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
