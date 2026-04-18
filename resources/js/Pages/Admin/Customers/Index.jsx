import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight italic uppercase leading-none">Daftar Pelanggan</h2>
                        <p className="text-xs text-slate-500 mt-2 font-bold italic uppercase tracking-wider">Manajemen Unit Sekolah yang Terdaftar</p>
                    </div>
                </div>
            }
        >
            <Head title="Daftar Pelanggan | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <form onSubmit={handleSearch} className="relative group max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </div>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari NPSN, Nama Sekolah, atau Email..."
                                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700 italic shadow-sm"
                            />
                        </form>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center w-16">#</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Data Sekolah</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Kontak</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Tgl Daftar</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Pesanan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {customers.data.length > 0 ? customers.data.map((customer, index) => (
                                        <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6 text-center text-xs font-black text-slate-400 italic">
                                                {(customers.current_page - 1) * customers.per_page + index + 1}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 uppercase italic leading-none">{customer.school_name || customer.name}</span>
                                                    <span className="text-[10px] font-bold text-indigo-600 mt-2 italic px-2 py-0.5 bg-indigo-50 rounded-md self-start">NPSN: {customer.npsn || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600 italic">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                                        {customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                                        {customer.phone_number || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center text-xs font-bold text-slate-500 italic uppercase">
                                                {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link 
                                                    href={route('admin.orders.index', { search: customer.email })} 
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase italic hover:bg-slate-200 transition-all hover:translate-x-1"
                                                >
                                                    Cek Pesanan &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                                    </div>
                                                    <p className="text-sm font-black text-slate-400 uppercase italic tracking-widest">Tidak ada pelanggan ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {customers.links && (
                            <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30">
                                <Pagination links={customers.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
