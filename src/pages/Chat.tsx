import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useUser } from '../context/UserContext';
import { Send, Bot, CheckCircle, ArrowRight, Camera, ChevronLeft, Mic } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    emotion?: 'neutral' | 'stressed' | 'happy';
    actionData?: any;
    image?: string; // For scanned images
}

export default function Chat() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, dailyStats, updateLog, dailyCalorieTarget } = useUser();
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeMealType = state?.mealType || 'snack';

    // Calculate total calories consumed today
    const totalConsumed = (dailyStats.breakfast || 0) + (dailyStats.lunch || 0) + (dailyStats.dinner || 0) + (dailyStats.snack || 0);
    const caloriesRemaining = dailyCalorieTarget - totalConsumed;

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);

    // Speech Recognition Setup
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'id-ID'; // Indonesian

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                text: `Hi! I'm ready to log your ${activeMealType}. Type the food name or tap the camera to scan it.`,
                sender: 'ai'
            }]);
        }
    }, [activeMealType]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() && !pendingImage) return;

        // Create Message Object
        const newMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            image: pendingImagePreview || undefined
        };
        setMessages(prev => [...prev, newMsg]);

        // Prepare Data for Backend
        const textToSend = input;
        const fileToSend = pendingImage;
        const currentContext = {
            profile: {
                name: user.name,
                gender: user.gender,
                age: user.birthDate ? new Date().getFullYear() - new Date(user.birthDate).getFullYear() : 'Unknown',
                height: user.height,
                weight: user.weight,
                medical_conditions: user.medicalConditions || []
            },
            stats: {
                target_calories: dailyCalorieTarget,
                consumed_calories: totalConsumed,
                remaining_calories: caloriesRemaining
            }
        };

        // Clear Input
        setInput('');
        setPendingImage(null);
        setPendingImagePreview(null);

        // Send to Backend
        setTimeout(() => processAIResponse(textToSend, fileToSend, currentContext), 500);
    };

    const handleScanClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Set Preview instead of automatic sending
        const imageUrl = URL.createObjectURL(file);
        setPendingImage(file);
        setPendingImagePreview(imageUrl);

        // Focus input to encourage typing prompt
        event.target.value = '';
    };

    const handleMicClick = () => {
        if (isScanning) return;

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        if (recognitionRef.current) {
            setIsRecording(true);
            recognitionRef.current.start();
        } else {
            alert("Browser does not support voice features.");
        }
    };

    const removePendingImage = () => {
        setPendingImage(null);
        setPendingImagePreview(null);
    }

    const processAIResponse = async (textData: string, fileData: File | null = null, userContext: any = {}) => {
        // Use environment variable first, else fallback to proxy
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

        try {
            let res;

            if (fileData) {
                // IMAGE ANALYSIS (with optional text prompt)
                console.log("Sending Image Analysis Request...");
                setIsScanning(true);

                const formData = new FormData();
                formData.append('image', fileData);
                if (textData) {
                    formData.append('prompt', textData);
                }
                // Append context as JSON string for multipart/form-data
                formData.append('user_context', JSON.stringify(userContext));

                res = await fetch(`${API_BASE}/analyze-image`, {
                    method: 'POST',
                    body: formData
                });

                setIsScanning(false);

            } else {
                // TEXT ONLY ANALYSIS
                console.log(`Attempting Text Analysis for: ${textData}`);

                // 1. Try Analyze Text (Food DB)
                const foodRes = await fetch(`${API_BASE}/analyze-text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: textData,
                        user_context: userContext
                    })
                });

                if (foodRes.ok) {
                    const foodData = await foodRes.json();
                    if (foodData.food_name && foodData.calories !== undefined) {
                        res = { ok: true, json: async () => foodData };
                        // Treat as scan result
                    } else {
                        // Fallback to chat if not food
                        res = await fetch(`${API_BASE}/chat`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                message: textData,
                                user_context: userContext
                            })
                        });
                    }
                } else {
                    res = await fetch(`${API_BASE}/chat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: textData,
                            user_context: userContext
                        })
                    });
                }
            }

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log("Backend Response:", data);

            // Determine if it's a Food Result or Chat Reply
            const isFoodResult = data.food_name && data.calories !== undefined && data.food_name !== "Image Analysis";

            if (isFoodResult) {
                // Food Analysis Response - Use AI's natural language reply!
                const responseText = data.reply || `I found **${data.food_name}** (~${data.calories} kcal).`;
                // If health_tip is present and meaningful (not just 'Info ] '), append it
                const healthTip = (data.health_tip && data.health_tip.length > 10) ? `\n\n💡 ${data.health_tip}` : '';

                const response: Message = {
                    id: Date.now() + 1,
                    text: `${responseText}${healthTip}`,
                    sender: 'ai',
                    actionData: {
                        type: 'confirm_log',
                        foodData: data
                    }
                };
                setMessages(prev => [...prev, response]);
            } else {
                // Chat Response
                const response: Message = {
                    id: Date.now() + 1,
                    text: data.reply || "Sorry, I didn't quite catch that.",
                    sender: 'ai'
                };
                setMessages(prev => [...prev, response]);
            }

        } catch (error: any) {
            console.error("Full Error Details:", error);
            setIsScanning(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Unable to connect to server.",
                sender: 'ai'
            }]);
        }
    };

    const handleConfirmLog = (foodData: any) => {
        const currentCalories = dailyStats[activeMealType as keyof typeof dailyStats] as number;
        updateLog({
            [activeMealType]: currentCalories + foodData.calories,
            protein: (dailyStats.protein || 0) + foodData.protein,
            carbs: (dailyStats.carbs || 0) + foodData.carbs,
            fat: (dailyStats.fat || 0) + foodData.fat,
            fiber: (dailyStats.fiber || 0) + foodData.fiber,
            sugar: (dailyStats.sugar || 0) + foodData.sugar,
            sodium: (dailyStats.sodium || 0) + foodData.sodium,
            cholesterol: (dailyStats.cholesterol || 0) + foodData.cholesterol,
            saturated_fat: (dailyStats.saturated_fat || 0) + (foodData.saturated_fat || 0),
            polyunsaturated_fat: (dailyStats.polyunsaturated_fat || 0) + (foodData.polyunsaturated_fat || 0),
            monounsaturated_fat: (dailyStats.monounsaturated_fat || 0) + (foodData.monounsaturated_fat || 0),
            potassium: (dailyStats.potassium || 0) + (foodData.potassium || 0),
        });

        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Berhasil mencatat ${foodData.food_name} (${foodData.calories} kkal) ke ${activeMealType}!`,
            sender: 'ai',
            actionData: { type: 'success_link' }
        }]);
    };

    return (
        <div className="flex-col" style={{ height: '100vh', background: 'var(--color-bg-app)' }}>
            {/* Header */}
            <div style={{ padding: '16px', background: 'white', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
                    <ChevronLeft size={24} />
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>GastroGuard AI</div>
                <div style={{ width: 32 }} />
            </div>

            <div className="chat-area" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className={`message-row ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                            {msg.sender === 'ai' && (
                                <div className="avatar-bot">
                                    <Bot size={20} />
                                </div>
                            )}

                            <div className="flex-col gap-2" style={{ alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                {msg.image && (
                                    <img src={msg.image} className="animate-fade-in" style={{ width: '150px', borderRadius: '12px', marginBottom: '4px', border: '2px solid white' }} />
                                )}
                                {(msg.text) && (
                                    <div className="message-bubble">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        {msg.actionData?.type === 'confirm_log' && (
                            <div className="action-row animate-fade-in">
                                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '14px', background: 'white' }} onClick={() => navigate('/log')}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '8px 16px', fontSize: '14px' }}
                                    onClick={() => handleConfirmLog(msg.actionData.foodData)}
                                >
                                    <CheckCircle size={16} /> Log It (+{msg.actionData.foodData.calories})
                                </button>
                            </div>
                        )}

                        {msg.actionData?.type === 'success_link' && (
                            <div className="action-row animate-fade-in">
                                <button className="btn" style={{ background: '#2D3436', color: 'white', fontSize: '14px', padding: '8px 16px' }} onClick={() => navigate('/log')}>
                                    Done <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {isScanning && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div className="avatar-bot">
                            <Bot size={20} />
                        </div>
                        <div className="message-bubble" style={{ background: 'white', color: '#B2BEC3' }}>
                            <div className="typing-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .typing-dots span { animation: blink 1.4s infinite both; font-size: 24px; line-height: 10px; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
            `}</style>

            {/* PREVIEW AREA */}
            {pendingImagePreview && (
                <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img
                            src={pendingImagePreview}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--color-primary)' }}
                        />
                        <button
                            onClick={removePendingImage}
                            style={{
                                position: 'absolute', top: -8, right: -8,
                                background: '#FF6B6B', color: 'white',
                                border: 'none', borderRadius: '50%',
                                width: '24px', height: '24px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="input-area card glass">
                <button className="btn-icon" onClick={handleScanClick} disabled={isScanning || isRecording}>
                    <Camera size={22} color="var(--color-text-muted)" />
                </button>
                <button className="btn-icon" onClick={handleMicClick} disabled={isScanning}>
                    <Mic size={22} color={isRecording ? "#FF6B6B" : "var(--color-text-muted)"} className={isRecording ? "pulse-anim" : ""} />
                </button>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={pendingImage ? "Add a caption..." : "Type or Scan..."}
                    className="chat-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn-send" onClick={handleSend} disabled={!input.trim() && !pendingImage}>
                    <Send size={20} color="white" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            <style>{`
        .chat-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
        .message-row { display: flex; gap: 12px; align-items: flex-end; }
        .message-row.user { justify-content: flex-end; }
        .avatar-bot { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 4px 10px rgba(78, 205, 196, 0.3); }
        .message-bubble { max-width: 260px; padding: 12px 16px; border-radius: 16px; border-bottom-left-radius: 4px; font-size: 15px; line-height: 1.4; box-shadow: 0 2px 5px rgba(0,0,0,0.03); }
        .user .message-bubble { background: var(--color-primary); color: white; border-bottom-left-radius: 16px; border-bottom-right-radius: 4px; }
        .ai .message-bubble { background: white; color: var(--color-text-main); }
        
        .input-area { padding: 12px 16px; display: flex; gap: 12px; background: white; border-top: 1px solid rgba(0,0,0,0.05); align-items: center; }
        .chat-input { flex: 1; border: none; background: #F1F5F9; padding: 12px 16px; border-radius: 20px; outline: none; transition: 0.2s; }
        .chat-input:focus { background: #E2E8F0; }
        .btn-send { width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn-send:active { transform: scale(0.9); }
        .btn-icon { background: none; border: none; padding: 8px; cursor: pointer; border-radius: 50%; transition: 0.2s; }
        .btn-icon:hover { background: #F1F5F9; }
        
        .action-row { display: flex; gap: 8px; justify-content: flex-start; margin-left: 44px; }
        .pulse-anim { animation: pulse 1s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
      `}</style>
        </div>
    );
}
