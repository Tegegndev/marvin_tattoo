import React from 'react';
import { Icon, IconProps } from '@iconify/react';

export interface Icons8Props extends Omit<IconProps, 'icon'> {
  name: string;
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Icons8 icon component powered by Icons8 Line Awesome and Iconify.
 * - Defaults to 'la:' (Icons8 Line Awesome) if no prefix is supplied.
 * - Supports brand icons like 'simple-icons:tiktok', 'simple-icons:instagram', etc.
 * - Zero bloat: icons are loaded on-demand and cached in memory.
 */
export const Icons8: React.FC<Icons8Props> = ({
  name,
  size = 20,
  className = '',
  color,
  ...props
}) => {
  const iconName = name.includes(':') ? name : `la:${name}`;
  return (
    <Icon
      icon={iconName}
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      color={color}
      {...props}
    />
  );
};

export default Icons8;
