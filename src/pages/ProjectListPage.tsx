import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { ProjectFormData } from '../types';

const PRIORITY_OPTIONS = [
    { value: 'high' as const, label: '높음' },
    { value: 'medium' as const, label: '보통' },
    { value: 'low' as const, label: '낮음' },
];

const ProjectListPage = () => {
    const { projects, addProject, removeProject, bulkMarkComplete, bulkRemove } = useProjects();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low' | ''>('');

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

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

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === projects.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(projects.map((p) => p.id)));
        }
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedIds(new Set());
    };

    const handleBulkComplete = () => {
        bulkMarkComplete(Array.from(selectedIds));
        exitSelectionMode();
    };

    const handleBulkDelete = () => {
        bulkRemove(Array.from(selectedIds));
        setShowBulkDeleteConfirm(false);
        exitSelectionMode();
    };

    const allSelected = projects.length > 0 && selectedIds.size === projects.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*헤더*/}
            <div className="flex items-center justify-between">
                {selectionMode ? (
                    <>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 accent-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {selectedIds.size > 0 ? `${selectedIds.size}개 선택됨` : '전체 선택'}
                            </span>
                        </label>
                        <button
                            onClick={exitSelectionMode}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font-bold text-gray-900">🗂️ 프로젝트</h1>
                        <div className="flex gap-2">
                            {projects.length > 0 && (
                                <button
                                    onClick={() => setSelectionMode(true)}
                                    className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    선택
                                </button>
                            )}
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                + 프로젝트 추가
                            </button>
                        </div>
                    </>
                )}
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
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                        priority === value
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
                            onDelete={!selectionMode ? removeProject : undefined}
                            selectionMode={selectionMode}
                            isSelected={selectedIds.has(project.id)}
                            onSelect={toggleSelect}
                        />
                    ))}
                </div>
            )}

            {/*하단 액션바 (선택모드 + 1개 이상 선택 시)*/}
            {selectionMode && selectedIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex gap-3 justify-center z-40">
                    <button
                        onClick={handleBulkComplete}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        모두 완료 ({selectedIds.size}개)
                    </button>
                    <button
                        onClick={() => setShowBulkDeleteConfirm(true)}
                        className="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
                    >
                        모두 삭제 ({selectedIds.size}개)
                    </button>
                </div>
            )}

            {/*하단 액션바 공간 확보*/}
            {selectionMode && selectedIds.size > 0 && <div className="h-16" />}

            {showBulkDeleteConfirm && (
                <ConfirmDialog
                    message={`프로젝트 ${selectedIds.size}개를 삭제할까요?`}
                    subMessage="삭제된 프로젝트는 복구할 수 없습니다."
                    onConfirm={handleBulkDelete}
                    onCancel={() => setShowBulkDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProjectListPage;
