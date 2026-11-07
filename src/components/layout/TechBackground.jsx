// TechBackground.jsx — Attractive, futuristic technology-inspired gradient background
import { memo } from 'react'

export const TechBackground = memo(function TechBackground({ variant = 'default' }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ── 1. Deep Cybernetic Canvas Gradient ── */}
      <div
        className="absolute inset-0 bg-[#07090e]"
        style={{
          backgroundImage: `
            radial-gradient(100% 100% at 50% 0%, #0d1522 0%, #080c14 45%, #05070a 100%)
          `,
        }}
      />

      {/* ── 2. Laser Horizon Accent Beam (Top Edge) ── */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1ed760] to-transparent opacity-75" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[8px] bg-gradient-to-r from-transparent via-[#1ed760]/30 to-transparent blur-sm" />

      {/* ── 3. High-Tech Grid & Coordinate Matrix ── */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 30%, black 20%, rgba(0,0,0,0.4) 60%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 30%, black 20%, rgba(0,0,0,0.4) 60%, transparent 95%)',
        }}
      />

      {/* ── 4. Cyber Green Micro-Dots Layer (Academy Theme) ── */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(rgba(30, 215, 96, 0.35) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(circle 500px at 50% 25%, black 20%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(circle 500px at 50% 25%, black 20%, transparent 75%)',
        }}
      />

      {/* ── 5. Radiant Atmospheric Nebula Orbs ── */}
      {/* Primary Tech Glow — Spotify Green / Emerald Aurora */}
      <div
        className="absolute -top-[12%] left-[12%] w-[680px] h-[680px] rounded-full blur-[130px] opacity-25 animate-tech-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(30, 215, 96, 0.8) 0%, rgba(16, 185, 129, 0.4) 40%, transparent 75%)',
        }}
      />

      {/* Secondary Tech Glow — Electric Cyan / Quantum Blue */}
      <div
        className="absolute top-[18%] -right-[8%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 animate-tech-drift"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(14, 165, 233, 0.35) 45%, transparent 75%)',
        }}
      />

      {/* Tertiary Tech Glow — Cyber Indigo / Deep Violet Core */}
      <div
        className="absolute bottom-[-15%] left-[28%] w-[720px] h-[720px] rounded-full blur-[150px] opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.25) 45%, transparent 80%)',
        }}
      />

      {/* Login / Intense Variant Extra Glow */}
      {variant === 'login' && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[120px] opacity-20 animate-tech-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(30, 215, 96, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)',
          }}
        />
      )}

      {/* ── 6. Futuristic Tech Corner Coordinate Markers ── */}
      <div className="hidden lg:block absolute top-6 left-72 text-[10px] font-mono text-[#1ed760]/40 tracking-wider">
        <span>SYS.NET // 256-BIT</span>
        <span className="mx-2 text-[#4d4d4d]">•</span>
        <span>LAT: 0.12ms</span>
      </div>

      <div className="hidden lg:block absolute top-6 right-8 text-[10px] font-mono text-[#b3b3b3]/30 tracking-wider">
        <span>LOC: [SEC-01:GRID]</span>
      </div>

      {/* Subtle bottom scanline highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
})
