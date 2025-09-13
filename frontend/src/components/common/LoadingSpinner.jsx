import React from 'react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", sizeClasses[size], className)} />
  );
};

export const LoadingCard = ({ className }) => (
  <div className={cn("animate-shimmer rounded-lg border p-6", className)}>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const LoadingTableRow = () => (
  <tr>
    <td colSpan="100%" className="p-4">
      <div className="animate-shimmer space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </td>
  </tr>
);

export default LoadingSpinner;