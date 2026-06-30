import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Plus, Send, Activity, Image, FileText, Code, ChevronDown } from 'lucide-react';
import { io } from 'socket.io-client';

import Sidebar from '../components/Sidebar';
import SettingsModal from '../components/SettingsModal';
import ProfileModal from '../components/ProfileModal';
import MessageItem from '../components/MessageItem';

const SOCKET_URL = import.meta.env.VITE_API_URL;
const WELCOME_MESSAGE = `<nexus-welcome></nexus-welcome>`;

function Dashboard({ onNavigate }) {
    const { user, logoutSession } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [message, setMessage] = useState('');
    const messageEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const socketRef = useRef(null);

    const [activeChatId, setActiveChatId] = useState('chat-1');
    const [attachMenuOpen, setAttachMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [systemPersona, setSystemPersona] = useState('Architect');
    const [aiTemperature, setAiTemperature] = useState(0.7);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const [chats, setChats] = useState([{ id: 'chat-1', title: 'New Chat' }]);
    const [messages, setMessages] = useState([
        { id: 'msg-init-1', chatId: 'chat-1', sender: 'bot', text: WELCOME_MESSAGE }
    ]);

    // Socket.io
    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ['websocket'], reconnectionAttempts: 5, withCredentials: true });
        socketRef.current = socket;
        socket.on('receiveMessage', (data) => {
            setIsAiTyping(false);
            setMessages((prev) => [
                ...prev,
                { id: data.id || 'msg-bot-' + Date.now(), chatId: data.chatId || 'chat-1', sender: 'bot', text: data.text || 'Sorry, I could not generate a response.' }
            ]);
        });
        return () => socket.disconnect();
    }, []);

    // Load chat history
    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/history`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success && data.history.length > 0) {
                    const historyMessages = data.history.map((msg) => ({
                        id: msg._id,
                        chatId: msg.chatId || 'chat-1',
                        sender: msg.role === 'user' ? 'user' : 'bot',
                        text: msg.text,
                    }));

                    // Extract distinct chats
                    const distinctChatsMap = new Map();
                    historyMessages.forEach(msg => {
                        if (msg.sender === 'user' && !distinctChatsMap.has(msg.chatId)) {
                            const title = msg.text.length > 28 ? msg.text.substring(0, 25) + '...' : msg.text;
                            distinctChatsMap.set(msg.chatId, { id: msg.chatId, title });
                        }
                    });

                    let loadedChats = Array.from(distinctChatsMap.values());
                    if (loadedChats.length === 0) loadedChats = [{ id: 'chat-1', title: 'New Chat' }];

                    // We also need to add the welcome message to the first chat
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

    // Auto scroll
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    // Scroll to bottom button visibility
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

    useEffect(() => {
        const handleOutsideClick = () => setAttachMenuOpen(false);
        if (attachMenuOpen) window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [attachMenuOpen]);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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

    const handleSendMessage = useCallback((e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const userPrompt = message.trim();
        setMessage('');
        setActiveChatId((currentChatId) => {
            setChats((prevChats) =>
                prevChats.map((chat) => {
                    if (chat.id === currentChatId && chat.title === 'New Chat') {
                        return { ...chat, title: userPrompt.length > 28 ? userPrompt.substring(0, 25) + '...' : userPrompt };
                    }
                    return chat;
                })
            );
            setMessages((prev) => [...prev, { id: 'msg-user-' + Date.now(), chatId: currentChatId, sender: 'user', text: userPrompt }]);
            setIsAiTyping(true);
            socketRef.current?.emit('sendMessage', {
                text: userPrompt,
                sender: user?.username || user?.email || 'Guest',
                chatId: currentChatId,
                persona: systemPersona,
                temperature: aiTemperature
            });
            return currentChatId;
        });
    }, [message, user, systemPersona, aiTemperature]);

    const currentChatMessages = messages.filter(m => m.chatId === activeChatId);

    const handlePromptClick = useCallback((promptText) => {
        setMessage(promptText);
    }, []);

    return (
        <div className="flex h-screen w-screen bg-[#0a0010] text-[#e3e6ed] font-sans antialiased overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.06),transparent_50%)] pointer-events-none" />

            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} systemPersona={systemPersona} setSystemPersona={setSystemPersona} aiTemperature={aiTemperature} setAiTemperature={setAiTemperature} />
            <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} messages={messages} />

            <Sidebar
                sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
                chats={chats} setChats={setChats}
                activeChatId={activeChatId} setActiveChatId={setActiveChatId}
                handleCreateNewChat={handleCreateNewChat} handleDeleteChat={handleDeleteChat}
                setSettingsOpen={setSettingsOpen} setProfileOpen={setProfileOpen}
                user={user} logoutSession={logoutSession} onNavigate={onNavigate}
            />

            <div className="flex-1 flex flex-col h-full bg-transparent relative z-10">
                <header className="h-14 border-b border-[#2a1040] px-6 flex items-center gap-4 bg-[#0a0010]/90 backdrop-blur-md">
                    {!sidebarOpen && (
                        <button onClick={() => setSidebarOpen(true)} className="p-1.5 bg-[#1a0a2e] border border-[#2a1040] rounded-lg text-gray-300 hover:border-pink-500/30 transition-colors">
                            <Menu className="h-4 w-4" />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20 flex items-center gap-1.5">
                            <Activity className="h-3 w-3 animate-pulse" /> Node: {systemPersona}
                        </span>
                        <span className="text-purple-800">/</span>
                        <h1 className="text-xs font-semibold text-gray-200 tracking-wide">
                            {chats.find(c => c.id === activeChatId)?.title || 'Main Console'}
                        </h1>
                    </div>
                </header>

                {/* Message area */}
                <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto custom-scrollbar relative">
                    {currentChatMessages.map((msg) => (
                        <MessageItem key={msg.id} msg={msg} onPromptClick={handlePromptClick} />
                    ))}

                    {/* AI Typing */}
                    {isAiTyping && (
                        <div className="flex gap-4 justify-start">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </div>
                            <div className="bg-[#1a0a2e] border border-[#2a1040] rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-1.5 w-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-1.5 w-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>

                {/* ✅ Scroll to bottom button */}
                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-28 right-8 z-20 h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:from-pink-400 hover:to-purple-500 transition-all cursor-pointer"
                    >
                        <ChevronDown className="h-4 w-4 text-white" />
                    </button>
                )}

                {/* Input footer */}
                <footer className="p-4 md:p-6 max-w-4xl w-full mx-auto bg-gradient-to-t from-[#0a0010] via-[#0a0010] to-transparent relative">
                    {attachMenuOpen && (
                        <div className="absolute bottom-[80px] left-6 md:left-8 bg-[#1a0a2e] border border-[#3d1a5e] rounded-xl p-2 w-52 shadow-2xl z-30" onClick={(e) => e.stopPropagation()}>
                            {[
                                { icon: Image, label: 'Upload Image' },
                                { icon: FileText, label: 'Attach Document' },
                                { icon: Code, label: 'Parse Source Code' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center justify-between px-2.5 py-2 hover:bg-[#2a1040] rounded-lg text-xs text-gray-400 cursor-not-allowed">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-3.5 w-3.5 text-purple-400/60" />
                                        <span>{label}</span>
                                    </div>
                                    <span className="text-[9px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Soon</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#1a0a2e] border border-[#2a1040] rounded-xl focus-within:border-pink-500/50 transition-all duration-200 shadow-xl group">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setAttachMenuOpen(!attachMenuOpen); }}
                            className={`p-2.5 ml-2 rounded-lg text-gray-500 hover:text-pink-400 hover:bg-[#2a1040] transition-all cursor-pointer ${attachMenuOpen ? 'rotate-45 text-pink-400 bg-[#2a1040]' : ''}`}>
                            <Plus className="h-4 w-4 stroke-[2.5]" />
                        </button>
                        <input
                            type="text"
                            className="w-full px-3 pr-14 py-3.5 bg-transparent text-gray-100 text-sm focus:outline-none placeholder-gray-600 tracking-wide"
                            placeholder="Ask anything..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" disabled={isAiTyping}
                            className="absolute right-2.5 p-2 bg-[#2a1040] text-gray-400 group-focus-within:bg-gradient-to-r group-focus-within:from-pink-500 group-focus-within:to-purple-600 group-focus-within:text-white rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                            <Send className="h-3.5 w-3.5" />
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-purple-900 mt-3 tracking-wider uppercase">
                        Engineered by DevOrbit Hub &bull; Operational Node v4.0.0
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default Dashboard;
