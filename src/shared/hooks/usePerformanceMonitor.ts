/**
 * usePerformanceMonitor Hook
 * Monitora Core Web Vitals e performance metrics
 */

import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  ttfb?: number; // Time to First Byte
  pageLoadTime?: number;
  resourceCount?: number;
  totalResourceSize?: number;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // Medir FCP e LCP
    if ('PerformanceObserver' in window) {
      try {
        // Paint Timing (FCP)
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = Math.round(entry.startTime);
            }
          }
          setMetrics({ ...metricsRef.current });
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.lcp = Math.round((lastEntry as any).renderTime || (lastEntry as any).loadTime);
          setMetrics({ ...metricsRef.current });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              metricsRef.current.cls = Math.round(clsValue * 1000) / 1000;
              setMetrics({ ...metricsRef.current });
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const firstEntry = list.getEntries()[0];
          metricsRef.current.fid = Math.round((firstEntry as any).processingDuration);
          setMetrics({ ...metricsRef.current });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        return () => {
          paintObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }

    // Medir TTFB e Page Load Time
    const measurePageMetrics = () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const ttfb = perfData.responseStart - perfData.navigationStart;

      metricsRef.current.pageLoadTime = pageLoadTime;
      metricsRef.current.ttfb = ttfb;

      // Contar recursos
      const resources = window.performance.getEntriesByType('resource');
      metricsRef.current.resourceCount = resources.length;
      metricsRef.current.totalResourceSize = resources.reduce(
        (sum, resource: any) => sum + (resource.transferSize || 0),
        0
      );

      setMetrics({ ...metricsRef.current });
    };

    // Aguardar carregamento completo
    if (document.readyState === 'complete') {
      measurePageMetrics();
    } else {
      window.addEventListener('load', measurePageMetrics);
      return () => window.removeEventListener('load', measurePageMetrics);
    }
  }, []);

  /**
   * Retorna avaliação de performance
   */
  const getPerformanceGrade = (): 'excellent' | 'good' | 'poor' => {
    const { fcp, lcp, cls } = metrics;

    if (!fcp || !lcp) return 'good';

    // Baseado em Core Web Vitals thresholds
    const fcpGood = fcp < 1800;
    const lcpGood = lcp < 2500;
    const clsGood = (cls || 0) < 0.1;

    if (fcpGood && lcpGood && clsGood) return 'excellent';
    if (fcpGood || lcpGood) return 'good';
    return 'poor';
  };

  /**
   * Reportar métricas para analytics
   */
  const reportMetrics = async (endpoint: string) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metrics,
          grade: getPerformanceGrade(),
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn('Failed to report metrics:', error);
    }
  };

  return {
    metrics,
    grade: getPerformanceGrade(),
    reportMetrics,
  };
}
