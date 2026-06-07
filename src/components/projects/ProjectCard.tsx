import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import { formatDate, isUrgent, isOverdue, getDday } from '../../utils/dateUtils';

interface Props {
    project: Project & { progress: number };
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

const PRIORITY_MAP = {
    high: { label: '높음', className: 'text-red-500' },
    medium: { label: '보통', className: 'text-yellow-500' },
    low: { label: '낮음', className: 'text-gray-400' },
};

const ProjectCard = ({ project, onToggleComplete, onDelete }: Props) => {
    const navigate = useNavigate();
    const urgent = isUrgent(project.dueDate);
    const overdue = isOverdue(project.dueDate, project.isCompleted);
    const dday = getDday(project.dueDate);

    return (
        <div
            className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${project.isCompleted
                    ? 'opacity-50 border-gray-200'
                    : overdue
                        ? 'border-red-300'
                        : urgent
                            ? 'border-orange-300'
                            : 'border-gray-200 hover:border-indigo-300'
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                {/*왼쪽: 체크박스 + 제목*/}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        checked={project.isCompleted}
                        onChange={() => onToggleComplete(project.id)}
                        className="mt-0.5 w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                    />
                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/projects/${project.id}`)}
                    >
                        <p className={`font-medium text-sm truncate ${project.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {project.title}
                        </p>
                        {project.priority && (
                            <span className={`text-xs ${PRIORITY_MAP[project.priority].className}`}>
                                ● {PRIORITY_MAP[project.priority].label}
                            </span>
                        )}
                    </div>
                </div>

                {/*오른쪽: D-day + 삭제*/}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold ${overdue ? 'text-red-500' : urgent ? 'text-orange-500' : 'text-indigo-500'
                        }`}>
                        {overdue ? '마감 지남' : dday}
                    </span>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/*진행률 바*/}
            <div className="mt-3 ml-7">
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
    );
};

export default ProjectCard;