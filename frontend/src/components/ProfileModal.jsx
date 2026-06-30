import { useState } from 'react';
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
        setPwError('');
        setPwSuccess('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPwError('Please fill in all fields.');
            return;
        }
        if (newPassword.length < 6) {
            setPwError('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('New passwords do not match.');
            return;
        }
        setPwLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                setPwError(data.message || 'Password change failed.');
                return;
            }
            setPwSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            setPwError('Unable to connect to server.');
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f0015] border border-[#2a1040] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_70%)] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2a1040]">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-pink-400" />
                        <h3 className="text-sm font-bold text-white tracking-wide">My Profile</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-[#2a1040] rounded-lg transition-colors cursor-pointer">
                        <X className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Avatar + Name + Stats */}
                <div className="flex flex-col items-center pt-6 pb-4 px-6">
                    <div className="relative mb-3">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_25px_rgba(236,72,153,0.3)]">
                            {userInitial}
                        </div>
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-pink-400 border-2 border-[#0f0015]">
                            <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-50" />
                        </span>
                    </div>
                    <h2 className="text-base font-bold text-white">{user?.username || 'User'}</h2>
                    <p className="text-xs text-purple-400/60 mt-0.5">{user?.email}</p>

                    <div className="flex gap-4 mt-4 w-full">
                        {[
                            { value: totalMessages, label: 'Messages', color: 'text-pink-400' },
                            { value: totalReplies, label: 'AI Replies', color: 'text-purple-400' },
                            { value: totalMessages + totalReplies, label: 'Total', color: 'text-pink-300' },
                        ].map(({ value, label, color }) => (
                            <div key={label} className="flex-1 bg-[#1a0a2e] border border-[#2a1040] rounded-xl px-4 py-3 text-center">
                                <p className={`text-lg font-black ${color}`}>{value}</p>
                                <p className="text-[10px] text-purple-400/60 mt-0.5 uppercase tracking-wider">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mx-6 mb-4 bg-[#0a0010] border border-[#2a1040] rounded-xl p-1">
                    {[
                        { id: 'profile', label: 'Info', icon: User },
                        { id: 'password', label: 'Password', icon: Lock },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setActiveTab(id); setPwError(''); setPwSuccess(''); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === id
                                ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-400 border border-pink-500/20'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Icon className="h-3 w-3" /> {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="px-6 pb-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-3">
                            {[
                                { icon: User, color: 'text-pink-400', label: 'Username', value: user?.username || '—' },
                                { icon: Mail, color: 'text-purple-400', label: 'Email', value: user?.email || '—' },
                                { icon: MessageSquare, color: 'text-pink-300', label: 'Activity', value: `${totalMessages} messages sent to Nexus AI` },
                            ].map(({ icon: Icon, color, label, value }) => (
                                <div key={label} className="flex items-center gap-3 bg-[#1a0a2e] border border-[#2a1040] rounded-xl px-4 py-3">
                                    <Icon className={`h-4 w-4 ${color} shrink-0`} />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-purple-400/60 font-bold">{label}</p>
                                        <p className="text-sm text-gray-200 font-medium mt-0.5">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange} className="space-y-3">
                            {pwError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {pwError}
                                </div>
                            )}
                            {pwSuccess && (
                                <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs rounded-xl flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5 shrink-0" /> {pwSuccess}
                                </div>
                            )}
                            {[
                                { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggleShow: () => setShowCurrent(p => !p) },
                                { label: 'New Password', value: newPassword, setter: setNewPassword, show: showNew, toggleShow: () => setShowNew(p => !p) },
                                { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggleShow: () => setShowConfirm(p => !p) },
                            ].map(({ label, value, setter, show, toggleShow }) => (
                                <div key={label} className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400/60">{label}</label>
                                    <div className="relative flex items-center bg-[#0a0010] border border-[#2a1040] rounded-xl focus-within:border-pink-500/50 transition-colors">
                                        <Lock className="absolute left-3.5 h-3.5 w-3.5 text-purple-500/50" />
                                        <input
                                            type={show ? 'text' : 'password'}
                                            className="w-full py-3 pl-10 pr-10 bg-transparent text-gray-100 text-sm focus:outline-none placeholder-gray-700"
                                            placeholder="••••••••••••"
                                            value={value}
                                            onChange={(e) => setter(e.target.value)}
                                        />
                                        <button type="button" onClick={toggleShow} className="absolute right-3 text-gray-500 hover:text-gray-300 cursor-pointer">
                                            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="submit"
                                disabled={pwLoading}
                                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] cursor-pointer flex items-center justify-center gap-2"
                            >
                                {pwLoading ? (
                                    <><div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                                ) : (
                                    <><Lock className="h-3.5 w-3.5" /> Update Password</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
