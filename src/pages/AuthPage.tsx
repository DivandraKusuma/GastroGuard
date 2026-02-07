import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Modes
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isUpdatePassword, setIsUpdatePassword] = useState(false); // New mode for Resetting

    const [loading, setLoading] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [successMSG, setSuccessMSG] = useState('');

    const navigate = useNavigate();

    // Check for Recovery Event
    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsUpdatePassword(true);
                setIsForgotPassword(false);
                setIsLogin(false);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMSG('');
        setSuccessMSG('');

        try {
            if (isUpdatePassword) {
                // 1. Update Password
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;

                setSuccessMSG('Password updated successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } else if (isForgotPassword) {
                // 2. Send Reset Link
                // We point to /auth so the listener above catches the event on arrival
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/auth',
                });
                if (error) throw error;
                setSuccessMSG('Password reset link sent! Check your email.');

            } else if (isLogin) {
                // 3. Login
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                navigate('/');
            } else {
                // 4. Register
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;

                // Check if email verification is required
                if (data.user && !data.session) {
                    setSuccessMSG('Sign up successful! Please check your email for the verification link.');
                    setIsLogin(true); // Switch to login mode
                    return;
                }

                navigate('/');
            }
        } catch (err: any) {
            setErrorMSG(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px', height: '80px', background: 'var(--color-primary)',
                    borderRadius: '24px', margin: '0 auto 24px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '40px' }}>🥗</span>
                </div>
                <h1 className="h1" style={{ color: 'var(--color-primary-dark)' }}>GastroGuard</h1>
                <p className="body-base" style={{ marginTop: '8px' }}>Your Personal AI Nutritionist</p>
            </div>

            <div className="card-glass" style={{ padding: '32px' }}>
                <h2 className="h2" style={{ marginBottom: '24px', textAlign: 'center' }}>
                    {isUpdatePassword ? 'Set New Password'
                        : isForgotPassword ? 'Reset Password'
                            : (isLogin ? 'Welcome Back' : 'Create Account')}
                </h2>

                {errorMSG && (
                    <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                        {errorMSG}
                    </div>
                )}

                {successMSG && (
                    <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                        {successMSG}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    {/* EMAIL INPUT (Hidden for UpdatePassword) */}
                    {!isUpdatePassword && (
                        <div className="form-group">
                            <label className="label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', top: 14, left: 16, color: '#94A3B8' }} />
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '48px' }}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="hello@example.com"
                                />
                            </div>
                        </div>
                    )}

                    {/* PASSWORD INPUT (Login/Register) */}
                    {!isForgotPassword && !isUpdatePassword && (
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', top: 14, left: 16, color: '#94A3B8' }} />
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '48px' }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    {/* NEW PASSWORD INPUT (Update Mode) */}
                    {isUpdatePassword && (
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', top: 14, left: 16, color: '#94A3B8' }} />
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    style={{ paddingLeft: '48px' }}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                    )}

                    {isLogin && !isForgotPassword && !isUpdatePassword && (
                        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '16px', marginTop: isForgotPassword ? '24px' : '0' }}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <div className="flex-center gap-2">
                                {isUpdatePassword ? 'Update Password'
                                    : isForgotPassword ? 'Send Reset Link'
                                        : (isLogin ? 'Sign In' : 'Sign Up')} <ArrowRight size={20} />
                            </div>
                        )}
                    </button>
                </form>

                {!isUpdatePassword && (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                if (isForgotPassword) {
                                    setIsForgotPassword(false);
                                } else {
                                    setIsLogin(!isLogin);
                                }
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {isForgotPassword
                                ? 'Back to Login'
                                : (isLogin ? 'New to GastroGuard? Create Account' : 'Already have an account? Sign In')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
