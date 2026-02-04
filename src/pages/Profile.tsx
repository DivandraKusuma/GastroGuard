import React from 'react';
import { useUser } from '../context/UserContext';
import { Settings, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useUser();

  const handleLogout = () => {
    if (confirm("Reset all data and start over?")) {
      localStorage.removeItem('gastroUser');
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="profile-header flex-center flex-col" style={{ padding: '32px 0' }}>
        <div className="avatar-large">{user.name.charAt(0)}</div>
        <div className="h1" style={{ marginTop: '16px' }}>{user.name}</div>
        <div className="body-sm">{user.gender} • {new Date().getFullYear() - new Date(user.birthDate).getFullYear()} yo</div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="h3" style={{ marginBottom: '16px' }}>Health Profile</div>
        <div className="row-item">
          <span>Height</span>
          <b>{user.height} cm</b>
        </div>
        <div className="row-item">
          <span>Weight</span>
          <b>{user.weight} kg</b>
        </div>
        <div className="row-item">
          <span>Goal</span>
          <b style={{ textTransform: 'capitalize' }}>{user.goal}</b>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="h3" style={{ marginBottom: '16px' }}>Medical Conditions</div>
        <div className="tags-container">
          {user.medicalConditions.length > 0 ? user.medicalConditions.map((c, i) => (
            <span key={i} className="tag">{c}</span>
          )) : <span className="body-sm">None listed</span>}
        </div>
      </div>

      <button className="btn btn-outline" style={{ width: '100%', borderColor: '#FF6B6B', color: '#FF6B6B' }} onClick={handleLogout}>
        <LogOut size={18} /> Reset App Data
      </button>

      <style>{`
        .avatar-large {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: var(--gradient-mint);
          color: white;
          font-size: 40px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-float);
        }
        .row-item {
          display: flex; justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #F1F5F9;
        }
        .row-item:last-child { border-bottom: none; }
        .tag {
          background: #F0FDFA; color: var(--color-primary-dark);
          padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;
          display: inline-block; margin-right: 8px; margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
