import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, orders }) {
    const statusClasses = {
        pending: 'bg-gray-100 text-gray-600',
        processing: 'bg-blue-50 text-blue-700 border border-blue-100',
        completed: 'bg-green-50 text-green-700 border border-green-100',
        cancelled: 'bg-red-50 text-red-700',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pesanan Masuk</h2>}
        >
            <Head title="Pesanan Masuk | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50">No. Pesanan</th>
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50">Pelanggan</th>
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50">Produk</th>
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50 text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50 text-center">Pembayaran</th>
                                        <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest italic border-b border-gray-50 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-indigo-600 italic">#{order.order_number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                        {order.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900 italic">{order.user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-700 italic">{order.product.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold italic ${statusClasses[order.status]}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold italic ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                                    {order.payment_status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('admin.orders.show', order.id)} className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all italic shadow-sm">
                                                    Detail & Invoice
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
