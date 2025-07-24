"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Server,
  Database,
  Globe
} from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  calculationTime: number;
  errorRate: number;
  uptime: number;
  activeUsers: number;
  totalCalculations: number;
  cacheHitRate: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  refreshInterval?: number;
}

export function PerformanceMonitor({ 
  showDetails = false, 
  refreshInterval = 30000 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    calculationTime: 0,
    errorRate: 0,
    uptime: 99.9,
    activeUsers: 0,
    totalCalculations: 0,
    cacheHitRate: 95
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Measure page performance
        if (typeof window !== 'undefined' && window.performance) {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: Math.round(pageLoadTime)
          }));
        }

        // Fetch server metrics (in production, this would come from your monitoring service)
        const response = await fetch('/api/metrics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const serverMetrics = await response.json();
          setMetrics(prev => ({
            ...prev,
            ...serverMetrics.data
          }));
        }

        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up interval for regular updates
    const interval = setInterval(fetchMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'text-green-600', icon: CheckCircle };
    if (value <= thresholds.warning) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'poor', color: 'text-red-600', icon: AlertTriangle };
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (!showDetails) {
    // Simplified view for production
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-64 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Uptime</span>
              <Badge variant={metrics.uptime >= 99.5 ? "default" : "destructive"}>
                {formatPercentage(metrics.uptime)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Response Time</span>
              <span className="text-xs font-mono">
                {formatTime(metrics.apiResponseTime)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detailed view for development/admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <Badge variant="outline">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Badge>
      </div>

      {/* Core Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Page Load Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(metrics.pageLoadTime)}
            </div>
            <Progress 
              value={Math.min((metrics.pageLoadTime / 3000) * 100, 100)} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;2s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              API Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(metrics.apiResponseTime)}
            </div>
            <Progress 
              value={Math.min((metrics.apiResponseTime / 1000) * 100, 100)} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;500ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Calculation Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(metrics.calculationTime)}
            </div>
            <Progress 
              value={Math.min((metrics.calculationTime / 500) * 100, 100)} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;200ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(metrics.errorRate)}
            </div>
            <Progress 
              value={metrics.errorRate * 10} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;1%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatPercentage(metrics.uptime)}
            </div>
            <p className="text-sm text-muted-foreground">
              99.9% SLA target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.activeUsers.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatPercentage(metrics.cacheHitRate)}
            </div>
            <p className="text-sm text-muted-foreground">
              Cache efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {metrics.errorRate > 5 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High error rate detected ({formatPercentage(metrics.errorRate)}). 
            System performance may be degraded.
          </AlertDescription>
        </Alert>
      )}

      {metrics.apiResponseTime > 2000 && (
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            API response time is above target ({formatTime(metrics.apiResponseTime)}). 
            Users may experience slow calculations.
          </AlertDescription>
        </Alert>
      )}

      {metrics.uptime < 99.5 && (
        <Alert variant="destructive">
          <Server className="h-4 w-4" />
          <AlertDescription>
            System uptime is below SLA ({formatPercentage(metrics.uptime)}). 
            Please check system health.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Hook for tracking performance metrics
export function usePerformanceTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          value: Math.round(pageLoadTime),
          custom_parameter: 'performance'
        });
      }
    };

    const trackCalculationTime = (startTime: number) => {
      const calculationTime = performance.now() - startTime;
      
      if (window.gtag) {
        window.gtag('event', 'calculation_time', {
          value: Math.round(calculationTime),
          custom_parameter: 'performance'
        });
      }
    };

    // Track page load
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    return () => {
      window.removeEventListener('load', trackPageLoad);
    };
  }, []);
}
