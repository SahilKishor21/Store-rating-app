import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StarRating from '../common/StarRating';
import useStoreStore from '@/stores/storeStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { RATING_LABELS } from '@/utils/constants';

const RatingDialog = ({ 
  open, 
  onOpenChange, 
  store, 
  currentRating = 0, 
  onSuccess 
}) => {
  const [rating, setRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitRating } = useStoreStore();

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating, open]);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const result = await submitRating(store.id, rating);
      if (result.success) {
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = () => {
    return RATING_LABELS[rating] || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {store?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              How would you rate your experience at this store?
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="lg"
              />
            </div>
            
            {rating > 0 && (
              <div className="space-y-2">
                <p className="text-lg font-medium">{getRatingLabel()}</p>
                <p className="text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                currentRating > 0 ? 'Update Rating' : 'Submit Rating'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;