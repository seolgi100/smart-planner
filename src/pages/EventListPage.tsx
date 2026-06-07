import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import SortFilterBar from '../components/events/SortFilterBar';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { EventFormData } from '../types';

const EventListPage = () => {
    const {
        events,
        sortBy,
        filterCategory,
        addEvent,
        removeEvent,
        bulkMarkComplete,
        bulkRemove,
        setSortBy,
        setFilterCategory,
    } = useEvents();

    const [showForm, setShowForm] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

    const handleSubmit = (data: EventFormData) => {
        addEvent(data);
        setShowForm(false);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === events.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(events.map((e) => e.id)));
        }
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedIds(new Set());
    };

    const handleBulkComplete = () => {
        bulkMarkComplete(Array.from(selectedIds));
        exitSelectionMode();
    };

    const handleBulkDelete = () => {
        bulkRemove(Array.from(selectedIds));
        setShowBulkDeleteConfirm(false);
        exitSelectionMode();
    };

    const allSelected = events.length > 0 && selectedIds.size === events.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*헤더*/}
            <div className="flex items-center justify-between">
                {selectionMode ? (
                    <>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 accent-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {selectedIds.size > 0 ? `${selectedIds.size}개 선택됨` : '전체 선택'}
                            </span>
                        </label>
                        <button
                            onClick={exitSelectionMode}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font-bold text-gray-900">📋 전체 일정</h1>
                        <div className="flex gap-2">
                            {events.length > 0 && (
                                <button
                                    onClick={() => setSelectionMode(true)}
                                    className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    선택
                                </button>
                            )}
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                + 일정 추가
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/*일정 추가 폼*/}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">새 일정</h2>
                    <EventForm
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/*정렬/필터 (선택모드 아닐 때만)*/}
            {!selectionMode && (
                <SortFilterBar
                    sortBy={sortBy}
                    filterCategory={filterCategory}
                    onSortChange={setSortBy}
                    onCategoryChange={setFilterCategory}
                />
            )}

            {/*일정 목록*/}
            {events.length === 0 ? (
                <EmptyState message="일정이 없습니다. 새 일정을 추가해보세요!" />
            ) : (
                <div className="flex flex-col gap-2">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onDelete={!selectionMode ? removeEvent : undefined}
                            selectionMode={selectionMode}
                            isSelected={selectedIds.has(event.id)}
                            onSelect={toggleSelect}
                        />
                    ))}
                </div>
            )}

            {/*하단 액션바 (선택모드 + 1개 이상 선택 시)*/}
            {selectionMode && selectedIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex gap-3 justify-center z-40">
                    <button
                        onClick={handleBulkComplete}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        모두 완료 ({selectedIds.size}개)
                    </button>
                    <button
                        onClick={() => setShowBulkDeleteConfirm(true)}
                        className="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
                    >
                        모두 삭제 ({selectedIds.size}개)
                    </button>
                </div>
            )}

            {/*하단 액션바 공간 확보*/}
            {selectionMode && selectedIds.size > 0 && <div className="h-16" />}

            {showBulkDeleteConfirm && (
                <ConfirmDialog
                    message={`일정 ${selectedIds.size}개를 삭제할까요?`}
                    subMessage="삭제된 일정은 복구할 수 없습니다."
                    onConfirm={handleBulkDelete}
                    onCancel={() => setShowBulkDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default EventListPage;