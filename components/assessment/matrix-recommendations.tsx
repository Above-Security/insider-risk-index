"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle,
  Clock,
  Target,
  ExternalLink,
  Shield,
  Search,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { generateMatrixRecommendations, type Recommendation, type RecommendationContext } from "@/lib/recommendations";
import { getPillarById } from "@/lib/pillars";

interface MatrixRecommendationsProps {
  context: RecommendationContext;
}

export function MatrixRecommendations({ context }: MatrixRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const recs = await generateMatrixRecommendations(context);
        setRecommendations(recs);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setError("Unable to load Matrix-based recommendations");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [context]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Matrix-Enhanced Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Recommendations Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your connection and try again, or refer to the standard playbooks.
          </p>
        </CardContent>
      </Card>
    );
  }

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedRecommendations = recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Matrix-Enhanced Recommendations
          </CardTitle>
          <p className="text-gray-600">
            Personalized recommendations based on your assessment results and the latest 
            insider threat intelligence from the ForScie Matrix.
          </p>
        </CardHeader>
      </Card>

      {/* Recommendations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Matrix Attribution */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Powered by Insider Threat Matrix
              </h3>
              <p className="text-blue-800 mb-4 text-sm">
                These recommendations are enhanced with threat intelligence from the 
                community-driven Insider Threat Matrix, providing you with the latest 
                techniques, preventions, and detection methods.
              </p>
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Full Matrix
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecommendationCard({ 
  recommendation, 
  rank 
}: { 
  recommendation: Recommendation; 
  rank: number; 
}) {
  const pillar = getPillarById(recommendation.pillarId);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                #{rank}
              </span>
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(recommendation.difficulty)}>
                {recommendation.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {recommendation.title}
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <TrendingUp className="h-3 w-3" />
              Impact: {recommendation.estimatedImpact}/10
            </div>
            {pillar && (
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: pillar.color, color: pillar.color }}
              >
                {pillar.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          {recommendation.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recommendation.timeToImplement}
          </div>
          {recommendation.matrixTechniques.length > 0 && (
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {recommendation.matrixTechniques.length} techniques
            </div>
          )}
          {recommendation.preventionStrategies.length > 0 && (
            <div className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {recommendation.preventionStrategies.length} preventions
            </div>
          )}
        </div>

        {/* Matrix Insights */}
        {(recommendation.preventionStrategies.length > 0 || recommendation.detectionMethods.length > 0) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Matrix Insights</h4>
            <div className="space-y-2">
              {recommendation.preventionStrategies.slice(0, 2).map((strategy, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Shield className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{strategy}</span>
                </div>
              ))}
              {recommendation.detectionMethods.slice(0, 1).map((method, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Search className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{method}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {recommendation.playbooks.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/playbooks/${recommendation.playbooks[0]}`}>
                <BookOpen className="h-3 w-3 mr-1" />
                View Playbook
              </a>
            </Button>
          )}
          {recommendation.resources.length > 0 && recommendation.resources[0].type === 'matrix' && (
            <Button variant="outline" size="sm" asChild>
              <a href={recommendation.resources[0].url}>
                <ExternalLink className="h-3 w-3 mr-1" />
                Matrix Data
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}