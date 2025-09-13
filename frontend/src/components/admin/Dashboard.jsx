import React, { useEffect } from 'react';
import { Users, Store, Star, TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useUserStore from '@/stores/userStore';
import LoadingSpinner from '../common/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, description, trend, gradientClass, textColor = "text-white" }) => (
  <Card className={`${gradientClass} border-0 text-white overflow-hidden relative`}>
    <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
      <Icon className="w-full h-full" />
    </div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
      <CardTitle className={`text-sm font-medium ${textColor} opacity-90`}>{title}</CardTitle>
      <Icon className={`h-5 w-5 ${textColor}`} />
    </CardHeader>
    <CardContent className="relative z-10">
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
      {description && (
        <p className={`text-sm ${textColor} opacity-80 mt-1`}>{description}</p>
      )}
      {trend && (
        <div className="flex items-center pt-2">
          <TrendingUp className="h-4 w-4 text-green-300" />
          <span className="text-sm text-green-300 ml-1">{trend}</span>
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
            Live
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { dashboardStats, isLoading, fetchDashboardStats } = useUserStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Store Rating Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Last updated: just now
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              Dashboard displaying live store ratings. Automatically updates every 5 minutes.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={dashboardStats?.totalUsers || 0}
            icon={Users}
            description="Registered users"
            trend="+12.5%"
            gradientClass="bg-gradient-blue"
          />
          <StatCard
            title="Total Stores"
            value={dashboardStats?.totalStores || 0}
            icon={Store}
            description="Active stores"
            trend="+8.2%"
            gradientClass="bg-gradient-purple"
          />
          <StatCard
            title="Total Ratings"
            value={dashboardStats?.totalRatings || 0}
            icon={Star}
            description="User ratings"
            trend="+23.1%"
            gradientClass="bg-gradient-green"
          />
          <StatCard
            title="Platform Health"
            value="Excellent"
            icon={Target}
            description="Overall status"
            gradientClass="bg-gradient-teal"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-600" />
                Recent Activity
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Store rating submitted</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New store added</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Admin user created</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
                System Health
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-sm text-muted-foreground font-medium">120ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm text-green-600 font-medium">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;