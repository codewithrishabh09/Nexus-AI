import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

function NexusLogo() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

function Login({ onNavigate }) {
    const { loginSession } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) { setErrorMessage('Please fill in all credential fields.'); return; }
        setLoading(true); setErrorMessage('');
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) { setErrorMessage(data.message || 'Login failed. Please try again.'); return; }
            loginSession(data.user, data.token);
            onNavigate('/dashboard');
        } catch { setErrorMessage('Unable to connect to server. Please try again.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#07070A' }}>
            {/* Background blobs */}
            <div className="absolute animate-blob" style={{ top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute animate-blob animation-delay-2000" style={{ bottom: '-15%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(192,38,211,0.06), transparent 70%)', filter: 'blur(40px)' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Card */}
                <div className="rounded-2xl p-7 relative overflow-hidden"
                    style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

                    {/* Glow top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-7">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
                            <NexusLogo />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
                        <p className="text-sm mt-1" style={{ color: '#52525B' }}>Sign in to your NEXUS AI workspace</p>
                    </div>

                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
                        >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errorMessage}
                        </motion.div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#3F3F46' }}>Email Address</label>
                            <div className="relative flex items-center rounded-xl transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                                onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                                onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                            >
                                <Mail className="absolute left-3.5 h-4 w-4" style={{ color: '#3F3F46' }} />
                                <input type="email" required
                                    className="w-full py-3.5 pl-11 pr-4 bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700"
                                    placeholder="you@example.com"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#3F3F46' }}>Password</label>
                            <div className="relative flex items-center rounded-xl transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                                onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                                onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                            >
                                <Lock className="absolute left-3.5 h-4 w-4" style={{ color: '#3F3F46' }} />
                                <input type={showPw ? 'text' : 'password'} required
                                    className="w-full py-3.5 pl-11 pr-11 bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700"
                                    placeholder="••••••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    className="absolute right-3.5 cursor-pointer" style={{ color: '#3F3F46' }}>
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit" disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-2 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}
                        >
                            {loading
                                ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                                : <>Sign In <ArrowRight className="h-4 w-4" /></>
                            }
                        </motion.button>
                    </form>

                    <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs" style={{ color: '#52525B' }}>
                            New to NEXUS AI?{' '}
                            <button onClick={() => onNavigate('/register')}
                                className="font-semibold cursor-pointer hover:underline transition-colors"
                                style={{ color: '#A78BFA' }}>
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;