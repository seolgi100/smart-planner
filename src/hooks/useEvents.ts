import { useEffect, useMemo } from 'react';
import { useEventStore } from '../store/eventStore';

//useEffect: 컴포넌트 마운트 시 localStorage에서 데이터 자동 로드
//useMemo: 정렬/필터 결과를 메모이제이션해서 불필요한 재계산 방지
export const useEvents = () => {
    const {
        events,
        sortBy,
        filterCategory,
        loadEvents,
        addEvent,
        editEvent,
        removeEvent,
        toggleComplete,
        bulkMarkComplete,
        bulkRemove,
        setSortBy,
        setFilterCategory,
    } = useEventStore();

    useEffect(() => {
        loadEvents();
    }, []);

    const filteredAndSorted = useMemo(() => {
        let result = [...events];

        //카테고리 필터
        if (filterCategory !== 'all') {
            result = result.filter((e) => e.category === filterCategory);
        }

        //정렬
        result.sort((a, b) => {
            if (sortBy === 'dueDate') {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (sortBy === 'priority') {
                const order = { high: 0, medium: 1, low: 2 };
                return (order[a.priority ?? 'low']) - (order[b.priority ?? 'low']);
            }
            if (sortBy === 'estimatedHours') {
                return (b.estimatedHours ?? 0) - (a.estimatedHours ?? 0);
            }
            return 0;
        });

        return result;
    }, [events, sortBy, filterCategory]);

    return {
        events: filteredAndSorted,
        sortBy,
        filterCategory,
        addEvent,
        editEvent,
        removeEvent,
        toggleComplete,
        bulkMarkComplete,
        bulkRemove,
        setSortBy,
        setFilterCategory,
    };
};