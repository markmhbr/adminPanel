import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel Kontrol Admin</h2>}
        >
            <Head title="Admin Dashboard | Simak Buy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                             <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">Total Produk</p>
                             <h3 className="text-3xl font-black text-slate-900">24</h3>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                             <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">Pesanan Baru</p>
                             <h3 className="text-3xl font-black text-indigo-600">12</h3>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                             <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">Customer Aktif</p>
                             <h3 className="text-3xl font-black text-slate-900">156</h3>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                             <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">Pendapatan (Bln ini)</p>
                             <h3 className="text-xl font-black text-emerald-600">Rp 45.2M</h3>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-4">Selamat Datang, Admin!</h2>
                                    <p className="text-slate-400 font-bold mb-8 max-w-md">Sistem SIMAK BUY dalam kondisi optimal. Silakan kelola produk, pantau pesanan masuk, dan berikan dukungan kepada pelanggan.</p>
                                    <div className="flex gap-4">
                                        <Link href={route('admin.products.index')} className="px-6 py-3 bg-indigo-600 rounded-xl font-black text-[10px] tracking-widest hover:bg-indigo-700 transition-all">Kelola Produk</Link>
                                        <Link href={route('admin.orders.index')} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] tracking-widest hover:bg-slate-100 transition-all">Daftar Pesanan</Link>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                                <h4 className="text-sm font-black text-slate-900 mb-6 tracking-widest">Akses Cepat</h4>
                                <div className="space-y-4">
                                    <Link href={route('admin.interface.index')} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
                                        </div>
                                        <span className="text-xs font-black text-slate-600 tracking-widest">Manajemen Interface</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
