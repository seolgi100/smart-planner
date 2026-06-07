import type { Project, ProjectFormData } from '../types';

const STORAGE_KEY = 'smart-planner-projects';

export const getProjects = (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const getProjectById = (id: string): Project | undefined => {
    return getProjects().find((p) => p.id === id);
};

export const createProject = (formData: ProjectFormData): Project => {
    const projects = getProjects();
    const newProject: Project = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...projects, newProject]));
    return newProject;
};

export const updateProject = (id: string, formData: Partial<ProjectFormData>): Project => {
    const projects = getProjects();
    const updated = projects.map((p) =>
        p.id === id ? { ...p, ...formData } : p
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((p) => p.id === id)!;
};

export const deleteProject = (id: string): void => {
    const projects = getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};