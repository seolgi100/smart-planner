import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import SortFilterBar from '../components/events/SortFilterBar';
import EmptyState from '../components/common/EmptyState';
import type { EventFormData } from '../types';

const EventListPage = () => {
    const {
        events,
        sortBy,
        filterCategory,
        addEvent,
        editEvent,
        removeEvent,
        toggleComplete,
        setSortBy,
        setFilterCategory,
    } = useEvents();

    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (data: EventFormData) => {
        addEvent(data);
        setShowForm(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
            {/*헤더*/}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">📋 전체 일정</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    + 일정 추가
                </button>
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

            {/*정렬/필터*/}
            <SortFilterBar
                sortBy={sortBy}
                filterCategory={filterCategory}
                onSortChange={setSortBy}
                onCategoryChange={setFilterCategory}
            />

            {/*일정 목록*/}
            {events.length === 0 ? (
                <EmptyState message="일정이 없습니다. 새 일정을 추가해보세요!" />
            ) : (
                <div className="flex flex-col gap-2">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onToggleComplete={toggleComplete}
                            onDelete={removeEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventListPage;