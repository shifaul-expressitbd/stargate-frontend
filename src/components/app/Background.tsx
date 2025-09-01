import React from 'react';
import './background.css';

export type BackgroundType = 'color' | 'image' | 'gradient';
export type BackgroundPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
export type BackgroundSize = 'cover' | 'contain' | 'auto' | '100% 100%';
export type AnimationType = 'pan' | 'pan-vertical' | 'pulse' | 'fade' | 'none';

export interface BackgroundProps {
  /** Type of background to render */
  type?: BackgroundType;
  /** Background color (hex, rgb, or named color) */
  color?: string;
  /** Image URL for background */
  imageUrl?: string;
  /** CSS gradient string */
  gradient?: string;
  /** Position for background image */
  position?: BackgroundPosition;
  /** Size for background image */
  size?: BackgroundSize;
  /** Whether to apply overlay on image backgrounds */
  overlay?: boolean;
  /** Overlay color (rgba recommended) */
  overlayColor?: string;
  /** Children content */
  children?: React.ReactNode;
  /** Optional className for styling */
  className?: string;
  /** Optional style for the wrapper */
  style?: React.CSSProperties;
  /** Animation type for the background */
  animation?: AnimationType;
  /** Duration of animation in seconds */
  animationDuration?: number;
  /** Whether animation should loop continuously */
  animationLoop?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({
  type = 'color',
  color = '#f0f0f0',
  imageUrl,
  gradient,
  position = 'center',
  size = 'cover',
  overlay = false,
  overlayColor = 'rgba(0,0,0,0.5)',
  children,
  className,
  style,
  animation = 'none',
  animationDuration = 30,
  animationLoop = true
}) => {
  // Create base wrapper styles
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '300px',
    ...style
  };

  // Generate background styles based on type
  const getBackgroundStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      ...(animation !== 'none' && {
        animationDuration: `${animationDuration}s`,
        animationIterationCount: animationLoop ? 'infinite' : 1
      })
    };

    switch (type) {
      case 'color':
        return {
          ...baseStyles,
          backgroundColor: color
        };

      case 'image':
        {
          if (!imageUrl) return { backgroundColor: color };

          const imageStyles: React.CSSProperties = {
            ...baseStyles,
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: position,
            backgroundSize: size,
            backgroundRepeat: 'no-repeat'
          };

          if (overlay) {
            return {
              ...imageStyles,
              backgroundColor: overlayColor
            };
          }
          return imageStyles;
        }

      case 'gradient':
        return {
          ...baseStyles,
          background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };

      default:
        return { backgroundColor: color };
    }
  };

  return (
    <div
      className={`background-wrapper ${className || ''}`}
      style={wrapperStyle}
    >
      <div
        className={`background-layer ${animation !== 'none' ? `animate-${animation}` : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          ...getBackgroundStyles()
        }}
      />
      <div className="content-layer" style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

Background.displayName = 'Background';