import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Global Background Accents */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-violet-50 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-xl shadow-indigo-100/30 px-6 h-16 flex justify-between items-center transition-all duration-300 ${scrolled ? 'rounded-2xl' : 'rounded-3xl'}`}>
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="transition-transform duration-300 hover:scale-110">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <ApplicationLogo className="h-6 w-6 fill-current text-white" />
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-2 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('admin.permissions.index')}
                                    active={route().current('admin.permissions.index')}
                                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                                >
                                    Permissions
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100">
                                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-100">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left hidden md:block">
                                                <p className="text-sm font-black text-gray-900 leading-none">{user.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Administrator</p>
                                            </div>
                                            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                                        <Dropdown.Link href={route('admin.profile.edit')} className="rounded-xl font-bold text-sm py-3">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </div>
                                        </Dropdown.Link>
                                        <hr className="my-1 border-gray-100" />
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="rounded-xl font-bold text-sm py-3 text-red-600 hover:bg-red-50">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log Out
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden transition-all duration-300 ${showingNavigationDropdown ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 space-y-1">
                        <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} className="rounded-xl font-bold">Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.permissions.index')} active={route().current('admin.permissions.index')} className="rounded-xl font-bold">Permissions</ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            <div className="pt-24 relative z-10">
                {header && (
                    <header className="mb-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-8 border border-white/50 shadow-sm shadow-indigo-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                <main className="pb-20">{children}</main>
            </div>
            
            {/* Minimalist Premium Footer */}
            <footer className="relative z-10 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                                <ApplicationLogo className="w-3 h-3 fill-current text-white" />
                            </div>
                            <span className="text-xs font-black tracking-widest text-gray-500 uppercase">Admin Panel Core</span>
                         </div>
                         <div className="flex gap-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a>
                         </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
