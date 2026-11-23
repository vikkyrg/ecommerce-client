import React, { Children, cloneElement, isValidElement } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * StaggerContainer Component
 * Progressively reveals child elements with a staggered delay when entering the viewport.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.staggerDelay=70] - Delay increment between each item in ms.
 * @param {number} [props.baseDelay=0] - Initial delay in ms before first item starts.
 * @param {number} [props.duration=550] - Animation duration per item in ms.
 * @param {number} [props.distance=20] - Slide-up distance in pixels.
 * @param {'up'|'fade'|'scale'} [props.direction='up'] - Reveal style.
 * @param {number} [props.threshold=0.1] - Viewport threshold.
 * @param {string} [props.className='']
 * @param {React.ElementType} [props.as='div']
 */
export default function StaggerContainer({
  children,
  staggerDelay = 70,
  baseDelay = 0,
  duration = 550,
  distance = 20,
  direction = 'up',
  threshold = 0.1,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  const [ref, isVisible] = useScrollReveal({ threshold, once: true });

  const getTransform = () => {
    if (isVisible) return 'none';
    if (direction === 'scale') return 'scale(0.95)';
    if (direction === 'up') return `translateY(${distance}px)`;
    return 'none';
  };

  return (
    <Component ref={ref} className={className} {...rest}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const itemDelay = baseDelay + index * staggerDelay;
        const itemStyle = {
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          transitionProperty: 'opacity, transform',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: `${itemDelay}ms`,
          willChange: 'opacity, transform'
        };

        return (
          <div style={itemStyle} className="h-full">
            {child}
          </div>
        );
      })}
    </Component>
  );
}
