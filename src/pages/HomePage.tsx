import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useProjects } from '../hooks/useProjects';
import EventCard from '../components/events/EventCard';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import { isOverdue, isUrgent } from '../utils/dateUtils';

const HomePage = () => {
    const navigate = useNavigate();
    const { events, toggleComplete: toggleEvent, removeEvent } = useEvents();
    const { projects, toggleComplete: toggleProject, removeProject } = useProjects();

    //오늘 기준 임박하거나 마감 지난 일정만 표시 (최대 5개)
    const urgentEvents = useMemo(() => {
        return events
            .filter((e) => !e.isCompleted && (isUrgent(e.dueDate) || isOverdue(e.dueDate, e.isCompleted)))
            .slice(0, 5);
    }, [events]);

    //진행 중인 프로젝트 (최대 3개)
    const activeProjects = useMemo(() => {
        return projects.filter((p) => !p.isCompleted).slice(0, 3);
    }, [projects]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
            {/*헤더*/}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">안녕하세요 👋</h1>
                <p className="text-sm text-gray-500 mt-1">오늘 확인해야 할 일정을 살펴보세요.</p>
            </div>

            {/*임박한 일정*/}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-800">⚠️ 임박한 일정</h2>
                    <button
                        onClick={() => navigate('/events')}
                        className="text-xs text-indigo-500 hover:underline"
                    >
                        전체 보기
                    </button>
                </div>
                {urgentEvents.length === 0 ? (
                    <EmptyState message="임박한 일정이 없습니다." />
                ) : (
                    <div className="flex flex-col gap-2">
                        {urgentEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onToggleComplete={toggleEvent}
                                onDelete={removeEvent}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/*진행 중인 프로젝트*/}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-800">🗂️ 진행 중인 프로젝트</h2>
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-xs text-indigo-500 hover:underline"
                    >
                        전체 보기
                    </button>
                </div>
                {activeProjects.length === 0 ? (
                    <EmptyState message="진행 중인 프로젝트가 없습니다." />
                ) : (
                    <div className="flex flex-col gap-2">
                        {activeProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onToggleComplete={toggleProject}
                                onDelete={removeProject}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;