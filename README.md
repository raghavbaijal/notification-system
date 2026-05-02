# Notification Priority System

The goal was to build a system that can process a large number of notifications and show the most important ones first.

Instead of focusing on UI, the main focus here is on **data handling, prioritization logic, and efficiency**.

---

## What this does

- Fetches notifications from the given API
- Assigns a priority score to each notification
- Returns the top 10 most important notifications

Priority is based on:
- Type of notification (placement > result > event)
- How recent the notification is

---

## How priority works

Each notification gets a score:

- Placement → highest weight  
- Result → medium  
- Event → lowest  

Then recency is added so newer notifications are ranked higher.

In simple terms:
> Important + Recent = Higher priority

---

## Why heap is used

Instead of sorting the full list every time, I used a **min heap of size 10**.

This helps:
- Keep only top 10 notifications
- Reduce unnecessary computation
- Handle continuous incoming data efficiently

---

## Project structure

notification-system/
│
├── stage-1/
│ ├── main.py / main.js
│ └── output.png
│
├── stage-2/
│ └── logging_middleware/
│
├── notification_system_design.md
└── README.md


---

## Stage 1

- Fetch notifications from API
- Compute priority
- Print top 10 notifications
- Output screenshot included

---

## Stage 2

- Basic logging middleware added
- Logs API calls, responses, and errors
- Helps in debugging and tracking system flow

---

## How to run

### Python

pip install requests
python main.py


### Node.js

node main.js


---

## Notes

- No database is used (as per instructions)
- No hardcoded data
- Focus was on clean logic and efficiency

---

## Author

Raghav Baijal  
