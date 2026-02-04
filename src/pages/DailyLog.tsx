import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, DailyLog as DailyLogType } from '../context/UserContext';
import { Plus, Coffee, Utensils, Moon, Zap, Sun, Flame } from 'lucide-react';
import { ActivitySelectionContent } from '../components/ActivitySelection';

const MealItem = ({ icon: Icon, title, calories, onAdd }: { icon: any, title: string, calories: number, onAdd: () => void }) => (
  <div className="card flex-between" style={{ marginBottom: '12px', padding: '16px' }}>
    <div className="flex-center gap-4">
      <div className="meal-icon-box">
        <Icon size={20} />
      </div>
      <div>
        <div className="h3" style={{ fontSize: '16px' }}>{title}</div>
        <div className="body-sm">{calories === 0 ? 'No food logged' : `${calories} kcal`}</div>
      </div>
    </div>
    <button className="btn-icon-add" onClick={onAdd}>
      <Plus size={20} color="white" />
    </button>
  </div>
);

export default function DailyLog() {
  const { dailyStats, updateLog, dailyCalorieTarget } = useUser();

  const navigate = useNavigate();
  const [showActivityModal, setShowActivityModal] = React.useState(false);

  const handleAdd = (type: keyof DailyLogType) => {
    if (type === 'exercise') {
      setShowActivityModal(true);
    } else {
      // Navigate to Chat for food
      navigate('/chat', { state: { mealType: type } });
    }
  };

  const handleLogActivity = (activity: string, duration: number) => {
    // Check for Manual Override from component
    if (activity.startsWith('MANUAL:')) {
      // Manual override: duration param actually holds calories here
      const calories = duration;
      updateLog({ exercise: (dailyStats.exercise || 0) + calories });
      setShowActivityModal(false);
      return;
    }

    let calories = 0;
    // Simple METs-like estimation
    if (activity === 'Running') calories = duration * 10; // ~10 kcal/min
    if (activity === 'Walking') calories = duration * 4;
    if (activity === 'Gym') calories = duration * 7;
    if (activity === 'Swimming') calories = duration * 8;

    // Matches recommendations in ActivitySelection
    if (activity === 'Morning Jog') calories = duration * 8; // ~240 for 30m
    if (activity === 'HIIT Cardio') calories = duration * 15; // ~300-400 for 20m
    if (activity === 'Yoga Flow') calories = duration * 3; // ~135 for 45m
    if (activity === 'Weight Lifting') calories = duration * 5; // ~200 for 40m

    // Default fallback for recommended items if calories is 0
    if (calories === 0 && duration > 0) calories = duration * 5;

    if (activity === 'Sleep') {
      const hours = duration / 60;
      updateLog({ sleep: (dailyStats.sleep || 0) + hours });
    } else {
      updateLog({ exercise: (dailyStats.exercise || 0) + calories });
    }
    setShowActivityModal(false);
  };

  const total = dailyStats.breakfast + dailyStats.lunch + dailyStats.dinner + dailyStats.snack;

  return (
    <div className="animate-fade-in">
      <div className="report-header card-glass" style={{ marginBottom: '24px', borderRadius: '24px', padding: '24px' }}>
        <div className="flex-between">
          <div>
            <div className="label">Daily Intake</div>
            <div className="h1" style={{ color: 'var(--color-primary-dark)' }}>{total}</div>
            <div className="body-sm">of {dailyCalorieTarget} kcal</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label">Burnt</div>
            <div className="h2">{dailyStats.exercise}</div>
            <div className="body-sm">kcal</div>
          </div>
        </div>
        {/* Simple Linear Bar */}
        <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min((total / dailyCalorieTarget) * 100, 100)}%`, background: 'var(--color-primary)', borderRadius: '4px' }} />
        </div>
      </div>

      <div className="section-title h3" style={{ marginBottom: '16px' }}>Meals</div>

      <MealItem
        icon={Coffee}
        title="Breakfast"
        calories={dailyStats.breakfast}
        onAdd={() => handleAdd('breakfast')}
      />

      <MealItem
        icon={Sun}
        title="Lunch"
        calories={dailyStats.lunch}
        onAdd={() => handleAdd('lunch')}
      />

      <MealItem
        icon={Utensils}
        title="Dinner"
        calories={dailyStats.dinner}
        onAdd={() => handleAdd('dinner')}
      />

      <MealItem
        icon={Zap}
        title="Snack"
        calories={dailyStats.snack}
        onAdd={() => handleAdd('snack')}
      />

      <div className="section-title h3" style={{ margin: '24px 0 16px' }}>Activity</div>

      <MealItem
        icon={Flame}
        title="Exercise"
        calories={dailyStats.exercise}
        onAdd={() => handleAdd('exercise')}
      />

      {/* ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card">
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div className="h3">Log Activity</div>
              <button onClick={() => setShowActivityModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <ActivitySelectionContent onClose={() => setShowActivityModal(false)} onLog={handleLogActivity} />
          </div>
        </div>
      )}

      <style>{`
        .meal-icon-box {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: var(--color-bg-app);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-primary);
        }
        .btn-icon-add {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--color-primary);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(78, 205, 196, 0.4);
        }
        .btn-icon-add:active { transform: scale(0.9); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
          display: flex; align-items: flex-end;
        }
        .modal-card {
          width: 100%; background: white; border-top-left-radius: 24px; border-top-right-radius: 24px; padding: 24px;
          animation: slideUp 0.3s ease-out;
          height: 70vh; display: flex; flex-direction: column;
        }
        
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}
