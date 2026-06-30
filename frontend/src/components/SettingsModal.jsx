import { Settings, Shield, Sliders, Building2, Terminal, Sparkles, X } from 'lucide-react';

const PERSONAS = [
    {
        id: 'Architect',
        icon: Building2,
        desc: 'Structured & precise',
        gradient: 'from-blue-500 to-purple-600',
        glow: 'rgba(99,102,241,0.3)',
    },
    {
        id: 'DevMode',
        icon: Terminal,
        desc: 'Code focused',
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'rgba(16,185,129,0.3)',
    },
    {
        id: 'Creative',
        icon: Sparkles,
        desc: 'Imaginative & free',
        gradient: 'from-pink-500 to-orange-400',
        glow: 'rgba(236,72,153,0.3)',
    },
];

function SettingsModal({
    isOpen,
    onClose,
    systemPersona,
    setSystemPersona,
    aiTemperature,
    setAiTemperature
}) {
    if (!isOpen) return null;

    const tempPercent = ((aiTemperature - 0.1) / (1.0 - 0.1)) * 100;

    return (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f0015] border border-[#2a1040] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_70%)] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2a1040]">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-pink-500/20 to-purple-600/20 border border-pink-500/20 flex items-center justify-center">
                            <Settings className="h-3.5 w-3.5 text-pink-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white tracking-wide">System Configuration</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-[#2a1040] rounded-lg transition-colors cursor-pointer group"
                    >
                        <X className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Engine Persona */}
                    <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-purple-400/60 flex items-center gap-1.5">
                            <Shield className="h-3 w-3" /> Engine Persona
                        </label>

                        <div className="grid grid-cols-3 gap-2.5">
                            {PERSONAS.map(({ id, icon: Icon, desc, gradient, glow }) => {
                                const isActive = systemPersona === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setSystemPersona(id)}
                                        className={`relative flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${isActive
                                                ? 'border-pink-500/40 bg-[#1a0a2e]'
                                                : 'border-[#2a1040] bg-[#0a0010] hover:border-purple-500/30 hover:bg-[#1a0a2e]/50'
                                            }`}
                                        style={isActive ? { boxShadow: `0 0 20px ${glow}` } : {}}
                                    >
                                        {/* Active glow bg */}
                                        {isActive && (
                                            <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-5 pointer-events-none`} />
                                        )}

                                        {/* Icon */}
                                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${gradient} flex items-center justify-center shadow-lg ${isActive ? 'scale-110' : 'opacity-60'} transition-all duration-200`}>
                                            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                                        </div>

                                        <div className="text-center">
                                            <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'} transition-colors`}>{id}</p>
                                            <p className={`text-[9px] mt-0.5 ${isActive ? 'text-purple-300/70' : 'text-gray-600'} transition-colors`}>{desc}</p>
                                        </div>

                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-pink-400">
                                                <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-60" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Temperature Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] uppercase tracking-widest font-bold text-purple-400/60 flex items-center gap-1.5">
                                <Sliders className="h-3 w-3" /> System Temperature
                            </label>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono font-black text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-md">
                                    {aiTemperature}
                                </span>
                            </div>
                        </div>

                        {/* Custom gradient slider track */}
                        <div className="relative">
                            <div className="h-2 rounded-full bg-[#1a0a2e] border border-[#2a1040] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 transition-all duration-150"
                                    style={{ width: `${tempPercent}%` }}
                                />
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={aiTemperature}
                                onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                            />
                            {/* Thumb indicator */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all duration-150 pointer-events-none"
                                style={{ left: `calc(${tempPercent}% - 8px)` }}
                            />
                        </div>

                        <div className="flex justify-between text-[10px] font-medium px-0.5 mt-1">
                            <span className="text-purple-400/50">🎯 Precise</span>
                            <span className="text-pink-400/70">✨ Creative</span>
                        </div>

                        {/* Temperature description */}
                        <div className="bg-[#1a0a2e] border border-[#2a1040] rounded-lg px-3 py-2 text-[10px] text-purple-400/60">
                            {aiTemperature <= 0.3 && '🎯 Very precise and deterministic responses'}
                            {aiTemperature > 0.3 && aiTemperature <= 0.6 && '⚖️ Balanced between accuracy and creativity'}
                            {aiTemperature > 0.6 && aiTemperature <= 0.8 && '💡 Creative with good coherence'}
                            {aiTemperature > 0.8 && '🚀 Highly creative and exploratory'}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-[#2a1040] flex items-center justify-between">
                        <p className="text-[10px] text-purple-400/40">Changes apply immediately</p>
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all text-white font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.2)] flex items-center gap-1.5"
                        >
                            <Settings className="h-3 w-3" />
                            Apply Parameters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;