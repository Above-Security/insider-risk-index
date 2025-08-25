"use client";

import posthog from './posthog-client';
import { AnalyticsDB } from './analytics-db';

// Analytics event types
export interface BaseEvent {
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent extends BaseEvent {
  type: "pageview";
  path: string;
  referrer?: string;
  userAgent?: string;
}

export interface AssessmentEvent extends BaseEvent {
  type: "assessment_started" | "assessment_completed" | "assessment_abandoned";
  pillarId?: string;
  questionId?: string;
  industry?: string;
  companySize?: string;
  score?: number;
  level?: number;
}

export interface ContentEvent extends BaseEvent {
  type: "playbook_viewed" | "research_viewed" | "pdf_generated" | "content_downloaded";
  contentId: string;
  contentType: "playbook" | "research" | "pdf" | "report";
  pillarId?: string;
  category?: string;
}

export interface InteractionEvent extends BaseEvent {
  type: "button_clicked" | "form_submitted" | "newsletter_subscribed" | "contact_submitted";
  element: string;
  location: string;
  value?: string;
}

export interface BenchmarkEvent extends BaseEvent {
  type: "benchmark_viewed" | "comparison_generated";
  industry?: string;
  companySize?: string;
  score?: number;
}

export type AnalyticsEventType = 
  | PageViewEvent 
  | AssessmentEvent 
  | ContentEvent 
  | InteractionEvent 
  | BenchmarkEvent;

class AnalyticsManager {
  private enabled: boolean;
  private queue: AnalyticsEventType[] = [];
  private isProcessing = false;

  constructor() {
    this.enabled = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
  }

  /**
   * Track a page view
   */
  async trackPageView(path: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    try {
      // Track with PostHog
      posthog.capture('$pageview', {
        $current_url: path,
        ...properties,
      });

      // Store in database
      await this.trackEvent({
        type: "pageview",
        path,
        referrer: typeof window !== "undefined" ? document.referrer : undefined,
        userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
        ...this.getBaseEventData(),
      });
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }

  /**
   * Track an assessment event
   */
  async trackAssessment(event: Omit<AssessmentEvent, keyof BaseEvent>) {
    if (!this.enabled) return;

    try {
      const fullEvent: AssessmentEvent = {
        ...event,
        ...this.getBaseEventData(),
      };

      // Track with PostHog
      posthog.capture(event.type, {
        pillar: event.pillarId,
        industry: event.industry,
        companySize: event.companySize,
        score: event.score,
        level: event.level,
      });

      // Store in database
      await this.trackEvent(fullEvent);
    } catch (error) {
      console.error("Error tracking assessment event:", error);
    }
  }

  /**
   * Track content interaction
   */
  async trackContent(event: Omit<ContentEvent, keyof BaseEvent>) {
    if (!this.enabled) return;

    try {
      const fullEvent: ContentEvent = {
        ...event,
        ...this.getBaseEventData(),
      };

      // Track with PostHog
      posthog.capture(event.type, {
        contentId: event.contentId,
        contentType: event.contentType,
        pillar: event.pillarId,
        category: event.category,
      });

      // Store in database
      await this.trackEvent(fullEvent);
    } catch (error) {
      console.error("Error tracking content event:", error);
    }
  }

  /**
   * Track user interactions
   */
  async trackInteraction(event: Omit<InteractionEvent, keyof BaseEvent>) {
    if (!this.enabled) return;

    try {
      const fullEvent: InteractionEvent = {
        ...event,
        ...this.getBaseEventData(),
      };

      // Track with PostHog
      posthog.capture(event.type, {
        element: event.element,
        location: event.location,
        value: event.value,
      });

      // Store in database
      await this.trackEvent(fullEvent);
    } catch (error) {
      console.error("Error tracking interaction event:", error);
    }
  }

  /**
   * Track benchmark viewing
   */
  async trackBenchmark(event: Omit<BenchmarkEvent, keyof BaseEvent>) {
    if (!this.enabled) return;

    try {
      const fullEvent: BenchmarkEvent = {
        ...event,
        ...this.getBaseEventData(),
      };

      // Track with PostHog
      posthog.capture(event.type, {
        industry: event.industry,
        companySize: event.companySize,
        score: event.score,
      });

      // Store in database
      await this.trackEvent(fullEvent);
    } catch (error) {
      console.error("Error tracking benchmark event:", error);
    }
  }

  /**
   * Track custom event with properties
   */
  async trackCustomEvent(name: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    try {
      // Track with PostHog
      posthog.capture(name, properties);

      // Store in database
      await AnalyticsDB.trackEvent({
        name,
        properties,
        ...this.getBaseEventData(),
      });
    } catch (error) {
      console.error("Error tracking custom event:", error);
    }
  }

  /**
   * Identify user for tracking
   */
  setUserId(userId: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("analytics_user_id", userId);
      // Identify user in PostHog
      posthog.identify(userId);
    }
  }

  /**
   * Set session ID
   */
  setSessionId(sessionId: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
  }

  /**
   * Get base event data
   */
  private getBaseEventData(): BaseEvent {
    const base: BaseEvent = {
      timestamp: new Date(),
    };

    if (typeof window !== "undefined") {
      base.userId = sessionStorage.getItem("analytics_user_id") || undefined;
      base.sessionId = sessionStorage.getItem("analytics_session_id") || this.generateSessionId();
    }

    return base;
  }

  /**
   * Generate a session ID
   */
  private generateSessionId(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
    return sessionId;
  }

  /**
   * Track event in database
   */
  private async trackEvent(event: AnalyticsEventType) {
    try {
      await AnalyticsDB.trackEvent({
        name: event.type,
        properties: event,
        userId: event.userId,
        sessionId: event.sessionId,
      });
    } catch (error) {
      // Queue event for retry if database is unavailable
      this.queue.push(event);
      this.processQueue();
    }
  }

  /**
   * Process queued events
   */
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      for (const event of events) {
        await AnalyticsDB.trackEvent({
          name: event.type,
          properties: event,
          userId: event.userId,
          sessionId: event.sessionId,
        });
      }
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...events);
      console.error("Failed to process analytics queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackAssessment: analytics.trackAssessment.bind(analytics),
    trackContent: analytics.trackContent.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackBenchmark: analytics.trackBenchmark.bind(analytics),
    trackCustomEvent: analytics.trackCustomEvent.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    setSessionId: analytics.setSessionId.bind(analytics),
  };
}

// Server-side analytics for API routes
export class ServerAnalytics {
  /**
   * Track server-side event
   */
  static async trackEvent(name: string, properties?: Record<string, any>) {
    try {
      await AnalyticsDB.trackEvent({
        name,
        properties,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error tracking server-side event:", error);
    }
  }

  /**
   * Track API usage
   */
  static async trackApiUsage({
    endpoint,
    method,
    statusCode,
    responseTime,
    userAgent,
    ip,
  }: {
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    userAgent?: string;
    ip?: string;
  }) {
    await this.trackEvent("api_request", {
      endpoint,
      method,
      statusCode,
      responseTime,
      userAgent,
      ip,
    });
  }

  /**
   * Track assessment completion
   */
  static async trackAssessmentCompletion({
    industry,
    companySize,
    score,
    level,
    pillarScores,
  }: {
    industry: string;
    companySize: string;
    score: number;
    level: number;
    pillarScores: Record<string, number>;
  }) {
    await this.trackEvent("assessment_completed_server", {
      industry,
      companySize,
      score,
      level,
      pillarScores,
    });
  }

  /**
   * Track PDF generation
   */
  static async trackPdfGeneration({
    type,
    score,
    industry,
    companySize,
    generationTime,
  }: {
    type: "board-brief" | "detailed-plan";
    score: number;
    industry: string;
    companySize: string;
    generationTime: number;
  }) {
    await this.trackEvent("pdf_generated_server", {
      type,
      score,
      industry,
      companySize,
      generationTime,
    });
  }
}

// Utility functions for analytics reporting
export class AnalyticsReporting {
  /**
   * Get popular content
   */
  static async getPopularContent(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const events = await AnalyticsDB.getAnalytics({
        startDate,
        endDate: new Date(),
        eventName: "content_viewed",
      });

      const contentCounts: Record<string, number> = {};
      
      events.forEach(event => {
        const contentId = event.properties?.contentId as string;
        if (contentId) {
          contentCounts[contentId] = (contentCounts[contentId] || 0) + 1;
        }
      });

      return Object.entries(contentCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([contentId, views]) => ({ contentId, views }));
    } catch (error) {
      console.error("Error getting popular content:", error);
      return [];
    }
  }

  /**
   * Get assessment statistics
   */
  static async getAssessmentStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const events = await AnalyticsDB.getAnalytics({
        startDate,
        endDate: new Date(),
      });

      const started = events.filter(e => e.name === "assessment_started").length;
      const completed = events.filter(e => e.name === "assessment_completed").length;
      const abandoned = events.filter(e => e.name === "assessment_abandoned").length;

      return {
        started,
        completed,
        abandoned,
        completionRate: started > 0 ? (completed / started) * 100 : 0,
        abandonmentRate: started > 0 ? (abandoned / started) * 100 : 0,
      };
    } catch (error) {
      console.error("Error getting assessment stats:", error);
      return { started: 0, completed: 0, abandoned: 0, completionRate: 0, abandonmentRate: 0 };
    }
  }
}