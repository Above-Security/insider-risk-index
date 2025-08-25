"use client";

import { useEffect, useState } from &apos;react&apos;;
import { Card, CardContent } from &apos;@/components/ui/card&apos;;
import { Badge } from &apos;@/components/ui/badge&apos;;
import { Button } from &apos;@/components/ui/button&apos;;
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock 
} from &apos;lucide-react&apos;;

interface MatrixStats {
  success: boolean;
  lastSync: string;
  version: string;
  techniquesCount: number;
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
      const response = await fetch(&apos;/api/matrix/sync&apos;);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(&apos;Failed to fetch matrix stats:&apos;, error);
      setStats({
        success: false,
        lastSync: new Date().toISOString(),
        version: &apos;unknown&apos;,
        techniquesCount: 0,
        preventionsCount: 0,
        detectionsCount: 0,
        error: &apos;Failed to load data&apos;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch(&apos;/api/matrix/sync&apos;, {
        method: &apos;POST&apos;,
        headers: { &apos;Content-Type&apos;: &apos;application/json&apos; },
        body: JSON.stringify({ clearCache: true })
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(&apos;Sync failed:&apos;, error);
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
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
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
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Matrix Data
            </h3>
            <p className="text-gray-500 mb-4">
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
      return new Date(dateString).toLocaleDateString(&apos;en-US&apos;, {
        year: &apos;numeric&apos;,
        month: &apos;short&apos;,
        day: &apos;numeric&apos;,
        hour: &apos;2-digit&apos;,
        minute: &apos;2-digit&apos;
      });
    } catch {
      return &apos;Unknown&apos;;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <Card className={stats.success ? &apos;border-green-200 bg-green-50&apos; : &apos;border-red-200 bg-red-50&apos;}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stats.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${stats.success ? &apos;text-green-900&apos; : &apos;text-red-900&apos;}`}>
                  Matrix {stats.success ? &apos;Connected&apos; : &apos;Disconnected&apos;}
                </p>
                <p className={`text-sm ${stats.success ? &apos;text-green-700&apos; : &apos;text-red-700&apos;}`}>
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
                <RefreshCw className={`h-4 w-4 ${syncing ? &apos;animate-spin&apos; : &apos;&apos;}`} />
                {syncing ? &apos;Syncing...&apos; : &apos;Sync&apos;}
              </Button>
            </div>
          </div>
          
          {stats.error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{stats.error}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Techniques</p>
                <p className="text-3xl font-bold text-gray-900">{stats.techniquesCount}</p>
                <p className="text-sm text-gray-500">Threat vectors</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Preventions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.preventionsCount}</p>
                <p className="text-sm text-gray-500">Control measures</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Detections</p>
                <p className="text-3xl font-bold text-gray-900">{stats.detectionsCount}</p>
                <p className="text-sm text-gray-500">Monitoring methods</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}