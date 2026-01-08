import React, { useState, useRef, useCallback } from 'react';

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
    const containerRef = useRef<HTMLDivElement>(null);

    // Interaction Handlers
    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(position);
    }, []);

    // Mouse: Hover to move (no click needed)
    const onMouseMove = useCallback((e: React.MouseEvent) => {
        handleMove(e.clientX);
    }, [handleMove]);

    // Touch: Drag to move
    const onTouchMove = useCallback((e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-2xl cursor-crosshair select-none border border-zinc-200 dark:border-white/10 shadow-2xl bg-zinc-900 group touch-none`}
            style={{
                aspectRatio: aspectRatio === 'video' ? '16/9' : aspectRatio === 'square' ? '1/1' : '4/3'
            }}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onTouchStart={onTouchMove} // Jump to position on touch start
        >
            {/* Background (After Image - Pro Restored) */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 z-10 bg-indigo-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg tracking-wider opacity-80">
                    {afterLabel}
                </div>
            </div>

            {/* Foreground (Before Image - Original) */}
            <div
                className="absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover pointer-events-none brightness-[0.85] saturate-[0.8]"
                    draggable={false}
                    loading="lazy"
                />
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-white/90 text-[10px] font-bold px-2 py-1 rounded border border-white/10 tracking-wider opacity-80">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider Divider (The "Restrained" Line) */}
            <div
                className="absolute top-0 bottom-0 w-[2px] bg-white/90 z-20 pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.5)] backdrop-blur-[1px]"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Subtle Glow Effect along the line */}
                <div className="absolute inset-y-0 -left-px w-[4px] bg-white/30 blur-[2px]"></div>

                {/* Optional: Very subtle middle indicator, hidden by default, shown on hover/move if needed. 
                    Kept extremely minimal as requested "restrained". */}
            </div>
        </div>
    );
};
