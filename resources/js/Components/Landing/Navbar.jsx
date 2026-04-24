import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props;

    const user = auth?.user;

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2">
                        <Link href={route('landing')} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white uppercase">SIMAK<span className="text-blue-600">BUY</span></span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10 text-base font-medium tracking-wide text-slate-400">
                        <Link href={route('landing')} className="hover:text-white active:scale-95 transition-all duration-200">Home</Link>
                        <Link href={route('landing') + '#katalog'} className="hover:text-white active:scale-95 transition-all duration-200">Katalog</Link>
                        <Link href={route('landing') + '#alur'} className="hover:text-white active:scale-95 transition-all duration-200">Alur Beli</Link>
                        <Link href={route('landing') + '#syarat'} className="hover:text-white active:scale-95 transition-all duration-200">Syarat</Link>
                        <Link href={route('pages.kontak')} className="hover:text-white active:scale-95 transition-all duration-200">Kontak</Link>
                    </div>
 
                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            auth.user?.role === 'admin' ? (
                                <Link href={route('admin.dashboard')} className="px-6 py-3 bg-white text-black rounded-lg text-sm font-bold hover:bg-slate-200 transition-all uppercase tracking-wide">Admin</Link>
                            ) : (
                                <Link href={route('user.dashboard')} className="px-6 py-3 bg-white text-black rounded-lg text-sm font-bold hover:bg-slate-200 transition-all uppercase tracking-wide">Portal</Link>
                            )
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase hidden sm:block">Masuk</Link>
                                <Link href={route('register')} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:translate-y-[-1px] transition-all uppercase tracking-wide">Daftar</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
