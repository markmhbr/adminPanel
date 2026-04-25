import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { PremiumAlert } from '@/Utils/alert';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const handleLogout = () => {
        PremiumAlert.confirm(
            'Konfirmasi Logout',
            'Apakah Anda yakin ingin keluar dari sistem?'
        ).then((result) => {
            if (result.isConfirmed) {
                router.post(route('logout'));
            }
        });
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Watch for route changes to close dropdown
    useEffect(() => {
        setIsProfileOpen(false);
        setIsSidebarOpen(false);
    }, [route().current()]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const navigation = user?.role === 'admin' ? [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', current: route().current('admin.dashboard') },
        { name: 'Produk', href: route('admin.products.index'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', current: route().current('admin.products.*') },
        { name: 'Item', href: route('admin.items.index'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', current: route().current('admin.items.*') },
        { name: 'Pesanan', href: route('admin.orders.index'), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', current: route().current('admin.orders.*') },
        { name: 'Pelanggan', href: route('admin.customers.index'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', current: route().current('admin.customers.index') },
        { name: 'Hak Akses', href: route('admin.permissions.index'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', current: route().current('admin.permissions.*') },
        { name: 'API Tokens', href: route('admin.tokens.index'), icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', current: route().current('admin.tokens.*') },
        { name: 'Interface', href: route('admin.interface.index'), icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', current: route().current('admin.interface.*') },
    ] : [
        { name: 'Dashboard', href: route('user.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', current: route().current('user.dashboard') },
        { name: 'Pesanan Saya', href: route('user.orders'), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', current: route().current('user.orders') },
        { name: 'Bantuan (Live Chat)', href: route('chat.index'), icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', current: route().current('chat.index') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Background Accents */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-violet-50/50 rounded-full blur-[100px]"></div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                        <ApplicationLogo className="h-4 w-4 fill-current text-white" />
                    </div>
                    <span className="font-black text-slate-900 tracking-widest text-sm">Admin Hub</span>
                </Link>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[70] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-100 z-[80] transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo Section */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div 
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-200"
                        >
                            <ApplicationLogo className="h-6 w-6 fill-current text-white" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 tracking-widest leading-none">Admin Hub</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">Premium Core</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-slate-400 tracking-widest mb-4">Main Navigation</p>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 group relative ${item.current ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <motion.svg 
                                whileHover={{ scale: 1.2 }}
                                className={`w-5 h-5 ${item.current ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} 
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </motion.svg>
                            <span className="tracking-wide">{item.name}</span>
                            {item.current && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-y-2 left-0 w-1 bg-white rounded-r-full"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-slate-100 flex items-center justify-center">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Hexanusa © 2026</p>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:pl-72 transition-all duration-300 min-h-screen relative z-10 flex flex-col">
                {/* Unified Topbar */}
                <header className={`sticky top-0 z-50 w-full transition-all duration-300 px-6 py-4 lg:px-10 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-md hidden md:block">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search anything..."
                                    className="w-full h-11 pl-11 pr-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4 ml-auto">
                            {/* Theme Toggle */}
                            <button 
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="w-11 h-11 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                )}
                            </button>

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-1 pr-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all active:scale-95 group focus:outline-none"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[10px] font-black text-slate-900 leading-none">{user?.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 mt-1 tracking-tighter">{user?.role === 'admin' ? 'Administrator' : 'Unit Sekolah'}</p>
                                    </div>
                                    <svg className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[90]" onClick={() => setIsProfileOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 py-4 px-2 focus:outline-none z-[100]"
                                            >
                                                <div className="px-4 py-3 mb-2 border-b border-slate-50">
                                                    <p className="text-[10px] font-black text-slate-400 tracking-widest">Signed in as</p>
                                                    <p className="text-xs font-black text-slate-900 truncate mt-1">{user?.email}</p>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    {user?.role === 'admin' && (
                                                        <Link href={route('admin.interface.index')} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all hover:bg-indigo-50 text-slate-600 hover:text-indigo-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                                            Manajemen Interface
                                                        </Link>
                                                    )}
                                                    <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all hover:bg-indigo-50 text-slate-600 hover:text-indigo-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                                        My Profile
                                                    </Link>
                                                    <button 
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all hover:bg-red-50 text-slate-600 hover:text-red-600 text-left"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                                        Keluar Sistem
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {header && (
                        <div className="pt-8 pb-4">
                            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-sm shadow-indigo-50/50"
                                >
                                    <div className="w-full">{header}</div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    <div className="p-6 lg:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={usePage().url}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="max-w-7xl mx-auto"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            ` }} />
        </div>
    );
}
