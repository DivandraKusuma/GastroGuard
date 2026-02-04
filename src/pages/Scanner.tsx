import React, { useState } from 'react';
import { Camera, AlertTriangle, Check } from 'lucide-react';

export default function Scanner() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<null | any>(null);

    const handleScan = () => {
        setScanning(true);
        // Mock scan process
        setTimeout(() => {
            setScanning(false);
            setResult({
                name: 'Spicy Noodle Soup',
                calories: 450,
                risk: 'High Spiciness',
                nutrients: { fat: 'Medium', carbs: 'High', protein: 'Low' },
                warning: 'Maag Trigger Detected'
            });
        }, 2000);
    };

    return (
        <div style={{ height: '80vh', position: 'relative', overflow: 'hidden', borderRadius: '24px', background: '#000' }}>
            {/* Camera Viewfinder Mock */}
            {!result && (
                <>
                    <img
                        src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                    />
                    <div className="scanner-overlay">
                        <div className="scan-frame" />
                        <div className="scan-text h3" style={{ color: 'white' }}>
                            {scanning ? 'Analyzing...' : 'Align food in frame'}
                        </div>
                        {!scanning && (
                            <button className="btn-scan" onClick={handleScan}>
                                <Camera size={32} />
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Result Card */}
            {result && (
                <div className="result-overlay animate-fade-in">
                    <div className="card glass-dark" style={{ width: '100%' }}>
                        <div className="flex-between" style={{ marginBottom: '16px' }}>
                            <div className="h2" style={{ color: 'white' }}>{result.name}</div>
                            <div className="badge-cal">{result.calories} kcal</div>
                        </div>

                        <div className="warning-box">
                            <AlertTriangle size={20} />
                            <span>{result.warning}</span>
                        </div>

                        <div className="grid-stats">
                            <div className="stat">
                                <div className="lbl">Fat</div>
                                <div className="val">{result.nutrients.fat}</div>
                            </div>
                            <div className="stat">
                                <div className="lbl">Carbs</div>
                                <div className="val">{result.nutrients.carbs}</div>
                            </div>
                        </div>

                        <div className="flex-between gap-4" style={{ marginTop: '24px' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setResult(null)}>Scan Again</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .scanner-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 20px;
        }
        .scan-frame {
          width: 250px; height: 250px;
          border: 2px dashed rgba(255,255,255,0.6);
          border-radius: 20px;
        }
        .btn-scan {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: white; border: 4px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .result-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }
        .glass-dark {
          background: rgba(30,30,30, 0.85); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
        .warning-box {
          background: rgba(255, 107, 107, 0.2);
          color: #FF6B6B;
          padding: 12px;
          border-radius: 8px;
          display: flex; align-items: center; gap: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .badge-cal {
          background: var(--color-primary); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 700;
        }
        .grid-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stat { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; text-align: center; }
        .stat .lbl { text-transform: uppercase; font-size: 10px; color: #aaa; margin-bottom: 4px; }
        .stat .val { font-weight: 600; }
      `}</style>
        </div>
    );
}
