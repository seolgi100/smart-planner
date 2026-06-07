import { useEffect, useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';

export const useProjects = () => {
    const {
        projects,
        loadProjects,
        addProject,
        editProject,
        removeProject,
        toggleComplete,
        bulkMarkComplete,
        bulkRemove,
    } = useProjectStore();

    useEffect(() => {
        loadProjects();
    }, []);

    //진행률 계산 포함한 프로젝트 목록
    const projectsWithProgress = useMemo(() => {
        return projects.map((p) => {
            const total = p.tasks.length;
            const completed = p.tasks.filter((t) => t.isCompleted).length;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
            return { ...p, progress };
        });
    }, [projects]);

    return {
        projects: projectsWithProgress,
        addProject,
        editProject,
        removeProject,
        toggleComplete,
        bulkMarkComplete,
        bulkRemove,
    };
};