import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ totalOrders, processingOrders, completedOrders, orders, featuredProducts }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Sekolah</h2>}
        >
            <Head title="Dashboard | Simak Buy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Selamat Datang, {auth?.user?.school_name || auth?.user?.name}!</h2>
                        <p className="text-slate-500 font-medium mt-2 italic">Pantau status pengerjaan website Anda dan jelajahi layanan terbaru kami.</p>
                    </div>

                    {/* Stats User */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Total Pesanan</p>
                            <h3 className="text-3xl font-black text-slate-900 italic">{totalOrders}</h3>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Sedang Diproses</p>
                            <h3 className="text-3xl font-black text-slate-900 italic">{processingOrders}</h3>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Website Selesai</p>
                            <h3 className="text-3xl font-black text-slate-900 italic">{completedOrders}</h3>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 italic">Riwayat Pesanan Terakhir</h3>
                                    <Link href="#" className="text-xs font-bold text-indigo-600 hover:underline italic">Lihat Semua</Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Produk</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Status</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {orders.length > 0 ? orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-8 py-5">
                                                        <p className="text-sm font-bold text-slate-900 italic">{order.product.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Inv: #{order.order_number}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-wider italic">
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <Link href={route('user.order.show', order.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 italic">Lihat Detail &rarr;</Link>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="px-8 py-10 text-center text-slate-400 font-bold text-sm italic">Belum ada pesanan website.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Promo/Featured Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold mb-4 italic uppercase">Butuh Website Custom?</h4>
                                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 italic">Konsultasikan kebutuhan fitur khusus sekolah Anda dengan tim ahli kami secara gratis melalui Live Chat.</p>
                                    <button className="block w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-extrabold text-center shadow-lg hover:bg-indigo-50 transition-all uppercase tracking-widest italic">Hubungi Tim Ahli</button>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-all"></div>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                                <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest italic">Produk Rekomendasi</h4>
                                <div className="space-y-6">
                                    {featuredProducts?.map((fp) => (
                                        <div key={fp.id} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex-shrink-0"></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 italic">{fp.name}</p>
                                                <p className="text-[10px] font-bold text-indigo-600 mt-1 italic">Rp {new Intl.NumberFormat('id-ID').format(fp.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
