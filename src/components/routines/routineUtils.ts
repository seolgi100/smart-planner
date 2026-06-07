import type { Routine, RoutineCategory, DaySchedule } from '../../types';

export const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

export const CATEGORY_CONFIG: Record<RoutineCategory, { label: string; badgeCls: string; dotCls: string }> = {
    school:   { label: '학교',   badgeCls: 'bg-indigo-100 text-indigo-700', dotCls: 'bg-indigo-400' },
    work:     { label: '직장',   badgeCls: 'bg-blue-100 text-blue-700',     dotCls: 'bg-blue-400'   },
    parttime: { label: '알바',   badgeCls: 'bg-amber-100 text-amber-700',   dotCls: 'bg-amber-400'  },
    exercise: { label: '운동',   badgeCls: 'bg-green-100 text-green-700',   dotCls: 'bg-green-400'  },
    other:    { label: '기타',   badgeCls: 'bg-gray-100 text-gray-600',     dotCls: 'bg-gray-400'   },
};

export const getRepeatLabel = (routine: Pick<Routine, 'repeatType' | 'repeatDays'>): string => {
    switch (routine.repeatType) {
        case 'daily':
            return '매일';
        case 'weekly':
            if (routine.repeatDays.length === 0) return '요일 미설정';
            return [...routine.repeatDays].sort((a, b) => a - b).map((d) => WEEKDAY_KO[d]).join('·') + '요일';
        case 'monthly':
            if (routine.repeatDays.length === 0) return '날짜 미설정';
            return `매월 ${routine.repeatDays[0]}일`;
    }
};

// 특정 요일(weekday 0~6)의 시간 반환. weekly는 daySchedules 우선, daily/monthly는 공통 startTime/endTime 사용
export const getDaySchedule = (routine: Routine, weekday: number): DaySchedule => {
    if (routine.repeatType === 'weekly' && routine.daySchedules?.[weekday]) {
        return routine.daySchedules[weekday];
    }
    return { startTime: routine.startTime, endTime: routine.endTime };
};

export const formatTimeRange = (schedule: DaySchedule): string => {
    if (!schedule.startTime) return '';
    return schedule.endTime ? `${schedule.startTime}~${schedule.endTime}` : schedule.startTime;
};

export const isRoutineOnDay = (routine: Routine, day: Date): boolean => {
    if (!routine.isActive) return false;
    if (routine.endDate) {
        const end = new Date(routine.endDate);
        end.setHours(23, 59, 59, 999);
        if (day > end) return false;
    }
    switch (routine.repeatType) {
        case 'daily':
            return true;
        case 'weekly':
            return routine.repeatDays.includes(day.getDay());
        case 'monthly':
            return routine.repeatDays.includes(day.getDate());
    }
};