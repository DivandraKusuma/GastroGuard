import React, { useState } from 'react';
import { Search, PenTool, Moon, Zap, Flame, ChevronRight, Clock } from 'lucide-react';

export const ActivitySelectionContent = ({ onClose, onLog }: { onClose: () => void, onLog: (name: string, val: number) => void }) => {
    const [view, setView] = useState<'main' | 'exercise_search' | 'exercise_manual' | 'sleep_input'>('main');
    const [manualName, setManualName] = useState('');
    const [manualCal, setManualCal] = useState('');
    const [sleepDuration, setSleepDuration] = useState('');

    // MAIN SELECTION VIEW
    if (view === 'main') {
        return (
            <div className="flex-col gap-4 animate-fade-in" style={{ flex: 1 }}>
                <button className="option-card" onClick={() => setView('exercise_search')}>
                    <div className="icon-box" style={{ background: '#FF6B6B', color: 'white' }}>
                        <Flame size={24} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <div className="h3">Exercise</div>
                        <div className="body-sm">Workout, Running, Sports</div>
                    </div>
                    <ChevronRight size={20} color="#CBD5E1" />
                </button>

                <button
                    className="option-card"
                    onClick={() => setView('sleep_input')}
                >
                    <div className="icon-box" style={{ background: '#A29BFE', color: 'white' }}>
                        <Moon size={24} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <div className="h3">Sleep & Rest</div>
                        <div className="body-sm">Log your sleep hours</div>
                    </div>
                    <ChevronRight size={20} color="#CBD5E1" />
                </button>

                <style>{`
          .option-card {
            display: flex; align-items: center; gap: 16px;
            padding: 20px;
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 20px;
            cursor: pointer; transition: 0.2s;
            width: 100%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          }
          .option-card:active { transform: scale(0.98); background: #F8FAFC; }
          .icon-box {
            width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
          }
        `}</style>
            </div>
        );
    }

    // EXERCISE SEARCH / RECOMMENDATION VIEW
    if (view === 'exercise_search') {
        return (
            <div className="flex-col animate-fade-in" style={{ height: '100%' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div className="input-group" style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
                        <input className="input-field" placeholder="Search exercises..." style={{ paddingLeft: 40, marginBottom: 0 }} />
                    </div>
                </div>

                <div className="h3" style={{ marginBottom: '12px' }}>Recommended for You</div>

                <div className="scroll-y" style={{ flex: 1, overflowY: 'auto' }}>
                    {[
                        { name: 'Morning Jog', cal: 250, dur: '30 min', color: '#FF6B6B' },
                        { name: 'HIIT Cardio', cal: 400, dur: '20 min', color: '#FF9F43' },
                        { name: 'Yoga Flow', cal: 120, dur: '45 min', color: '#54A0FF' },
                        { name: 'Weight Lifting', cal: 180, dur: '40 min', color: '#5F27CD' },
                    ].map((ex, i) => (
                        <button key={i} className="rec-card" onClick={() => onLog(ex.name, 30)}> {/* Mock 30 mins */}
                            <div className="rec-icon" style={{ background: ex.color }}>
                                <Zap size={20} color="white" />
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <div style={{ fontWeight: 600 }}>{ex.name}</div>
                                <div className="body-sm" style={{ fontSize: '12px' }}>{ex.dur} • ~{ex.cal} kcal</div>
                            </div>
                            <div className="add-btn-small">+</div>
                        </button>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn-text" onClick={() => setView('exercise_manual')}>
                            Don't see it? <span style={{ textDecoration: 'underline', fontWeight: 600 }}>Create Manual Input</span>
                        </button>
                    </div>
                </div>

                <style>{`
             .rec-card {
                display: flex; align-items: center; gap: 12px;
                padding: 12px;
                margin-bottom: 12px;
                background: white;
                border: 1px solid #F1F5F9;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                width: 100%; cursor: pointer;
             }
             .rec-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
             .add-btn-small { width: 24px; height: 24px; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--color-primary); }
             .btn-text { background: none; border: none; color: var(--color-text-muted); font-size: 14px; cursor: pointer; }
           `}</style>
            </div>
        );
    }

    // MANUAL INPUT VIEW
    if (view === 'exercise_manual') {
        return (
            <div className="flex-col animate-fade-in" style={{ height: '100%' }}>
                <h3 className="h3" style={{ marginBottom: '24px' }}>Custom Exercise</h3>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="label">Activity Name</label>
                    <input className="input-field" placeholder="e.g. Jumping Rope" value={manualName} onChange={e => setManualName(e.target.value)} />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="label">Calories Burned</label>
                    <input className="input-field" type="number" placeholder="e.g. 150" value={manualCal} onChange={e => setManualCal(e.target.value)} />
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                        if (manualName && manualCal) {
                            onLog(`MANUAL:${manualName}`, parseInt(manualCal));
                        }
                    }}
                >
                    Save Activity
                </button>
            </div>
        );
    }

    // SLEEP INPUT VIEW
    if (view === 'sleep_input') {
        return (
            <div className="flex-col animate-fade-in" style={{ height: '100%' }}>
                <h3 className="h3" style={{ marginBottom: '8px' }}>Log Sleep</h3>
                <div className="body-sm" style={{ marginBottom: '24px' }}>How long did you rest?</div>

                <div className="card" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div className="flex-center" style={{ gap: '12px', marginBottom: '24px' }}>
                        <div className="icon-box" style={{ background: '#A29BFE', color: 'white', width: '64px', height: '64px' }}>
                            <Moon size={32} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="label" style={{ textAlign: 'center', display: 'block' }}>Duration (hours)</label>
                        <div style={{ position: 'relative', maxWidth: '120px', margin: '0 auto' }}>
                            <input
                                className="input-field"
                                type="number"
                                placeholder="7"
                                style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', height: '60px' }}
                                value={sleepDuration}
                                onChange={e => setSleepDuration(e.target.value)}
                            />
                            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontWeight: 600 }}>h</div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                            if (sleepDuration) {
                                // Parent expects Minutes.
                                onLog('Sleep', parseFloat(sleepDuration) * 60);
                            }
                        }}
                    >
                        Save Sleep
                    </button>

                </div>
            </div>
        );
    }

    return null;
};
