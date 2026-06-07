import { create } from 'zustand';
import type { Project, ProjectFormData } from '../types';
import * as projectService from '../services/projectService';

interface ProjectStore {
    projects: Project[];
    loadProjects: () => void;
    addProject: (formData: ProjectFormData) => void;
    editProject: (id: string, formData: Partial<ProjectFormData>) => void;
    removeProject: (id: string) => void;
    toggleComplete: (id: string) => void;
    bulkMarkComplete: (ids: string[]) => void;
    bulkRemove: (ids: string[]) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],

    loadProjects: () => {
        const projects = projectService.getProjects();
        set({ projects });
    },

    addProject: (formData) => {
        const newProject = projectService.createProject(formData);
        set((state) => ({ projects: [...state.projects, newProject] }));
    },

    editProject: (id, formData) => {
        const updated = projectService.updateProject(id, formData);
        set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? updated : p)),
        }));
    },

    removeProject: (id) => {
        projectService.deleteProject(id);
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        }));
    },

    toggleComplete: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const updated = projectService.updateProject(id, { isCompleted: !project.isCompleted });
        set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? updated : p)),
        }));
    },

    bulkMarkComplete: (ids) => {
        const idsSet = new Set(ids);
        const updates: Project[] = [];
        get().projects.forEach((p) => {
            if (idsSet.has(p.id) && !p.isCompleted) {
                updates.push(projectService.updateProject(p.id, { isCompleted: true }));
            }
        });
        if (updates.length === 0) return;
        const updatedMap = new Map(updates.map((p) => [p.id, p]));
        set((state) => ({
            projects: state.projects.map((p) => updatedMap.get(p.id) ?? p),
        }));
    },

    bulkRemove: (ids) => {
        const idsSet = new Set(ids);
        ids.forEach((id) => projectService.deleteProject(id));
        set((state) => ({
            projects: state.projects.filter((p) => !idsSet.has(p.id)),
        }));
    },
}));