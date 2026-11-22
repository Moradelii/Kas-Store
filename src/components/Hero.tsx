import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Play, Pause } from 'lucide-react';
import { StoreContent } from '../types/index.ts';
const heroVideo = '/assets/video/video_hero.mp4';

interface HeroProps {
  content: StoreContent;
  onExploreCollection: () => void;
  onViewProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onExploreCollection,
  onViewProducts
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property configuration required for cross-browser autoplay compliance
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const startPlayback = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Hero video autoplay deferred by browser policy:', err);
        setIsPlaying(false);
      }
    };

    startPlayback();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="hero" className="relative bg-[#111111] text-[#F9F8F5] overflow-hidden">
      {/* Background Media Container (Cinematic Video Hero) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          src={heroVideo}
          className="w-full h-full object-cover object-center lg:object-[center_35%] opacity-75 filter brightness-95 transition-transform duration-1000 scale-100"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Editorial Gradients for Legibility and Elegance */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />
      </div>

      {/* Discreet Video Status & Play/Pause Trigger */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-[#111111]/75 backdrop-blur-md border border-[#E6D5B8]/30 px-3 py-1.5 text-[#E6D5B8] text-xs shadow-lg">
        <button
          onClick={togglePlay}
          className="hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
          title={isPlaying ? 'Pausar video' : 'Reproducir video'}
          aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[10px] tracking-widest uppercase font-semibold">
            {isPlaying ? 'Video Hero' : 'Pausado'}
          </span>
        </button>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44 flex flex-col justify-center min-h-[85vh]">
        <div className="max-w-2xl space-y-6">
          {/* Editorial Tagline */}
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#E6D5B8]" />
            <p className="text-[#E6D5B8] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
              {content.hero.tagline || "MODERN MEN'S FASHION — PREMIUM ESSENTIALS"}
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F9F8F5] leading-[1.1] font-heading text-balance">
            {content.hero.title || 'EL ESTILO ESTÁ EN LOS DETALLES.'}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#F2EBDD]/90 font-light leading-relaxed max-w-xl">
            {content.hero.subtitle ||
              'Descubre nuestra selección de jeans y camisetas premium. Diseñados para hombres que valoran la calidad, el estilo y la autenticidad.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onExploreCollection}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F9F8F5] text-[#111111] hover:bg-[#E6D5B8] text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg group"
            >
              <span>{content.hero.primaryBtnText || 'EXPLORAR COLECCIÓN'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onViewProducts}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-[#E6D5B8] text-[#E6D5B8] hover:bg-[#E6D5B8]/15 text-xs font-bold tracking-widest uppercase transition-all duration-300"
            >
              <span>{content.hero.secondaryBtnText || 'VER PRODUCTOS'}</span>
            </button>
          </div>

          {/* Brand Promise Footer */}
          <div className="pt-8 flex items-center gap-6 text-xs text-[#E6D5B8]/80 font-medium tracking-wider">
            <span>Denim Selvedge</span>
            <span>·</span>
            <span>Algodón 260 GSM</span>
            <span>·</span>
            <span>Honduras</span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 text-[#E6D5B8]/60 text-[10px] tracking-widest uppercase">
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};
