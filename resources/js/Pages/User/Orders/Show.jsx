import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Show({ auth, order, midtransClientKey }) {
    useEffect(() => {
        if (order.payment_status === 'unpaid') {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
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
                    window.location.href = route('dashboard');
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
                    <Link href={route('dashboard')} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors italic">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                        Kembali ke Dashboard
                    </Link>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight italic uppercase leading-none mt-2">Konfirmasi Pembayaran #{order.order_number}</h2>
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
                                        <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-extrabold uppercase tracking-widest mb-4 italic">Ringkasan Pesanan</span>
                                        <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{order.product?.name || 'Paket Produk'}</h3>
                                        <p className="text-xs text-slate-500 mt-2 font-bold italic">Paket Website Profesional</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Total Tagihan</p>
                                        <p className="text-2xl font-black text-indigo-600 italic">Rp {new Intl.NumberFormat('id-ID').format(order.total_price || 0)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-slate-50 pt-8 mb-12">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-black italic uppercase">Status Pembayaran</span>
                                        <span className={`font-black uppercase italic ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment_status.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-black italic uppercase">Status Pengerjaan</span>
                                        <span className="font-black text-slate-900 uppercase italic">{order.status.toUpperCase()}</span>
                                    </div>
                                </div>

                                {order.payment_status === 'unpaid' ? (
                                    <button 
                                        onClick={handlePay}
                                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all uppercase tracking-widest italic"
                                    >
                                        Bayar Sekarang
                                    </button>
                                ) : (
                                    <div className="p-8 bg-green-50 border border-green-100 rounded-2xl text-center shadow-inner">
                                        <p className="text-green-700 font-black italic uppercase">Terima kasih! Pembayaran Anda telah kami terima.</p>
                                        <p className="text-xs text-green-600 mt-2 italic font-bold">Proyek Anda sedang kami tinjau untuk segera dikerjakan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-200">
                                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 italic">Informasi Penting</h4>
                                <ul className="space-y-6 text-xs font-bold text-slate-400 leading-relaxed italic">
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
