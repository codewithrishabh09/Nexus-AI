import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ClipboardCopy, Zap, Code2, Search, PenLine, MessageSquare, Database, Cpu } from 'lucide-react';

// ─── Suggested prompts ──────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
    { icon: '⚡', text: 'Write a Python function to sort a list' },
    { icon: '🌌', text: 'Explain quantum computing simply' },
    { icon: '📧', text: 'Draft a professional email template' },
    { icon: '🔍', text: 'Debug my code and find errors' },
];

// ─── Quick-action cards ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
    { icon: Code2,      label: 'Generate Code',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)', prompt: 'Write a clean, well-documented code snippet for:' },
    { icon: Search,     label: 'Debug Code',      color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)',  prompt: 'Debug and fix the following code:' },
    { icon: PenLine,    label: 'Write Blog',      color: '#C026D3', bg: 'rgba(192,38,211,0.1)', border: 'rgba(192,38,211,0.25)', prompt: 'Write an engaging blog post about:' },
    { icon: MessageSquare, label: 'Brainstorm', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', prompt: 'Brainstorm creative ideas for:' },
    { icon: Database,   label: 'Design Database', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', prompt: 'Design a database schema for:' },
    { icon: Cpu,        label: 'Analyze Data',    color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  prompt: 'Analyze and summarize the following data:' },
];

// ─── Welcome screen ──────────────────────────────────────────────────────────
function NexusWelcomeCard({ onPromptClick }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-2xl mx-auto pt-6 pb-10"
        >
            {/* ── Hero greeting ── */}
            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold mb-5 tracking-widest uppercase"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                    One Workspace · Multiple Agents · Unlimited Possibilities
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight"
                >
                    {greeting} 👋
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-xl font-medium mb-1"
                    style={{ color: '#A1A1AA' }}
                >
                    Welcome back to{' '}
                    <span className="shimmer-text font-bold">NEXUS AI</span>
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-sm"
                    style={{ color: '#52525B' }}
                >
                    Your intelligent workspace is ready. What will you build today?
                </motion.p>
            </div>

            {/* ── Quick-action grid ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
            >
                {QUICK_ACTIONS.map(({ icon: Icon, label, color, bg, border, prompt }, idx) => (
                    <motion.button
                        key={label}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + idx * 0.06 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onPromptClick && onPromptClick(prompt)}
                        className="flex flex-col items-start gap-2.5 p-4 rounded-2xl cursor-pointer text-left group transition-all"
                        style={{ background: bg, border: `1px solid ${border}` }}
                    >
                        <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                            <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <span className="text-xs font-semibold text-white leading-tight">{label}</span>
                    </motion.button>
                ))}
            </motion.div>

            {/* ── Suggested prompts ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
            >
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#3F3F46' }}>
                    Try asking...
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {SUGGESTED_PROMPTS.map(({ icon, text }) => (
                        <motion.button
                            key={text}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onPromptClick && onPromptClick(text)}
                            className="flex items-center gap-2.5 p-3 rounded-xl text-left cursor-pointer transition-all group"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                        >
                            <span className="text-base shrink-0">{icon}</span>
                            <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-tight line-clamp-2">{text}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* ── Status footer ── */}
            <div className="flex items-center justify-center gap-4 mt-8">
                {[
                    { dot: '#3B82F6', label: 'Gemini 2.5 Flash' },
                    { dot: '#10B981', label: 'MongoDB Atlas' },
                    { dot: '#8B5CF6', label: 'Socket.io Live' },
                ].map(({ dot, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot, opacity: 0.7 }} />
                        <span className="text-[9px] font-medium tracking-wide" style={{ color: '#3F3F46' }}>{label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main message item ───────────────────────────────────────────────────────
function MessageItem({ msg, onPromptClick }) {
    const [copiedId, setCopiedId] = useState('');
    const [msgCopied, setMsgCopied] = useState(false);

    const handleCopyCode = useCallback((codeText, blockId) => {
        navigator.clipboard.writeText(codeText).then(() => {
            setCopiedId(blockId);
            setTimeout(() => setCopiedId(''), 2000);
        });
    }, []);

    const handleCopyMessage = useCallback(() => {
        const plainText = msg.text.replace(/<[^>]+>/g, '').replace(/\*\*/g, '');
        navigator.clipboard.writeText(plainText).then(() => {
            setMsgCopied(true);
            setTimeout(() => setMsgCopied(false), 2000);
        });
    }, [msg.text]);

    const renderInlineMarkdown = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**'))
                return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
            return part;
        });
    };

    const renderMessageText = useCallback((text, msgId) => {
        if (text.includes('<nexus-welcome>')) return <NexusWelcomeCard onPromptClick={onPromptClick} />;

        if (!text.includes('```')) {
            return (
                <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
                    {renderInlineMarkdown(text)}
                </p>
            );
        }

        const parts = text.split('```');
        return parts.map((part, index) => {
            if (index % 2 !== 0) {
                const lines = part.split('\n');
                const language = lines[0].trim() || 'code';
                const codeContent = lines.slice(1).join('\n').trim();
                const blockUniqueId = `${msgId}-block-${index}`;
                return (
                    <div key={blockUniqueId} className="my-4 rounded-2xl overflow-hidden text-left w-full"
                        style={{ background: '#0D0D12', border: '1px solid rgba(139,92,246,0.2)' }}>
                        {/* Code block header */}
                        <div className="px-4 py-2.5 flex justify-between items-center"
                            style={{ background: 'rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} />
                                </div>
                                <span className="text-[10px] font-semibold tracking-wider uppercase ml-1" style={{ color: '#A78BFA' }}>
                                    {language}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopyCode(codeContent, blockUniqueId)}
                                className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                style={{
                                    background: copiedId === blockUniqueId ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                                    color: copiedId === blockUniqueId ? '#A78BFA' : '#71717A',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {copiedId === blockUniqueId
                                    ? <><Check className="h-3 w-3" /><span>Copied!</span></>
                                    : <><Copy className="h-3 w-3" /><span>Copy</span></>
                                }
                            </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono"
                            style={{ color: '#CBD5E1', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                            {codeContent}
                        </pre>
                    </div>
                );
            }
            return part ? (
                <p key={`${msgId}-txt-${index}`} className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {renderInlineMarkdown(part)}
                </p>
            ) : null;
        });
    }, [copiedId, handleCopyCode, onPromptClick]);

    const isBot = msg.sender === 'bot';
    const isWelcome = msg.text?.includes('<nexus-welcome>');

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={`flex gap-3 ${!isBot ? 'justify-end' : 'justify-start'} group/msg`}
        >
            {/* Bot avatar */}
            {isBot && !isWelcome && (
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
            )}

            <div className={`flex flex-col ${isWelcome ? 'w-full' : 'max-w-[82%]'} ${!isBot ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed w-full ${
                        isWelcome
                            ? 'bg-transparent p-0'
                            : !isBot
                                ? 'rounded-br-md'
                                : 'rounded-bl-md'
                    }`}
                    style={isWelcome ? {} : !isBot ? {
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(139,92,246,0.25)',
                    } : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#D4D4D8',
                    }}
                >
                    {renderMessageText(msg.text, msg.id)}
                </div>

                {!isWelcome && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        onClick={handleCopyMessage}
                        className="mt-1.5 flex items-center gap-1 text-[10px] opacity-0 group-hover/msg:opacity-100 transition-all cursor-pointer"
                        style={{ color: '#52525B' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#A78BFA'}
                        onMouseLeave={e => e.currentTarget.style.color = '#52525B'}
                    >
                        {msgCopied
                            ? <><Check className="h-2.5 w-2.5" style={{ color: '#A78BFA' }} /><span style={{ color: '#A78BFA' }}>Copied!</span></>
                            : <><ClipboardCopy className="h-2.5 w-2.5" /><span>Copy</span></>
                        }
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

export default MessageItem;
