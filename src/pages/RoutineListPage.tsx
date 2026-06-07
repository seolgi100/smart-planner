import { useState } from 'react';
import { useRoutines } from '../hooks/useRoutines';
import RoutineCard from '../components/routines/RoutineCard';
import RoutineForm from '../components/routines/RoutineForm';
import EmptyState from '../components/common/EmptyState';
import type { Routine, RoutineFormData } from '../types';

type FormMode = { type: 'add' } | { type: 'edit'; routine: Routine } | null;

const RoutineListPage = () => {
    const { routines, addRoutine, editRoutine, removeRoutine, toggleActive } = useRoutines();
    const [formMode, setFormMode] = useState<FormMode>(null);

    const activeRoutines = routines.filter((r) => r.isActive);
    const inactiveRoutines = routines.filter((r) => !r.isActive);

    const handleSubmit = (data: RoutineFormData) => {
        if (formMode?.type === 'edit') {
            editRoutine(formMode.routine.id, data);
        } else {
            addRoutine(data);
        }
        setFormMode(null);
    };

    const handleEdit = (routine: Routine) => {
        setFormMode({ type: 'edit', routine });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">🔁 루틴</h1>
                {!formMode && (
                    <button
                        onClick={() => setFormMode({ type: 'add' })}
                        className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        + 루틴 추가
                    </button>
                )}
            </div>

            {/* 추가/수정 폼 */}
            {formMode && (
                <div className="bg-white rounded-xl border border-indigo-200 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        {formMode.type === 'edit' ? '루틴 수정' : '새 루틴'}
                    </h2>
                    <RoutineForm
                        initialData={formMode.type === 'edit' ? formMode.routine : undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => setFormMode(null)}
                    />
                </div>
            )}

            {/* 목록이 비어 있을 때 */}
            {routines.length === 0 && !formMode && (
                <EmptyState message="아직 루틴이 없습니다. 반복 일정을 추가해보세요!" />
            )}

            {/* 활성 루틴 */}
            {activeRoutines.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                        <h2 className="text-sm font-semibold text-gray-700">활성 루틴</h2>
                        <span className="text-xs text-gray-400">{activeRoutines.length}개</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {activeRoutines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onEdit={handleEdit}
                                onDelete={removeRoutine}
                                onToggleActive={toggleActive}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 비활성 루틴 */}
            {inactiveRoutines.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-5 bg-gray-300 rounded-full" />
                        <h2 className="text-sm font-semibold text-gray-400">비활성 루틴</h2>
                        <span className="text-xs text-gray-300">{inactiveRoutines.length}개</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {inactiveRoutines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onEdit={handleEdit}
                                onDelete={removeRoutine}
                                onToggleActive={toggleActive}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default RoutineListPage;