import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

export default function Checkout({ product }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing } = useForm({
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('buy', product.id));
    };

    return (
        <div className="bg-slate-50 antialiased selection:bg-indigo-100 selection:text-indigo-700 font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Checkout | Simak Buy" />
            
            <Navbar />

            <main className="pt-32 pb-20 mt-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        <div className="flex-1">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Checkout Pesanan</h2>
                            <p className="text-slate-500 font-medium mt-2 italic">Lengkapi data pendaftaran atau masuk untuk melanjutkan pembayaran.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold italic shadow-lg shadow-blue-100">1</div>
                                <span className="text-[8px] font-bold text-blue-600 uppercase mt-2 italic">Konfirmasi</span>
                            </div>
                            <div className="w-12 h-px bg-slate-200"></div>
                            <div className="flex flex-col items-center opacity-40">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold italic">2</div>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 italic">Pembayaran</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Kiri: Produk Detail */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 sticky top-32">
                                <div className="h-48 bg-slate-100 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <div className="p-8">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest italic">Paket Website</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-4 mb-2 italic uppercase">{product.name}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-3 mb-6">{product.description}</p>
                                    
                                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 italic">Harga Paket:</span>
                                        <span className="text-xl font-black text-blue-600 italic">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Form/Auth */}
                        <div className="lg:col-span-8 space-y-8">
                            {!auth.user ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Daftar Akun */}
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2 italic uppercase">Belum Punya Akun?</h4>
                                        <p className="text-xs text-slate-400 font-medium italic mb-8">Daftarkan sekolah Anda untuk mulai kustomisasi website.</p>
                                        <Link href={route('register')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest italic mt-auto">Daftar Akun Sekolah</Link>
                                    </div>

                                    {/* Login */}
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2 italic uppercase">Sudah Punya Akun?</h4>
                                        <p className="text-xs text-slate-400 font-medium italic mb-8">Masuk untuk melanjutkan pesanan Anda yang tertunda.</p>
                                        <Link href={route('login')} className="w-full py-4 bg-white text-blue-600 border border-blue-100 rounded-2xl font-bold text-xs shadow-sm hover:bg-blue-50 transition-all uppercase tracking-widest italic mt-auto">Masuk Sekarang</Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 italic">Informasi Pembeli</h3>
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest italic">Terverifikasi</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 mb-10">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Nama Sekolah</p>
                                                <p className="text-base font-bold text-slate-900 italic">{auth.user.school_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">NPSN</p>
                                                <p className="text-base font-bold text-slate-900 italic">{auth.user.npsn}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Penanggung Jawab & Kontak</p>
                                                <p className="text-base font-bold text-slate-900 italic">{auth.user.name} ({auth.user.email} / {auth.user.phone_number})</p>
                                            </div>
                                        </div>

                                        <hr className="border-slate-50 mb-10" />

                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 italic">Catatan Tambahan</h3>
                                        <textarea 
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows="4" 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium italic" 
                                            placeholder="Ceritakan fitur khusus yang sekolah Anda butuhkan di sini..."
                                        />
                                        
                                        <div className="mt-10 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed italic">Pesanan ini akan langsung diproses setelah konfirmasi pembayaran diterima. Anda dapat memantau status pengerjaan melalui dashboard sekolah.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-base shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest italic disabled:opacity-50"
                                    >
                                        Konfirmasi & Lanjutkan ke Pembayaran
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
