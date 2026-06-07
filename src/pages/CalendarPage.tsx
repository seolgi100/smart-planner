import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameDay,
    isSameMonth,
    isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEventStore } from '../store/eventStore';
import type { Event } from '../types';
import { isOverdue, isUrgent, formatDate } from '../utils/dateUtils';
import CategoryBadge from '../components/common/CategoryBadge';
import EmptyState from '../components/common/EmptyState';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const eventColor = (event: Event): string => {
    if (event.isCompleted) return 'bg-gray-300';
    if (isOverdue(event.dueDate, event.isCompleted)) return 'bg-red-400';
    if (isUrgent(event.dueDate)) return 'bg-orange-400';
    return 'bg-indigo-400';
};

const CalendarPage = () => {
    const navigate = useNavigate();
    const { events, loadEvents } = useEventStore();

    useEffect(() => { loadEvents(); }, []);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // 캘린더 그리드: 월 첫날 전 주 일요일 ~ 월 마지막날 다음 주 토요일
    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const getEventsForDay = (day: Date): Event[] =>
        events.filter((e) => isSameDay(new Date(e.dueDate), day));

    const selectedDayEvents = useMemo(
        () => getEventsForDay(selectedDate),
        [selectedDate, events],
    );

    const goToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        setSelectedDate(today);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">📅 캘린더</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToday}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        오늘
                    </button>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors text-lg"
                        >
                            ‹
                        </button>
                        <span className="w-28 text-center text-sm font-semibold text-gray-800">
                            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                        </span>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors text-lg"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            {/* 캘린더 그리드 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                    {WEEKDAYS.map((day, i) => (
                        <div
                            key={day}
                            className={`py-3 text-center text-xs font-semibold tracking-wide ${
                                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 셀 */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDay(day);
                        const inMonth = isSameMonth(day, currentMonth);
                        const selected = isSameDay(day, selectedDate);
                        const today = isToday(day);
                        const isLastRow = idx >= calendarDays.length - 7;
                        const col = idx % 7;

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={`min-h-[72px] p-2 text-left transition-colors ${
                                    !isLastRow ? 'border-b' : ''
                                } ${col < 6 ? 'border-r' : ''} border-gray-100 ${
                                    selected
                                        ? 'bg-indigo-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <span
                                    className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-medium ${
                                        today
                                            ? 'bg-indigo-600 text-white'
                                            : selected
                                            ? 'text-indigo-600 font-bold'
                                            : !inMonth
                                            ? 'text-gray-300'
                                            : col === 0
                                            ? 'text-red-400'
                                            : col === 6
                                            ? 'text-blue-400'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {format(day, 'd')}
                                </span>

                                {/* 이벤트 인디케이터 */}
                                <div className="mt-1 flex flex-col gap-px">
                                    {dayEvents.slice(0, 2).map((e) => (
                                        <div
                                            key={e.id}
                                            className={`h-1.5 rounded-full ${eventColor(e)} ${!inMonth ? 'opacity-40' : ''}`}
                                        />
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                                            +{dayEvents.length - 2}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 인디케이터 범례 */}
            <div className="flex gap-4 px-1">
                {[
                    { color: 'bg-indigo-400', label: '일정' },
                    { color: 'bg-orange-400', label: '임박' },
                    { color: 'bg-red-400', label: '마감 지남' },
                    { color: 'bg-gray-300', label: '완료' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-1.5 rounded-full ${color}`} />
                        <span className="text-xs text-gray-400">{label}</span>
                    </div>
                ))}
            </div>

            {/* 선택된 날짜 일정 */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                    <h2 className="text-base font-semibold text-gray-800">
                        {format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
                    </h2>
                    <span className="text-xs text-gray-400 ml-1">
                        {selectedDayEvents.length > 0
                            ? `${selectedDayEvents.length}개`
                            : '일정 없음'}
                    </span>
                </div>

                {selectedDayEvents.length === 0 ? (
                    <EmptyState message="이 날에 일정이 없습니다." />
                ) : (
                    <div className="flex flex-col gap-2">
                        {selectedDayEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all hover:border-indigo-300 ${
                                    event.isCompleted
                                        ? 'opacity-50 border-gray-200'
                                        : isOverdue(event.dueDate, event.isCompleted)
                                        ? 'border-red-300'
                                        : isUrgent(event.dueDate)
                                        ? 'border-orange-300'
                                        : 'border-gray-200'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span
                                            className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                                                event.isCompleted
                                                    ? 'bg-indigo-400 border-indigo-400'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={`font-medium text-sm truncate ${
                                                    event.isCompleted
                                                        ? 'line-through text-gray-400'
                                                        : 'text-gray-800'
                                                }`}
                                            >
                                                {event.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <CategoryBadge category={event.category} />
                                                {event.estimatedHours && (
                                                    <span className="text-xs text-gray-400">
                                                        {event.estimatedHours}시간
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs font-bold flex-shrink-0 ${
                                            isOverdue(event.dueDate, event.isCompleted)
                                                ? 'text-red-500'
                                                : isUrgent(event.dueDate)
                                                ? 'text-orange-500'
                                                : 'text-indigo-500'
                                        }`}
                                    >
                                        {event.isCompleted
                                            ? '완료'
                                            : isOverdue(event.dueDate, event.isCompleted)
                                            ? '마감 지남'
                                            : '마감 ' + formatDate(event.dueDate)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CalendarPage;