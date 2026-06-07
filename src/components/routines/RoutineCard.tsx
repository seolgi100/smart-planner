import { useState } from 'react';
import type { Routine } from '../../types';
import { CATEGORY_CONFIG, getRepeatLabel, getDaySchedule, formatTimeRange, WEEKDAY_KO } from './routineUtils';
import ConfirmDialog from '../common/ConfirmDialog';

interface Props {
    routine: Routine;
    onEdit: (routine: Routine) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
}

const RoutineCard = ({ routine, onEdit, onDelete, onToggleActive }: Props) => {
    const cat = CATEGORY_CONFIG[routine.category];
    const [showConfirm, setShowConfirm] = useState(false);

    const weeklyTimeRows: { day: number; timeStr: string }[] = [];
    if (routine.repeatType === 'weekly' && routine.daySchedules) {
        const sorted = [...routine.repeatDays].sort((a, b) => a - b);
        sorted.forEach((day) => {
            const sched = getDaySchedule(routine, day);
            const timeStr = formatTimeRange(sched);
            if (timeStr) weeklyTimeRows.push({ day, timeStr });
        });
    }

    const hasCommonTime = routine.repeatType !== 'weekly' && routine.startTime;

    return (
        <>
            <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${
                routine.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}>
                <div className="flex items-start justify-between gap-3">
                    {/* 왼쪽: 카테고리 + 제목 + 반복 정보 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.badgeCls}`}>
                                {cat.label}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                {getRepeatLabel(routine)}
                            </span>
                            {hasCommonTime && (
                                <span className="text-xs text-gray-400">
                                    {routine.startTime}
                                    {routine.endTime && ` ~ ${routine.endTime}`}
                                </span>
                            )}
                            {routine.endDate && (
                                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                    ~{routine.endDate} 종료
                                </span>
                            )}
                        </div>
                        <p className={`font-semibold text-sm ${routine.isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                            {routine.title}
                        </p>
                        {weeklyTimeRows.length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                {weeklyTimeRows.map(({ day, timeStr }) => (
                                    <span key={day} className="text-xs text-gray-400">
                                        <span className="font-medium text-indigo-400">{WEEKDAY_KO[day]}</span>
                                        {' '}{timeStr}
                                    </span>
                                ))}
                            </div>
                        )}
                        {routine.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{routine.description}</p>
                        )}
                    </div>

                    {/* 오른쪽: 활성 토글 + 수정/삭제 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => onToggleActive(routine.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                routine.isActive ? 'bg-indigo-500' : 'bg-gray-200'
                            }`}
                            title={routine.isActive ? '비활성화' : '활성화'}
                        >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                routine.isActive ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                        </button>
                        <button
                            onClick={() => onEdit(routine)}
                            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    message="이 루틴을 삭제할까요?"
                    subMessage={`"${routine.title}" 루틴이 영구적으로 삭제됩니다.`}
                    onConfirm={() => { setShowConfirm(false); onDelete(routine.id); }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default RoutineCard;