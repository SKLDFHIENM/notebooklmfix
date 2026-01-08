import React, { useEffect, useState } from 'react';
import { X, Trophy, Zap, Sparkles, MessageCircle, Copy, Check } from 'lucide-react';
import wechatQr from '../../assets/wechat.png';
import { copyToClipboard } from '../../utils/clipboard';

interface UpdateAnnouncementModalProps {
    lang: 'en' | 'cn';
}

export const UpdateAnnouncementModal: React.FC<UpdateAnnouncementModalProps> = ({ lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard('JaffryD');
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    useEffect(() => {
        // Check if seen specific version
        const hasSeen = localStorage.getItem('update_announcement_v2_3_seen');
        if (!hasSeen) {
            // Delay slightly to not conflict with heavy init logic
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('update_announcement_v2_3_seen', 'true');
    };

    if (!isOpen) return null;

    const t = {
        title: lang === 'en' ? 'New Update v2.3' : '🎉 系统升级公告 (v2.3)',
        subtitle: lang === 'en' ? 'More power, less cost.' : '更强的功能，更低的价格',
        featuresTitle: lang === 'en' ? 'What\'s New:' : '本次更新内容：',
        feature1: lang === 'en' ? 'Removed bottom-right watermark.' : '新增功能：自动移除 NotebookLM 右下角水印',
        feature2: lang === 'en' ? 'Credit System: 2K=1, 4K=2 (Old quota x2 migrated).' : '积分制上线：极速2K(1积分)、极致4K(2积分)',
        feature2Desc: lang === 'en' ? 'Your old quota has been doubled automatically.' : '您的旧版剩余次数已自动翻倍转换为积分！',
        pricingTitle: lang === 'en' ? 'New Pricing:' : '限时优惠价格：',
        pricing1: lang === 'en' ? 'First Buy: 10 RMB / 40 Credits' : '🎉 首次购买：10 元 / 40 积分',
        pricing1Desc: lang === 'en' ? '(Up to 40 images)' : '（最多可升级 40 张图）',
        pricing2: lang === 'en' ? 'Regular: 20 RMB / 40 Credits' : '🎉 之后恢复：20 元 / 40 积分',
        contactBtn: lang === 'en' ? 'I got it' : '我知道了',
        wechatId: 'WeChat: JaffryD'
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-md transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-500 max-h-[85dvh] flex flex-col">

                {/* Decorative Elements (Hidden on mobile to save space/distraction) */}
                <div className="hidden md:block absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="hidden md:block absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative p-5 pt-7 sm:p-6 sm:pt-8 overflow-y-auto">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white animate-pulse">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-heading font-bold text-zinc-900 dark:text-white">
                                {t.title}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                {t.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                        <div className="flex gap-3 items-start p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight mb-1">
                                    {t.feature1}
                                </h4>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight mb-1">
                                    {t.feature2}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                                    {t.feature2Desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Contact Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* Pricing Card */}
                        <div className="bg-amber-50/50 dark:bg-amber-500/10 rounded-xl p-3 border border-amber-100 dark:border-amber-500/20">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600/80 dark:text-amber-400/80 mb-2 border-b border-amber-500/10 pb-1">
                                {t.pricingTitle}
                            </h5>
                            <div className="space-y-2 text-xs text-amber-900 dark:text-amber-100 leading-relaxed font-medium">
                                <p>{t.pricing1}<br /><span className="opacity-70 text-[10px] scale-90 origin-left inline-block">{t.pricing1Desc}</span></p>
                                <p className="pt-1 border-t border-amber-500/10 dark:border-amber-500/20">{t.pricing2}<br /><span className="opacity-70 text-[10px] scale-90 origin-left inline-block">{t.pricing1Desc}</span></p>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl p-3 border border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center justify-center text-center">
                            <img src={wechatQr} alt="QR" className="w-24 h-24 object-contain mb-2 bg-white rounded-lg p-1" />
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 bg-white/50 dark:bg-black/20 rounded-md text-indigo-800 dark:text-indigo-200 font-mono hover:bg-white dark:hover:bg-black/40 transition-colors cursor-pointer active:scale-95"
                            >
                                <span>{t.wechatId.replace('WeChat: ', '')}</span>
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-50" />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl font-bold transition-transform active:scale-[0.98] shadow-lg"
                    >
                        {t.contactBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};
