import React from 'react';
import {
    Play,
    Square,
    Loader2,
    FileText,
    Presentation,
    Zap,
    Lock,
    Download,
    ChevronUp
} from 'lucide-react';
import { ProcessedPage } from '../../types';

interface MobileActionBarProps {
    t: any;
    lang: 'en' | 'cn';
    pages: ProcessedPage[];
    completedCount: number;
    progress: number;
    isAllComplete: boolean;
    resolution: '2K' | '4K';
    setResolution: (res: '2K' | '4K') => void;
    resolutionLocked: boolean;
    authMode: 'key' | 'passcode' | null;
    keyAuthorized: boolean;
    setIsKeyModalOpen: (isOpen: boolean) => void;
    isProcessing: boolean;
    isStopping: boolean;
    isStopped: boolean;
    startProcessing: () => void;
    stopProcessing: () => void;
    handleExportPdf: () => void;
    isExportingPdf: boolean;
    handleExportPptx: () => void;
    isExportingPptx: boolean;
    handleDownloadZip: () => void;
    uploadMode: 'pdf' | 'image';
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
    t,
    lang,
    pages,
    completedCount,
    progress,
    isAllComplete,
    resolution,
    setResolution,
    resolutionLocked,
    authMode,
    keyAuthorized,
    setIsKeyModalOpen,
    isProcessing,
    isStopping,
    isStopped,
    startProcessing,
    stopProcessing,
    handleExportPdf,
    isExportingPdf,
    handleExportPptx,
    isExportingPptx,
    handleDownloadZip,
    uploadMode
}) => {
    if (pages.length === 0) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 pb-safe-area">
            {/* Progress Bar (Top Line) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out relative ${isAllComplete
                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="px-4 py-3 flex items-center justify-between gap-4">
                {/* Left: Resolution / Status */}
                <div className="flex items-center gap-2">
                    {/* Resolution Toggle (Compact) */}
                    {!resolutionLocked && completedCount < pages.length && (
                        <button
                            onClick={() => {
                                if (authMode === 'key' && resolution === '2K') {
                                    setIsKeyModalOpen(true);
                                } else {
                                    setResolution(resolution === '2K' ? '4K' : '2K'); // Toggle
                                }
                            }}
                            className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl border transition-all ${resolution === '4K'
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                                : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500'
                                }`}
                        >
                            <span className="text-[10px] font-bold">{resolution}</span>
                            {authMode === 'key' && resolution === '2K' && <Lock className="w-2.5 h-2.5 opacity-50" />}
                        </button>
                    )}

                    {/* Count */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{t.pages}</span>
                        <div className="text-sm font-bold font-heading text-zinc-900 dark:text-white leading-none">
                            {completedCount} <span className="text-zinc-400 font-normal">/ {pages.length}</span>
                        </div>
                    </div>
                </div>

                {/* Center: Main Action (Big Button) */}
                {completedCount < pages.length && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                        {isProcessing ? (
                            <button
                                onClick={stopProcessing}
                                disabled={isStopping}
                                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-900 transition-transform active:scale-95 ${isStopping ? 'bg-amber-500' : 'bg-red-500'}`}
                            >
                                {isStopping ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Square className="w-6 h-6 text-white fill-current" />}
                            </button>
                        ) : (
                            <button
                                onClick={startProcessing}
                                disabled={!keyAuthorized}
                                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-900 transition-transform active:scale-95 ${keyAuthorized
                                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                                    : "bg-zinc-200 dark:bg-white/10 text-zinc-400"
                                    }`}
                            >
                                <Play className="w-6 h-6 fill-current ml-1" />
                            </button>
                        )}
                    </div>
                )}


                {/* Right: Export Actions */}
                <div className="flex gap-2">
                    {uploadMode === 'pdf' ? (
                        <button
                            onClick={handleExportPdf} // Default to PDF for mobile simplicity or maintain logic
                            disabled={completedCount === 0 || isProcessing}
                            className={`p-2.5 rounded-xl border transition-all ${isExportingPdf
                                ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200"
                                : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10"
                                }`}
                        >
                            {isExportingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />}
                        </button>
                    ) : (
                        <button
                            onClick={handleDownloadZip}
                            disabled={completedCount === 0 || isProcessing}
                            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
                        >
                            <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                        </button>
                    )}
                </div>
            </div>

            {/* Safe Area Spacer */}
            <div className="h-safe-area pb-4"></div>
        </div>
    );
};
