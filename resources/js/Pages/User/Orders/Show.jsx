import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Show({ auth, order, midtransClientKey, midtransIsProduction }) {
    useEffect(() => {
        if (order.payment_status === 'unpaid') {
            const script = document.createElement('script');
            const snapUrl = midtransIsProduction 
                ? 'https://app.midtrans.com/snap/snap.js'
                : 'https://app.sandbox.midtrans.com/snap/snap.js';
            
            script.src = snapUrl;
            script.setAttribute('data-client-key', midtransClientKey);
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [order.payment_status, midtransClientKey]);

    const handlePay = () => {
        if (window.snap) {
            window.snap.pay(order.snap_token, {
                onSuccess: function (result) {
                    window.location.href = route('user.dashboard');
                },
                onPending: function (result) {
                    window.location.reload();
                },
                onError: function (result) {
                    alert("Pembayaran gagal!");
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-2">
                    <Link href={route('user.dashboard')} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                        Kembali ke Dashboard
                    </Link>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-none mt-2">Konfirmasi Pembayaran #{order.order_number}</h2>
                </div>
            }
        >
            <Head title={`Order #${order.order_number} | Simak Buy`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-10 overflow-hidden relative">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest mb-4">Ringkasan Pesanan</span>
                                        <h3 className="text-xl font-black text-slate-900 uppercase leading-none">{order.product?.name || 'Paket Produk'}</h3>
                                        <p className="text-xs text-slate-500 mt-2 font-bold">Paket Website Profesional</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Tagihan</p>
                                        <p className="text-2xl font-black text-indigo-600">Rp {new Intl.NumberFormat('id-ID').format(order.total_price || 0)}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Domain Sekolah</p>
                                        <p className="text-sm font-bold text-slate-900 lowercase">{order.domain || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pilihan Paket</p>
                                        <p className="text-sm font-bold text-slate-900 uppercase">{order.student_count || 0} Siswa</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12 bg-white rounded-2xl p-2">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Fitur & Layanan Terpilih:</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-xs font-bold text-slate-700 border-b border-slate-50 pb-2 last:border-0 group">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center text-[10px]">✓</div>
                                                    <span>{item.item_name}</span>
                                                </div>
                                                {parseFloat(item.item_price) === 0 && (
                                                    <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Gratis</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-slate-50 pt-8 mb-12">
                                    {order.subtotal && (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs items-center">
                                                <span className="text-slate-400 font-black uppercase tracking-widest">Subtotal Investasi</span>
                                                <span className="font-black text-slate-700">Rp {new Intl.NumberFormat('id-ID').format(order.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs items-center">
                                                <span className="text-slate-400 font-black uppercase tracking-widest">Pajak (PPN {order.tax_percentage}%)</span>
                                                <span className="font-black text-slate-700">+ Rp {new Intl.NumberFormat('id-ID').format(order.tax_amount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm items-center pt-4 border-t border-indigo-100 mt-2">
                                                <span className="text-indigo-600 font-black uppercase tracking-widest">Total Pembayaran</span>
                                                <span className="text-xl font-black text-indigo-600 underline decoration-indigo-200 underline-offset-8">Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-sm items-center pt-8 border-t border-slate-50">
                                        <span className="text-slate-500 font-black uppercase">Status Pembayaran</span>
                                        <span className={`font-black uppercase ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment_status?.toUpperCase() || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-500 font-black uppercase">Status Pengerjaan</span>
                                        <span className="font-black text-slate-900 uppercase">{order.status?.toUpperCase() || '-'}</span>
                                    </div>
                                </div>

                                {order.payment_status === 'unpaid' ? (
                                    <button 
                                        onClick={handlePay}
                                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all uppercase tracking-widest"
                                    >
                                        Bayar Sekarang
                                    </button>
                                ) : (
                                    <div className="p-8 bg-green-50 border border-green-100 rounded-2xl text-center shadow-inner">
                                        <p className="text-green-700 font-black uppercase">Terima kasih! Pembayaran Anda telah kami terima.</p>
                                        <p className="text-xs text-green-600 mt-2 font-bold">Proyek Anda sedang kami tinjau untuk segera dikerjakan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-200">
                                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">Informasi Penting</h4>
                                <ul className="space-y-6 text-xs font-bold text-slate-400 leading-relaxed">
                                    <li className="flex gap-4">
                                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        Pembayaran akan diverifikasi secara otomatis oleh sistem Midtrans.
                                    </li>
                                    <li className="flex gap-4">
                                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        Setelah lunas, tim kami akan menghubungi Anda via WhatsApp dalam 1x24 jam.
                                    </li>
                                    <li className="flex gap-4">
                                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        Pastikan data sekolah yang Anda daftarkan sudah benar.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
