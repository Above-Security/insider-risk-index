"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Shield, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock 
} from "lucide-react";

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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/matrix/sync");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch matrix stats:", error);
      setStats({
        success: false,
        lastSync: new Date().toISOString(),
        version: "unknown",
        techniquesCount: 0,
        preventionsCount: 0,
        detectionsCount: 0,
        error: "Failed to load data"
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
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