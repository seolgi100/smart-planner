import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    { path: '/', label: '홈' },
    { path: '/events', label: '일정' },
    { path: '/projects', label: '프로젝트' },
];

const Header = () => {
    const { pathname } = useLocation();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="text-lg font-bold text-indigo-600 tracking-tight">
                    Smart Planner
                </Link>
                <nav className="flex gap-1">
                    {NAV_ITEMS.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === path
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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