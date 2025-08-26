import 'server-only';
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export interface AnalyticsEventData {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

export interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  eventName?: string;
  userId?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
}

export class AnalyticsDB {
  /**
   * Track an analytics event
   */
  static async trackEvent(data: AnalyticsEventData) {
    try {
      return await prisma.analyticsEvent.create({
        data: {
          name: data.name,
          properties: data.properties || {},
          userId: data.userId,
          sessionId: data.sessionId,
          timestamp: data.timestamp || new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
      throw error;
    }
  }

  /**
   * Get analytics events with filtering
   */
  static async getAnalytics(query: AnalyticsQuery = {}) {
    try {
      const where: any = {};

      if (query.startDate || query.endDate) {
        where.timestamp = {};
        if (query.startDate) where.timestamp.gte = query.startDate;
        if (query.endDate) where.timestamp.lte = query.endDate;
      }

      if (query.eventName) {
        where.name = query.eventName;
      }

      if (query.userId) {
        where.userId = query.userId;
      }

      if (query.sessionId) {
        where.sessionId = query.sessionId;
      }

      return await prisma.analyticsEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: query.limit || 1000,
        skip: query.offset || 0,
      });
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      throw error;
    }
  }

  /**
   * Get event count by name
   */
  static async getEventCount(eventName: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { name: eventName };

      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = startDate;
        if (endDate) where.timestamp.lte = endDate;
      }

      return await prisma.analyticsEvent.count({ where });
    } catch (error) {
      console.error('Failed to get event count:', error);
      return 0;
    }
  }

  /**
   * Get unique users count
   */
  static async getUniqueUsersCount(startDate?: Date, endDate?: Date) {
    try {
      const where: any = {
        userId: { not: null },
      };

      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = startDate;
        if (endDate) where.timestamp.lte = endDate;
      }

      const result = await prisma.analyticsEvent.groupBy({
        by: ['userId'],
        where,
        _count: true,
      });

      return result.length;
    } catch (error) {
      console.error('Failed to get unique users count:', error);
      return 0;
    }
  }

  /**
   * Get event aggregation by time period
   */
  static async getEventAggregation(
    eventName: string,
    period: 'day' | 'week' | 'month',
    startDate: Date,
    endDate: Date
  ) {
    try {
      // This would typically use raw SQL for proper date aggregation
      // For now, we'll return the events and let the client aggregate
      const events = await prisma.analyticsEvent.findMany({
        where: {
          name: eventName,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      return events;
    } catch (error) {
      console.error('Failed to get event aggregation:', error);
      return [];
    }
  }

  /**
   * Clean up old analytics data
   */
  static async cleanup(olderThanDays: number) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await prisma.analyticsEvent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      return result.count;
    } catch (error) {
      console.error('Failed to cleanup analytics data:', error);
      return 0;
    }
  }
}