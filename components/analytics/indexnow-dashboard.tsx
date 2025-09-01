'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface IndexNowDashboardData {
  indexnow_stats: {
    success_rate: number;
    total_submissions: number;
    avg_response_time: number;
    last_24h_submissions: number;
  };
  seo_performance: {
    indexed_pages: number;
    avg_indexing_speed: number;
    avg_ranking_position: number;
    total_organic_clicks: number;
  };
  trending_urls: Array<{
    url: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  indexing_timeline: Array<{
    date: string;
    submissions: number;
    successes: number;
    indexed: number;
  }>;
}

export function IndexNowDashboard() {
  const [data, setData] = useState<IndexNowDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/indexnow?format=dashboard&period=30');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to load analytics data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
  };

  const testIndexNow = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/analytics/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'test_indexnow',
          test_url: 'https://www.insiderisk.io/' 
        }),
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh data after test
        await fetchAnalytics();
      }
    } catch (err) {
      console.error('Test failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Analytics Error</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Analytics Data</CardTitle>
          <CardDescription>No analytics data available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIndexingSpeedColor = (hours: number) => {
    if (hours <= 2) return 'text-green-600';
    if (hours <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">IndexNow Analytics</h2>
          <p className="text-slate-600">Performance metrics and SEO impact tracking</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={testIndexNow}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test IndexNow
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSuccessRateColor(data.indexnow_stats.success_rate)}`}>
              {data.indexnow_stats.success_rate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.indexnow_stats.total_submissions} total submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data.indexnow_stats.avg_response_time)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {data.indexnow_stats.last_24h_submissions} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.seo_performance.indexed_pages}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully indexed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indexing Speed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndexingSpeedColor(data.seo_performance.avg_indexing_speed)}`}>
              {data.seo_performance.avg_indexing_speed}h
            </div>
            <p className="text-xs text-muted-foreground">
              Average time to index
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SEO Performance */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Performance Summary</CardTitle>
          <CardDescription>
            Search engine visibility and ranking metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {data.seo_performance.avg_ranking_position}
              </div>
              <div className="text-sm text-muted-foreground">Average Position</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">
                {data.seo_performance.total_organic_clicks}
              </div>
              <div className="text-sm text-muted-foreground">Total Organic Clicks</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">
                {data.seo_performance.indexed_pages}/{data.indexnow_stats.total_submissions}
              </div>
              <div className="text-sm text-muted-foreground">Indexing Ratio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing URLs</CardTitle>
          <CardDescription>
            Pages with highest organic traffic and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.trending_urls.slice(0, 5).map((url, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {url.url.replace('https://www.insiderisk.io', '')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Position {url.position} • {url.impressions} impressions
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge variant="secondary">
                    {url.clicks} clicks
                  </Badge>
                  <Badge variant="outline">
                    {url.ctr.toFixed(1)}% CTR
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indexing Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Indexing Timeline</CardTitle>
          <CardDescription>
            Daily submissions, successes, and indexing results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.indexing_timeline.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-600">
                    {day.submissions} submitted
                  </span>
                  <span className="text-green-600">
                    {day.successes} successful
                  </span>
                  <span className="text-purple-600">
                    {day.indexed} indexed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}