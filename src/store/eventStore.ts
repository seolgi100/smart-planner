import { create } from 'zustand';
import type { Event, EventFormData, SortOption, EventCategory } from '../types';
import * as eventService from '../services/eventService';

interface EventStore {
    events: Event[];
    sortBy: SortOption;
    filterCategory: EventCategory | 'all';
    //액션
    loadEvents: () => void;
    addEvent: (formData: EventFormData) => void;
    editEvent: (id: string, formData: Partial<EventFormData>) => void;
    removeEvent: (id: string) => void;
    toggleComplete: (id: string) => void;
    setSortBy: (sort: SortOption) => void;
    setFilterCategory: (category: EventCategory | 'all') => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    sortBy: 'dueDate',
    filterCategory: 'all',

    loadEvents: () => {
        const events = eventService.getEvents();
        set({ events });
    },

    addEvent: (formData) => {
        const newEvent = eventService.createEvent(formData);
        set((state) => ({ events: [...state.events, newEvent] }));
    },

    editEvent: (id, formData) => {
        const updated = eventService.updateEvent(id, formData);
        set((state) => ({
            events: state.events.map((e) => (e.id === id ? updated : e)),
        }));
    },

    removeEvent: (id) => {
        eventService.deleteEvent(id);
        set((state) => ({
            events: state.events.filter((e) => e.id !== id),
        }));
    },

    toggleComplete: (id) => {
        const event = get().events.find((e) => e.id === id);
        if (!event) return;
        const updated = eventService.updateEvent(id, { isCompleted: !event.isCompleted });
        set((state) => ({
            events: state.events.map((e) => (e.id === id ? updated : e)),
        }));
    },

    setSortBy: (sort) => set({ sortBy: sort }),
    setFilterCategory: (category) => set({ filterCategory: category }),
}));