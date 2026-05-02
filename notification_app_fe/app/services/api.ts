export interface Notification {
  id: string | number;
  title?: string;
  message?: string;
  notification_type: 'Event' | 'Result' | 'Placement' | string;
  timestamp?: string;
  created_at?: string;
  // Any other potential fields from the API
  [key: string]: any;
}

// Fallback data in case the API is completely unreachable
const FALLBACK_DATA: Notification[] = [
  { id: 1, title: 'Campus Drive Scheduled', message: 'The placement drive for CSE students is scheduled for tomorrow.', notification_type: 'Event', timestamp: '2 hours ago' },
  { id: 2, title: 'Aptitude Test Results', message: 'Results for the Aptitude round have been published.', notification_type: 'Result', timestamp: '5 hours ago' },
  { id: 3, title: 'Final Selection', message: 'Congratulations! You have been selected for the SDE role.', notification_type: 'Placement', timestamp: '1 day ago' },
  { id: 4, title: 'Pre-Placement Talk', message: 'Mandatory pre-placement talk starting in 15 mins.', notification_type: 'Event', timestamp: '1 day ago' },
  { id: 5, title: 'Technical Interview Results', message: 'Round 2 results are out. Check your dashboard.', notification_type: 'Result', timestamp: '2 days ago' },
];

export async function fetchNotifications(params: { limit?: number; page?: number; notification_type?: string } = {}) {
  try {
    const url = new URL('http://20.207.122.201/evaluation-service/notifications');
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.notification_type && params.notification_type !== 'All') {
      url.searchParams.append('notification_type', params.notification_type);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    // Assuming data is either an array or has a data property
    if (Array.isArray(data)) return data;
    if (data.notifications) return data.notifications;
    if (data.data) return data.data;
    
    return [];
  } catch (err) {
    console.error('Failed to fetch from real API, using fallback data', err);
    // Return fallback data
    let filtered = [...FALLBACK_DATA];
    if (params.notification_type && params.notification_type !== 'All') {
      filtered = filtered.filter(n => n.notification_type === params.notification_type);
    }
    if (params.limit) {
      filtered = filtered.slice(0, params.limit);
    }
    return filtered;
  }
}
