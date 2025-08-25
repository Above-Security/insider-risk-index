"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export function MatrixVisualization() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Matrix Visualization
          </h3>
          <p className="text-gray-500 mb-6">
            Interactive matrix visualization is in development
          </p>
        </div>
      </CardContent>
    </Card>
  );
}