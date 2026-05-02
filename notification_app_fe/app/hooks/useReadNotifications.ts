'use client';
import { useState, useEffect } from 'react';

export function useReadNotifications() {
  const [readIds, setReadIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('read_notifications');
    if (stored) {
      try {
        setReadIds(new Set(JSON.parse(stored)));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const markAsRead = (id: string | number) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem('read_notifications', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const markAllAsRead = (ids: (string | number)[]) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      ids.forEach(id => newSet.add(id));
      localStorage.setItem('read_notifications', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  return { readIds, markAsRead, markAllAsRead };
}
