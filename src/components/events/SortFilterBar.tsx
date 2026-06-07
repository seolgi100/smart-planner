import type { SortOption, EventCategory } from '../../types';

interface Props {
    sortBy: SortOption;
    filterCategory: EventCategory | 'all';
    onSortChange: (sort: SortOption) => void;
    onCategoryChange: (category: EventCategory | 'all') => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'dueDate', label: '날짜순' },
    { value: 'priority', label: '중요도순' },
    { value: 'estimatedHours', label: '소요시간순' },
];

const CATEGORY_OPTIONS: { value: EventCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'exam', label: '시험' },
    { value: 'assignment', label: '과제' },
    { value: 'meeting', label: '약속/미팅' },
    { value: 'project', label: '프로젝트' },
    { value: 'personal', label: '개인' },
    { value: 'other', label: '기타' },
];

const SortFilterBar = ({ sortBy, filterCategory, onSortChange, onCategoryChange }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            {/*정렬*/}
            <div className="flex gap-1 flex-wrap">
                {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => onSortChange(value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sortBy === value
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/*카테고리 필터*/}
            <div className="flex gap-1 flex-wrap">
                {CATEGORY_OPTIONS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => onCategoryChange(value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCategory === value
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SortFilterBar;