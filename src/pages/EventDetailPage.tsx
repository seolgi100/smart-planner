import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import EventForm from '../components/events/EventForm';
import CategoryBadge from '../components/common/CategoryBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDate, getDday, formatHours, isOverdue } from '../utils/dateUtils';
import type { EventFormData } from '../types';

const EventDetailPage = () => {
    //useParams: URL의 id 파라미터로 해당 일정 조회
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { events, editEvent, removeEvent } = useEvents();

    const event = events.find((e) => e.id === id);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    if (!event) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6 text-center">
                <p className="text-gray-400 text-sm">일정을 찾을 수 없습니다.</p>
                <button
                    onClick={() => navigate('/events')}
                    className="mt-4 text-indigo-500 text-sm hover:underline"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const overdue = isOverdue(event.dueDate, event.isCompleted);
    const dday = getDday(event.dueDate);

    const handleEdit = (data: EventFormData) => {
        editEvent(event.id, data);
        setIsEditing(false);
    };

    const handleDelete = () => {
        removeEvent(event.id);
        navigate('/events');
    };

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-xl font-bold text-gray-900 mb-4">일정 수정</h1>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <EventForm
                        initialData={event}
                        onSubmit={handleEdit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*뒤로가기*/}
            <button
                onClick={() => navigate('/events')}
                className="text-sm text-gray-400 hover:text-gray-600 w-fit"
            >
                ← 목록으로
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                {/*제목 + 배지*/}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h1 className={`text-lg font-bold ${event.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-2">
                            <CategoryBadge category={event.category} />
                            <span className={`text-xs font-bold ${overdue ? 'text-red-500' : 'text-indigo-500'}`}>
                                {overdue ? '마감 지남' : dday}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
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
                </div>

                {/*상세 정보*/}
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                    {event.startDate && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">시작일</span>
                            <span>{formatDate(event.startDate)}</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-20 flex-shrink-0">마감일</span>
                        <span>{formatDate(event.dueDate)}</span>
                    </div>
                    {event.estimatedHours && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">예상 시간</span>
                            <span>{formatHours(event.estimatedHours)}</span>
                        </div>
                    )}
                    {event.location && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">장소</span>
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.priority && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 w-20 flex-shrink-0">중요도</span>
                            <span>{{ high: '높음', medium: '보통', low: '낮음' }[event.priority]}</span>
                        </div>
                    )}
                </div>

                {/*설명*/}
                {event.description && (
                    <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400 mb-1">상세 설명</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                {/*메모*/}
                {event.memo && (
                    <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400 mb-1">메모</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.memo}</p>
                    </div>
                )}

                {/*준비물*/}
                {event.materials && event.materials.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400 mb-2">준비물</p>
                        <div className="flex flex-wrap gap-1">
                            {event.materials.map((m, i) => (
                                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="이 일정을 삭제할까요?"
                    subMessage={`"${event.title}"`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default EventDetailPage;