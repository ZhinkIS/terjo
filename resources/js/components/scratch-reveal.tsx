import { useEffect, useRef, useState } from 'react';

import type {
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
    ReactNode,
    TouchEvent as ReactTouchEvent,
} from 'react';

import { cn } from '@/lib/utils';

type ScratchRevealProps = {
    children: ReactNode;
    brushSize?: number;
    revealThreshold?: number;
    coverText?: string;
    className?: string;
    canvasClassName?: string;
};

type Point = {
    x: number;
    y: number;
};

type CoverMask = {
    width: number;
    height: number;
    pixels: Uint8Array;
};

const REVEAL_FADE_DURATION = 500;
const COVER_FILL = 'rgba(26, 30, 38, 0.78)';

function getCanvasPoint(
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
): Point | null {
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
        return null;
    }

    return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
}

function getClearedRatio(
    canvas: HTMLCanvasElement,
    mask: CoverMask | null,
): number {
    const context = canvas.getContext('2d');

    if (
        !context ||
        !mask ||
        mask.width !== canvas.width ||
        mask.height !== canvas.height
    ) {
        return 0;
    }

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;

    // Sample every fourth covered pixel; checking every pixel is unnecessary.
    for (let pixel = 0; pixel < mask.pixels.length; pixel += 4) {
        if (mask.pixels[pixel] === 0) {
            continue;
        }

        sampled += 1;

        if (data[pixel * 4 + 3] === 0) {
            cleared += 1;
        }
    }

    return sampled === 0 ? 0 : cleared / sampled;
}

export default function ScratchReveal({
    children,
    brushSize = 28,
    revealThreshold = 0.5,
    coverText = 'SCRATCH TO REVEAL',
    className,
    canvasClassName,
}: ScratchRevealProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const coverMaskRef = useRef<CoverMask | null>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<Point | null>(null);
    const progressFrameRef = useRef<number | null>(null);
    const finishScratchRef = useRef<() => void>(() => {});
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const content = contentRef.current;

        if (!canvas || !content) {
            return;
        }

        const image = content.querySelector('img') ?? content;

        const drawCover = (force = false) => {
            const width = image.clientWidth;
            const height = image.clientHeight;

            if (width === 0 || height === 0) {
                return;
            }

            const sizeChanged =
                canvas.width !== width || canvas.height !== height;

            if (!sizeChanged && !force) {
                return;
            }

            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.backgroundColor = 'transparent';

            const context = canvas.getContext('2d');

            if (!context) {
                return;
            }

            const styles = window.getComputedStyle(canvas);
            const coverFill =
                styles.getPropertyValue('--scratch-cover').trim() || COVER_FILL;
            const coverInk =
                styles.getPropertyValue('--scratch-ink').trim() || '#ffffff';

            context.globalCompositeOperation = 'source-over';
            context.filter = 'none';
            context.clearRect(0, 0, width, height);

            // Draw a blurred copy of the image and tint only its visible
            // pixels. The source art has generous transparent padding, so
            // clipping the tint to the image alpha keeps the cover hugging the
            // mascot instead of a large square.
            if (
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0
            ) {
                context.save();
                context.filter = 'blur(15px)';
                context.drawImage(image, 0, 0, width, height);
                context.restore();
                context.globalCompositeOperation = 'source-atop';
                context.fillStyle = coverFill;
                context.fillRect(0, 0, width, height);
                context.globalCompositeOperation = 'source-over';
            } else {
                context.fillStyle = coverFill;
                context.fillRect(0, 0, width, height);
            }

            const coverData = context.getImageData(0, 0, width, height).data;
            const pixels = new Uint8Array(width * height);

            for (let pixel = 0; pixel < pixels.length; pixel += 1) {
                if (coverData[pixel * 4 + 3] > 0) {
                    pixels[pixel] = 1;
                }
            }

            coverMaskRef.current = { width, height, pixels };

            const fontSize = Math.min(30, Math.max(16, width * 0.055));

            context.fillStyle = coverInk;
            context.font = `600 ${fontSize}px "Instrument Sans", system-ui, sans-serif`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.shadowColor = 'rgba(0, 0, 0, 0.35)';
            context.shadowBlur = 8;
            context.shadowOffsetY = 2;
            context.fillText(coverText, width / 2, height / 2);
            context.shadowColor = 'transparent';
            context.shadowBlur = 0;
            context.shadowOffsetY = 0;
        };

        drawCover(true);

        const themeObserver = new MutationObserver(() => drawCover(true));

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        const observer = new ResizeObserver(() => drawCover());
        observer.observe(image);
        observer.observe(content);

        const handleResize = () => drawCover();
        const handleImageLoad = () => drawCover(true);

        if (image instanceof HTMLImageElement) {
            image.addEventListener('load', handleImageLoad);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            themeObserver.disconnect();
            observer.disconnect();

            if (image instanceof HTMLImageElement) {
                image.removeEventListener('load', handleImageLoad);
            }

            window.removeEventListener('resize', handleResize);
        };
    }, [coverText]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const preventTouchDefault = (event: TouchEvent) => {
            event.preventDefault();
        };

        // React attaches touch listeners at the root as passive, so a native
        // non-passive listener is required to stop mobile page scrolling.
        canvas.addEventListener('touchstart', preventTouchDefault, {
            passive: false,
        });
        canvas.addEventListener('touchmove', preventTouchDefault, {
            passive: false,
        });

        return () => {
            canvas.removeEventListener('touchstart', preventTouchDefault);
            canvas.removeEventListener('touchmove', preventTouchDefault);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (progressFrameRef.current !== null) {
                window.cancelAnimationFrame(progressFrameRef.current);
            }
        };
    }, []);

    const scratchAt = (point: Point) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) {
            return;
        }

        const previousPoint = lastPointRef.current ?? point;

        context.globalCompositeOperation = 'destination-out';
        context.fillStyle = '#000000';
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.beginPath();
        context.moveTo(previousPoint.x, previousPoint.y);
        context.lineTo(point.x, point.y);
        context.stroke();
        context.beginPath();
        context.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
        context.fill();

        lastPointRef.current = point;
    };

    const revealIfThresholdMet = () => {
        if (isRevealed) {
            return;
        }

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        if (getClearedRatio(canvas, coverMaskRef.current) >= revealThreshold) {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            setIsRevealed(true);
        }
    };

    const checkRevealProgress = () => {
        if (isRevealed || progressFrameRef.current !== null) {
            return;
        }

        // Check on the next frame instead of running getImageData for every
        // move event. This still runs during the drag if the pointer stops.
        progressFrameRef.current = window.requestAnimationFrame(() => {
            progressFrameRef.current = null;
            revealIfThresholdMet();
        });
    };

    const finishScratch = () => {
        if (!isDrawingRef.current) {
            return;
        }

        isDrawingRef.current = false;
        lastPointRef.current = null;

        if (progressFrameRef.current !== null) {
            window.cancelAnimationFrame(progressFrameRef.current);
            progressFrameRef.current = null;
        }

        revealIfThresholdMet();
    };

    useEffect(() => {
        finishScratchRef.current = finishScratch;
    });

    useEffect(() => {
        const handleWindowMouseUp = () => finishScratchRef.current();

        window.addEventListener('mouseup', handleWindowMouseUp);

        return () => window.removeEventListener('mouseup', handleWindowMouseUp);
    }, []);

    const startScratch = (point: Point) => {
        if (progressFrameRef.current !== null) {
            window.cancelAnimationFrame(progressFrameRef.current);
            progressFrameRef.current = null;
        }

        isDrawingRef.current = true;
        lastPointRef.current = point;
        scratchAt(point);
        checkRevealProgress();
    };

    const handleMouseDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
        if (isRevealed || event.button !== 0) {
            return;
        }

        const point = getCanvasPoint(
            event.clientX,
            event.clientY,
            event.currentTarget,
        );

        if (point) {
            startScratch(point);
        }
    };

    const handleMouseMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
        if (isRevealed || !isDrawingRef.current) {
            return;
        }

        const point = getCanvasPoint(
            event.clientX,
            event.clientY,
            event.currentTarget,
        );

        if (!point) {
            return;
        }

        scratchAt(point);
        checkRevealProgress();
    };

    const handleTouchStart = (event: ReactTouchEvent<HTMLCanvasElement>) => {
        if (isRevealed) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        event.currentTarget.focus({ preventScroll: true });

        const point = getCanvasPoint(
            touch.clientX,
            touch.clientY,
            event.currentTarget,
        );

        if (point) {
            startScratch(point);
        }
    };

    const handleTouchMove = (event: ReactTouchEvent<HTMLCanvasElement>) => {
        // The native non-passive touchmove listener above calls
        // preventDefault so the page does not scroll while scratching.
        if (isRevealed || !isDrawingRef.current) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const point = getCanvasPoint(
            touch.clientX,
            touch.clientY,
            event.currentTarget,
        );

        if (!point) {
            return;
        }

        scratchAt(point);
        checkRevealProgress();
    };

    const handleTouchEnd = (event: ReactTouchEvent<HTMLCanvasElement>) => {
        if (event.touches.length === 0) {
            finishScratch();
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();

        if (progressFrameRef.current !== null) {
            window.cancelAnimationFrame(progressFrameRef.current);
            progressFrameRef.current = null;
        }

        isDrawingRef.current = false;
        lastPointRef.current = null;
        setIsRevealed(true);
    };

    return (
        <div className={cn('relative inline-block h-fit w-fit', className)}>
            <div
                ref={contentRef}
                className="relative block leading-none [&>img]:block"
                inert={!isRevealed}
            >
                {children}
            </div>

            <canvas
                ref={canvasRef}
                width={1}
                height={1}
                role="button"
                tabIndex={isRevealed ? -1 : 0}
                aria-label={coverText}
                aria-hidden={isRevealed}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={finishScratch}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={finishScratch}
                onKeyDown={handleKeyDown}
                className={cn(
                    'absolute top-0 left-0 z-10 cursor-crosshair touch-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neu-accent)]',
                    'transition-opacity ease-out',
                    isRevealed && 'pointer-events-none opacity-0',
                    canvasClassName,
                )}
                style={{ transitionDuration: `${REVEAL_FADE_DURATION}ms` }}
            />
        </div>
    );
}
