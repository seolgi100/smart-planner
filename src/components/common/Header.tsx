import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    { path: '/', label: '홈' },
    { path: '/calendar', label: '캘린더' },
    { path: '/events', label: '일정' },
    { path: '/projects', label: '프로젝트' },
];

const Header = () => {
    const { pathname } = useLocation();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-indigo-100 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                {/*로고*/}
                <Link to="/" className="flex flex-col leading-tight">
                    <span
                        className="text-xl font-bold text-indigo-700 tracking-wide"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Smart Planner
                    </span>
                    <span className="text-[10px] text-indigo-300 tracking-[0.2em] uppercase">
                        Your Personal Assistant
                    </span>
                </Link>

                {/*네비게이션*/}
                <nav className="flex gap-1">
                    {NAV_ITEMS.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === path
                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;