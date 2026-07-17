import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import NexusLogo from './NexusLogo';

function PaymentModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState('plan'); // 'plan', 'checkout', 'success'
    const [plan, setPlan] = useState('monthly'); // 'monthly', 'annual'
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states for demo purposes
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    const handleClose = () => {
        if (isProcessing) return;
        setStep('plan');
        setPlan('monthly');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setCardName('');
        onClose();
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // TODO: Replace with real payment gateway (Razorpay/Stripe) later
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => {
                handleClose();
                onSuccess();
            }, 2000);
        }, 2000);
    };

    if (!isOpen) return null;

    const price = plan === 'monthly' ? '49' : '499';
    const period = plan === 'monthly' ? '/month' : '/year';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl overflow-hidden relative text-center"
                        style={{
                            background: '#111114',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.08)',
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />

                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            disabled={isProcessing}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer z-50 disabled:opacity-50"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <X className="h-4 w-4" />
                        </button>

                        <div className="p-7 relative z-10">
                            <AnimatePresence mode="wait">
                                {step === 'plan' && (
                                    <motion.div
                                        key="plan"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-center mb-5">
                                            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white"
                                                style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
                                                <Sparkles className="h-7 w-7" />
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-2">Upgrade to Continue</h2>
                                        <p className="text-sm mb-6" style={{ color: '#A1A1AA' }}>Upgrade to Nexus Premium for unlimited AI power.</p>

                                        {/* Toggle */}
                                        <div className="flex p-1 mb-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <button onClick={() => setPlan('monthly')}
                                                className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                                                style={plan === 'monthly' ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' } : { color: '#71717A', border: '1px solid transparent' }}>
                                                Monthly
                                            </button>
                                            <button onClick={() => setPlan('annual')}
                                                className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                style={plan === 'annual' ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' } : { color: '#71717A', border: '1px solid transparent' }}>
                                                Annual <span className="text-[9px] px-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>Save 15%</span>
                                            </button>
                                        </div>

                                        {/* Pricing Card */}
                                        <div className="p-4 rounded-xl mb-6 text-left"
                                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-white">NEXUS Pro</span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}>{plan === 'annual' ? 'Best Value' : 'Popular'}</span>
                                            </div>
                                            <div className="mb-3">
                                                <span className="text-2xl font-black text-white">₹{price}</span>
                                                <span className="text-xs" style={{ color: '#A1A1AA' }}>{period}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {['Unlimited Messages', 'Access to all Personas', 'Priority Generation'].map(feature => (
                                                    <li key={feature} className="flex items-center gap-2 text-xs" style={{ color: '#D4D4D8' }}>
                                                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <motion.button
                                            onClick={() => setStep('checkout')}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}
                                        >
                                            Continue to Payment
                                        </motion.button>
                                    </motion.div>
                                )}

                                {step === 'checkout' && (
                                    <motion.div
                                        key="checkout"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-left"
                                    >
                                        <button onClick={() => setStep('plan')} disabled={isProcessing}
                                            className="flex items-center gap-1.5 text-xs font-medium mb-5 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                                            style={{ color: '#A1A1AA' }}>
                                            <ArrowLeft className="h-3.5 w-3.5" /> Back to plans
                                        </button>
                                        
                                        <div className="mb-5 flex justify-between items-end">
                                            <div>
                                                <h2 className="text-lg font-bold text-white">Checkout</h2>
                                                <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>NEXUS Pro {plan === 'annual' ? '(Annual)' : '(Monthly)'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-white">₹{price}</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePayment} className="space-y-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#71717A' }}>Card Number</label>
                                                <div className="relative flex items-center rounded-xl transition-all"
                                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <CreditCard className="absolute left-3.5 h-3.5 w-3.5" style={{ color: '#71717A' }} />
                                                    <input type="text" required placeholder="0000 0000 0000 0000" disabled={isProcessing}
                                                        value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                                                        className="w-full py-2.5 pl-10 pr-4 bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#71717A' }}>Expiry</label>
                                                    <input type="text" required placeholder="MM/YY" disabled={isProcessing}
                                                        value={expiry} onChange={e => setExpiry(e.target.value)}
                                                        className="w-full py-2.5 px-3.5 rounded-xl bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700 transition-all"
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#71717A' }}>CVV</label>
                                                    <input type="text" required placeholder="123" disabled={isProcessing}
                                                        value={cvv} onChange={e => setCvv(e.target.value)}
                                                        className="w-full py-2.5 px-3.5 rounded-xl bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700 transition-all"
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[9px] uppercase font-semibold tracking-widest" style={{ color: '#71717A' }}>Cardholder Name</label>
                                                <input type="text" required placeholder="John Doe" disabled={isProcessing}
                                                    value={cardName} onChange={e => setCardName(e.target.value)}
                                                    className="w-full py-2.5 px-3.5 rounded-xl bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-700 transition-all"
                                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={isProcessing}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-2 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                                                style={{ background: 'linear-gradient(135deg, #8B5CF6, #C026D3)', boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Processing payment...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-4 w-4" /> Pay ₹{price}
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center py-6"
                                    >
                                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 text-white"
                                            style={{ background: 'linear-gradient(135deg, #10B981, #34D399)', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                                            <Check className="h-8 w-8" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
                                        <p className="text-sm" style={{ color: '#A1A1AA' }}>Enjoy unlimited messages.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PaymentModal;
