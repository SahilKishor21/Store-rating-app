import React, { useEffect } from 'react';
import { Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useStoreStore from '@/stores/storeStore';
import useAuthStore from '@/stores/authStore';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDateTime } from '@/lib/utils';

const StoreDashboard = () => {
  const { user } = useAuthStore();
  const { currentStore, storeRatings, isLoading, fetchStoreRatings } = useStoreStore();

  useEffect(() => {
    
    const findUserStore = async () => {
      await fetchStoreRatings(1);
    };
    
    findUserStore();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Dashboard</h1>
        <p className="text-muted-foreground">Monitor your store's performance</p>
      </div>

      {currentStore && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStore.average_rating || 'N/A'}</div>
              <StarRating rating={currentStore.average_rating || 0} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storeRatings.length}</div>
              <p className="text-xs text-muted-foreground">Users who rated your store</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Customer Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeRatings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="font-medium">{rating.user_name}</TableCell>
                  <TableCell>{rating.user_email}</TableCell>
                  <TableCell>
                    <StarRating rating={rating.rating} size="sm" />
                  </TableCell>
                  <TableCell>{formatDateTime(rating.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreDashboard;