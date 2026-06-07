import type { EventCategory } from '../../types';

interface Props {
    category: EventCategory;
}

const CATEGORY_MAP: Record<EventCategory, { label: string; className: string }> = {
    exam: { label: '시험', className: 'bg-red-100 text-red-700' },
    assignment: { label: '과제', className: 'bg-orange-100 text-orange-700' },
    meeting: { label: '약속/미팅', className: 'bg-blue-100 text-blue-700' },
    project: { label: '프로젝트', className: 'bg-purple-100 text-purple-700' },
    personal: { label: '개인', className: 'bg-green-100 text-green-700' },
    other: { label: '기타', className: 'bg-gray-100 text-gray-600' },
};

const CategoryBadge = ({ category }: Props) => {
    const { label, className } = CATEGORY_MAP[category];
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {label}
        </span>
    );
};

export default CategoryBadge;