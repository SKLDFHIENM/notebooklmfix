import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight, MoveHorizontal } from 'lucide-react';

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    aspectRatio?: 'video' | 'square' | 'auto'; // 'video' = 16:9, 'square' = 1:1
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
    beforeImage,
    afterImage,
    beforeLabel = 'Original',
    afterLabel = 'Restored',
    aspectRatio = 'auto' // Default to auto
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(position);
    }, []);

    const onMouseDown = useCallback(() => setIsDragging(true), []);
    const onTouchStart = useCallback(() => setIsDragging(true), []);

    useEffect(() => {
        const onMouseUp = () => setIsDragging(false);
        const onTouchEnd = () => setIsDragging(false);

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e.clientX);
        };
        const onTouchMove = (e: TouchEvent) => {
            if (isDragging) handleMove(e.touches[0].clientX);
        };

        if (isDragging) {
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchend', onTouchEnd);
            window.addEventListener('touchmove', onTouchMove);
        }

        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, [isDragging, handleMove]);

    // Handle hover movement (optional, if desired behavior is hover instead of drag)
    // For now, implementing drag for better mobile/UX reliability. 
    // If hover is preferred, we can add onMouseMove to container.

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-2xl cursor-col-resize select-none border border-zinc-200 dark:border-white/10 shadow-2xl bg-zinc-900 group`}
            style={{
                aspectRatio: aspectRatio === 'video' ? '16/9' : aspectRatio === 'square' ? '1/1' : '4/3' // Default 4:3 for docs
            }}
            onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
            }}
        >
            {/* Background (After Image - Full Visibility) */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />
                <div className="absolute top-4 rights-4 z-10 bg-indigo-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded right-4 shadow-lg">
                    {afterLabel}
                </div>
            </div>

            {/* Foreground (Before Image - Clipped) */}
            <div
                className="absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-white/90 text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-20 cursor-col-resize flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 -ml-[14px] rounded-full bg-white shadow-xl flex items-center justify-center text-zinc-600 ring-4 ring-black/10">
                    <ArrowLeftRight className="w-4 h-4" />
                </div>
            </div>

            {/* Hover Hint Overlay (disappears on interaction) */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                <div className="bg-black/40 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 animate-pulse border border-white/10">
                    <MoveHorizontal className="w-4 h-4" />
                    Drag or Click to Compare
                </div>
            </div>
        </div>
    );
};
