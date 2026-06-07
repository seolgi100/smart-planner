import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import type { ProjectFormData } from '../types';

const PRIORITY_OPTIONS = [
    { value: 'high' as const, label: '높음' },
    { value: 'medium' as const, label: '보통' },
    { value: 'low' as const, label: '낮음' },
];

const ProjectListPage = () => {
    const { projects, addProject, removeProject, toggleComplete } = useProjects();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low' | ''>('');

    const handleSubmit = () => {
        if (!title.trim() || !dueDate) return;
        const formData: ProjectFormData = {
            title: title.trim(),
            dueDate,
            tasks: [],
            isCompleted: false,
            ...(description.trim() && { description: description.trim() }),
            ...(priority && { priority }),
        };
        addProject(formData);
        setTitle('');
        setDueDate('');
        setDescription('');
        setPriority('');
        setShowForm(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*헤더*/}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">🗂️ 프로젝트</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    + 프로젝트 추가
                </button>
            </div>

            {/*프로젝트 추가 폼*/}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-gray-700">새 프로젝트</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="프로젝트 제목"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            마감일 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            설명 <span className="text-gray-400 text-xs">(선택)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="프로젝트 설명"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            중요도 <span className="text-gray-400 text-xs">(선택)</span>
                        </label>
                        <div className="flex gap-2">
                            {PRIORITY_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setPriority(priority === value ? '' : value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${priority === value
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={() => setShowForm(false)}
                            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!title.trim() || !dueDate}
                            className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            저장
                        </button>
                    </div>
                </div>
            )}

            {/*프로젝트 목록*/}
            {projects.length === 0 ? (
                <EmptyState message="프로젝트가 없습니다. 새 프로젝트를 추가해보세요!" />
            ) : (
                <div className="flex flex-col gap-2">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onToggleComplete={toggleComplete}
                            onDelete={removeProject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectListPage;