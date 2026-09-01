'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PhotoItem {
    src: string;
    alt: string;
    position?: string;
    tag?: {
        icon: string;
        location: string;
        sub: string;
    } | null;
}

interface PhotoCarouselProps {
    baseUrl?: string;
    autoPlayInterval?: number;
    className?: string;
}

const photos: PhotoItem[] = [
    {
        src: 'some_dork.jpeg',
        alt: 'John taking in the view while multipitching in Red Rocks NV',
        position: 'object-center',
        tag: {
            icon: '🧗',
            location: 'Red Rocks, NV',
            sub: 'multipitch',
        },
    },
    {
        src: 'btwn-a-rock-and-a-hard-place.JPEG',
        alt: 'John stemming in a rock climbing chimney',
        position: 'object-[center_20%]',
        tag: null,
    },
    {
        src: 'happy-nerd.JPEG',
        alt: 'John smiling outdoors in beanie and hoodie',
        position: 'object-[center_15%]',
        tag: null,
    },
];

export function PhotoCarousel({
    baseUrl = '/jp-website',
    autoPlayInterval = 4500,
    className = '',
}: PhotoCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const getFullUrl = (path: string) => {
        const cleanBase = (baseUrl || '').replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '');
        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, []);

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-advance timer (pauses on hover)
    useEffect(() => {
        if (isHovered) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isHovered, autoPlayInterval, goToNext]);

    const currentPhoto = photos[currentIndex];

    return (
        <div
            className={`relative group select-none w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ambient Multi-Color Gradient Glow */}
            <div
                className="absolute -inset-1.5 bg-gradient-to-r from-primary/25 via-secondary/20 to-primary/25 rounded-2xl blur-xl group-hover:opacity-100 transition duration-500 opacity-65 pointer-events-none"
            />

            {/* Framed Gruvbox Glass Card Container */}
            <div className="relative card-gruvbox p-2.5 bg-[#282828]/80 backdrop-blur-md w-full rounded-2xl overflow-hidden shadow-2xl border border-gruvbox-dark2/80">
                
                {/* Fixed Aspect Ratio Photo Box (4/5) */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gruvbox-dark0_hard shadow-inner">
                    {photos.map((photo, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <img
                                key={photo.src}
                                src={getFullUrl(photo.src)}
                                alt={photo.alt}
                                decoding="async"
                                loading={index === 0 ? 'eager' : 'lazy'}
                                className={`absolute inset-0 w-full h-full object-cover ${photo.position || 'object-center'} transition-opacity duration-700 ease-in-out ${
                                    isActive
                                        ? 'opacity-100 z-10 pointer-events-auto'
                                        : 'opacity-0 z-0 pointer-events-none'
                                }`}
                                style={{
                                    imageRendering: 'auto',
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                        );
                    })}

                    {/* Navigation Buttons (Fade in on hover) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            goToPrev();
                        }}
                        aria-label="Previous photo"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#1d2021]/85 hover:bg-[#32302f] border border-gruvbox-dark2/90 text-gruvbox-light2 hover:text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-90 shadow-xl backdrop-blur-md"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            goToNext();
                        }}
                        aria-label="Next photo"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#1d2021]/85 hover:bg-[#32302f] border border-gruvbox-dark2/90 text-gruvbox-light2 hover:text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-90 shadow-xl backdrop-blur-md"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Pill Indicator Overlay */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1d2021]/80 backdrop-blur-md border border-[#3c3836]/80 shadow-md">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToIndex(i);
                                }}
                                aria-label={`Go to photo ${i + 1}`}
                                className={`transition-all duration-300 rounded-full ${
                                    i === currentIndex
                                        ? 'w-5 h-1.5 bg-primary shadow-sm'
                                        : 'w-1.5 h-1.5 bg-gruvbox-light4/60 hover:bg-gruvbox-light2'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Subtitle / Caption Bar (Strict Fixed Height to Prevent Size Shifts) */}
                <div className="h-8 px-1.5 flex items-center justify-between text-xs font-mono text-gruvbox-light3">
                    {currentPhoto.tag ? (
                        <div className="w-full flex items-center justify-between transition-opacity duration-300">
                            <span className="flex items-center gap-1.5 text-gruvbox-light2 font-medium">
                                <span className="text-gruvbox-bright_orange">
                                    {currentPhoto.tag.icon}
                                </span>
                                <span>{currentPhoto.tag.location}</span>
                            </span>
                            <span className="text-[11px] text-gruvbox-light4 tracking-wide">
                                {currentPhoto.tag.sub}
                            </span>
                        </div>
                    ) : (
                        <div className="w-full flex items-center justify-end">
                            <span className="text-[11px] font-mono text-gruvbox-light4/40 tracking-widest">
                                {currentIndex + 1} / {photos.length}
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default PhotoCarousel;
