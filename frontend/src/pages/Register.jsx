import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, User, Share2, ArrowRight, AlertCircle } from 'lucide-react';

function Register({ onNavigate }) {
    const { loginSession } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setErrorMessage('');
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.message || 'Registration failed. Please try again.');
                return;
            }
            loginSession(data.user, data.token);
            onNavigate('/dashboard');
        } catch {
            setErrorMessage('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-[#0a0010] flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.08),transparent_60%)]" />
            <div className="w-full max-w-md bg-[#0f0015] border border-[#2a1040] rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.3)] mb-4">
                        <Share2 className="h-6 w-6 text-white stroke-[2.5]" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Create Your Account</h2>
                    <p className="text-xs text-purple-400/60 mt-1">Join Nexus AI and start chatting</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400/60">Username</label>
                        <div className="relative flex items-center bg-[#0a0010] border border-[#2a1040] rounded-xl focus-within:border-pink-500/50 transition-colors">
                            <User className="absolute left-3.5 h-4 w-4 text-purple-500/50" />
                            <input type="text" required
                                className="w-full py-3.5 pl-11 pr-4 bg-transparent text-gray-100 text-sm focus:outline-none placeholder-gray-700 font-sans"
                                placeholder="nexus_developer" value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400/60">Email Address</label>
                        <div className="relative flex items-center bg-[#0a0010] border border-[#2a1040] rounded-xl focus-within:border-pink-500/50 transition-colors">
                            <Mail className="absolute left-3.5 h-4 w-4 text-purple-500/50" />
                            <input type="email" required
                                className="w-full py-3.5 pl-11 pr-4 bg-transparent text-gray-100 text-sm focus:outline-none placeholder-gray-700 font-sans"
                                placeholder="developer@nexus.io" value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400/60">Password</label>
                        <div className="relative flex items-center bg-[#0a0010] border border-[#2a1040] rounded-xl focus-within:border-pink-500/50 transition-colors">
                            <Key className="absolute left-3.5 h-4 w-4 text-purple-500/50" />
                            <input type="password" required
                                className="w-full py-3.5 pl-11 pr-4 bg-transparent text-gray-100 text-sm focus:outline-none placeholder-gray-700"
                                placeholder="••••••••••••" value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)] cursor-pointer">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                Create Account <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#2a1040]/50 text-center">
                    <p className="text-xs text-gray-500">
                        Already have an account?{' '}
                        <button onClick={() => onNavigate('/login')} className="text-pink-400 hover:text-pink-300 font-semibold cursor-pointer">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;