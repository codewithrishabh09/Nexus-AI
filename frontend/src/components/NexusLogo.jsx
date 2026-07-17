import React from 'react';

export default function NexusLogo({ size = 32 }) {
    const iconSize = Math.round(size / 2);
    const roundedClass = size <= 32 ? 'rounded-xl' : 'rounded-2xl';
    const shadowBlur = Math.round(size * 0.5);

    return (
        <div
            className={`${roundedClass} flex items-center justify-center text-white shrink-0`}
            style={{
                width: size,
                height: size,
                background: 'linear-gradient(135deg, #8B5CF6, #C026D3)',
                boxShadow: `0 0 ${shadowBlur}px rgba(139,92,246,0.4)`
            }}
        >
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
        </div>
    );
}
