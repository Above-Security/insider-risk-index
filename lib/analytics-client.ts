"use client";

import posthog from './posthog-client';

// Analytics event types
export interface BaseEvent {
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent extends BaseEvent {
  type: "pageview";
  path: string;
  metadata?: Record<string, any>;
}

export interface AssessmentEvent extends BaseEvent {
  type: "assessment_started" | "assessment_completed" | "assessment_abandoned";
  industry?: string;
  companySize?: string;
  score?: number;
  level?: number;
}

export interface ContentEvent extends BaseEvent {
  type: "content_viewed" | "pdf_generated" | "content_shared";
  contentId: string;
  contentType?: string;
}

export interface InteractionEvent extends BaseEvent {
  type: "button_clicked" | "form_submitted" | "search_performed";
  element?: string;
  value?: string | number;
}

export interface BenchmarkEvent extends BaseEvent {
  type: "benchmark_viewed" | "benchmark_filtered" | "benchmark_exported";
  industry?: string;
  pillar?: string;
  filterType?: string;
}

export type AnalyticsEvent = 
  | PageViewEvent 
  | AssessmentEvent 
  | ContentEvent 
  | InteractionEvent 
  | BenchmarkEvent;

class ClientAnalytics {
  private userId: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.userId = sessionStorage.getItem("analytics_user_id");
      this.sessionId = sessionStorage.getItem("analytics_session_id") || this.generateSessionId();
      sessionStorage.setItem("analytics_session_id", this.sessionId);
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Track page views
   */
  async trackPageView(path: string, metadata?: Record<string, any>) {
    try {
      const properties = {
        path,
        ...metadata,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Track with PostHog
      posthog.capture('pageview', properties);
      
      console.log('Page view tracked:', path);
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }

  /**
   * Track assessment events
   */
  async trackAssessment(eventData: Omit<AssessmentEvent, 'timestamp' | 'userId' | 'sessionId'>) {
    try {
      const properties = {
        ...eventData,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Track with PostHog
      posthog.capture('assessment_event', properties);
      
      console.log('Assessment event tracked:', eventData.type);
    } catch (error) {
      console.error("Error tracking assessment event:", error);
    }
  }

  /**
   * Track content interactions
   */
  async trackContent(eventData: Omit<ContentEvent, 'timestamp' | 'userId' | 'sessionId'>) {
    try {
      const properties = {
        ...eventData,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Track with PostHog
      posthog.capture('content_event', properties);
      
      console.log('Content event tracked:', eventData.type, eventData.contentId);
    } catch (error) {
      console.error("Error tracking content event:", error);
    }
  }

  /**
   * Track user interactions
   */
  async trackInteraction(eventData: Omit<InteractionEvent, 'timestamp' | 'userId' | 'sessionId'>) {
    try {
      const properties = {
        ...eventData,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Track with PostHog
      posthog.capture('interaction_event', properties);
      
      console.log('Interaction event tracked:', eventData.type);
    } catch (error) {
      console.error("Error tracking interaction event:", error);
    }
  }

  /**
   * Track benchmark interactions
   */
  async trackBenchmark(eventData: Omit<BenchmarkEvent, 'timestamp' | 'userId' | 'sessionId'>) {
    try {
      const properties = {
        ...eventData,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
      };

      // Track with PostHog
      posthog.capture('benchmark_event', properties);
      
      console.log('Benchmark event tracked:', eventData.type);
    } catch (error) {
      console.error("Error tracking benchmark event:", error);
    }
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string) {
    if (typeof window !== "undefined") {
      this.userId = userId;
      sessionStorage.setItem("analytics_user_id", userId);
      posthog.identify(userId);
    }
  }

  /**
   * Set session ID
   */
  setSessionId(sessionId: string) {
    if (typeof window !== "undefined") {
      this.sessionId = sessionId;
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
  }
}

// Export singleton instance
export const analytics = new ClientAnalytics();