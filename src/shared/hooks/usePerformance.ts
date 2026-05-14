/**
 * usePerformance Hook
 * Monitora Core Web Vitals (LCP, FID, CLS)
 */

import { useEffect } from 'react';

interface WebVitals {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformance(onMetrics?: (vitals: WebVitals) => void) {
  useEffect(() => {
    const vitals: WebVitals = {};

    // Medir LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Medir FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            vitals.fid = entries[0].processingDuration;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Medir CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              vitals.cls = clsValue;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Medir TTFB (Time to First Byte)
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationTiming) {
          vitals.ttfb = navigationTiming.responseStart - navigationTiming.fetchStart;
        }

        // Callback com métricas
        if (onMetrics) {
          const timer = setTimeout(() => {
            onMetrics(vitals);
          }, 3000);

          return () => {
            clearTimeout(timer);
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
          };
        }
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }, [onMetrics]);

  return {
    reportMetrics: () => {
      if (navigator.sendBeacon && 'PerformanceObserver' in window) {
        const vitals = performance.getEntriesByType('navigation')[0];
        if (vitals) {
          navigator.sendBeacon('/api/metrics', JSON.stringify(vitals));
        }
      }
    },
  };
}
