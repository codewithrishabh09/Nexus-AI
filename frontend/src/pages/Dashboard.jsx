import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, Plus, Send, Activity, Paperclip, Image, FileText,
    Code, ChevronDown, Mic, Globe, Cpu, Zap
} from 'lucide-react';
import { io } from 'socket.io-client';

import Sidebar from '../components/Sidebar';
import SettingsModal from '../components/SettingsModal';
import ProfileModal from '../components/ProfileModal';
import MessageItem from '../components/MessageItem';
import PaymentModal from '../components/PaymentModal';

const SOCKET_URL = import.meta.env.VITE_API_URL;
const WELCOME_MESSAGE = `<nexus-welcome></nexus-welcome>`;

// ─── Animated background ─────────────────────────────────────────────────────
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Base */}
            <div className="absolute inset-0" style={{ background: '#07070A' }} />
            {/* Top-left blob */}
            <div className="absolute animate-blob"
                style={{
                    top: '-20%', left: '-10%', width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
            {/* Bottom-right blob */}
            <div className="absolute animate-blob animation-delay-2000"
                style={{
                    bottom: '-15%', right: '-10%', width: '45vw', height: '45vw',
                    background: 'radial-gradient(circle, rgba(192,38,211,0.05) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
            {/* Center subtle glow */}
            <div className="absolute animate-blob animation-delay-4000"
                style={{
                    top: '30%', left: '40%', width: '30vw', height: '30vw',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }} />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />
        </div>
    );
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex gap-3 justify-start"
        >
            <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #C026D3)',
                    boxShadow: '0 0 12px rgba(139,92,246,0.3)',
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            </div>
            <div className="px-4 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 typing-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 typing-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 typing-dot" />
            </div>
        </motion.div>
    );
}



// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
    const { user, logoutSession } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [message, setMessage] = useState('');
    const messageEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const socketRef = useRef(null);
    const textareaRef = useRef(null);

    const [activeChatId, setActiveChatId] = useState('chat-1');
    const [attachMenuOpen, setAttachMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [systemPersona, setSystemPersona] = useState('Architect');
    const [aiTemperature, setAiTemperature] = useState(0.7);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    
    // Paywall state
    const [messageCount, setMessageCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const [chats, setChats] = useState([{ id: 'chat-1', title: 'New Chat' }]);
    const [messages, setMessages] = useState([
        { id: 'msg-init-1', chatId: 'chat-1', sender: 'bot', text: WELCOME_MESSAGE }
    ]);

    // Keep ref in sync with activeChatId
    const activeChatIdRef = useRef(activeChatId);
    useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

    // ── Socket connection ──────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;

        const socket = io(SOCKET_URL, {
            // ✅ FIX: Do NOT force 'websocket' only — Socket.io needs the initial HTTP
            // polling handshake to negotiate & upgrade to WebSocket (101 Switching Protocols).
            // Forcing ['websocket'] skips that handshake → connection refused.
            withCredentials: true,
            reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });
        socket.on('connect_error', (err) => {
            console.error('❌ Socket connect_error:', err.message);
            setIsAiTyping(false);
        });
        socket.on('error', (err) => {
            console.error('❌ Socket error:', err);
            setIsAiTyping(false);
        });
        socket.on('receiveMessage', (data) => {
            setIsAiTyping(false);
            setMessages((prev) => [
                ...prev,
                { id: data.id || 'msg-bot-' + Date.now(), chatId: data.chatId || 'chat-1', sender: 'bot', text: data.text || 'Sorry, I could not generate a response.' }
            ]);
        });
        return () => socket.disconnect();
    }, [user]);

    // ── Chat history ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/history`, { credentials: 'include' });
                const data = await res.json();
                if (data.success && data.history.length > 0) {
                    const historyMessages = data.history.map((msg) => ({
                        id: msg._id, chatId: msg.chatId || 'chat-1',
                        sender: msg.role === 'user' ? 'user' : 'bot', text: msg.text,
                    }));
                    const distinctChatsMap = new Map();
                    historyMessages.forEach(msg => {
                        if (msg.sender === 'user' && !distinctChatsMap.has(msg.chatId)) {
                            const title = msg.text.length > 28 ? msg.text.substring(0, 25) + '...' : msg.text;
                            distinctChatsMap.set(msg.chatId, { id: msg.chatId, title });
                        }
                    });
                    let loadedChats = Array.from(distinctChatsMap.values());
                    if (loadedChats.length === 0) loadedChats = [{ id: 'chat-1', title: 'New Chat' }];
                    setMessages([
                        { id: 'msg-init-1', chatId: loadedChats[0].id, sender: 'bot', text: WELCOME_MESSAGE },
                        ...historyMessages
                    ]);
                    setChats(loadedChats);
                    setActiveChatId(loadedChats[0].id);
                }
            } catch { console.error('Failed to load chat history'); }
        };
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // ── Auto scroll ────────────────────────────────────────────────────────
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    // ── Scroll button visibility ───────────────────────────────────────────
    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150);
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // ── Attach menu outside click ──────────────────────────────────────────
    useEffect(() => {
        const handleOutsideClick = () => setAttachMenuOpen(false);
        if (attachMenuOpen) window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [attachMenuOpen]);

    // ── Auto-resize textarea ───────────────────────────────────────────────
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        }
    }, [message]);

    const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleCreateNewChat = useCallback(() => {
        const newChatId = 'chat-' + Date.now();
        setChats((prev) => [{ id: newChatId, title: 'New Chat' }, ...prev]);
        setActiveChatId(newChatId);
        setMessages((prev) => [...prev, { id: 'msg-welcome-' + Date.now(), chatId: newChatId, sender: 'bot', text: WELCOME_MESSAGE }]);
    }, []);

    const handleDeleteChat = useCallback((e, idToDelete) => {
        e.stopPropagation();
        setChats((prevChats) => {
            const updated = prevChats.filter(c => c.id !== idToDelete);
            setActiveChatId((cur) => {
                if (cur === idToDelete) {
                    if (updated.length > 0) return updated[0].id;
                    const freshId = 'chat-' + Date.now();
                    setTimeout(() => {
                        setChats([{ id: freshId, title: 'New Chat' }]);
                        setMessages([{ id: 'msg-fresh-' + Date.now(), chatId: freshId, sender: 'bot', text: WELCOME_MESSAGE }]);
                    }, 0);
                    return freshId;
                }
                return cur;
            });
            return updated;
        });
    }, []);

    const handleSendMessage = useCallback((e, forceSend = false) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        // Paywall check at the absolute start
        if (!isPremium && !forceSend) {
            setPaymentModalOpen(true);
            return; // stop right here — do not proceed to any API call, socket emit, or message append below
        }

        if (!message.trim()) return;

        const userPrompt = message.trim();
        const currentChatId = activeChatIdRef.current;
        
        // Clear message only after the paywall check passes
        setMessage('');
        setMessageCount(prev => prev + 1);

        setChats((prevChats) => prevChats.map((chat) => {
            if (chat.id === currentChatId && chat.title === 'New Chat') {
                return { ...chat, title: userPrompt.length > 28 ? userPrompt.substring(0, 25) + '...' : userPrompt };
            }
            return chat;
        }));
        setMessages((prev) => [...prev, { id: 'msg-user-' + Date.now(), chatId: currentChatId, sender: 'user', text: userPrompt }]);
        setIsAiTyping(true);
        socketRef.current?.emit('sendMessage', {
            text: userPrompt,
            sender: user?.username || user?.email || 'Guest',
            chatId: currentChatId,
            persona: systemPersona,
            temperature: aiTemperature
        });
    }, [message, user, systemPersona, aiTemperature, isPremium, messageCount]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    }, [handleSendMessage]);

    const currentChatMessages = messages.filter(m => m.chatId === activeChatId);

    const handlePromptClick = useCallback((promptText) => { setMessage(promptText); }, []);

    const activeChat = chats.find(c => c.id === activeChatId);

    return (
        <div className="flex h-screen w-screen overflow-hidden relative" style={{ background: '#07070A', color: '#FFFFFF' }}>
            <AnimatedBackground />

            {/* Modals */}
            <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSuccess={() => { setPaymentModalOpen(false); setIsPremium(true); handleSendMessage(null, true); }} />
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}
                systemPersona={systemPersona} setSystemPersona={setSystemPersona}
                aiTemperature={aiTemperature} setAiTemperature={setAiTemperature} />
            <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} messages={messages} />

            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
                chats={chats} setChats={setChats}
                activeChatId={activeChatId} setActiveChatId={setActiveChatId}
                handleCreateNewChat={handleCreateNewChat} handleDeleteChat={handleDeleteChat}
                setSettingsOpen={setSettingsOpen} setProfileOpen={setProfileOpen}
                user={user} logoutSession={logoutSession} onNavigate={onNavigate}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col h-full relative z-10 min-w-0">

                {/* ── Header ── */}
                <header className="h-12 shrink-0 flex items-center gap-3 px-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(7,7,10,0.8)', backdropFilter: 'blur(12px)' }}>

                    {/* Toggle sidebar button */}
                    {!sidebarOpen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 rounded-lg cursor-pointer transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717A' }}
                        >
                            <Menu className="h-4 w-4" />
                        </motion.button>
                    )}

                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1.5"
                            style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <Activity className="h-2.5 w-2.5 animate-pulse" />
                            {systemPersona}
                        </span>
                        <span style={{ color: '#27272A' }}>/</span>
                        <h1 className="text-xs font-medium text-zinc-300 truncate">
                            {activeChat?.title || 'New Chat'}
                        </h1>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-[9px] font-medium px-2 py-1 rounded-md hidden sm:flex items-center gap-1"
                            style={{ background: 'rgba(255,255,255,0.03)', color: '#3F3F46', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Gemini 2.5 Flash
                        </span>
                    </div>
                </header>

                {/* ── Messages ── */}
                <div
                    ref={messageContainerRef}
                    className="flex-1 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}
                >
                    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-4">
                        {currentChatMessages.map((msg) => (
                            <MessageItem key={msg.id} msg={msg} onPromptClick={handlePromptClick} />
                        ))}

                        <AnimatePresence>
                            {isAiTyping && <TypingIndicator />}
                        </AnimatePresence>

                        <div ref={messageEndRef} />
                    </div>
                </div>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                    {showScrollBtn && (
                        <motion.button
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.9 }}
                            onClick={scrollToBottom}
                            className="absolute bottom-36 right-6 z-20 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #8B5CF6, #C026D3)',
                                boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                            }}
                        >
                            <ChevronDown className="h-4 w-4 text-white" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* ── Input area ── */}
                <div className="shrink-0 px-4 pb-4 pt-2 max-w-3xl mx-auto w-full relative">

                    {/* Attach popup */}
                    <AnimatePresence>
                        {attachMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                onClick={e => e.stopPropagation()}
                                className="absolute bottom-[calc(100%+8px)] left-4 rounded-2xl p-2 w-52 z-30"
                                style={{
                                    background: '#111114',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                }}
                            >
                                {[
                                    { icon: Paperclip, label: 'Attach' },
                                    { icon: Globe, label: 'Web Search' },
                                    { icon: Cpu, label: 'Agent Mode' },
                                    { icon: Mic, label: 'Voice' },
                                    { icon: Zap, label: 'Deep Think' },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-not-allowed transition-colors hover:bg-white/5"
                                        style={{ color: '#52525B' }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-3.5 w-3.5 text-violet-500/40" />
                                            <span>{label}</span>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase"
                                            style={{ background: 'rgba(139,92,246,0.1)', color: '#7C3AED' }}>
                                            Soon
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input box */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(17,17,20,0.9)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {/* Textarea */}
                        <form onSubmit={handleSendMessage}>
                            <div className="flex items-end gap-3 px-3 py-3">
                                {/* Plus Button */}
                                <motion.button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); setAttachMenuOpen(!attachMenuOpen); }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer"
                                    style={{
                                        background: attachMenuOpen ? 'linear-gradient(135deg, #8B5CF6, #C026D3)' : 'rgba(255,255,255,0.06)',
                                        color: attachMenuOpen ? 'white' : '#A1A1AA',
                                    }}
                                >
                                    <Plus className={`h-4 w-4 transition-transform duration-200 ${attachMenuOpen ? 'rotate-45' : ''}`} strokeWidth={2.5} />
                                </motion.button>

                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed min-h-[28px] max-h-[160px] py-1.5"
                                    placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                />
                                
                                <motion.button
                                    type="submit"
                                    disabled={!message.trim() || isAiTyping}
                                    whileHover={message.trim() ? { scale: 1.08 } : {}}
                                    whileTap={message.trim() ? { scale: 0.92 } : {}}
                                    className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed"
                                    style={message.trim() && !isAiTyping ? {
                                        background: 'linear-gradient(135deg, #8B5CF6, #C026D3)',
                                        boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                                    } : {
                                        background: 'rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <Send className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    <p className="text-center text-[10px] mt-2" style={{ color: '#27272A' }}>
                        Engineered by Rishabh Dwivedi &bull; NEXUS AI v4.0.0 &bull; Powered by Gemini
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
