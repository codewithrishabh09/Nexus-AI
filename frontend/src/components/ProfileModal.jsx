import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, MessageSquare, Shield, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

function ProfileModal({ isOpen, onClose, user, messages }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');

    if (!isOpen) return null;

    const totalMessages = messages?.filter(m => m.sender === 'user').length || 0;
    const totalReplies = messages?.filter(m => m.sender === 'bot' && !m.text?.includes('<nexus-welcome>')).length || 0;
    const userInitial = user?.username ? user.username[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U';

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwError(''); setPwSuccess('');
        if (!currentPassword || !newPassword || !confirmPassword) { setPwError('Please fill in all fields.'); return; }
        if (newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setPwError('New passwords do not match.'); return; }
        setPwLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) { setPwError(data.message || 'Password change failed.'); return; }
            setPwSuccess('Password changed successfully!');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch { setPwError('Unable to connect to server.'); }
        finally { setPwLoading(false); }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl overflow-hidden relative"
                        style={{
                            background: '#111114',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.08)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-violet-400" />
                                <h3 className="text-sm font-bold text-white">My Profile</h3>
                            </div>
                            <button onClick={onClose}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Avatar + Name */}
                        <div className="flex flex-col items-center pt-6 pb-4 px-6">
                            <div className="relative mb-3">
                                <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B5CF6, #C026D3)',
                                        boxShadow: '0 0 30px rgba(139,92,246,0.35)',
                                    }}>
                                    {userInitial}
                                </div>
                                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2"
                                    style={{ borderColor: '#111114' }}>
                                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                                </span>
                            </div>
                            <h2 className="text-base font-bold text-white">{user?.username || 'User'}</h2>
                            <p className="text-xs mt-0.5" style={{ color: '#52525B' }}>{user?.email}</p>

                            {/* Stats */}
                            <div className="flex gap-3 mt-4 w-full">
                                {[
                                    { value: totalMessages, label: 'Messages', color: '#8B5CF6' },
                                    { value: totalReplies, label: 'AI Replies', color: '#C026D3' },
                                    { value: totalMessages + totalReplies, label: 'Total', color: '#A78BFA' },
                                ].map(({ value, label, color }) => (
                                    <div key={label} className="flex-1 rounded-xl px-4 py-3 text-center"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p className="text-lg font-black" style={{ color }}>{value}</p>
                                        <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#3F3F46' }}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex mx-6 mb-4 p-1 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {[
                                { id: 'profile', label: 'Info', icon: User },
                                { id: 'password', label: 'Password', icon: Lock },
                            ].map(({ id, label, icon: Icon }) => (
                                <button key={id}
                                    onClick={() => { setActiveTab(id); setPwError(''); setPwSuccess(''); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                    style={activeTab === id ? {
                                        background: 'rgba(139,92,246,0.15)',
                                        color: '#A78BFA',
                                        border: '1px solid rgba(139,92,246,0.2)',
                                    } : {
                                        color: '#52525B',
                                        border: '1px solid transparent',
                                    }}
                                >
                                    <Icon className="h-3 w-3" /> {label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="px-6 pb-6">
                            {activeTab === 'profile' && (
                                <div className="space-y-2.5">
                                    {[
                                        { icon: User, label: 'Username', value: user?.username || '—', color: '#8B5CF6' },
                                        { icon: Mail, label: 'Email', value: user?.email || '—', color: '#C026D3' },
                                        { icon: MessageSquare, label: 'Activity', value: `${totalMessages} messages sent`, color: '#06B6D4' },
                                    ].map(({ icon: Icon, color, label, value }) => (
                                        <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                                                <Icon className="h-3.5 w-3.5" style={{ color }} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#3F3F46' }}>{label}</p>
                                                <p className="text-sm text-zinc-200 font-medium mt-0.5">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'password' && (
                                <form onSubmit={handlePasswordChange} className="space-y-3">
                                    {pwError && (
                                        <div className="p-3 rounded-xl flex items-center gap-2 text-xs"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {pwError}
                                        </div>
                                    )}
                                    {pwSuccess && (
                                        <div className="p-3 rounded-xl flex items-center gap-2 text-xs"
                                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399' }}>
                                            <Check className="h-3.5 w-3.5 shrink-0" /> {pwSuccess}
                                        </div>
                                    )}
                                    {[
                                        { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggleShow: () => setShowCurrent(p => !p) },
                                        { label: 'New Password', value: newPassword, setter: setNewPassword, show: showNew, toggleShow: () => setShowNew(p => !p) },
                                        { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggleShow: () => setShowConfirm(p => !p) },
                                    ].map(({ label, value, setter, show, toggleShow }) => (
                                        <div key={label} className="space-y-1">
                                            <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#52525B' }}>{label}</label>
                                            <div className="relative flex items-center rounded-xl transition-all"
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                                                onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                                                onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                            >
                                                <Lock className="absolute left-3.5 h-3.5 w-3.5" style={{ color: '#3F3F46' }} />
                                                <input
                                                    type={show ? 'text' : 'password'}
                                                    className="w-full py-3 pl-10 pr-10 bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700"
                                                    placeholder="••••••••••••"
                                                    value={value}
                                                    onChange={e => setter(e.target.value)}
                                                />
                                                <button type="button" onClick={toggleShow}
                                                    className="absolute right-3 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer">
                                                    {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <motion.button
                                        type="submit"
                                        disabled={pwLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full mt-2 py-3 rounded-xl text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                                        style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}
                                    >
                                        {pwLoading
                                            ? <><div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                                            : <><Lock className="h-3.5 w-3.5" /> Update Password</>
                                        }
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ProfileModal;
