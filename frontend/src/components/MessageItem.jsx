import { useState, useCallback } from 'react';
import { Copy, Check, Zap, ClipboardCopy } from 'lucide-react';

const SUGGESTED_PROMPTS = [
    { icon: '⚡', text: 'Write a Python function to sort a list' },
    { icon: '🌌', text: 'Explain quantum computing simply' },
    { icon: '📧', text: 'Draft a professional email template' },
    { icon: '🔍', text: 'Debug my code and find errors' },
];

function NexusWelcomeCard({ onPromptClick }) {
    return (
        <div className="w-full">
            {/* Animated gradient border wrapper */}
            <div className="relative p-px rounded-2xl overflow-hidden">
                {/* Rotating gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 via-blue-500 to-pink-500 opacity-40 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 opacity-20 blur-sm" />

                {/* Inner card */}
                <div className="relative bg-[#1a0a2e] rounded-2xl p-5">

                    {/* Logo + Brand */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative h-11 w-11 shrink-0">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.35)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </div>
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-pink-400 border-2 border-[#1a0a2e]">
                                <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-70" />
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base font-black tracking-[0.1em] text-white">NEXUS AI</h2>
                                <span className="text-[9px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded tracking-widest uppercase">v4.0</span>
                                {/* LIVE badge */}
                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded tracking-widest uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                    LIVE
                                </span>
                            </div>
                            <p className="text-[11px] text-purple-400/60 tracking-wide mt-0.5">Intelligent Assistant Platform</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-pink-500/30 via-purple-500/20 to-transparent mb-4" />

                    {/* Capability grid */}
                    <p className="text-xs text-gray-400 mb-3 tracking-wide">Your workspace is ready. Here's what I can do:</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { icon: '💬', label: 'Answer', desc: 'Any question, any topic' },
                            { icon: '🔍', label: 'Analyze', desc: 'Data, code & documents' },
                            { icon: '💡', label: 'Brainstorm', desc: 'Ideas & creative content' },
                            { icon: '📝', label: 'Write', desc: 'Drafts, reports & more' },
                        ].map(({ icon, label, desc }) => (
                            <div key={label} className="flex items-start gap-2.5 bg-[#0f0015] border border-[#2a1040] rounded-lg px-3 py-2.5 hover:border-pink-500/20 transition-colors">
                                <span className="text-base leading-none mt-0.5">{icon}</span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-200">{label}</p>
                                    <p className="text-[10px] text-purple-400/60 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Suggested prompts */}
                    <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-purple-400/50 mb-2">Try asking...</p>
                        <div className="grid grid-cols-2 gap-2">
                            {SUGGESTED_PROMPTS.map(({ icon, text }) => (
                                <button
                                    key={text}
                                    onClick={() => onPromptClick && onPromptClick(text)}
                                    className="flex items-center gap-2 bg-[#0f0015] hover:bg-[#2a1040] border border-[#2a1040] hover:border-pink-500/30 rounded-lg px-3 py-2 text-left transition-all duration-200 cursor-pointer group"
                                >
                                    <span className="text-sm shrink-0">{icon}</span>
                                    <span className="text-[10px] text-gray-400 group-hover:text-gray-200 transition-colors leading-tight line-clamp-2">{text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer stats bar */}
                    <div className="pt-3 border-t border-[#2a1040]/60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-purple-400/50">
                                <Zap className="h-2.5 w-2.5 text-pink-500 shrink-0" />
                                <span>Type a message or click a prompt above</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {[
                                { dot: 'bg-blue-400', label: 'Gemini 1.5 Flash' },
                                { dot: 'bg-green-400', label: 'MongoDB Atlas' },
                                { dot: 'bg-pink-400', label: 'Socket.io' },
                            ].map(({ dot, label }) => (
                                <span key={label} className="flex items-center gap-1 text-[9px] text-purple-400/40 font-medium">
                                    <span className={`h-1.5 w-1.5 rounded-full ${dot} opacity-70`} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-gray-100">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const renderMessageText = useCallback((text, msgId) => {
        if (text.includes('<nexus-welcome>')) return <NexusWelcomeCard onPromptClick={onPromptClick} />;

        if (!text.includes('```')) {
            return <p className="whitespace-pre-wrap break-words">{renderInlineMarkdown(text)}</p>;
        }

        const parts = text.split('```');
        return parts.map((part, index) => {
            if (index % 2 !== 0) {
                const lines = part.split('\n');
                const language = lines[0].trim() || 'code';
                const codeContent = lines.slice(1).join('\n').trim();
                const blockUniqueId = `${msgId}-block-${index}`;
                return (
                    <div key={blockUniqueId} className="my-4 border border-[#3d1a5e] rounded-xl overflow-hidden bg-[#050008] text-left w-full font-mono text-xs shadow-inner">
                        <div className="bg-[#1a0a2e] px-4 py-2 border-b border-[#2a1040] flex justify-between items-center select-none">
                            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">{language}</span>
                            <button onClick={() => handleCopyCode(codeContent, blockUniqueId)} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                                {copiedId === blockUniqueId
                                    ? <><Check className="h-3 w-3 text-pink-400" /><span className="text-[10px] text-pink-400">Copied!</span></>
                                    : <><Copy className="h-3 w-3" /><span className="text-[10px]">Copy code</span></>
                                }
                            </button>
                        </div>
                        <div className="p-4 overflow-x-auto custom-scrollbar whitespace-pre text-[#cbd5e1] leading-relaxed">{codeContent}</div>
                    </div>
                );
            }
            return part ? <p key={`${msgId}-txt-${index}`} className="whitespace-pre-wrap break-words">{renderInlineMarkdown(part)}</p> : null;
        });
    }, [copiedId, handleCopyCode, onPromptClick]);

    const isBot = msg.sender === 'bot';
    const isWelcome = msg.text?.includes('<nexus-welcome>');

    return (
        <div className={`flex gap-4 ${!isBot ? 'justify-end' : 'justify-start'} group/msg`}>
            {isBot && !isWelcome && (
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(236,72,153,0.25)] shrink-0 mt-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                </div>
            )}

            <div className={`flex flex-col ${isWelcome ? 'w-full' : 'max-w-[85%]'} ${!isBot ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm tracking-wide w-full ${!isBot
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-tr-none shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                    : isWelcome
                        ? 'bg-transparent p-0'
                        : 'bg-[#1a0a2e] border border-[#2a1040] text-[#d1d5db] rounded-tl-none'
                    }`}>
                    {renderMessageText(msg.text, msg.id)}
                </div>

                {!isWelcome && (
                    <button
                        onClick={handleCopyMessage}
                        className="mt-1.5 flex items-center gap-1 text-[10px] opacity-0 group-hover/msg:opacity-100 transition-all cursor-pointer text-purple-400/60 hover:text-pink-400"
                    >
                        {msgCopied
                            ? <><Check className="h-2.5 w-2.5 text-pink-400" /><span className="text-pink-400">Copied!</span></>
                            : <><ClipboardCopy className="h-2.5 w-2.5" /><span>Copy</span></>
                        }
                    </button>
                )}
            </div>
        </div>
    );
}

export default MessageItem;
