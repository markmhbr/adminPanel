import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

export default function Detail({ product }) {
    return (
        <div className="antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-700 font-['Plus Jakarta Sans', sans-serif]">
            <Head title={`${product.name} | Simak Buy`} />
            
            <Navbar />

            <main className="pt-32 pb-20 mt-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Product Image / Visual */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[3rem] p-12 aspect-square flex flex-col justify-center items-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                                <svg className="w-32 h-32 opacity-20 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <h2 className="text-4xl font-[800] text-center tracking-tight leading-tight italic uppercase">{product.name}</h2>
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Durasi Kerja</p>
                                    <p className="text-sm font-bold text-slate-900 italic">3-7 Hari Kerja</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Dukungan</p>
                                    <p className="text-sm font-bold text-slate-900 italic">Prioritas 24/7</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wider italic">Ready to Deploy</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-wider italic">Premium Template</span>
                            </div>

                            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-6 italic uppercase">{product.name}</h1>
                            
                            <div className="prose prose-slate max-w-none mb-10">
                                <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-line italic">
                                    {product.description}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Investasi Anda</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight italic">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                                </div>
                                <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all text-center uppercase italic tracking-widest">Lihat Live Demo</a>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Link href={route('checkout', product.slug)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-center italic">
                                    Pesan Sekarang
                                </Link>
                                <p className="text-[10px] text-center text-slate-400 font-bold italic uppercase tracking-widest">Transaksi Aman via Midtrans Payment Gateway</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
