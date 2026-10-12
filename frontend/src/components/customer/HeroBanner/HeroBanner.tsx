import React from 'react';
import { useSupport } from '../../../context/SupportContext';
import styles from './HeroBanner.module.scss';

export const HeroBanner: React.FC = () => {
  const { user } = useSupport();

  // Extract first name for greeting
  const firstName = user.name.split(' ')[0] || 'there';

  return (
    <section className={styles.heroBanner}>
      <div className={styles.textContainer}>
        <h1 className={styles.greeting}>
          Hello {firstName} <span className={styles.wave}>👋</span>
        </h1>
        <p className={styles.subtitle}>
          Raise a support ticket, track your requests, and get help — all in one place.
        </p>
      </div>

      <div className={styles.illustrationContainer}>
        {/* Soft background aura glow */}
        <div className={styles.auraGlow} />

        {/* SVG Robot Assistant matching the design */}
        <svg
          className={styles.robotSvg}
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle soft backdrop shape */}
          <ellipse cx="110" cy="115" rx="55" ry="32" fill="#E0EDFF" opacity="0.6" />
          
          {/* Robot Neck / Collar */}
          <path
            d="M95 108 L125 108 L120 120 L100 120 Z"
            fill="#CBD5E1"
          />

          {/* Robot Torso / Shoulder Curve */}
          <path
            d="M75 128 C75 116 145 116 145 128 L145 138 C145 142 75 142 75 138 Z"
            fill="#E2E8F0"
          />

          {/* Head Base Glow Shadow */}
          <ellipse cx="110" cy="78" rx="42" ry="36" fill="#DBEAFE" />

          {/* Robot Head Body */}
          <ellipse cx="110" cy="76" rx="40" ry="34" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Dark Glass Visor */}
          <rect
            x="84"
            y="58"
            width="52"
            height="34"
            rx="17"
            fill="#0F172A"
          />

          {/* Glowing Happy Eyes in Visor */}
          {/* Left Eye Curve */}
          <path
            d="M95 76 C95 71 101 71 101 76"
            stroke="#60A5FA"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right Eye Curve */}
          <path
            d="M119 76 C119 71 125 71 125 76"
            stroke="#60A5FA"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Subtle cute smile */}
          <path
            d="M107 83 C109 85 111 85 113 83"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Headphone Band */}
          <path
            d="M68 76 C68 45 152 45 152 76"
            stroke="#2563EB"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Left Headphone Ear Cushion */}
          <rect
            x="64"
            y="62"
            width="12"
            height="28"
            rx="6"
            fill="#1D4ED8"
          />
          <rect
            x="70"
            y="66"
            width="5"
            height="20"
            rx="2.5"
            fill="#3B82F6"
          />

          {/* Right Headphone Ear Cushion */}
          <rect
            x="144"
            y="62"
            width="12"
            height="28"
            rx="6"
            fill="#1D4ED8"
          />
          <rect
            x="145"
            y="66"
            width="5"
            height="20"
            rx="2.5"
            fill="#3B82F6"
          />

          {/* Head Antenna Stem & Tip */}
          <line x1="110" y1="42" x2="110" y2="34" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="32" r="4" fill="#3B82F6" />

          {/* Floating Speech Bubble */}
          <g className={styles.speechBubble}>
            <rect
              x="140"
              y="18"
              width="44"
              height="28"
              rx="10"
              fill="#3B82F6"
            />
            {/* Bubble Tail */}
            <path
              d="M148 44 L142 51 L155 44 Z"
              fill="#3B82F6"
            />
            {/* Dots */}
            <circle cx="152" cy="32" r="2.5" fill="#FFFFFF" />
            <circle cx="162" cy="32" r="2.5" fill="#FFFFFF" />
            <circle cx="172" cy="32" r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </section>
  );
};
export default HeroBanner;
