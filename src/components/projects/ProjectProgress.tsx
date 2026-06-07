import { useState } from 'react';
import type { ProjectTask } from '../../types';

interface Props {
    tasks: ProjectTask[];
    onToggleTask: (taskId: string) => void;
    onAddTask: (title: string) => void;
    onDeleteTask: (taskId: string) => void;
}

const ProjectProgress = ({ tasks, onToggleTask, onAddTask, onDeleteTask }: Props) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAdd = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask(newTaskTitle.trim());
        setNewTaskTitle('');
    };

    const completed = tasks.filter((t) => t.isCompleted).length;
    const total = tasks.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="flex flex-col gap-3">
            {/*진행률*/}
            <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>전체 진행률</span>
                    <span className="font-medium text-indigo-600">{completed} / {total} 완료 ({progress}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/*태스크 목록*/}
            <ul className="flex flex-col gap-2">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => onToggleTask(task.id)}
                            className="w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0"
                        />
                        <span className={`flex-1 text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.title}
                        </span>
                        <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>

            {/*태스크 추가*/}
            <div className="flex gap-2 mt-1">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="할 일 추가 (Enter)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                    onClick={handleAdd}
                    disabled={!newTaskTitle.trim()}
                    className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    추가
                </button>
            </div>
        </div>
    );
};

export default ProjectProgress;