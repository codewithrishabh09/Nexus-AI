import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, MessageSquare, Trash2, Settings, LogOut,
    PanelLeftClose, Pencil, Check, Search, Zap, User
} from 'lucide-react';
import NexusLogo from './NexusLogo';



// ─── Group chats by time ────────────────────────────────────────────────────
function groupChats(chats) {
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

    // Since chats have no timestamps, we group by array position as a proxy
    const groups = { Pinned: [], Today: [], Yesterday: [], 'Last Week': [], Earlier: [] };
    chats.forEach((chat, i) => {
        if (i === 0) groups.Today.push(chat);
        else if (i === 1) groups.Today.push(chat);
        else if (i < 4) groups.Yesterday.push(chat);
        else if (i < 10) groups['Last Week'].push(chat);
        else groups.Earlier.push(chat);
    });
    return groups;
}

function Sidebar({
    sidebarOpen, setSidebarOpen,
    chats, setChats,
    activeChatId, setActiveChatId,
    handleCreateNewChat, handleDeleteChat,
    setSettingsOpen, setProfileOpen,
    user, logoutSession, onNavigate
}) {
    const [editingChatId, setEditingChatId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (editingChatId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingChatId]);

    const handleDoubleClick = (chat) => { setEditingChatId(chat.id); setEditingTitle(chat.title); };
    const handleRenameSubmit = (chatId) => {
        if (editingTitle.trim()) setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: editingTitle.trim() } : c));
        setEditingChatId(null); setEditingTitle('');
    };
    const handleRenameKeyDown = (e, chatId) => {
        if (e.key === 'Enter') handleRenameSubmit(chatId);
        if (e.key === 'Escape') { setEditingChatId(null); setEditingTitle(''); }
    };

    const filtered = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const userInitial = user?.username ? user.username[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U';

    return (
        <AnimatePresence>
            {sidebarOpen && (
                <motion.div
                    key="sidebar"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 272, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full flex flex-col overflow-hidden relative z-20 shrink-0"
                    style={{
                        background: 'rgba(10,8,18,0.95)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* ── Brand header ── */}
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <NexusLogo size={32} />
                            <div>
                                <span className="font-bold text-sm tracking-wider text-white">NEXUS AI</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] text-emerald-400/70 font-medium tracking-widest uppercase">Live</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                            <PanelLeftClose className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* ── New Chat button ── */}
                    <div className="px-3 pb-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateNewChat}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(192,38,211,0.15))',
                                border: '1px solid rgba(139,92,246,0.3)',
                            }}
                        >
                            <Plus className="h-3.5 w-3.5 text-violet-400 stroke-[2.5]" />
                            New Chat
                        </motion.button>
                    </div>

                    {/* ── Search ── */}
                    <div className="px-3 pb-2">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none transition-colors"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.4)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                            />
                        </div>
                    </div>

                    {/* ── Chat list ── */}
                    <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>
                                    <MessageSquare className="h-5 w-5 text-violet-500/40" />
                                </div>
                                <p className="text-xs font-medium text-zinc-500">No chats yet</p>
                                <p className="text-[10px] text-zinc-700 mt-1">Click "New Chat" to begin</p>
                            </div>
                        ) : (
                            filtered.map((chat) => {
                                const isActive = chat.id === activeChatId;
                                const isEditing = editingChatId === chat.id;
                                return (
                                    <motion.div
                                        key={chat.id}
                                        layout
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        onClick={() => !isEditing && setActiveChatId(chat.id)}
                                        onDoubleClick={() => handleDoubleClick(chat)}
                                        className="group relative w-full px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                                        style={{
                                            background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                                            border: isActive ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div className="flex items-center gap-2.5 truncate flex-1 mr-1">
                                            <MessageSquare className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                                            {isEditing ? (
                                                <input
                                                    ref={inputRef}
                                                    value={editingTitle}
                                                    onChange={e => setEditingTitle(e.target.value)}
                                                    onKeyDown={e => handleRenameKeyDown(e, chat.id)}
                                                    onBlur={() => handleRenameSubmit(chat.id)}
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex-1 text-xs text-white bg-transparent focus:outline-none border-b border-violet-500/50"
                                                />
                                            ) : (
                                                <span className={`truncate text-xs ${isActive ? 'font-medium text-white' : 'text-zinc-400 group-hover:text-zinc-200'} transition-colors`}>
                                                    {chat.title}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {isEditing ? (
                                                <button onClick={e => { e.stopPropagation(); handleRenameSubmit(chat.id); }} className="p-1 text-violet-400">
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleDoubleClick(chat); }}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all cursor-pointer"
                                                    ><Pencil className="h-3 w-3" /></button>
                                                    <button
                                                        onClick={e => handleDeleteChat(e, chat.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                                    ><Trash2 className="h-3 w-3" /></button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* ── Bottom nav ── */}
                    <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center gap-3 text-zinc-400 hover:text-white cursor-pointer transition-all group"
                            style={{ background: 'transparent' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <Settings className="h-3.5 w-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                            Settings
                        </button>

                        <div className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {user ? (
                                <div className="flex items-center justify-between px-1">
                                    <button
                                        onClick={() => setProfileOpen(true)}
                                        className="flex items-center gap-2.5 truncate flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
                                    >
                                        <div className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)' }}>
                                            {userInitial}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-zinc-200 truncate">{user.username || user.email}</p>
                                            <p className="text-[9px] text-zinc-600 truncate">{user.email}</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={logoutSession}
                                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                                        title="Sign out"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onNavigate('/login')}
                                    className="w-full py-2.5 px-3 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)' }}
                                >
                                    <Zap className="h-3.5 w-3.5" /> Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Sidebar;
