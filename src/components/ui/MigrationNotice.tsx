import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, X } from 'lucide-react';

interface MigrationNoticeProps {
    show: boolean;
    migratedFrom: number | null;
    currentCredits: number | null;
    onClose: () => void;
    lang: 'en' | 'cn';
}

export const MigrationNotice: React.FC<MigrationNoticeProps> = ({
    show,
    migratedFrom,
    currentCredits,
    onClose,
    lang
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // Animation State
    const [displayedCredits, setDisplayedCredits] = useState(migratedFrom || 0);

    useEffect(() => {
        if (show) {
            // 1. Show modal slightly faster
            const timer = setTimeout(() => setIsVisible(true), 500);

            // 2. Start Rolling Animation
            if (migratedFrom !== null && currentCredits !== null && currentCredits > migratedFrom) {
                const start = migratedFrom;
                const end = currentCredits;
                const duration = 1500; // 1.5s animation
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const current = Math.floor(start + (end - start) * ease);
                    setDisplayedCredits(current);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                // Start animation after modal appears
                setTimeout(() => requestAnimationFrame(animate), 800);
            }

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [show, migratedFrom, currentCredits]);

    if (!show || !isVisible) return null;

    const isUpgrade = migratedFrom !== null && currentCredits !== null && migratedFrom > 0;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 animate-in slide-in-from-top-4 duration-700 ease-out pointer-events-auto">
            <div className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md p-0.5 ${isUpgrade
                ? 'bg-gradient-to-r from-amber-500/50 via-purple-500/50 to-indigo-500/50 border-white/20'
                : 'bg-zinc-900/90 dark:bg-zinc-800/90 border-zinc-700/50'
                }`}>

                {/* Inner Content */}
                <div className="bg-zinc-950/90 rounded-[14px] p-4 flex items-start gap-4">
                    {/* Icon */}
                    <div className={`shrink-0 p-2.5 rounded-xl ${isUpgrade ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {isUpgrade ? <Trophy className="w-6 h-6 animate-pulse" /> : <Sparkles className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className={`text-sm font-bold mb-1 ${isUpgrade ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500' : 'text-zinc-100'}`}>
                            {lang === 'en' ? 'Service Upgrade' : '服务升级通知'}
                        </h3>

                        {isUpgrade ? (
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    {lang === 'en'
                                        ? 'Your account has been upgraded to the Credit System.'
                                        : '您的账户已升级为积分制，剩余次数已自动翻倍。'}
                                </p>
                                <div className="flex items-center gap-3 text-xs font-mono bg-white/5 rounded-lg p-2 border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-500 uppercase">Old</span>
                                        <span className="text-zinc-400 line-through decoration-red-500/50">{migratedFrom} Times</span>
                                    </div>
                                    <div className="text-zinc-600">→</div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-amber-500 uppercase font-bold">New</span>
                                        <span className={`text-amber-400 font-bold text-base tabular-nums ${displayedCredits < (currentCredits || 0) ? 'animate-pulse' : ''}`}>
                                            {displayedCredits} Credits
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                    {lang === 'en' ? '2K = 1 Credit | 4K = 2 Credits' : '极速版(2K)消耗1积分 | 极致版(4K)消耗2积分'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    {lang === 'en'
                                        ? 'Welcome to the new Credit System!'
                                        : '全新积分系统上线！更灵活的算力分配。'}
                                </p>
                                <p className="text-[10px] text-indigo-300/80">
                                    {lang === 'en' ? '2K takes 1 Credit, 4K takes 2 Credits' : '2K极速版 (1积分/张) · 4K极致版 (2积分/张)'}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-zinc-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
