import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const baseStyle = 'bg-surface-container-high/60 animate-pulse';

  const variants = {
    text: 'h-4 w-full rounded-sm',
    rect: 'h-full w-full rounded-md',
    circle: 'rounded-full',
  };

  return <div className={`${baseStyle} ${variants[variant]} ${className}`} />;
};
export default Skeleton;
