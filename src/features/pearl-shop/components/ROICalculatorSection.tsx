/**
 * ROICalculatorSection Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROICalculator } from '@/components/ROICalculator';

export function ROICalculatorSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de ROI Interativa</CardTitle>
      </CardHeader>
      <CardContent>
        <ROICalculator />
      </CardContent>
    </Card>
  );
}
