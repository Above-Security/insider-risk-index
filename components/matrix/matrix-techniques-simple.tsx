"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function MatrixTechniques() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Technique Browser
          </h3>
          <p className="text-gray-500 mb-6">
            Comprehensive technique browser is in development
          </p>
        </div>
      </CardContent>
    </Card>
  );
}