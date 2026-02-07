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


  const handleNext = () => {
    // Validation
    if (step === 1 && !formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (step === 3) {
      if (!formData.height || !formData.weight || !formData.birthDate || !formData.targetWeight) {
        alert("Please fill in all body stats.");
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

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNext}>
        {step === 4 ? 'Complete Setup' : 'Continue'} <ChevronRight size={20} />
      </button>

      <style>{`
        .goal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        
        .goal-card {
          border: 1px solid #E2E8F0;
          background: white;
          border-radius: 12px;
          padding: 16px 8px;
          font-size: 13px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: 0.2s;
        }
        .goal-card.active { border-color: var(--color-primary); background: #F0FDFA; color: var(--color-primary-dark); font-weight: 600; }
        
        .btn-select {
          padding: 12px; border-radius: 12px; border: 1px solid #E2E8F0; background: white; cursor: pointer;
        }
        .btn-select.active { border-color: var(--color-primary); background: #F0FDFA; color: var(--color-primary-dark); font-weight: 600; }
        
        .activity-card {
           display: flex; align-items: center; gap: 16px;
           padding: 16px;
           background: white;
           border: 1px solid #E2E8F0;
           border-radius: 16px;
           cursor: pointer;
           transition: 0.2s;
        }
        .activity-card.active { border-color: var(--color-primary); box-shadow: var(--shadow-soft); transform: scale(1.02); }
        .icon-box { width: 40px; height: 40px; background: #F1F5F9; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
      `}</style>
    </div>
  );
}
