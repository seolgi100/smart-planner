import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../../types';
import CategoryBadge from '../common/CategoryBadge';
import { formatDate, getDday, isUrgent, isOverdue } from '../../utils/dateUtils';
import ConfirmDialog from '../common/ConfirmDialog';

interface Props {
    event: Event;
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

const EventCard = ({ event, onDelete, selectionMode, isSelected, onSelect }: Props) => {
    const navigate = useNavigate();
    const urgent = isUrgent(event.dueDate);
    const overdue = isOverdue(event.dueDate, event.isCompleted);
    const dday = getDday(event.dueDate);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCardClick = () => {
        if (selectionMode) {
            onSelect?.(event.id);
        } else {
            navigate(`/events/${event.id}`);
        }
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
                    selectionMode && isSelected
                        ? 'border-indigo-400 bg-indigo-50/50'
                        : event.isCompleted
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
                                onChange={() => onSelect?.(event.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5 w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                            />
                        ) : (
                            <span className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                                event.isCompleted ? 'bg-indigo-400 border-indigo-400' : 'border-gray-300'
                            }`} />
                        )}

                        <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${
                                event.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}>
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

                {/*마감일*/}
                <p className="text-xs text-gray-400 mt-2 ml-6">
                    마감 {formatDate(event.dueDate)}
                    {event.estimatedHours && ` · 예상 ${event.estimatedHours}시간`}
                </p>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="이 일정을 삭제할까요?"
                    subMessage={`"${event.title}"`}
                    onConfirm={() => { setShowConfirm(false); onDelete!(event.id); }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default EventCard;