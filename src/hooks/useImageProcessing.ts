import { useState, useRef, useEffect } from 'react';
import { ProcessedPage, QuotaInfo } from '../types';
import { processImageWithGemini } from '../services/geminiService';
import { AuthMode } from './useAuth';
import { saveToArchive } from '../db/archive';

interface UseImageProcessingProps {
    pages: ProcessedPage[];
    setPages: React.Dispatch<React.SetStateAction<ProcessedPage[]>>;
    quota: QuotaInfo | null;
    setQuota: React.Dispatch<React.SetStateAction<QuotaInfo | null>>;
    authMode: AuthMode;
    keyAuthorized: boolean;
    verifyKey: () => Promise<boolean>;
    handleSelectKey: () => Promise<void>;
}

// Helper: Convert Base64 Data URL to Blob
const dataURLtoBlob = async (dataurl: string): Promise<Blob> => {
    const res = await fetch(dataurl);
    return await res.blob();
};

export function useImageProcessing({
    pages,
    setPages,
    quota, // Added missing prop
    setQuota,
    keyAuthorized,
    verifyKey,
    handleSelectKey,
    authMode
}: UseImageProcessingProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number | null>(null);
    const [resolution, setResolution] = useState<'2K' | '4K'>('2K');
    const [resolutionLocked, setResolutionLocked] = useState(false);
    const [showCompletionBanner, setShowCompletionBanner] = useState(false);
    const [showStoppingToast, setShowStoppingToast] = useState(false);

    // New Error Toast State
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorToastMessage, setErrorToastMessage] = useState('');

    // New Insufficient Credits Modal State
    const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
    const [insufficientCreditsInfo, setInsufficientCreditsInfo] = useState<{ current: number; cost: number } | null>(null);

    // Auto-switch to 4K for Passcode Mode, BUT respect mobile constraints
    useEffect(() => {
        if (authMode === 'passcode') {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            if (!isMobile) {
                setResolution('4K');
            }
        }
    }, [authMode]);

    const abortRef = useRef(false);

    const triggerErrorToast = (msg: string) => {
        setErrorToastMessage(msg);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 4000);
    };

    const closeInsufficientCreditsModal = () => {
        setShowInsufficientCreditsModal(false);
    };

    // Internal: Core processing loop that accepts an explicit page list
    const processPagesList = async (currentPages: ProcessedPage[]) => {
        // 1. Auth Check
        if (!keyAuthorized) {
            const success = await verifyKey();
            if (!success) {
                await handleSelectKey();
                return;
            }
        }

        // 2. Pre-flight Checks (Credit System)
        if (authMode === 'passcode' && quota) {
            const cost = resolution === '4K' ? 2 : 1;
            // Use quota.remaining (which is mapped to credits in backend)
            if (quota.remaining < cost) {
                // Replaced native alert with Custom Modal logic
                setInsufficientCreditsInfo({ current: quota.remaining, cost });
                setShowInsufficientCreditsModal(true);
                return;
            }
        }

        // 3. Filter Processable Pages
        const pagesToProcess = currentPages.filter(p => p.selected && !p.processedUrl);
        if (pagesToProcess.length === 0) {
            if (currentPages.some(p => !p.selected)) {
                alert("No pages selected for processing.");
            }
            return;
        }

        // 3. Set Processing State
        setIsProcessing(true);
        setIsStopped(false);
        setIsStopping(false);
        setResolutionLocked(true);
        abortRef.current = false;

        // Create a working copy
        const newPages = [...currentPages];

        for (let i = 0; i < newPages.length; i++) {
            // Skip if already processed OR NOT SELECTED
            if (newPages[i].processedUrl || !newPages[i].selected) continue;

            // Check for Abort Signal
            if (abortRef.current) {
                setIsStopped(true);
                break;
            }

            setCurrentProcessingIndex(i);

            // Update status to processing
            newPages[i].status = 'processing';
            newPages[i].resolution = resolution;
            setPages([...newPages]); // Trigger UI update

            try {
                const result = await processImageWithGemini(
                    newPages[i].originalUrl,
                    newPages[i].width,
                    newPages[i].height,
                    newPages[i].resolution // Fix: Use the resolution stored on the page object or current state
                );

                newPages[i].processedUrl = result.image;
                newPages[i].status = 'completed';

                // --- Archive Logic ---
                try {
                    const blob = await dataURLtoBlob(result.image);

                    // Fix: Get ACTUAL dimensions of the generated image, not the original dimensions
                    // This ensures 4K images are correctly tagged in the archive
                    const getImageDimensions = (src: string): Promise<{ w: number; h: number }> => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.onload = () => resolve({ w: img.width, h: img.height });
                            img.src = src;
                        });
                    };

                    const { w: realWidth, h: realHeight } = await getImageDimensions(result.image);

                    // Use Page Index as name since we don't store filenames per page in ProcessedPage
                    await saveToArchive(blob, realWidth, realHeight, `Page ${newPages[i].pageIndex + 1}`, newPages[i].originalUrl);
                    // Trigger simple shake animation in Header
                    window.dispatchEvent(new Event('archive-saved'));
                } catch (archiveErr) {
                    console.error("Failed to archive image:", archiveErr);
                    // Silent fail for archive - don't stop processing
                }
                // ---------------------

                // Update Quota if returned (Access Code Mode)
                if (result.quota) {
                    setQuota(result.quota);
                }

            } catch (error: any) {
                console.error(`Page ${i + 1} Error:`, error);
                newPages[i].status = 'error';
                // Capture specific error message for debugging
                newPages[i].errorMessage = error?.message || 'Unknown error occurred';

                // Trigger Toast only for the first error in a batch to avoid spam
                if (!showErrorToast) {
                    triggerErrorToast('⚠️ 部分生成失败，不扣除次数 (Quota Safe)。请稍后重试。');
                }
            }

            setPages([...newPages]);
        }

        // 4. Cleanup State
        setIsProcessing(false);
        setResolutionLocked(false);
        setIsStopping(false);
        setCurrentProcessingIndex(null);

        // 5. Completion Check
        const selectedPages = newPages.filter(p => p.selected);
        const allSelectedDone = selectedPages.length > 0 && selectedPages.every(p => p.status === 'completed' || p.status === 'error');
        const hasSuccessfulPages = selectedPages.some(p => p.status === 'completed');

        // Show banner if:
        // 1. All selected pages finished (natural completion) AND at least one success
        // 2. OR Processing was manually stopped AND at least one success
        if (hasSuccessfulPages && (allSelectedDone || abortRef.current)) {
            setShowCompletionBanner(true);

            // Track successful images for global stats
            const successfulCount = selectedPages.filter(p => p.status === 'completed').length;
            if (successfulCount > 0) {
                fetch('/api/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: successfulCount })
                }).catch(() => { /* Silent fail */ });
            }
        }
    };

    // Public: Event Handler safe wrapper
    const startProcessing = async () => {
        await processPagesList(pages);
    };

    const stopProcessing = () => {
        abortRef.current = true;
        setIsStopping(true);
        setShowStoppingToast(true);
        setTimeout(() => setShowStoppingToast(false), 2000);
    };

    // Improvement #2: Retry single failed page
    const retryPage = (index: number) => {
        // Create new pages state locally
        const newPages = [...pages];
        if (newPages[index] && newPages[index].status === 'error') {
            newPages[index] = {
                ...newPages[index],
                status: 'pending', // Was error
                selected: true,
                processedUrl: undefined
            };

            // 1. Update UI
            setPages(newPages);

            // 2. Trigger processing immediately with the NEW state
            // setTimeout to ensure state update doesn't conflict
            setTimeout(() => {
                processPagesList(newPages);
            }, 0);
        }
    };

    // Improvement #3: Computed stats for CompletionBanner
    const successCount = pages.filter(p => p.status === 'completed').length;
    const failCount = pages.filter(p => p.status === 'error').length;

    return {
        isProcessing,
        isStopped,
        isStopping,
        currentProcessingIndex,
        resolution,
        setResolution,
        resolutionLocked,
        setResolutionLocked,
        showCompletionBanner,
        setShowCompletionBanner,
        showStoppingToast,
        showErrorToast,
        errorToastMessage,
        // Credits Modal Exports
        showInsufficientCreditsModal,
        insufficientCreditsInfo,
        closeInsufficientCreditsModal,
        startProcessing,
        stopProcessing,
        retryPage,
        successCount,
        failCount
    };
}
