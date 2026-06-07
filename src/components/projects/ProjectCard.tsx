import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import { formatDate, isUrgent, isOverdue, getDday } from '../../utils/dateUtils';
import ConfirmDialog from '../common/ConfirmDialog';

interface Props {
    project: Project & { progress: number };
    onDelete?: (id: string) => void;
    selectionMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

const PRIORITY_MAP = {
    high: { label: '높음', className: 'text-red-500' },
    medium: { label: '보통', className: 'text-yellow-500' },
    low: { label: '낮음', className: 'text-gray-400' },
};

const ProjectCard = ({ project, onDelete, selectionMode, isSelected, onSelect }: Props) => {
    const navigate = useNavigate();
    const urgent = isUrgent(project.dueDate);
    const overdue = isOverdue(project.dueDate, project.isCompleted);
    const dday = getDday(project.dueDate);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCardClick = () => {
        if (selectionMode) {
            onSelect?.(project.id);
        } else {
            navigate(`/projects/${project.id}`);
        }
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
                    selectionMode && isSelected
                        ? 'border-indigo-400 bg-indigo-50/50'
                        : project.isCompleted
                        ? 'opacity-50 border-gray-200'
                        : overdue
                        ? 'border-red-300'
                        : urgent
                        ? 'border-orange-300'
                        : 'border-gray-200 hover:border-indigo-300'
                }`}
            >
                <div className="flex items-start justify-between gap-2">
                    {/*왼쪽: 선택 체크박스(선택모드) 또는 완료 상태 표시 + 제목*/}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {selectionMode ? (
                            <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => onSelect?.(project.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5 w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                            />
                        ) : (
                            <span className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                                project.isCompleted ? 'bg-indigo-400 border-indigo-400' : 'border-gray-300'
                            }`} />
                        )}

                        <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${
                                project.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}>
                                {project.title}
                            </p>
                            {project.priority && (
                                <span className={`text-xs ${PRIORITY_MAP[project.priority].className}`}>
                                    ● {PRIORITY_MAP[project.priority].label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/*오른쪽: D-day + 삭제 (선택모드 아닐 때만)*/}
                    {!selectionMode && (
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className={`text-xs font-bold ${
                                overdue ? 'text-red-500' : urgent ? 'text-orange-500' : 'text-indigo-500'
                            }`}>
                                {overdue ? '마감 지남' : dday}
                            </span>
                            {onDelete && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                                    className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    )}

                    {/*선택모드: D-day만 표시*/}
                    {selectionMode && (
                        <span className={`text-xs font-bold flex-shrink-0 ${
                            overdue ? 'text-red-500' : urgent ? 'text-orange-500' : 'text-indigo-500'
                        }`}>
                            {overdue ? '마감 지남' : dday}
                        </span>
                    )}
                </div>

                {/*진행률 바*/}
                <div className="mt-3 ml-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>진행률</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        마감 {formatDate(project.dueDate)}
                    </p>
                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="이 프로젝트를 삭제할까요?"
                    subMessage={`"${project.title}"`}
                    onConfirm={() => { setShowConfirm(false); onDelete!(project.id); }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default ProjectCard;