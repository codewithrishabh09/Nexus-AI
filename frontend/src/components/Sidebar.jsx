import { useState, useRef, useEffect } from 'react';
import { Share2, Plus, MessageSquare, Trash2, Settings, HelpCircle, LogOut, X, Pencil, Check } from 'lucide-react';

function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    handleCreateNewChat,
    handleDeleteChat,
    setSettingsOpen,
    setProfileOpen,
    user,
    logoutSession,
    onNavigate
}) {
    const [editingChatId, setEditingChatId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (editingChatId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingChatId]);

    const handleDoubleClick = (chat) => {
        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
    };

    const handleRenameSubmit = (chatId) => {
        if (editingTitle.trim()) {
            setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: editingTitle.trim() } : c));
        }
        setEditingChatId(null);
        setEditingTitle('');
    };

    const handleRenameKeyDown = (e, chatId) => {
        if (e.key === 'Enter') handleRenameSubmit(chatId);
        if (e.key === 'Escape') { setEditingChatId(null); setEditingTitle(''); }
    };

    return (
        <div className={`${sidebarOpen ? 'w-68' : 'w-0'} bg-[#0f0015] border-r border-[#2a1040] h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden relative z-20`}>

            {/* Brand Header */}
            <div className="p-4 border-b border-[#2a1040] flex items-center justify-between bg-[#0a0010]">
                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.35)]">
                        <Share2 className="h-4 w-4 text-white stroke-[2.5]" />
                    </div>
                    <span className="font-bold text-sm tracking-[0.12em] text-white">NEXUS AI</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-[#2a1040] rounded-lg transition-colors cursor-pointer md:hidden">
                    <X className="h-4 w-4 text-gray-400" />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3.5">
                <button
                    onClick={handleCreateNewChat}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1a0a2e] hover:bg-[#2a1040] border border-[#3d1a5e] text-xs font-semibold text-gray-100 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5 text-pink-400 stroke-[2.5]" />
                    New chat
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-2.5 space-y-1 custom-scrollbar">
                <p className="text-[10px] uppercase font-bold text-purple-400/60 px-3 my-2 tracking-widest">Recent Chats</p>

                {chats.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div className="h-10 w-10 rounded-xl bg-[#1a0a2e] border border-[#2a1040] flex items-center justify-center mb-3">
                            <MessageSquare className="h-5 w-5 text-purple-400/40" />
                        </div>
                        <p className="text-xs font-semibold text-gray-500">No chats yet</p>
                        <p className="text-[10px] text-purple-400/40 mt-1">Click "New chat" to begin</p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const isActive = chat.id === activeChatId;
                        const isEditing = editingChatId === chat.id;
                        return (
                            <div
                                key={chat.id}
                                onClick={() => !isEditing && setActiveChatId(chat.id)}
                                onDoubleClick={() => handleDoubleClick(chat)}
                                className={`w-full px-3 py-2.5 rounded-lg text-left text-xs flex items-center justify-between transition-all duration-150 group cursor-pointer ${isActive
                                    ? 'text-white bg-[#2a1040] border border-[#3d1a5e]/60 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1a0a2e]/80'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5 truncate flex-1 mr-1">
                                    <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-pink-400' : 'text-gray-600 group-hover:text-pink-500'}`} />
                                    {isEditing ? (
                                        <input
                                            ref={inputRef}
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                                            onBlur={() => handleRenameSubmit(chat.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 bg-[#0a0010] border border-pink-500/40 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-pink-500"
                                        />
                                    ) : (
                                        <span className={`truncate ${isActive ? 'font-semibold' : 'font-medium'}`} title="Double click to rename">
                                            {chat.title}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {isEditing ? (
                                        <button onClick={(e) => { e.stopPropagation(); handleRenameSubmit(chat.id); }} className="p-1 text-pink-400 hover:text-pink-300">
                                            <Check className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDoubleClick(chat); }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-purple-900/40 rounded text-gray-500 hover:text-pink-400 transition-all"
                                                title="Rename"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-purple-900/40 rounded text-gray-500 hover:text-red-400 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bottom Nav */}
            <div className="p-3 border-t border-[#2a1040] bg-[#0a0010]/60 space-y-1">
                <button onClick={() => setSettingsOpen(true)} className="w-full px-3 py-2 rounded-lg text-left text-xs text-gray-400 hover:text-white hover:bg-[#1a0a2e] flex items-center gap-3 transition-all cursor-pointer">
                    <Settings className="h-3.5 w-3.5 text-purple-400/60" />
                    <span>Settings Configuration</span>
                </button>
                <button className="w-full px-3 py-2 rounded-lg text-left text-xs text-gray-400 hover:text-white hover:bg-[#1a0a2e] flex items-center gap-3 transition-all cursor-pointer">
                    <HelpCircle className="h-3.5 w-3.5 text-purple-400/60" />
                    <span>Documentation</span>
                </button>

                <div className="pt-2 mt-2 border-t border-[#2a1040]/60">
                    {user ? (
                        <div className="flex items-center justify-between">
                            <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2.5 truncate max-w-[80%] hover:opacity-80 transition-opacity cursor-pointer">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                                    {user.username ? user.username[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                                </div>
                                <p className="text-xs font-semibold text-gray-300 truncate">{user.username || user.email}</p>
                            </button>
                            <button onClick={logoutSession} className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer">
                                <LogOut className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => onNavigate('/login')} className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.25)] animate-pulse">
                            Sign In / Register
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
