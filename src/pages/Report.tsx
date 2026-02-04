import React from 'react';
import { useUser } from '../context/UserContext';
import { PieChart, Activity, Droplet, Heart, Zap, AlertCircle } from 'lucide-react';

const NutrientRow = ({ label, value, unit, color, percent }: any) => (
    <div style={{ marginBottom: '12px' }}>
        <div className="flex-between body-sm" style={{ marginBottom: '6px' }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value} {unit}</span>
        </div>
        <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(percent, 100)}%`, background: color, height: '100%', borderRadius: '3px' }} />
        </div>
    </div>
);

export default function Report() {
    const { dailyStats, user } = useUser();
    const totalCal = dailyStats.breakfast + dailyStats.lunch + dailyStats.dinner + dailyStats.snack;

    // Real macro data from DB
    const {
        protein = 0, carbs = 0, fat = 0,
        fiber = 0, sugar = 0, sodium = 0, cholesterol = 0,
        saturated_fat = 0, polyunsaturated_fat = 0, monounsaturated_fat = 0, potassium = 0
    } = dailyStats;

    // Calculate Percentages (Assumes 2000kcal standard or use dailyCalorieTarget if available)
    // 1g Protein = 4kcal, 1g Carb = 4kcal, 1g Fat = 9kcal
    // Simple display logic:

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h1 className="h1">Daily Report</h1>
                <div className="label">{new Date().toDateString()}</div>
            </div>

            {/* Top Summary Card */}
            <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white', marginBottom: '24px', border: 'none' }}>
                <div className="flex-between">
                    <div>
                        <div style={{ opacity: 0.8, fontSize: '13px', fontWeight: 600 }}>CALORIE INTAKE</div>
                        <div style={{ fontSize: '32px', fontWeight: 700 }}>{totalCal} <span style={{ fontSize: '16px', fontWeight: 500 }}>kcal</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ opacity: 0.8, fontSize: '13px', fontWeight: 600 }}>BURNT</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{dailyStats.exercise} <span style={{ fontSize: '14px', fontWeight: 500 }}>kcal</span></div>
                    </div>
                </div>
            </div>

            {/* Macros Section */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h3 className="h3">Macronutrients</h3>
                    <PieChart size={20} color="var(--color-text-light)" />
                </div>

                <NutrientRow label="Carbohydrates" value={carbs} unit="g" color="#4ECDC4" percent={(carbs * 4 / 2000) * 100} />
                <NutrientRow label="Protein" value={protein} unit="g" color="#FF6B6B" percent={(protein * 4 / 2000) * 100} />
                <NutrientRow label="Fat" value={fat} unit="g" color="#FFE66D" percent={(fat * 9 / 2000) * 100} />

                <div style={{ marginTop: '16px', padding: '12px', background: '#F8F9FA', borderRadius: '12px' }}>
                    <div className="body-sm" style={{ fontWeight: 600, color: '#636E72', marginBottom: '8px' }}>Fat Breakdown</div>
                    <div className="flex-between" style={{ fontSize: '13px', marginBottom: '4px' }}>
                        <span>Saturated</span>
                        <span>{saturated_fat}g</span>
                    </div>
                    <div className="flex-between" style={{ fontSize: '13px', marginBottom: '4px' }}>
                        <span>Polyunsaturated</span>
                        <span>{polyunsaturated_fat}g</span>
                    </div>
                    <div className="flex-between" style={{ fontSize: '13px' }}>
                        <span>Monounsaturated</span>
                        <span>{monounsaturated_fat}g</span>
                    </div>
                </div>
            </div>

            {/* Micros & Others */}
            <div className="h3" style={{ marginBottom: '16px' }}>Detailed Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '80px' }}>

                <div className="stat-box">
                    <div className="icon-tiny" style={{ color: '#E17055' }}><Zap size={16} /></div>
                    <div className="val">{sugar}g</div>
                    <div className="lbl">Sugar</div>
                </div>

                <div className="stat-box">
                    <div className="icon-tiny" style={{ color: '#00CEC9' }}><Droplet size={16} /></div>
                    <div className="val">{fiber}g</div>
                    <div className="lbl">Fiber</div>
                </div>

                <div className="stat-box">
                    <div className="icon-tiny" style={{ color: '#FF7675' }}><Heart size={16} /></div>
                    <div className="val">{cholesterol}mg</div>
                    <div className="lbl">Cholesterol</div>
                </div>

                <div className="stat-box">
                    <div className="icon-tiny" style={{ color: '#6C5CE7' }}><AlertCircle size={16} /></div>
                    <div className="val">{sodium}mg</div>
                    <div className="lbl">Sodium</div>
                </div>

                <div className="stat-box">
                    <div className="icon-tiny" style={{ color: '#FD79A8' }}><Zap size={16} /></div>
                    <div className="val">{potassium}mg</div>
                    <div className="lbl">Potassium</div>
                </div>

            </div>

            <style>{`
         .stat-box {
           background: white; border-radius: 16px; padding: 16px;
           box-shadow: var(--shadow-card);
           display: flex; flex-direction: column; gap: 4px;
         }
         .icon-tiny { margin-bottom: 4px; }
         .stat-box .val { font-size: 18px; font-weight: 700; color: var(--color-text-main); }
         .stat-box .lbl { font-size: 12px; color: var(--color-text-muted); }
       `}</style>
        </div>
    );
}
