import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserGoal, ActivityLevel, Gender } from '../context/UserContext';
import { ChevronRight, Heart, Activity, User, Check } from 'lucide-react';

export default function Onboarding() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // If already onboarded, redirect to Dashboard
  React.useEffect(() => {
    if (user.isOnboarded) {
      navigate('/', { replace: true });
    }
  }, [user.isOnboarded]);

  const [formData, setFormData] = useState({
    name: '',
    goal: 'maintain' as UserGoal,
    healthPurpose: '',
    medicalConditions: '',
    height: '',
    weight: '',
    targetWeight: '',
    birthDate: '',
    gender: 'male' as Gender,
    activityLevel: 'moderate' as ActivityLevel
  });


  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleNext = () => {
    // Validation
    if (step === 1 && !formData.name.trim()) {
      showToast("Please enter your name.");
      return;
    }
    if (step === 3) {
      if (!formData.height || !formData.weight || !formData.birthDate || !formData.targetWeight) {
        showToast("Please fill in all body stats.");
        return;
      }
    }

    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      await updateUser({
        ...formData,
        height: Number(formData.height) || 0,
        weight: Number(formData.weight) || 0,
        targetWeight: Number(formData.targetWeight) || 0,
        medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(s => s.trim()) : [],
        isOnboarded: true
      });
      // Short delay to ensure propagation
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error("Onboarding failed", error);
    }
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h1 className="h1" style={{ marginBottom: '8px' }}>Welcome!</h1>
      <p className="body-sm" style={{ marginBottom: '32px' }}>Let's start by getting to know you.</p>

      <div className="form-group">
        <label className="label">What should we call you?</label>
        <input
          className="input-field"
          placeholder="Your Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-group" style={{ marginTop: '24px' }}>
        <label className="label">What is your main goal?</label>
        <div className="goal-grid">
          {['loss', 'maintain', 'gain'].map((g) => (
            <button
              key={g}
              className={`goal-card ${formData.goal === g ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, goal: g as UserGoal })}
            >
              {g === 'loss' && '📉 Lose Weight'}
              {g === 'maintain' && '⚖️ Maintain'}
              {g === 'gain' && '📈 Gain Weight'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <h1 className="h1">Health Context</h1>
      <p className="body-sm" style={{ marginBottom: '32px' }}>Why are you here? (Optional)</p>

      <div className="form-group">
        <label className="label">Specific Purpose</label>
        <input
          className="input-field"
          placeholder="e.g. Managing Diabetes, Better Sleep..."
          value={formData.healthPurpose}
          onChange={e => setFormData({ ...formData, healthPurpose: e.target.value })}
        />
      </div>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label className="label">Medical History (Comma separated)</label>
        <textarea
          className="input-field"
          style={{ height: '100px', fontFamily: 'inherit' }}
          placeholder="e.g. Maag, Lactose Intolerance"
          value={formData.medicalConditions}
          onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      <h1 className="h1">Body Stats</h1>
      <p className="body-sm" style={{ marginBottom: '32px' }}>Used to calculate your daily metabolic rate.</p>

      <div className="flex-between gap-4">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Height (cm)</label>
          <input type="number" className="input-field" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Weight (kg)</label>
          <input type="number" className="input-field" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="label">Target Weight (kg)</label>
        <input type="number" className="input-field" value={formData.targetWeight} onChange={e => setFormData({ ...formData, targetWeight: e.target.value })} />
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="label">Date of Birth</label>
        <input type="date" className="input-field" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} />
      </div>

      <div className="flex-between gap-4" style={{ marginTop: '16px' }}>
        <button
          className={`btn-select ${formData.gender === 'male' ? 'active' : ''}`}
          onClick={() => setFormData({ ...formData, gender: 'male' })}
          style={{ flex: 1 }}
        > Male </button>
        <button
          className={`btn-select ${formData.gender === 'female' ? 'active' : ''}`}
          onClick={() => setFormData({ ...formData, gender: 'female' })}
          style={{ flex: 1 }}
        > Female </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-fade-in">
      <h1 className="h1">Activity Level</h1>
      <p className="body-sm" style={{ marginBottom: '32px' }}>How active are you usually?</p>

      <div className="activity-list flex-col gap-4">
        {['low', 'moderate', 'high'].map((level) => (
          <button
            key={level}
            className={`activity-card ${formData.activityLevel === level ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, activityLevel: level as ActivityLevel })}
          >
            <div className="icon-box">
              {level === 'low' && '🛋️'}
              {level === 'moderate' && '🚶'}
              {level === 'high' && '🔥'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{level}</div>
              <div className="body-sm">
                {level === 'low' && 'Sedentary job, little exercise'}
                {level === 'moderate' && 'Light exercise 3-5 days/week'}
                {level === 'high' && 'Hard exercise 6-7 days/week'}
              </div>
            </div>
            {formData.activityLevel === level && <Check size={20} color="var(--color-primary)" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px 24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div className="progress-bar-container" style={{ display: 'flex', gap: '4px', marginBottom: '40px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: '4px', flex: 1, borderRadius: '2px', background: i <= step ? 'var(--color-primary)' : '#E2E8F0', transition: '0.3s' }} />
          ))}
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {step > 1 && (
          <button
            className="btn"
            style={{ width: '48px', padding: 0, justifyContent: 'center', background: '#F1F5F9', color: '#64748B' }}
            onClick={() => setStep(step - 1)}
          >
            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext}>
          {step === 4 ? 'Complete Setup' : 'Continue'} <ChevronRight size={20} />
        </button>
      </div>

      {/* Custom Toast Notification */}
      {toast.visible && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
          padding: '12px 24px', borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000, fontWeight: 500, fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ⚠️ {toast.message}
        </div>
      )}

      <style>{`
        /* --- Modern Onboarding Styles --- */
        .goal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        
        .goal-card {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px 12px;
          font-size: 14px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .goal-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .goal-card.active { 
          border-color: var(--color-primary); 
          background: #F0FDFA; 
          color: var(--color-primary-dark); 
          font-weight: 600; 
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
        }
        
        .btn-select {
          padding: 16px; 
          border-radius: 16px; 
          border: 1px solid #E2E8F0; 
          background: #FFFFFF; 
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          color: var(--color-text-body);
        }
        .btn-select:hover { background: #F8FAFC; border-color: #CBD5E1; }
        .btn-select.active { 
          border-color: var(--color-primary); 
          background: #F0FDFA; 
          color: var(--color-primary-dark); 
          font-weight: 600; 
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.1);
        }
        
        .activity-card {
           display: flex; align-items: center; gap: 16px;
           padding: 20px;
           background: #FFFFFF;
           border: 1px solid #E2E8F0;
           border-radius: 20px;
           cursor: pointer;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           position: relative;
           overflow: hidden;
        }
        .activity-card:hover { border-color: var(--color-primary-light); background: #F8FAFC; }
        .activity-card.active { 
          border-color: var(--color-primary); 
          background: #F0FDFA;
          box-shadow: 0 8px 20px -4px rgba(13, 148, 136, 0.15); 
          transform: scale(1.02); 
        }
        
        .icon-box { 
          width: 48px; height: 48px; 
          background: #F1F5F9; 
          border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 24px;
          transition: 0.3s;
        }
        .activity-card.active .icon-box { background: #CCFBF1; }

        /* Input Enhancements */
        .input-field {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 16px;
          transition: 0.3s;
          outline: none;
        }
        .input-field:focus {
          border-color: var(--color-primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
        }
        
        /* Typography spacer */
        .label { margin-bottom: 8px; display: block; font-weight: 500; color: var(--color-text-header); }

      `}</style>
    </div>
  );
}
