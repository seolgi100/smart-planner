import { create } from 'zustand';
import type { Routine, RoutineFormData } from '../types';
import * as routineService from '../services/routineService';

interface RoutineStore {
    routines: Routine[];
    loadRoutines: () => void;
    addRoutine: (data: RoutineFormData) => void;
    editRoutine: (id: string, data: Partial<RoutineFormData>) => void;
    removeRoutine: (id: string) => void;
    toggleActive: (id: string) => void;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
    routines: [],

    loadRoutines: () => {
        set({ routines: routineService.getRoutines() });
    },

    addRoutine: (data) => {
        const newRoutine = routineService.createRoutine(data);
        set((state) => ({ routines: [...state.routines, newRoutine] }));
    },

    editRoutine: (id, data) => {
        const updated = routineService.updateRoutine(id, data);
        set((state) => ({
            routines: state.routines.map((r) => (r.id === id ? updated : r)),
        }));
    },

    removeRoutine: (id) => {
        routineService.deleteRoutine(id);
        set((state) => ({ routines: state.routines.filter((r) => r.id !== id) }));
    },

    toggleActive: (id) => {
        const routine = get().routines.find((r) => r.id === id);
        if (!routine) return;
        const updated = routineService.updateRoutine(id, { isActive: !routine.isActive });
        set((state) => ({
            routines: state.routines.map((r) => (r.id === id ? updated : r)),
        }));
    },
}));