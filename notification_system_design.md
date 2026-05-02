# Stage 1

## Notification System Design

### 1. Approach
The solution is designed to act as an efficient background service that fetches notifications from the provided evaluation API and determines the top 10 most critical alerts that a user should see immediately. 

Instead of storing notifications in a database or sorting an ever-growing list, the system implements an **in-memory Min-Heap (Priority Queue)** approach. As notifications are streamed or fetched, they are evaluated individually. The system calculates a combined priority score and attempts to push the notification into a bounded heap (size = 10). This ensures that memory consumption remains minimal (O(1) relative to total notifications) while retaining the absolute highest-priority items.

### 2. Priority Formula
The priority is modeled as a tuple in Python: `(Weight, Unread_Status, Recency)`.
Since Python compares tuples element-by-element from left to right, this inherently enforces our strict hierarchy without requiring complex mathematics.

* **Weight (Primary Focus):** `Placement = 3 > Result = 2 > Event = 1`. This ensures any placement notification overrides all result and event notifications regardless of when they arrived.
* **Unread Status (Secondary Focus):** `Unread = 1, Read = 0`. If two notifications share the same weight, the unread one takes precedence.
* **Recency (Tertiary Focus):** Represented by the parsed Unix timestamp (float). If weight and read status are identical, the newer notification wins.

### 3. Time Complexity
* **Processing a single notification:** `O(log K)` where `K` is the size of the heap (K=10).
* **Processing N notifications:** `O(N log K)`. Since `K` is a small constant (10), `log(10)` is negligible. Thus, the time complexity simplifies to **`O(N)`**. 
* This is vastly superior to `O(N log N)` which would be required if we tried to sort the entire list every time we fetched new data.

### 4. Why Heap?
A Min-Heap is the optimal data structure for maintaining the "Top K" elements in a potentially infinite or massive data stream. 
* **Avoids Global Sorting:** Sorting the entire dataset every time a new payload arrives scales poorly.
* **Constant Space:** The memory footprint is strictly bounded to `O(K)`.
* **Fast Eviction:** With a Min-Heap, the root of the tree `heap[0]` is always the *lowest* priority element currently in our Top 10. When a new notification arrives, we only need to compare it in `O(1)` time against the root. If the new notification is more important, we pop the root and push the new item in `O(log K)` time.

### 5. How System Scales for Real-Time Notifications
In a production real-time environment (e.g., connected via WebSockets, Server-Sent Events, or high-frequency polling):
1. **Memory Efficiency:** The bounded size of the heap means the application's memory will not balloon over time, even if millions of notifications pass through the system.
2. **Computational Efficiency:** Pushing to a heap of size 10 takes fractions of a microsecond. This logic can safely run on a highly concurrent thread or async loop without blocking the main event loop.
3. **Stateless Nature:** The logic doesn't strictly depend on database locks. It can exist entirely as a microservice cache layer or in-memory view, updating almost instantly to deliver a highly responsive priority inbox experience to end users.
