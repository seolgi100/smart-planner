import type { Event, EventFormData } from '../types';

const STORAGE_KEY = 'smart-planner-events';

//전체 조회
export const getEvents = (): Event[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

//단일 조회
export const getEventById = (id: string): Event | undefined => {
    return getEvents().find((e) => e.id === id);
};

//생성
export const createEvent = (formData: EventFormData): Event => {
    const events = getEvents();
    const newEvent: Event = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...events, newEvent]));
    return newEvent;
};

//수정
export const updateEvent = (id: string, formData: Partial<EventFormData>): Event => {
    const events = getEvents();
    const updated = events.map((e) =>
        e.id === id ? { ...e, ...formData } : e
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((e) => e.id === id)!;
};

//삭제
export const deleteEvent = (id: string): void => {
    const events = getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};