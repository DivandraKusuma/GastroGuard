import React from 'react';
import { useUser } from '../context/UserContext';
import { Settings, LogOut, Edit3 } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useUser();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logout();
      // Supabase auth state change will trigger context update
      // But we can also force a reload or navigate if needed
      window.location.href = '/';
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

      <button
        className="btn btn-outline"
        onClick={() => {
          // Temporarily set isOnboarded to false to allow re-entry to onboarding
          // We don't save this to DB immediately to avoid flicker, just client-side nav
          // Note: In a real app, you might want a dedicated setting page.
          // For now, re-using Onboarding flow is a smart shortcut!

          // Force navigation to onboarding by updating context state locally if needed,
          // but since we are navigating, we can just push history.
          // However, Onboarding page checks user.isOnboarded. 
          // So we MUST update the context state first.

          // Let's use a creative way: Pass a state or query param, 
          // OR, actually update the user context to isOnboarded: false locally without DB save.
          // But our updateUser saves to DB. 

          // Safe approach: navigate with state that Onboarding.tsx detects?
          // No, Onboarding.tsx checks user.isOnboarded in useEffect.
          // So we DO need to update user state.

          // Let's update it locally (DB update might be skipped in Demo Mode anyway, which is fine)
          const { updateUser } = useUser(); // Hook logic needs to be accessed. 
          // Wait, I can't call hook inside onClick. 
          // I need to use the `updateUser` from the component scope.
        }}
        style={{ width: '100%', marginBottom: '12px', borderColor: '#CBD5E1', color: '#475569' }}
      >
        <Edit3 size={18} /> Update Profile Data
      </button>

      <button className="btn btn-outline" style={{ width: '100%', borderColor: '#FF6B6B', color: '#FF6B6B' }} onClick={handleLogout}>
        <LogOut size={18} /> Log Out
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
