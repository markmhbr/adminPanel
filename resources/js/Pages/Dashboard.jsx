import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="w-full">
                    <h2 className="text-3xl font-black leading-tight text-gray-900">
                        Admin Command Center
                    </h2>
                    <p className="text-gray-400 font-medium mt-1">Status sistem dan ringkasan aktivitas saat ini.</p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 transform transition-transform hover:scale-[1.01] duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[60px] -ml-24 -mb-24"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block border border-white/20">System Status: Online</span>
                                <h1 className="text-4xl font-black mb-2">Selamat Datang Kembali, Admin!</h1>
                                <p className="text-indigo-100 text-lg font-medium opacity-90 max-w-xl">
                                    Kontrol akses, kelola izin sekolah, dan monitor aktivitas sistem secara real-time dari satu tempat yang elegan.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-40 h-40 bg-white/20 backdrop-blur-xl rounded-4xl flex items-center justify-center border border-white/30 rotate-3">
                                    <svg className="w-20 h-20 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: 'Total Sekolah', value: '12', color: 'indigo', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { label: 'Role Aktif', value: '24', color: 'fuchsia', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { label: 'Database Sync', value: 'OK', color: 'emerald', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-6 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-500`}>
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Quick Access Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-indigo-50 border border-indigo-50">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">Akses Cepat</h4>
                            <div className="h-px bg-gray-100 flex-grow mx-8 hidden md:block"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <a href={route('admin.permissions.index')} className="group flex items-center p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100 group-hover:shadow-indigo-100 transition-all">
                                     <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h5 className="text-lg font-black text-gray-900 group-hover:text-indigo-700">Manajemen Izin</h5>
                                    <p className="text-sm text-gray-400 font-medium">Atur role dan hak akses untuk semua sekolah.</p>
                                </div>
                            </a>
                            <a href={route('admin.profile.edit')} className="group flex items-center p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-violet-100 hover:bg-violet-50 transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100 group-hover:shadow-violet-100 transition-all">
                                     <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h5 className="text-lg font-black text-gray-900 group-hover:text-violet-700">Pengaturan Profil</h5>
                                    <p className="text-sm text-gray-400 font-medium">Perbarui informasi akun dan keamanan Anda.</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
