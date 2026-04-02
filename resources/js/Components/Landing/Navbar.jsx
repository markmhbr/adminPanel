import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props;

    const user = auth?.user;

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <div className="flex items-center gap-2">
                        <Link href={route('landing')} className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white uppercase italic">SIMAK<span className="text-blue-500">BUY</span></span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest italic text-slate-300">
                        <Link href={route('landing')} className="hover:text-blue-400 transition-colors">Home</Link>
                        <a href="#katalog" className="hover:text-blue-400 transition-colors">Katalog</a>
                        <a href="#alur" className="hover:text-blue-400 transition-colors">Alur Beli</a>
                        <a href="#syarat" className="hover:text-blue-400 transition-colors">Syarat</a>
                        <Link href={route('pages.kontak')} className="hover:text-blue-400 transition-colors">Kontak</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            auth.user?.role === 'admin' ? (
                                <Link href={route('admin.dashboard')} className="px-6 py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:bg-blue-600 hover:text-white transition-all uppercase italic">Dashboard Admin</Link>
                            ) : (
                                <Link href={route('user.dashboard')} className="px-6 py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:bg-blue-600 hover:text-white transition-all uppercase italic">Portal Pelanggan</Link>
                            )
                        ) : (
                            <>
                                <Link href={route('login')} className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase italic hidden sm:block">Masuk</Link>
                                <Link href={route('register')} className="px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-black shadow-lg shadow-white/10 hover:bg-slate-200 hover:scale-105 transition-all uppercase tracking-widest italic">Daftar</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
