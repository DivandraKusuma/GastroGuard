import React from 'react';
import { useUser } from '../context/UserContext';
import { Flame, Moon, Smile } from 'lucide-react';

const CircularProgress = ({ value, max, label, subLabel }: { value: number, max: number, label: string, subLabel: string }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="#E2E8F0"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--color-primary)"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="h1" style={{ color: 'var(--color-primary-dark)' }}>{Math.round(value)}</div>
        <div className="label">{label}</div>
        <div className="body-sm" style={{ marginTop: '4px' }}>{subLabel}</div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, dailyStats, dailyCalorieTarget } = useUser();

  const totalConsumed = dailyStats.breakfast + dailyStats.lunch + dailyStats.dinner + dailyStats.snack;
  const remaining = dailyCalorieTarget - totalConsumed + dailyStats.exercise;
  const progressValue = remaining > 0 ? remaining : 0; // Just visual logic

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '20px' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <div className="body-sm">Welcome back,</div>
          <div className="h2">{user.name || 'Guest'} 👋</div>
        </div>
        <div className="avatar-placeholder">{user.name.charAt(0)}</div>
      </div>

      {/* Main Circle */}
      <div className="card card-glass flex-center flex-col" style={{ marginBottom: '32px', padding: '40px 20px' }}>
        <CircularProgress
          value={remaining}
          max={dailyCalorieTarget}
          label="REM. CALORIES"
          subLabel={`Goal: ${dailyCalorieTarget}`}
        />
      </div>

      {/* Stats Cards */}
      <div className="h3" style={{ marginBottom: '16px' }}>Today's Status</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        <div className="card flex-col gap-2">
          <div className="icon-circle" style={{ background: '#FFF4E6', color: '#FFA94D' }}>
            <Flame size={20} />
          </div>
          <div className="label">Activity</div>
          <div className="h3">{dailyStats.exercise} <span className="body-sm">kcal</span></div>
        </div>

        <div className="card flex-col gap-2">
          <div className="icon-circle" style={{ background: '#E3FAFC', color: '#22B8CF' }}>
            <Moon size={20} />
          </div>
          <div className="label">Sleep</div>
          <div className="h3">{dailyStats.sleep} <span className="body-sm">hrs</span></div>
        </div>

        <div className="card flex-col gap-2" style={{ gridColumn: 'span 2', flexDirection: 'row', alignItems: 'center' }}>
          <div className="icon-circle" style={{ background: '#F3F0FF', color: '#845EF7' }}>
            <Smile size={20} />
          </div>
          <div>
            <div className="label">Mood Status</div>
            <div className="h3">Feeling Good</div>
          </div>
        </div>

      </div>

      {/* Macronutrients */}
      <div className="h3" style={{ marginBottom: '16px', marginTop: '24px' }}>Macronutrients</div>
      <div className="card flex-col gap-3">
        {['Protein', 'Carbs', 'Fat'].map((macro, i) => (
          <div key={macro}>
            <div className="flex-between body-sm" style={{ marginBottom: '4px' }}>
              <span>{macro}</span>
              <span>0 / 100g</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: '0%', // Start at 0
                height: '100%',
                background: i === 0 ? '#10B981' : i === 1 ? '#3B82F6' : '#F59E0B',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .avatar-placeholder {
          width: 48px; height: 48px;
          background: var(--gradient-mint);
          border-radius: 50%;
          color: white;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .icon-circle {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>
    </div>
  );
}
