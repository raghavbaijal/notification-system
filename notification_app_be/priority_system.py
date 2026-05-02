import requests
import heapq
import datetime
import os

# API configuration
API_URL = "http://20.207.122.201/evaluation-service/notifications"

# Weights for notification types
TYPE_WEIGHTS = {
    "placement": 3,
    "result": 2,
    "event": 1
}

def fetch_notifications():
    """
    Fetches notifications from the evaluation service API.
    Handles protected route by checking for an auth token in environment variables.
    """
    token = os.environ.get("AUTH_TOKEN", "YOUR_DUMMY_TOKEN_HERE")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(API_URL, headers=headers, timeout=10)
        
        if response.status_code == 401 or response.status_code == 403:
            print("Warning: API is protected. Please set a valid AUTH_TOKEN environment variable.")
            return []
            
        response.raise_for_status()
        data = response.json()
        
        # Depending on API structure, it might return a list directly or wrap it in a dict
        if isinstance(data, list):
            return data
        elif "notifications" in data:
            return data["notifications"]
        elif "data" in data:
            return data["data"]
            
        return []
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching notifications: {e}")
        return []

def parse_timestamp(timestamp_str):
    """
    Parses a timestamp string into a Unix timestamp (float/int).
    Returns 0 if parsing fails to handle malformed data gracefully.
    """
    if not timestamp_str:
        return 0
        
    try:
        # Assuming ISO 8601 format like "2024-05-02T10:00:00Z"
        # We replace Z with +00:00 to support Python's fromisoformat in standard libraries
        clean_ts = str(timestamp_str).replace('Z', '+00:00')
        dt = datetime.datetime.fromisoformat(clean_ts)
        return dt.timestamp()
    except (ValueError, TypeError):
        # Fallback if the format is just a raw Unix timestamp
        try:
            return float(timestamp_str)
        except (ValueError, TypeError):
            return 0

def compute_priority(notification):
    """
    Computes a priority tuple for a notification.
    Tuple structure: (Type Weight, Unread Status, Recency Timestamp)
    Python compares tuples element by element, so higher weight wins.
    If weights match, unread wins. If both match, newer timestamp wins.
    """
    # 1. Type Weight
    notif_type = str(notification.get("notification_type", "")).lower()
    # Default to 0 if unknown type
    weight = TYPE_WEIGHTS.get(notif_type, 0)
    
    # 2. Unread Status (Preferred if field exists)
    # Assume unread is True, read is False. Unread gets 1, Read gets 0.
    is_unread = notification.get("unread", notification.get("read") is False)
    unread_score = 1 if is_unread else 0
    
    # 3. Recency (Timestamp)
    timestamp_str = notification.get("timestamp") or notification.get("created_at")
    recency = parse_timestamp(timestamp_str)
    
    return (weight, unread_score, recency)

def get_top_notifications(notifications, top_n=10):
    """
    Uses a min-heap to efficiently maintain the top N highest-priority notifications.
    Time Complexity: O(M log N) where M is total notifications and N is top_n.
    Space Complexity: O(N) for the heap.
    """
    min_heap = []
    
    for notif in notifications:
        # Skip malformed notifications that lack an ID
        notif_id = notif.get("id", notif.get("ID", id(notif)))

        priority_tuple = compute_priority(notif)
        
        # Heap element: (priority_tuple, unique_id, notification)
        # unique_id prevents comparison errors on the dictionary if priority_tuples are identical
        heap_item = (priority_tuple, notif_id, notif)
        
        if len(min_heap) < top_n:
            heapq.heappush(min_heap, heap_item)
        else:
            # If current notification's priority is greater than the smallest in the heap
            if priority_tuple > min_heap[0][0]:
                heapq.heappushpop(min_heap, heap_item)
                
    # Sort the final heap in descending order (highest priority first)
    top_notifications = [item[2] for item in sorted(min_heap, key=lambda x: x[0], reverse=True)]
    return top_notifications

def print_output(top_notifications):
    """
    Prints the top notifications in a clean, readable format.
    """
    print("="*60)
    print(f" TOP {len(top_notifications)} PRIORITY NOTIFICATIONS INBOX ")
    print("="*60)
    
    if not top_notifications:
        print("No notifications found or unable to fetch.")
        return
        
    for i, notif in enumerate(top_notifications, 1):
        n_id = notif.get("id", notif.get("ID", "N/A"))
        n_type = str(notif.get("notification_type", "Unknown")).capitalize()
        is_unread = "UNREAD" if notif.get("unread", notif.get("read") is False) else "READ"
        msg = notif.get("message", notif.get("msg", "No message content"))
        ts = notif.get("timestamp", notif.get("created_at", "Unknown time"))
        
        print(f"{i}. [{n_type}] {is_unread}")
        print(f"   ID: {n_id} | Time: {ts}")
        print(f"   Message: {msg}")
        print("-" * 60)

def main():
    print("Fetching notifications from API...")
    notifications = fetch_notifications()
    
    if not notifications:
        print("Using sample data for demonstration since API fetch failed/returned empty.")
        # Fallback sample data to demonstrate logic if API is unreachable/protected
        notifications = [
            {"id": "1", "notification_type": "event", "message": "Hackathon registration opens", "timestamp": "2026-05-01T10:00:00Z", "unread": False},
            {"id": "2", "notification_type": "placement", "message": "Offer letter generated", "timestamp": "2026-05-02T11:00:00Z", "unread": True},
            {"id": "3", "notification_type": "result", "message": "Semester 6 marks published", "timestamp": "2026-05-01T15:00:00Z", "unread": True},
            {"id": "4", "notification_type": "event", "message": "Alumni meetup at 5 PM", "timestamp": "2026-05-02T09:00:00Z", "unread": True},
            {"id": "5", "notification_type": "placement", "message": "Interview scheduled with Google", "timestamp": "2026-05-01T08:00:00Z", "unread": False},
        ]
        
    print(f"Total notifications retrieved: {len(notifications)}")
    
    top_10_notifications = get_top_notifications(notifications, top_n=10)
    
    print_output(top_10_notifications)

if __name__ == "__main__":
    main()
