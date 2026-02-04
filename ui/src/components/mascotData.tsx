/**
 * SVG mascot definitions and color palettes for agent avatars.
 *
 * Each mascot is a simple, cute SVG character rendered as a React component.
 * Colors are keyed by AgentMascot name so avatars stay visually distinct
 * when multiple agents run in parallel.
 */

import type { AgentMascot } from '../lib/types'

// ---------------------------------------------------------------------------
// Color types and palettes
// ---------------------------------------------------------------------------

export interface MascotColorPalette {
  primary: string
  secondary: string
  accent: string
}

/** Props shared by every mascot SVG component. */
export interface MascotSVGProps {
  colors: MascotColorPalette
  size: number
}

/** Fallback colors for unknown / untracked agents (neutral gray). */
export const UNKNOWN_COLORS: MascotColorPalette = {
  primary: '#6B7280',
  secondary: '#9CA3AF',
  accent: '#F3F4F6',
}

export const AVATAR_COLORS: Record<AgentMascot, MascotColorPalette> = {
  // Original 5
  Spark: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#DBEAFE' },  // Blue robot
  Fizz: { primary: '#F97316', secondary: '#FB923C', accent: '#FFEDD5' },   // Orange fox
  Octo: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#EDE9FE' },   // Purple octopus
  Hoot: { primary: '#22C55E', secondary: '#4ADE80', accent: '#DCFCE7' },   // Green owl
  Buzz: { primary: '#EAB308', secondary: '#FACC15', accent: '#FEF9C3' },   // Yellow bee
  // Tech-inspired
  Pixel: { primary: '#EC4899', secondary: '#F472B6', accent: '#FCE7F3' },  // Pink
  Byte: { primary: '#06B6D4', secondary: '#22D3EE', accent: '#CFFAFE' },   // Cyan
  Nova: { primary: '#F43F5E', secondary: '#FB7185', accent: '#FFE4E6' },   // Rose
  Chip: { primary: '#84CC16', secondary: '#A3E635', accent: '#ECFCCB' },   // Lime
  Bolt: { primary: '#FBBF24', secondary: '#FCD34D', accent: '#FEF3C7' },   // Amber
  // Energetic
  Dash: { primary: '#14B8A6', secondary: '#2DD4BF', accent: '#CCFBF1' },   // Teal
  Zap: { primary: '#A855F7', secondary: '#C084FC', accent: '#F3E8FF' },    // Violet
  Gizmo: { primary: '#64748B', secondary: '#94A3B8', accent: '#F1F5F9' },  // Slate
  Turbo: { primary: '#EF4444', secondary: '#F87171', accent: '#FEE2E2' },  // Red
  Blip: { primary: '#10B981', secondary: '#34D399', accent: '#D1FAE5' },   // Emerald
  // Playful
  Neon: { primary: '#D946EF', secondary: '#E879F9', accent: '#FAE8FF' },   // Fuchsia
  Widget: { primary: '#6366F1', secondary: '#818CF8', accent: '#E0E7FF' }, // Indigo
  Zippy: { primary: '#F59E0B', secondary: '#FBBF24', accent: '#FEF3C7' },  // Orange-yellow
  Quirk: { primary: '#0EA5E9', secondary: '#38BDF8', accent: '#E0F2FE' },  // Sky
  Flux: { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#EDE9FE' },   // Purple
}

// ---------------------------------------------------------------------------
// SVG mascot components - simple cute characters
// ---------------------------------------------------------------------------

function SparkSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Robot body */}
      <rect x="16" y="20" width="32" height="28" rx="4" fill={colors.primary} />
      {/* Robot head */}
      <rect x="12" y="8" width="40" height="24" rx="4" fill={colors.secondary} />
      {/* Antenna */}
      <circle cx="32" cy="4" r="4" fill={colors.primary} className="animate-pulse" />
      <rect x="30" y="4" width="4" height="8" fill={colors.primary} />
      {/* Eyes */}
      <circle cx="24" cy="18" r="4" fill="white" />
      <circle cx="40" cy="18" r="4" fill="white" />
      <circle cx="25" cy="18" r="2" fill={colors.primary} />
      <circle cx="41" cy="18" r="2" fill={colors.primary} />
      {/* Mouth */}
      <rect x="26" y="24" width="12" height="2" rx="1" fill="white" />
      {/* Arms */}
      <rect x="6" y="24" width="8" height="4" rx="2" fill={colors.primary} />
      <rect x="50" y="24" width="8" height="4" rx="2" fill={colors.primary} />
    </svg>
  )
}

function FizzSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Ears */}
      <polygon points="12,12 20,28 4,28" fill={colors.primary} />
      <polygon points="52,12 60,28 44,28" fill={colors.primary} />
      <polygon points="14,14 18,26 8,26" fill={colors.accent} />
      <polygon points="50,14 56,26 44,26" fill={colors.accent} />
      {/* Head */}
      <ellipse cx="32" cy="36" rx="24" ry="22" fill={colors.primary} />
      {/* Face */}
      <ellipse cx="32" cy="40" rx="18" ry="14" fill={colors.accent} />
      {/* Eyes */}
      <ellipse cx="24" cy="32" rx="4" ry="5" fill="white" />
      <ellipse cx="40" cy="32" rx="4" ry="5" fill="white" />
      <circle cx="25" cy="33" r="2" fill="#1a1a1a" />
      <circle cx="41" cy="33" r="2" fill="#1a1a1a" />
      {/* Nose */}
      <ellipse cx="32" cy="42" rx="4" ry="3" fill={colors.primary} />
      {/* Whiskers */}
      <line x1="8" y1="38" x2="18" y2="40" stroke={colors.primary} strokeWidth="2" />
      <line x1="8" y1="44" x2="18" y2="44" stroke={colors.primary} strokeWidth="2" />
      <line x1="46" y1="40" x2="56" y2="38" stroke={colors.primary} strokeWidth="2" />
      <line x1="46" y1="44" x2="56" y2="44" stroke={colors.primary} strokeWidth="2" />
    </svg>
  )
}

function OctoSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Tentacles */}
      <path d="M12,48 Q8,56 12,60 Q16,64 20,58" fill={colors.secondary} />
      <path d="M22,50 Q20,58 24,62" fill={colors.secondary} />
      <path d="M32,52 Q32,60 36,62" fill={colors.secondary} />
      <path d="M42,50 Q44,58 40,62" fill={colors.secondary} />
      <path d="M52,48 Q56,56 52,60 Q48,64 44,58" fill={colors.secondary} />
      {/* Head */}
      <ellipse cx="32" cy="32" rx="22" ry="24" fill={colors.primary} />
      {/* Eyes */}
      <ellipse cx="24" cy="28" rx="6" ry="8" fill="white" />
      <ellipse cx="40" cy="28" rx="6" ry="8" fill="white" />
      <ellipse cx="25" cy="30" rx="3" ry="4" fill={colors.primary} />
      <ellipse cx="41" cy="30" rx="3" ry="4" fill={colors.primary} />
      {/* Smile */}
      <path d="M24,42 Q32,48 40,42" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function HootSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Ear tufts */}
      <polygon points="14,8 22,24 6,20" fill={colors.primary} />
      <polygon points="50,8 58,20 42,24" fill={colors.primary} />
      {/* Body */}
      <ellipse cx="32" cy="40" rx="20" ry="18" fill={colors.primary} />
      {/* Head */}
      <circle cx="32" cy="28" r="20" fill={colors.secondary} />
      {/* Eye circles */}
      <circle cx="24" cy="26" r="10" fill={colors.accent} />
      <circle cx="40" cy="26" r="10" fill={colors.accent} />
      {/* Eyes */}
      <circle cx="24" cy="26" r="6" fill="white" />
      <circle cx="40" cy="26" r="6" fill="white" />
      <circle cx="25" cy="27" r="3" fill="#1a1a1a" />
      <circle cx="41" cy="27" r="3" fill="#1a1a1a" />
      {/* Beak */}
      <polygon points="32,32 28,40 36,40" fill="#F97316" />
      {/* Belly */}
      <ellipse cx="32" cy="46" rx="10" ry="8" fill={colors.accent} />
    </svg>
  )
}

function BuzzSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Wings */}
      <ellipse cx="14" cy="32" rx="10" ry="14" fill={colors.accent} opacity="0.8" className="animate-pulse" />
      <ellipse cx="50" cy="32" rx="10" ry="14" fill={colors.accent} opacity="0.8" className="animate-pulse" />
      {/* Body stripes */}
      <ellipse cx="32" cy="36" rx="14" ry="20" fill={colors.primary} />
      <ellipse cx="32" cy="30" rx="12" ry="6" fill="#1a1a1a" />
      <ellipse cx="32" cy="44" rx="12" ry="6" fill="#1a1a1a" />
      {/* Head */}
      <circle cx="32" cy="16" r="12" fill={colors.primary} />
      {/* Antennae */}
      <line x1="26" y1="8" x2="22" y2="2" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="38" y1="8" x2="42" y2="2" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="22" cy="2" r="2" fill="#1a1a1a" />
      <circle cx="42" cy="2" r="2" fill="#1a1a1a" />
      {/* Eyes */}
      <circle cx="28" cy="14" r="4" fill="white" />
      <circle cx="36" cy="14" r="4" fill="white" />
      <circle cx="29" cy="15" r="2" fill="#1a1a1a" />
      <circle cx="37" cy="15" r="2" fill="#1a1a1a" />
      {/* Smile */}
      <path d="M28,20 Q32,24 36,20" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function PixelSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Blocky body */}
      <rect x="20" y="28" width="24" height="28" fill={colors.primary} />
      <rect x="16" y="32" width="8" height="20" fill={colors.secondary} />
      <rect x="40" y="32" width="8" height="20" fill={colors.secondary} />
      {/* Head */}
      <rect x="16" y="8" width="32" height="24" fill={colors.primary} />
      {/* Eyes */}
      <rect x="20" y="14" width="8" height="8" fill="white" />
      <rect x="36" y="14" width="8" height="8" fill="white" />
      <rect x="24" y="16" width="4" height="4" fill="#1a1a1a" />
      <rect x="38" y="16" width="4" height="4" fill="#1a1a1a" />
      {/* Mouth */}
      <rect x="26" y="26" width="12" height="4" fill={colors.accent} />
    </svg>
  )
}

function ByteSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 3D cube body */}
      <polygon points="32,8 56,20 56,44 32,56 8,44 8,20" fill={colors.primary} />
      <polygon points="32,8 56,20 32,32 8,20" fill={colors.secondary} />
      <polygon points="32,32 56,20 56,44 32,56" fill={colors.accent} opacity="0.6" />
      {/* Face */}
      <circle cx="24" cy="28" r="4" fill="white" />
      <circle cx="40" cy="28" r="4" fill="white" />
      <circle cx="25" cy="29" r="2" fill="#1a1a1a" />
      <circle cx="41" cy="29" r="2" fill="#1a1a1a" />
      <path d="M26,38 Q32,42 38,38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function NovaSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Star points */}
      <polygon points="32,2 38,22 58,22 42,36 48,56 32,44 16,56 22,36 6,22 26,22" fill={colors.primary} />
      <circle cx="32" cy="32" r="14" fill={colors.secondary} />
      {/* Face */}
      <circle cx="27" cy="30" r="3" fill="white" />
      <circle cx="37" cy="30" r="3" fill="white" />
      <circle cx="28" cy="31" r="1.5" fill="#1a1a1a" />
      <circle cx="38" cy="31" r="1.5" fill="#1a1a1a" />
      <path d="M28,37 Q32,40 36,37" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function ChipSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Chip body */}
      <rect x="16" y="16" width="32" height="32" rx="4" fill={colors.primary} />
      {/* Pins */}
      <rect x="20" y="10" width="4" height="8" fill={colors.secondary} />
      <rect x="30" y="10" width="4" height="8" fill={colors.secondary} />
      <rect x="40" y="10" width="4" height="8" fill={colors.secondary} />
      <rect x="20" y="46" width="4" height="8" fill={colors.secondary} />
      <rect x="30" y="46" width="4" height="8" fill={colors.secondary} />
      <rect x="40" y="46" width="4" height="8" fill={colors.secondary} />
      {/* Face */}
      <circle cx="26" cy="28" r="4" fill={colors.accent} />
      <circle cx="38" cy="28" r="4" fill={colors.accent} />
      <circle cx="26" cy="28" r="2" fill="#1a1a1a" />
      <circle cx="38" cy="28" r="2" fill="#1a1a1a" />
      <rect x="26" y="38" width="12" height="3" rx="1" fill={colors.accent} />
    </svg>
  )
}

function BoltSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Lightning bolt body */}
      <polygon points="36,4 20,28 30,28 24,60 48,32 36,32 44,4" fill={colors.primary} />
      <polygon points="34,8 24,26 32,26 28,52 42,34 34,34 40,8" fill={colors.secondary} />
      {/* Face */}
      <circle cx="30" cy="30" r="3" fill="white" />
      <circle cx="38" cy="26" r="3" fill="white" />
      <circle cx="31" cy="31" r="1.5" fill="#1a1a1a" />
      <circle cx="39" cy="27" r="1.5" fill="#1a1a1a" />
    </svg>
  )
}

function DashSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Speed lines */}
      <rect x="4" y="28" width="12" height="3" rx="1" fill={colors.accent} opacity="0.6" />
      <rect x="8" y="34" width="10" height="3" rx="1" fill={colors.accent} opacity="0.4" />
      {/* Aerodynamic body */}
      <ellipse cx="36" cy="32" rx="20" ry="16" fill={colors.primary} />
      <ellipse cx="40" cy="32" rx="14" ry="12" fill={colors.secondary} />
      {/* Face */}
      <circle cx="38" cy="28" r="4" fill="white" />
      <circle cx="48" cy="28" r="4" fill="white" />
      <circle cx="39" cy="29" r="2" fill="#1a1a1a" />
      <circle cx="49" cy="29" r="2" fill="#1a1a1a" />
      <path d="M40,36 Q44,39 48,36" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function ZapSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Electric sparks */}
      <path d="M12,32 L20,28 L16,32 L22,30" stroke={colors.secondary} strokeWidth="2" className="animate-pulse" />
      <path d="M52,32 L44,28 L48,32 L42,30" stroke={colors.secondary} strokeWidth="2" className="animate-pulse" />
      {/* Orb */}
      <circle cx="32" cy="32" r="18" fill={colors.primary} />
      <circle cx="32" cy="32" r="14" fill={colors.secondary} />
      {/* Face */}
      <circle cx="26" cy="30" r="4" fill="white" />
      <circle cx="38" cy="30" r="4" fill="white" />
      <circle cx="27" cy="31" r="2" fill={colors.primary} />
      <circle cx="39" cy="31" r="2" fill={colors.primary} />
      <path d="M28,40 Q32,44 36,40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function GizmoSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Gear teeth */}
      <rect x="28" y="4" width="8" height="8" fill={colors.primary} />
      <rect x="28" y="52" width="8" height="8" fill={colors.primary} />
      <rect x="4" y="28" width="8" height="8" fill={colors.primary} />
      <rect x="52" y="28" width="8" height="8" fill={colors.primary} />
      {/* Gear body */}
      <circle cx="32" cy="32" r="20" fill={colors.primary} />
      <circle cx="32" cy="32" r="14" fill={colors.secondary} />
      {/* Face */}
      <circle cx="26" cy="30" r="4" fill="white" />
      <circle cx="38" cy="30" r="4" fill="white" />
      <circle cx="27" cy="31" r="2" fill="#1a1a1a" />
      <circle cx="39" cy="31" r="2" fill="#1a1a1a" />
      <path d="M28,40 Q32,43 36,40" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function TurboSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Flames */}
      <ellipse cx="32" cy="58" rx="8" ry="6" fill="#FBBF24" className="animate-pulse" />
      <ellipse cx="32" cy="56" rx="5" ry="4" fill="#FCD34D" />
      {/* Rocket body */}
      <ellipse cx="32" cy="32" rx="14" ry="24" fill={colors.primary} />
      {/* Nose cone */}
      <ellipse cx="32" cy="12" rx="8" ry="10" fill={colors.secondary} />
      {/* Fins */}
      <polygon points="18,44 10,56 18,52" fill={colors.secondary} />
      <polygon points="46,44 54,56 46,52" fill={colors.secondary} />
      {/* Window/Face */}
      <circle cx="32" cy="28" r="8" fill={colors.accent} />
      <circle cx="29" cy="27" r="2" fill="#1a1a1a" />
      <circle cx="35" cy="27" r="2" fill="#1a1a1a" />
      <path d="M29,32 Q32,34 35,32" stroke="#1a1a1a" strokeWidth="1" fill="none" />
    </svg>
  )
}

function BlipSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Radar rings */}
      <circle cx="32" cy="32" r="28" stroke={colors.accent} strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="32" cy="32" r="22" stroke={colors.accent} strokeWidth="2" fill="none" opacity="0.5" />
      {/* Main dot */}
      <circle cx="32" cy="32" r="14" fill={colors.primary} />
      <circle cx="32" cy="32" r="10" fill={colors.secondary} />
      {/* Face */}
      <circle cx="28" cy="30" r="3" fill="white" />
      <circle cx="36" cy="30" r="3" fill="white" />
      <circle cx="29" cy="31" r="1.5" fill="#1a1a1a" />
      <circle cx="37" cy="31" r="1.5" fill="#1a1a1a" />
      <path d="M29,37 Q32,40 35,37" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function NeonSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Glow effect */}
      <circle cx="32" cy="32" r="26" fill={colors.accent} opacity="0.3" />
      <circle cx="32" cy="32" r="22" fill={colors.accent} opacity="0.5" />
      {/* Body */}
      <circle cx="32" cy="32" r="18" fill={colors.primary} />
      {/* Inner glow */}
      <circle cx="32" cy="32" r="12" fill={colors.secondary} />
      {/* Face */}
      <circle cx="27" cy="30" r="4" fill="white" />
      <circle cx="37" cy="30" r="4" fill="white" />
      <circle cx="28" cy="31" r="2" fill={colors.primary} />
      <circle cx="38" cy="31" r="2" fill={colors.primary} />
      <path d="M28,38 Q32,42 36,38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function WidgetSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Window frame */}
      <rect x="8" y="12" width="48" height="40" rx="4" fill={colors.primary} />
      {/* Title bar */}
      <rect x="8" y="12" width="48" height="10" rx="4" fill={colors.secondary} />
      <circle cx="16" cy="17" r="2" fill="#EF4444" />
      <circle cx="24" cy="17" r="2" fill="#FBBF24" />
      <circle cx="32" cy="17" r="2" fill="#22C55E" />
      {/* Content area / Face */}
      <rect x="12" y="26" width="40" height="22" rx="2" fill={colors.accent} />
      <circle cx="24" cy="34" r="4" fill="white" />
      <circle cx="40" cy="34" r="4" fill="white" />
      <circle cx="25" cy="35" r="2" fill={colors.primary} />
      <circle cx="41" cy="35" r="2" fill={colors.primary} />
      <rect x="28" y="42" width="8" height="3" rx="1" fill={colors.primary} />
    </svg>
  )
}

function ZippySVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Ears */}
      <ellipse cx="22" cy="14" rx="6" ry="14" fill={colors.primary} />
      <ellipse cx="42" cy="14" rx="6" ry="14" fill={colors.primary} />
      <ellipse cx="22" cy="14" rx="3" ry="10" fill={colors.accent} />
      <ellipse cx="42" cy="14" rx="3" ry="10" fill={colors.accent} />
      {/* Head */}
      <circle cx="32" cy="38" r="20" fill={colors.primary} />
      {/* Face */}
      <circle cx="24" cy="34" r="5" fill="white" />
      <circle cx="40" cy="34" r="5" fill="white" />
      <circle cx="25" cy="35" r="2.5" fill="#1a1a1a" />
      <circle cx="41" cy="35" r="2.5" fill="#1a1a1a" />
      {/* Nose and mouth */}
      <ellipse cx="32" cy="44" rx="3" ry="2" fill={colors.secondary} />
      <path d="M32,46 L32,50 M28,52 Q32,56 36,52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function QuirkSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Question mark body */}
      <path d="M24,20 Q24,8 32,8 Q44,8 44,20 Q44,28 32,32 L32,40"
            stroke={colors.primary} strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="52" r="6" fill={colors.primary} />
      {/* Face on the dot */}
      <circle cx="29" cy="51" r="1.5" fill="white" />
      <circle cx="35" cy="51" r="1.5" fill="white" />
      <circle cx="29" cy="51" r="0.75" fill="#1a1a1a" />
      <circle cx="35" cy="51" r="0.75" fill="#1a1a1a" />
      {/* Decorative swirl */}
      <circle cx="32" cy="20" r="4" fill={colors.secondary} />
    </svg>
  )
}

function FluxSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Wave body */}
      <path d="M8,32 Q16,16 32,32 Q48,48 56,32" stroke={colors.primary} strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M8,32 Q16,16 32,32 Q48,48 56,32" stroke={colors.secondary} strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Face */}
      <circle cx="28" cy="28" r="4" fill="white" />
      <circle cx="40" cy="36" r="4" fill="white" />
      <circle cx="29" cy="29" r="2" fill="#1a1a1a" />
      <circle cx="41" cy="37" r="2" fill="#1a1a1a" />
      {/* Sparkles */}
      <circle cx="16" cy="24" r="2" fill={colors.accent} className="animate-pulse" />
      <circle cx="48" cy="40" r="2" fill={colors.accent} className="animate-pulse" />
    </svg>
  )
}

/** Fallback icon for unknown / untracked agents. */
function UnknownSVG({ colors, size }: MascotSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle background */}
      <circle cx="32" cy="32" r="28" fill={colors.primary} />
      <circle cx="32" cy="32" r="24" fill={colors.secondary} />
      {/* Question mark */}
      <text x="32" y="44" textAnchor="middle" fontSize="32" fontWeight="bold" fill="white">?</text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Mascot component lookup
// ---------------------------------------------------------------------------

/** Maps each mascot name to its SVG component. */
export const MASCOT_SVGS: Record<AgentMascot, React.FC<MascotSVGProps>> = {
  // Original 5
  Spark: SparkSVG,
  Fizz: FizzSVG,
  Octo: OctoSVG,
  Hoot: HootSVG,
  Buzz: BuzzSVG,
  // Tech-inspired
  Pixel: PixelSVG,
  Byte: ByteSVG,
  Nova: NovaSVG,
  Chip: ChipSVG,
  Bolt: BoltSVG,
  // Energetic
  Dash: DashSVG,
  Zap: ZapSVG,
  Gizmo: GizmoSVG,
  Turbo: TurboSVG,
  Blip: BlipSVG,
  // Playful
  Neon: NeonSVG,
  Widget: WidgetSVG,
  Zippy: ZippySVG,
  Quirk: QuirkSVG,
  Flux: FluxSVG,
}

/** The SVG component for unknown agents. Exported separately because
 *  it is not part of the AgentMascot union type. */
export const UnknownMascotSVG: React.FC<MascotSVGProps> = UnknownSVG
