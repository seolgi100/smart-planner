import { differenceInCalendarDays, format, isToday, isTomorrow, isPast } from 'date-fns';
import { ko } from 'date-fns/locale';

//날짜를 "2025년 6월 7일" 형식으로 포맷
export const formatDate = (dateStr: string): string => {
    return format(new Date(dateStr), 'yyyy년 M월 d일', { locale: ko });
};

//D-day 계산 (오늘 기준)
export const getDday = (dueDateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    if (isToday(due)) return 'D-DAY';
    if (isTomorrow(due)) return 'D-1';

    const diff = differenceInCalendarDays(due, today);
    if (diff < 0) return `D+${Math.abs(diff)}`;
    return `D-${diff}`;
};

//마감 임박 여부 (3일 이내)
export const isUrgent = (dueDateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const diff = differenceInCalendarDays(due, today);
    return diff >= 0 && diff <= 3;
};

//마감 지났는지 여부
export const isOverdue = (dueDateStr: string, isCompleted: boolean): boolean => {
    if (isCompleted) return false;
    const due = new Date(dueDateStr);
    due.setHours(23, 59, 59, 999);
    return isPast(due);
};

//예상 소요 시간 표시 (예: 1.5 → "1시간 30분")
export const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}분`;
    if (m === 0) return `${h}시간`;
    return `${h}시간 ${m}분`;
};