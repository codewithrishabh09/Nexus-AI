import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Sliders, Building2, Terminal, Sparkles, X } from 'lucide-react';

const PERSONAS = [
    { id: 'Architect', icon: Building2, desc: 'Structured & precise', gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', glow: 'rgba(99,102,241,0.35)' },
    { id: 'DevMode',   icon: Terminal,  desc: 'Code focused',        gradient: 'linear-gradient(135deg, #10B981, #06B6D4)', glow: 'rgba(16,185,129,0.35)' },
    { id: 'Creative',  icon: Sparkles,  desc: 'Imaginative & free',  gradient: 'linear-gradient(135deg, #C026D3, #F59E0B)', glow: 'rgba(192,38,211,0.35)' },
];

function SettingsModal({ isOpen, onClose, systemPersona, setSystemPersona, aiTemperature, setAiTemperature }) {
    if (!isOpen) return null;
    const tempPercent = ((aiTemperature - 0.1) / (1.0 - 0.1)) * 100;

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
                        {/* Glow orb */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }} />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                    <Settings className="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">System Configuration</h3>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">Tune your AI workspace</p>
                                </div>
                            </div>
                            <button onClick={onClose}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* ── Persona picker ── */}
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2"
                                    style={{ color: '#52525B' }}>
                                    <Shield className="h-3 w-3 text-violet-500" /> Engine Persona
                                </label>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {PERSONAS.map(({ id, icon: Icon, desc, gradient, glow }) => {
                                        const isActive = systemPersona === id;
                                        return (
                                            <motion.button
                                                key={id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setSystemPersona(id)}
                                                className="relative flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl cursor-pointer overflow-hidden transition-all"
                                                style={{
                                                    background: isActive ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
                                                    border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                                    boxShadow: isActive ? `0 0 20px ${glow}` : 'none',
                                                }}
                                            >
                                                <div className="h-9 w-9 rounded-xl flex items-center justify-center transition-transform"
                                                    style={{
                                                        background: gradient,
                                                        transform: isActive ? 'scale(1.1)' : 'scale(0.9)',
                                                        opacity: isActive ? 1 : 0.5,
                                                    }}>
                                                    <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-bold" style={{ color: isActive ? '#fff' : '#71717A' }}>{id}</p>
                                                    <p className="text-[9px] mt-0.5" style={{ color: isActive ? '#A78BFA' : '#3F3F46' }}>{desc}</p>
                                                </div>
                                                {isActive && (
                                                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-violet-400">
                                                        <span className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-60" />
                                                    </span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Temperature slider ── */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2"
                                        style={{ color: '#52525B' }}>
                                        <Sliders className="h-3 w-3 text-violet-500" /> Creativity Temperature
                                    </label>
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                                        style={{ background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
                                        {aiTemperature}
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <div className="h-full rounded-full transition-all duration-150"
                                            style={{ width: `${tempPercent}%`, background: 'linear-gradient(90deg, #8B5CF6, #C026D3)' }} />
                                    </div>
                                    <input type="range" min="0.1" max="1.0" step="0.1"
                                        value={aiTemperature}
                                        onChange={e => setAiTemperature(parseFloat(e.target.value))}
                                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" />
                                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-violet-500 bg-white shadow-lg pointer-events-none transition-all duration-150"
                                        style={{ left: `calc(${tempPercent}% - 8px)`, boxShadow: '0 0 8px rgba(139,92,246,0.5)' }} />
                                </div>

                                <div className="flex justify-between text-[10px] px-0.5">
                                    <span style={{ color: '#52525B' }}>🎯 Precise</span>
                                    <span style={{ color: '#A78BFA' }}>✨ Creative</span>
                                </div>

                                <div className="px-3 py-2.5 rounded-xl text-[11px]"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717A' }}>
                                    {aiTemperature <= 0.3 && '🎯 Very precise and deterministic responses'}
                                    {aiTemperature > 0.3 && aiTemperature <= 0.6 && '⚖️ Balanced between accuracy and creativity'}
                                    {aiTemperature > 0.6 && aiTemperature <= 0.8 && '💡 Creative with good coherence'}
                                    {aiTemperature > 0.8 && '🚀 Highly creative and exploratory'}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-1"
                                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <p className="text-[10px]" style={{ color: '#3F3F46' }}>Changes apply immediately</p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onClose}
                                    className="text-white font-semibold text-xs py-2.5 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}
                                >
                                    <Settings className="h-3 w-3" /> Save Configuration
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SettingsModal;