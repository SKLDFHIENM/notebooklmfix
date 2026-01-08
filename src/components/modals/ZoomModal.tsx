import React from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ZoomModalProps {
    zoomedImage: string | null;
    onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ zoomedImage, onClose }) => {
    if (!zoomedImage) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-300" onClick={onClose}>
            {/* Controls are inside TransformWrapper context if we want to use hooks, but for simplicity we just render wrapper */}

            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-zinc-800 text-white/70 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all z-[101] group shadow-xl"
            >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div
                className="w-full h-full flex items-center justify-center p-4 md:p-0"
                onClick={(e) => e.stopPropagation()}
            >
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit={true}
                    limitToBounds={false}
                    smooth={true}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <React.Fragment>
                            {/* Zoom Tools (Mobile/Desktop friendly) */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-[102] touch-none">
                                <button onClick={() => zoomOut()} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <button onClick={() => resetTransform()} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button onClick={() => zoomIn()} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                            </div>

                            <TransformComponent
                                wrapperClass="!w-full !h-full flex items-center justify-center"
                                contentClass="!w-full !h-full flex items-center justify-center"
                            >
                                <img
                                    src={zoomedImage}
                                    alt="Zoomed"
                                    className="max-w-full max-h-[85vh] object-contain shadow-2xl cursor-grab active:cursor-grabbing"
                                />
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
};
