import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Show({ auth, order }) {
    const { data, setData, put, processing } = useForm({
        status: order.status,
        payment_status: order.payment_status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.orders.updateStatus', order.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Pesanan #{order.order_number}</h2>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all">
                        Cetak Invoice
                    </button>
                </div>
            }
        >
            <Head title={`Detail Pesanan #${order.order_number} | Admin`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Invoice Card */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-10 overflow-hidden relative">
                                <div className="absolute -right-10 -top-10 opacity-[0.03] rotate-12">
                                    <svg className="w-64 h-64 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                </div>

                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <div>
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 mb-4">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                        </div>
                                        <h3 className="text-xl font-extrabold tracking-tight text-gray-900 uppercase">SIMAK BUY</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 font-black">Jasa Pembuatan Website Profesional</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-extrabold uppercase mb-2 tracking-widest">Invoice Pesanan</span>
                                        <p className="text-sm font-extrabold text-gray-900">#{order.order_number}</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-12 relative z-10 border-y border-gray-50 py-8">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Info Pelanggan:</p>
                                        <p className="text-sm font-extrabold text-gray-900 uppercase">{order.user.name}</p>
                                        <p className="text-xs font-bold text-gray-500 mt-1">{order.user.email}</p>
                                        <p className="text-[10px] text-gray-400 font-black mt-4 uppercase">Sekolah: {order.user.school_name}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase">NPSN: {order.user.npsn}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Status Pembayaran:</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative z-10 shadow-inner">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-2">Permintaan Domain:</p>
                                        <p className="text-base font-black text-indigo-700 lowercase">{order.domain || 'Belum diisi'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Kapasitas Siswa:</p>
                                        <p className="text-base font-black text-slate-900 uppercase">{order.student_count || 0} Siswa</p>
                                    </div>
                                </div>

                                <div className="mb-12 relative z-10">
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6">Rincian Layanan:</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                                                    P
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-gray-900 uppercase">{order.product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">Paket Utama</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-extrabold text-gray-400">Rp 0</p>
                                        </div>

                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                                                        ✓
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-gray-900 uppercase">{item.item_name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.billing_type === 'annual' ? 'Per Tahun' : 'Sekali Beli'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-extrabold text-gray-900">Rp {new Intl.NumberFormat('id-ID').format(item.item_price)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end relative z-10">
                                    <div className="w-full sm:w-64 space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span>Subtotal</span>
                                            <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span>Pajak (0%)</span>
                                            <span>Rp 0</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 flex justify-between text-lg font-extrabold text-indigo-600">
                                            <span>Total</span>
                                            <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Actions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
                                <h3 className="text-sm font-extrabold text-gray-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-4">Update Status</h3>
                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Status Pengerjaan</label>
                                        <select 
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-black appearance-none"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Dalam Pengerjaan</option>
                                            <option value="completed">Selesai</option>
                                            <option value="cancelled">Dibatalkan</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Status Pembayaran</label>
                                        <select 
                                            value={data.payment_status}
                                            onChange={e => setData('payment_status', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-black appearance-none"
                                        >
                                            <option value="unpaid">Belum Bayar</option>
                                            <option value="paid">Lunas</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Update Data
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
