import type { Routine, RoutineFormData } from '../types';

const STORAGE_KEY = 'smart-planner-routines';

export const getRoutines = (): Routine[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const getRoutineById = (id: string): Routine | undefined =>
    getRoutines().find((r) => r.id === id);

export const createRoutine = (formData: RoutineFormData): Routine => {
    const routines = getRoutines();
    const newRoutine: Routine = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...routines, newRoutine]));
    return newRoutine;
};

export const updateRoutine = (id: string, formData: Partial<RoutineFormData>): Routine => {
    const routines = getRoutines();
    const updated = routines.map((r) => (r.id === id ? { ...r, ...formData } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((r) => r.id === id)!;
};

export const deleteRoutine = (id: string): void => {
    const routines = getRoutines().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
};