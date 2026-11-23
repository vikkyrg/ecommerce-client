import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * ScrollReveal Component
 * Smoothly reveals content when scrolled into the viewport.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'up'|'down'|'left'|'right'|'scale'|'fade'} [props.direction='up'] - Reveal animation style.
 * @param {number} [props.delay=0] - Delay in milliseconds before animation starts.
 * @param {number} [props.duration=600] - Duration in milliseconds.
 * @param {number} [props.distance=24] - Movement distance in pixels.
 * @param {number} [props.threshold=0.12] - IntersectionObserver threshold.
 * @param {boolean} [props.once=true] - Trigger only once.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {React.ElementType} [props.as='div'] - HTML element to render.
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 24,
  threshold = 0.12,
  once = true,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const [ref, isVisible] = useScrollReveal({ threshold, once });

  // Compute transform based on direction
  const getTransform = () => {
    if (isVisible) return 'none';
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'scale':
        return 'scale(0.96)';
      case 'fade':
      default:
        return 'none';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform'
  };

  return (
    <Component ref={ref} style={style} className={className} {...rest}>
      {children}
    </Component>
  );
}
