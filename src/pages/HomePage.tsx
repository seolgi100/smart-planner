import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useProjects } from '../hooks/useProjects';
import EventCard from '../components/events/EventCard';
import ProjectCard from '../components/projects/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import { isOverdue, isUrgent } from '../utils/dateUtils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const HomePage = () => {
    const navigate = useNavigate();
    const { events } = useEvents();
    const { projects } = useProjects();

    const today = format(new Date(), 'yyyy년 M월 d일 EEEE', { locale: ko });

    const urgentEvents = useMemo(() => {
        return events
            .filter((e) => !e.isCompleted && (isUrgent(e.dueDate) || isOverdue(e.dueDate, e.isCompleted)))
            .slice(0, 5);
    }, [events]);

    const activeProjects = useMemo(() => {
        return projects.filter((p) => !p.isCompleted).slice(0, 3);
    }, [projects]);

    const totalPending = events.filter((e) => !e.isCompleted).length;
    const totalProjects = projects.filter((p) => !p.isCompleted).length;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">

            {/*히어로 섹션*/}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 text-white overflow-hidden">
                {/*배경 장식*/}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <p className="text-indigo-200 text-sm tracking-widest uppercase mb-2">
                        {today}
                    </p>
                    <h1
                        className="text-3xl font-bold mb-2 leading-snug"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        안녕하세요 👋
                    </h1>
                    <p className="text-indigo-200 text-sm mb-6">
                        세련된 비서가 당신의 일정을 관리해 드립니다.
                    </p>

                    {/*요약 카드*/}
                    <div className="flex gap-3">
                        <div className="bg-indigo-900/50 border border-white/20 rounded-xl px-5 py-3 flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">{totalPending}</span>
                            <span className="text-xs text-indigo-200 mt-0.5">남은 일정</span>
                        </div>
                        <div className="bg-indigo-900/50 border border-white/20 rounded-xl px-5 py-3 flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">{urgentEvents.length}</span>
                            <span className="text-xs text-indigo-200 mt-0.5">임박한 일정</span>
                        </div>
                        <div className="bg-indigo-900/50 border border-white/20 rounded-xl px-5 py-3 flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">{totalProjects}</span>
                            <span className="text-xs text-indigo-200 mt-0.5">진행 중 프로젝트</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*임박한 일정*/}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                        <h2
                            className="text-base font-semibold text-gray-800"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            임박한 일정
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/events')}
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                    >
                        전체 보기 →
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
                            />
                        ))}
                    </div>
                )}
            </section>

            {/*진행 중인 프로젝트*/}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-500 rounded-full" />
                        <h2
                            className="text-base font-semibold text-gray-800"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            진행 중인 프로젝트
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                    >
                        전체 보기 →
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
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;