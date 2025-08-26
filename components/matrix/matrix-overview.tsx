"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock 
} from 'lucide-react';

interface MatrixStats {
  success: boolean;
  lastSync: string;
  version: string;
  elementsCount: number;
  preventionsCount: number;
  detectionsCount: number;
  error?: string;
}

export function MatrixOverview() {
  const [stats, setStats] = useState<MatrixStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/matrix/sync');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch matrix stats:', error);
      setStats({
        success: false,
        lastSync: new Date().toISOString(),
        version: 'unknown',
        elementsCount: 0,
        preventionsCount: 0,
        detectionsCount: 0,
        error: 'Failed to load data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/matrix/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearCache: true })
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-above-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Failed to Load Matrix Data
            </h3>
            <p className="text-slate-500 mb-4">
              Unable to connect to the Insider Threat Matrix API
            </p>
            <Button onClick={fetchStats} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <Card className={stats.success ? 'border-above-blue-200 bg-above-blue-50' : 'border-above-rose-200 bg-above-rose-50'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stats.success ? (
                <CheckCircle className="h-5 w-5 text-above-blue-800" />
              ) : (
                <XCircle className="h-5 w-5 text-above-rose-800" />
              )}
              <div>
                <p className={`font-medium ${stats.success ? 'text-above-blue-900' : 'text-above-rose-900'}`}>
                  Matrix {stats.success ? 'Connected' : 'Disconnected'}
                </p>
                <p className={`text-sm ${stats.success ? 'text-above-blue-800' : 'text-above-rose-800'}`}>
                  Last updated: {formatDate(stats.lastSync)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                v{stats.version}
              </Badge>
              <Button
                onClick={handleSync}
                disabled={syncing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
            </div>
          </div>
          
          {stats.error && (
            <div className="mt-4 p-3 bg-above-rose-100 border border-above-rose-200 rounded-md">
              <p className="text-sm text-above-rose-800">{stats.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Techniques</p>
                <p className="text-3xl font-bold text-slate-900">{stats.elementsCount}</p>
                <p className="text-sm text-slate-500">Threat vectors</p>
              </div>
              <div className="bg-above-rose-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-above-rose-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Preventions</p>
                <p className="text-3xl font-bold text-slate-900">{stats.preventionsCount}</p>
                <p className="text-sm text-slate-500">Control measures</p>
              </div>
              <div className="bg-above-blue-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-above-blue-800" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Detections</p>
                <p className="text-3xl font-bold text-slate-900">{stats.detectionsCount}</p>
                <p className="text-sm text-slate-500">Monitoring methods</p>
              </div>
              <div className="bg-above-blue-100 p-3 rounded-lg">
                <Search className="h-6 w-6 text-above-blue-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}