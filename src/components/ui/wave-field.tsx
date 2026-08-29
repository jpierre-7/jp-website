'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WaveFieldProps {
    headline?: string;
    className?: string;
    variant?: 'card' | 'background';
    opacity?: number;
}

export function WaveField({
    headline = "HARMONIC",
    className = "",
    variant = "card",
    opacity = 1,
}: WaveFieldProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRunning, setIsRunning] = useState(true);

    const pointerRef = useRef({ x: -2000, y: -2000, targetX: -2000, targetY: -2000 });
    const isRunningRef = useRef(isRunning);
    isRunningRef.current = isRunning;

    const isBackground = variant === 'background';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animId = 0;
        let time = 0;

        const updateSize = () => {
            const width = isBackground ? window.innerWidth : (containerRef.current?.clientWidth || 400);
            const height = isBackground ? window.innerHeight : (containerRef.current?.clientHeight || 400);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        updateSize();

        let resizeObserver: ResizeObserver | null = null;
        if (!isBackground && containerRef.current) {
            resizeObserver = new ResizeObserver(() => updateSize());
            resizeObserver.observe(containerRef.current);
        } else {
            window.addEventListener('resize', updateSize);
        }

        // Global mouse listeners for background mode
        const handleWindowMouseMove = (e: MouseEvent) => {
            pointerRef.current.targetX = e.clientX;
            pointerRef.current.targetY = e.clientY;
        };

        const handleWindowMouseLeave = () => {
            pointerRef.current.targetX = -2000;
            pointerRef.current.targetY = -2000;
        };

        if (isBackground) {
            window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
            document.addEventListener('mouseleave', handleWindowMouseLeave);
        }

        const render = () => {
            if (isRunningRef.current) {
                time += 0.014;
            }

            const width = isBackground ? window.innerWidth : (containerRef.current?.clientWidth || 400);
            const height = isBackground ? window.innerHeight : (containerRef.current?.clientHeight || 400);
            const pointer = pointerRef.current;

            pointer.x += (pointer.targetX - pointer.x) * 0.1;
            pointer.y += (pointer.targetY - pointer.y) * 0.1;

            ctx.clearRect(0, 0, width, height);

            const lines = isBackground ? 36 : 32;
            const stepY = height / (lines + 1);

            for (let i = 0; i < lines; i++) {
                const yBase = stepY * (i + 1);
                ctx.beginPath();
                const points = isBackground ? 120 : 100;
                const stepX = width / points;

                for (let p = 0; p <= points; p++) {
                    const x = p * stepX;
                    const dx = x - pointer.x;
                    const dy = yBase - pointer.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = isBackground ? 350 : 250;
                    const influence = dist < maxDist ? (1 - dist / maxDist) * (isBackground ? 50 : 35) : 0;

                    const wave = Math.sin(p * 0.07 + time + i * 0.16) * (isBackground ? 22 : 18) + Math.cos(p * 0.035 - time * 0.7) * (isBackground ? 15 : 12);
                    const y = yBase + wave - influence;

                    if (p === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                // Dynamic golden Gruvbox palette with gradient-like alpha visibility
                const alpha = (0.12 + (i / lines) * 0.38) * opacity;
                ctx.strokeStyle = `rgba(250, 189, 47, ${alpha})`;
                ctx.lineWidth = isBackground ? 1.3 : 1.2;
                ctx.stroke();
            }

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
            if (resizeObserver) resizeObserver.disconnect();
            if (isBackground) {
                window.removeEventListener('resize', updateSize);
                window.removeEventListener('mousemove', handleWindowMouseMove);
                document.removeEventListener('mouseleave', handleWindowMouseLeave);
            }
        };
    }, [isBackground, opacity]);

    if (isBackground) {
        return (
            <div
                ref={containerRef}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-0 pointer-events-none overflow-hidden",
                    className
                )}
            >
                <canvas
                    ref={canvasRef}
                    className="block h-full w-full"
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    pointerRef.current.targetX = e.clientX - rect.left;
                    pointerRef.current.targetY = e.clientY - rect.top;
                }
            }}
            onMouseLeave={() => {
                pointerRef.current.targetX = -2000;
                pointerRef.current.targetY = -2000;
            }}
            className={cn("relative flex h-[380px] w-full select-none flex-col justify-between overflow-hidden rounded-2xl border border-gruvbox-dark2/60 bg-gruvbox-dark0_hard shadow-2xl", className)}
        >
            <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full cursor-crosshair" />
            <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 md:p-8">
                <header className="flex w-full items-center justify-between font-mono text-xs text-gruvbox-light3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[11px] font-mono tracking-wider uppercase text-gruvbox-light4">// Interactive Canvas</span>
                    </div>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="flex items-center gap-1.5 rounded-lg border border-gruvbox-dark2 bg-gruvbox-dark1/80 px-2.5 py-1.5 backdrop-blur-md transition-all hover:bg-gruvbox-dark2 text-gruvbox-light2 hover:text-primary active:scale-[0.98]"
                    >
                        {isRunning ? <Pause className="size-3 text-primary" /> : <Play className="size-3 text-primary" />}
                        <span className="text-xs font-mono">{isRunning ? "FREEZE" : "RUN"}</span>
                    </button>
                </header>
                <main className="pointer-events-none flex flex-col items-center justify-center text-center text-gruvbox-light0 mix-blend-difference">
                    <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase">{headline}</h2>
                    <p className="text-xs font-mono text-gruvbox-light3 mt-1 tracking-wider opacity-80">HOVER / MOVE CURSOR TO DISTORT WAVEFORM</p>
                </main>
                <div />
            </div>
        </div>
    );
}

export default WaveField;
