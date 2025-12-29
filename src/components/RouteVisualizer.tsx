'use client';

import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RouteStep {
  label: string;
  value?: string;
  icon?: string;
}

interface RouteVisualizerProps {
  steps: RouteStep[];
}

export function RouteVisualizer({ steps }: RouteVisualizerProps): JSX.Element {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardContent className="p-4">
        <div className="text-xs font-semibold text-blue-500 mb-3">
          TRANSACTION ROUTE
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2 min-w-fit">
              <div className="flex flex-col items-center gap-1">
                {step.icon && (
                  <div className="text-2xl">{step.icon}</div>
                )}
                <div className="text-xs font-medium text-center">
                  {step.label}
                </div>
                {step.value && (
                  <div className="text-xs text-muted-foreground">
                    {step.value}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
