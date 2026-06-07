import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectProgress from '../components/projects/ProjectProgress';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDate, getDday, isOverdue } from '../utils/dateUtils';
import type { ProjectTask } from '../types';

const ProjectDetailPage = () => {
    //useParams: URL의 id 파라미터로 해당 프로젝트 조회
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, editProject, removeProject } = useProjects();

    const project = projects.find((p) => p.id === id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    if (!project) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6 text-center">
                <p className="text-gray-400 text-sm">프로젝트를 찾을 수 없습니다.</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="mt-4 text-indigo-500 text-sm hover:underline"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const overdue = isOverdue(project.dueDate, project.isCompleted);
    const dday = getDday(project.dueDate);

    const handleToggleTask = (taskId: string) => {
        const updatedTasks = project.tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        editProject(project.id, { tasks: updatedTasks });
    };

    const handleAddTask = (title: string) => {
        const newTask: ProjectTask = {
            id: crypto.randomUUID(),
            title,
            isCompleted: false,
        };
        editProject(project.id, { tasks: [...project.tasks, newTask] });
    };

    const handleDeleteTask = (taskId: string) => {
        const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
        editProject(project.id, { tasks: updatedTasks });
    };

    const handleDelete = () => {
        removeProject(project.id);
        navigate('/projects');
    };

    const handleTitleSave = () => {
        if (!editTitle.trim()) return;
        editProject(project.id, { title: editTitle.trim() });
        setIsEditingTitle(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*뒤로가기*/}
            <button
                onClick={() => navigate('/projects')}
                className="text-sm text-gray-400 hover:text-gray-600 w-fit"
            >
                ← 목록으로
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-5">
                {/*제목*/}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        {isEditingTitle ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    autoFocus
                                />
                                <button
                                    onClick={handleTitleSave}
                                    className="px-3 py-1.5 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={() => setIsEditingTitle(false)}
                                    className="px-3 py-1.5 border border-gray-300 text-xs rounded-lg hover:bg-gray-50"
                                >
                                    취소
                                </button>
                            </div>
                        ) : (
                            <h1 className={`text-lg font-bold ${project.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {project.title}
                            </h1>
                        )}
                        <span className={`text-xs font-bold w-fit ${overdue ? 'text-red-500' : 'text-indigo-500'}`}>
                            {overdue ? '마감 지남' : dday}
                        </span>
                    </div>

                    {!isEditingTitle && (
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => { setEditTitle(project.title); setIsEditingTitle(true); }}
                                className="text-xs text-indigo-500 hover:underline"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="text-xs text-red-400 hover:underline"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>

                {/*상세 정보*/}
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-20 flex-shrink-0">마감일</span>
                        <span>{formatDate(project.dueDate)}</span>
                    </div>
                    {project.priority && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">중요도</span>
                            <span>{{ high: '높음', medium: '보통', low: '낮음' }[project.priority]}</span>
                        </div>
                    )}
                    {project.description && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">설명</span>
                            <span className="whitespace-pre-wrap">{project.description}</span>
                        </div>
                    )}
                </div>

                {/*태스크 진행률*/}
                <div className="border-t border-gray-100 pt-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">할 일 목록</h2>
                    <ProjectProgress
                        tasks={project.tasks}
                        onToggleTask={handleToggleTask}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                    />
                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="이 프로젝트를 삭제할까요?"
                    subMessage={`"${project.title}"`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProjectDetailPage;