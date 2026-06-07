import { useNavigate } from 'react-router-dom';
import type { Event } from '../../types';
import CategoryBadge from '../common/CategoryBadge';
import { formatDate, getDday, isUrgent, isOverdue } from '../../utils/dateUtils';

interface Props {
    event: Event;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

const PRIORITY_MAP = {
    high: { label: '높음', className: 'text-red-500' },
    medium: { label: '보통', className: 'text-yellow-500' },
    low: { label: '낮음', className: 'text-gray-400' },
};

const EventCard = ({ event, onToggleComplete, onDelete }: Props) => {
    const navigate = useNavigate();
    const urgent = isUrgent(event.dueDate);
    const overdue = isOverdue(event.dueDate, event.isCompleted);
    const dday = getDday(event.dueDate);

    return (
        <div
            className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${event.isCompleted
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
                        checked={event.isCompleted}
                        onChange={() => onToggleComplete(event.id)}
                        className="mt-0.5 w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                    />
                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/events/${event.id}`)}
                    >
                        <p className={`font-medium text-sm truncate ${event.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <CategoryBadge category={event.category} />
                            {event.priority && (
                                <span className={`text-xs ${PRIORITY_MAP[event.priority].className}`}>
                                    ● {PRIORITY_MAP[event.priority].label}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/*오른쪽: D-day + 삭제*/}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold ${overdue ? 'text-red-500' : urgent ? 'text-orange-500' : 'text-indigo-500'
                        }`}>
                        {overdue ? '마감 지남' : dday}
                    </span>
                    <button
                        onClick={() => onDelete(event.id)}
                        className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/*마감일*/}
            <p className="text-xs text-gray-400 mt-2 ml-7">
                마감 {formatDate(event.dueDate)}
                {event.estimatedHours && ` · 예상 ${event.estimatedHours}시간`}
            </p>
        </div>
    );
};

export default EventCard;