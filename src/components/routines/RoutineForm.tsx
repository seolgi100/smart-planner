import { useState } from 'react';
import type { Routine, RoutineFormData, RoutineCategory, RepeatType, DaySchedule } from '../../types';
import { WEEKDAY_KO } from './routineUtils';

interface Props {
    initialData?: Routine;
    onSubmit: (data: RoutineFormData) => void;
    onCancel: () => void;
}

const CATEGORIES: { value: RoutineCategory; label: string }[] = [
    { value: 'school',   label: '학교' },
    { value: 'work',     label: '직장' },
    { value: 'parttime', label: '알바' },
    { value: 'exercise', label: '운동' },
    { value: 'other',    label: '기타' },
];

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
    { value: 'daily',   label: '매일' },
    { value: 'weekly',  label: '요일 선택' },
    { value: 'monthly', label: '매월' },
];

const RoutineForm = ({ initialData, onSubmit, onCancel }: Props) => {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [category, setCategory] = useState<RoutineCategory>(initialData?.category ?? 'other');
    const [repeatType, setRepeatType] = useState<RepeatType>(initialData?.repeatType ?? 'daily');
    const [repeatDays, setRepeatDays] = useState<number[]>(initialData?.repeatDays ?? []);
    const [monthDay, setMonthDay] = useState<string>(
        initialData?.repeatType === 'monthly' && initialData.repeatDays.length > 0
            ? String(initialData.repeatDays[0])
            : ''
    );
    // daily/monthly 공통 시간
    const [startTime, setStartTime] = useState(initialData?.startTime ?? '');
    const [endTime, setEndTime] = useState(initialData?.endTime ?? '');
    // weekly 요일별 시간 (키: 0~6)
    const [daySchedules, setDaySchedules] = useState<Record<number, DaySchedule>>(
        initialData?.daySchedules ?? {}
    );
    const [endDate, setEndDate] = useState(initialData?.endDate ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');

    const handleRepeatTypeChange = (type: RepeatType) => {
        setRepeatType(type);
        setRepeatDays([]);
        setMonthDay('');
    };

    const toggleWeekday = (day: number) => {
        setRepeatDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const updateDaySchedule = (day: number, field: 'startTime' | 'endTime', value: string) => {
        setDaySchedules((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }));
    };

    const isValid = (): boolean => {
        if (!title.trim()) return false;
        if (repeatType === 'weekly' && repeatDays.length === 0) return false;
        if (repeatType === 'monthly' && (!monthDay || Number(monthDay) < 1 || Number(monthDay) > 31)) return false;
        return true;
    };

    const handleSubmit = () => {
        if (!isValid()) return;
        const finalRepeatDays = repeatType === 'monthly' ? [Number(monthDay)] : repeatDays;

        const data: RoutineFormData = {
            title: title.trim(),
            category,
            repeatType,
            repeatDays: finalRepeatDays,
            isActive: initialData?.isActive ?? true,
            ...(repeatType !== 'weekly' && startTime && { startTime }),
            ...(repeatType !== 'weekly' && endTime && { endTime }),
            ...(repeatType === 'weekly' && Object.keys(daySchedules).length > 0 && { daySchedules }),
            ...(endDate && { endDate }),
            ...(description.trim() && { description: description.trim() }),
        };

        onSubmit(data);
    };

    const sortedRepeatDays = [...repeatDays].sort((a, b) => a - b);

    return (
        <div className="flex flex-col gap-4">
            {/* 제목 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="루틴 제목"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* 카테고리 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setCategory(value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                category === value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 반복 유형 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">반복</label>
                <div className="flex gap-2">
                    {REPEAT_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => handleRepeatTypeChange(value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                repeatType === value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* 요일 선택 + 요일별 시간 */}
                {repeatType === 'weekly' && (
                    <div className="mt-3 flex flex-col gap-3">
                        {/* 요일 체크박스 */}
                        <div className="flex gap-2">
                            {WEEKDAY_KO.map((day, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleWeekday(idx)}
                                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${
                                        repeatDays.includes(idx)
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        {/* 선택된 요일별 시간 입력 */}
                        {sortedRepeatDays.length > 0 && (
                            <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 font-medium mb-1">요일별 시간 설정 <span className="text-gray-400">(선택)</span></p>
                                {sortedRepeatDays.map((day) => (
                                    <div key={day} className="flex items-center gap-2">
                                        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 bg-indigo-600 text-white`}>
                                            {WEEKDAY_KO[day]}
                                        </span>
                                        <input
                                            type="time"
                                            value={daySchedules[day]?.startTime ?? ''}
                                            onChange={(e) => updateDaySchedule(day, 'startTime', e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <span className="text-gray-400 text-sm flex-shrink-0">~</span>
                                        <input
                                            type="time"
                                            value={daySchedules[day]?.endTime ?? ''}
                                            onChange={(e) => updateDaySchedule(day, 'endTime', e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 매월 날짜 */}
                {repeatType === 'monthly' && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-600">매월</span>
                        <input
                            type="number"
                            min={1}
                            max={31}
                            value={monthDay}
                            onChange={(e) => setMonthDay(e.target.value)}
                            placeholder="일"
                            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <span className="text-sm text-gray-600">일</span>
                    </div>
                )}
            </div>

            {/* 시간 (daily/monthly 전용) */}
            {repeatType !== 'weekly' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        시간 <span className="text-gray-400 text-xs">(선택)</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <span className="text-gray-400 text-sm">~</span>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>
            )}

            {/* 종료일 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일 <span className="text-gray-400 text-xs">(선택 · 이 날 이후엔 캘린더에 표시 안 됨)</span>
                </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {endDate && (
                    <button
                        onClick={() => setEndDate('')}
                        className="mt-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                        종료일 제거
                    </button>
                )}
            </div>

            {/* 메모 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    메모 <span className="text-gray-400 text-xs">(선택)</span>
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="추가 메모"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isValid()}
                    className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {initialData ? '수정' : '저장'}
                </button>
            </div>
        </div>
    );
};

export default RoutineForm;