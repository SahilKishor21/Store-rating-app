import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'default',
  interactive = false,
  onRatingChange,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleStarClick = (clickedRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(clickedRating);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isHalfFilled = starRating - 0.5 <= rating && starRating > rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starRating)}
            className={cn(
              "relative",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isHalfFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              )}
            />
            {isHalfFilled && (
              <Star
                className={cn(
                  "absolute inset-0 fill-yellow-400 text-yellow-400",
                  sizeClasses[size]
                )}
                style={{
                  clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;