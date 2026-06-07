import { useState } from 'react';
import type { EventFormData, EventCategory, Priority } from '../../types';

interface Props {
    initialData?: Partial<EventFormData>;
    onSubmit: (data: EventFormData) => void;
    onCancel: () => void;
}

const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
    { value: 'exam', label: '시험' },
    { value: 'assignment', label: '과제' },
    { value: 'meeting', label: '약속/미팅' },
    { value: 'project', label: '프로젝트' },
    { value: 'personal', label: '개인' },
    { value: 'other', label: '기타' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
    { value: 'high', label: '높음' },
    { value: 'medium', label: '보통' },
    { value: 'low', label: '낮음' },
];

const EventForm = ({ initialData, onSubmit, onCancel }: Props) => {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [category, setCategory] = useState<EventCategory>(initialData?.category ?? 'other');
    const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
    const [startDate, setStartDate] = useState(initialData?.startDate ?? '');
    const [priority, setPriority] = useState<Priority | ''>(initialData?.priority ?? '');
    const [estimatedHours, setEstimatedHours] = useState(initialData?.estimatedHours?.toString() ?? '');
    const [location, setLocation] = useState(initialData?.location ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [memo, setMemo] = useState(initialData?.memo ?? '');
    const [materials, setMaterials] = useState(initialData?.materials?.join(', ') ?? '');

    const handleSubmit = () => {
        if (!title.trim() || !dueDate) return;

        const formData: EventFormData = {
            title: title.trim(),
            category,
            dueDate,
            isCompleted: initialData?.isCompleted ?? false,
            ...(startDate && { startDate }),
            ...(priority && { priority }),
            ...(estimatedHours && { estimatedHours: parseFloat(estimatedHours) }),
            ...(location.trim() && { location: location.trim() }),
            ...(description.trim() && { description: description.trim() }),
            ...(memo.trim() && { memo: memo.trim() }),
            ...(materials.trim() && {
                materials: materials.split(',').map((m) => m.trim()).filter(Boolean),
            }),
        };

        onSubmit(formData);
    };

    return (
        <div className="flex flex-col gap-4">
            {/*제목 - 필수*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="일정 제목을 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/*카테고리 - 필수*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setCategory(value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/*날짜*/}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        시작일 <span className="text-gray-400 text-xs">(선택)</span>
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        마감일 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
            </div>

            {/*중요도*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    중요도 <span className="text-gray-400 text-xs">(선택)</span>
                </label>
                <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setPriority(priority === value ? '' : value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${priority === value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/*예상 소요 시간*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    예상 소요 시간 <span className="text-gray-400 text-xs">(선택 · 시간 단위, 예: 1.5)</span>
                </label>
                <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/*장소*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    장소 <span className="text-gray-400 text-xs">(선택)</span>
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="장소를 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/*상세 설명*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    상세 설명 <span className="text-gray-400 text-xs">(선택)</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="상세 설명을 입력하세요"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
            </div>

            {/*메모*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    메모 <span className="text-gray-400 text-xs">(선택 · 시험 범위, 포인트 등)</span>
                </label>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="메모를 입력하세요"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
            </div>

            {/*준비물*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    준비물 <span className="text-gray-400 text-xs">(선택 · 쉼표로 구분, 예: 교재, 필기구)</span>
                </label>
                <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="교재, 필기구, 노트북"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/*버튼*/}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !dueDate}
                    className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default EventForm;