// Client-side sharing utilities for assessment results

export interface ShareableAssessmentData {
  answers: Record<string, number>;
  organizationData: {
    organizationName: string;
    industry: string;
    employeeCount: string;
  };
  completedAt: string;
}

/**
 * Encode assessment data into a URL-safe string
 */
export function encodeAssessmentData(data: ShareableAssessmentData): string {
  try {
    const jsonString = JSON.stringify(data);
    const base64 = btoa(jsonString);
    // Make it URL-safe by replacing characters
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding assessment data:', error);
    throw new Error('Failed to encode assessment data');
  }
}

/**
 * Decode assessment data from a URL-safe string
 */
export function decodeAssessmentData(encoded: string): ShareableAssessmentData {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const jsonString = atob(base64);
    const data = JSON.parse(jsonString) as ShareableAssessmentData;
    
    // Validate required fields
    if (!data.answers || !data.organizationData) {
      throw new Error('Invalid data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error decoding assessment data:', error);
    throw new Error('Failed to decode assessment data');
  }
}

/**
 * Generate a shareable URL for assessment results
 */
export function generateShareableUrl(data: ShareableAssessmentData, baseUrl?: string): string {
  const encoded = encodeAssessmentData(data);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://insiderisk.io');
  return `${base}/results/share?data=${encoded}`;
}

/**
 * Create shareable data from current assessment state
 */
export function createShareableData(
  answers: Record<string, number>,
  organizationName: string,
  industry: string,
  employeeCount: string
): ShareableAssessmentData {
  return {
    answers,
    organizationData: {
      organizationName: organizationName || 'Organization',
      industry: industry || 'Unknown',
      employeeCount: employeeCount || 'Unknown',
    },
    completedAt: new Date().toISOString(),
  };
}