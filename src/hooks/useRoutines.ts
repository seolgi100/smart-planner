import { useEffect } from 'react';
import { useRoutineStore } from '../store/routineStore';

export const useRoutines = () => {
    const {
        routines,
        loadRoutines,
        addRoutine,
        editRoutine,
        removeRoutine,
        toggleActive,
    } = useRoutineStore();

    useEffect(() => {
        loadRoutines();
    }, []);

    return { routines, addRoutine, editRoutine, removeRoutine, toggleActive };
};