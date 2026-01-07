import React from 'react';
import { X, AlertCircle, MessageCircle } from 'lucide-react';
import wechatQr from '../../assets/wechat.png'; // Make sure this path is correct

interface InsufficientCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCredits: number;
    cost: number;
    lang: 'en' | 'cn';
}

export const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
    isOpen,
    onClose,
    currentCredits,
    cost,
    lang
}) => {
    if (!isOpen) return null;

    const t = {
        title: lang === 'en' ? 'Insufficient Credits' : '积分不足',
        subtitle: lang === 'en' ? 'Processing paused' : '无法继续处理',
        current: lang === 'en' ? 'Current Balance' : '当前余额',
        cost: lang === 'en' ? 'Required' : '本次消耗',
        contactTitle: lang === 'en' ? 'Get More Credits' : '获取更多积分',
        contactDesc: lang === 'en' ? 'Scan to contact author for top-up' : '扫码联系作者进行充值',
        wechatId: 'WeChat: JaffryD'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300">

                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 pt-8 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm animate-bounce">
                        <AlertCircle className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-heading font-bold text-zinc-900 dark:text-white mb-1">
                        {t.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                        {t.subtitle}
                    </p>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-2 gap-3 mb-8">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">{t.current}</span>
                            <span className="text-2xl font-mono font-bold text-red-500 dark:text-red-400 tabular-nums">
                                {currentCredits}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">{t.cost}</span>
                            <span className="text-2xl font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
                                {cost}
                            </span>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="w-full bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-bold">{t.contactTitle}</span>
                        </div>

                        {/* QR Code */}
                        <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm mb-3">
                            <img
                                src={wechatQr}
                                alt="WeChat QR"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <p className="text-xs text-indigo-600/80 dark:text-indigo-300/60 font-medium mb-1">
                            {t.contactDesc}
                        </p>
                        <code className="text-[10px] px-2 py-1 bg-white/50 dark:bg-black/20 rounded-md text-indigo-800 dark:text-indigo-200 font-mono select-all cursor-text">
                            {t.wechatId}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};
