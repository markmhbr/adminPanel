import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, orders }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight uppercase">Riwayat Pesanan Website</h2>}
        >
            <Head title="Pesanan Saya | Simak Buy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pesanan</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paket Produk</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pembayaran</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.data.length > 0 ? orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-indigo-600">#{order.order_number}</span>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-slate-900 uppercase leading-none">{order.product.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-2">Web Development Project</p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link href={route('user.order.show', order.id)} className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                                                    Lihat Detail &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-black text-sm">Pesanan Anda Masih Kosong.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
