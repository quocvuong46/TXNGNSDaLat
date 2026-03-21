import { Injectable } from '@angular/core';

export interface HistoryItem {
  id: string;
  name: string;
  image?: string;
  dateViewed: string; // ISO string
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly storageKey = 'trace_history';
  private readonly maxItems = 10; // keep recent 5-10 items

  constructor() {}

  getHistory(): HistoryItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as HistoryItem[];
    } catch (err) {
      console.warn('HistoryService: parse failed', err);
      return [];
    }
  }

  addToHistory(item: HistoryItem): void {
    if (!item?.id) return;
    const now = item.dateViewed || new Date().toISOString();
    const history = this.getHistory().filter((h) => h.id !== item.id);
    history.unshift({ ...item, dateViewed: now });
    if (history.length > this.maxItems) {
      history.length = this.maxItems;
    }
    this.save(history);
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.warn('HistoryService: clear failed', err);
    }
  }

  private save(data: HistoryItem[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (err) {
      console.warn('HistoryService: save failed', err);
    }
  }
}
