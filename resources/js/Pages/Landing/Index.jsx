import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { motion } from 'framer-motion';

export default function Index({ products, storeProfile }) {

    const steps = [
        { step: '01', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'Eksplorasi', desc: 'Tentukan template/paket fitur yang paling relevan.' },
        { step: '02', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', title: 'Registrasi', desc: 'Buat akun dengan sistem OTP yang cepat dan aman.' },
        { step: '03', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Pembayaran', desc: 'Selesaikan administrasi via gateway terintegrasi.' },
        { step: '04', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Aktivasi', desc: 'Akses dashboard instan & sistem siap beroperasi.' },
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const stagger = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.1 }
    };

    return (
        <div className="antialiased text-white bg-[#050505] selection:bg-blue-600 selection:text-white font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Simak Buy | Solusi Website Profesional & Modern" />

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-44 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_70%)]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        <motion.div 
                            {...fadeIn}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold tracking-widest mb-10"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.8)]"></span>
                            {storeProfile?.store_name ?? 'Simak Buy'} • Solusi Premium
                        </motion.div>

                        <motion.h1 
                            {...fadeIn}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-10"
                        >
                            {storeProfile?.landing_title ?? 'Arsitektur Digital Masa Depan'}
                        </motion.h1>

                        <motion.p 
                            {...fadeIn}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-lg md:text-xl text-slate-400 font-bold leading-relaxed mb-14 max-w-3xl mx-auto"
                        >
                            {storeProfile?.landing_subtitle ?? 'Platform penyedia solusi website profesional terbaik untuk akselerasi bisnis Anda.'}
                        </motion.p>

                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link href={route('register')} className="w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-xl font-bold text-base text-white shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all duration-300 text-center tracking-widest">
                                MULAI SEKARANG
                            </Link>
                            <a href="#katalog" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-xl font-bold text-base text-white hover:bg-white/10 transition-all tracking-widest flex items-center justify-center gap-2">
                                LIHAT KATALOG
                            </a>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="mt-28 relative max-w-6xl mx-auto"
                        >
                            {/* Main Showcase */}
                            <div className="relative z-20 rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-3 shadow-[0_0_100px_rgba(79,70,229,0.15)] overflow-hidden">
                                <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="mx-auto bg-white/5 px-4 py-1.5 rounded-lg text-[10px] text-slate-500 font-black tracking-widest uppercase">simakbuy.com/workspace</div>
                                </div>
                                <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                        alt="Showcase"
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>
                            </div>

                            {/* Floating decoration with dynamic address */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="absolute -top-12 -right-12 w-64 h-48 bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl hidden lg:block z-30 animate-bounce-slow"
                            >
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-500 mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div className="text-[10px] font-black text-white/40 tracking-widest uppercase mb-1">Lokasi Kami</div>
                                <div className="text-xs font-bold text-slate-300 leading-relaxed line-clamp-2">
                                    {storeProfile?.address || 'Jl. Pendidikan No. 1, Jakarta'}
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-xl font-bold text-white">24/7</div>
                                    <div className="text-[10px] text-indigo-500 font-black tracking-widest uppercase">Support</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Marquee */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-16 bg-white/5 border-y border-white/5 overflow-hidden"
            >
                <div className="flex gap-20 w-max animate-marquee opacity-30">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-24 items-center shrink-0">
                            <span className="text-2xl font-bold text-white tracking-widest">SIMAK AKADEMIK</span>
                            <span className="text-2xl font-bold text-white tracking-widest">SOLUSI SEKOLAH</span>
                            <span className="text-2xl font-bold text-white tracking-widest">PINTAR SEKOLAH</span>
                            <span className="text-2xl font-bold text-white tracking-widest">DIGITAL EDUKASI</span>
                            <span className="text-2xl font-bold text-white tracking-widest">SIMAK NUSANTARA</span>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Core Features */}
            <section className="py-40 bg-[#050505] relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div 
                        {...fadeIn}
                        className="max-w-4xl mb-24"
                    >
                        <div className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-6">Keahlian & Keamanan</div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">Pondasi Digital yang <br />Lebih dari Sekadar Kode.</h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">Setiap algoritma dirancang untuk stabilitas jangka panjang dan kecepatan yang tak tertandingi.</p>
                    </motion.div>

                    <motion.div 
                        variants={stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-8"
                    >
                        <motion.div 
                            variants={fadeIn}
                            className="md:col-span-8 group bg-white/5 rounded-[2.5rem] p-12 border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-xl shadow-blue-600/20">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Performa Eksponensial</h3>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">Optimalisasi pada layer paling rendah memastikan akses instan di seluruh penjuru dunia dengan latensi minimum.</p>
                        </motion.div>

                        <motion.div 
                            variants={fadeIn}
                            className="md:col-span-4 bg-blue-600 rounded-[2.5rem] p-12 text-white relative overflow-hidden group hover:bg-blue-700 transition-colors shadow-2xl shadow-blue-600/20"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 backdrop-blur-md">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 tracking-tight">Keamanan Kelas Militer</h3>
                                <p className="text-base text-blue-100 leading-relaxed font-medium">Standar enkripsi end-to-end yang menjamin integritas data Anda setiap saat.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Katalog Section */}
            <section id="katalog" className="py-40 bg-[#080808] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div 
                        {...fadeIn}
                        className="text-center mb-24"
                    >
                        <div className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-4">Koleksi Kami</div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">Pilih Paket Masa Depan.</h2>
                        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">Solusi siap pakai yang dikurasi khusus untuk akselerasi pertumbuhan bisnis Anda.</p>
                    </motion.div>

                    <motion.div 
                        variants={stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {products?.sort((a, b) => a.id - b.id).map((product) => (
                            <motion.div 
                                key={product.id}
                                variants={fadeIn}
                                className="group bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-10 hover:border-blue-500/40 transition-all duration-500 flex flex-col h-full hover:bg-white/[0.05] active:scale-[0.98]"
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 transition-all group-hover:bg-blue-600 group-hover:text-white shadow-lg">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Lisensi Aktif</span>
                                    </div>

                                    <Link href={route('product.detail', product.slug)} className="block group/link active:scale-[0.99] transition-transform">
                                        <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors tracking-tight uppercase">{product.name}</h4>
                                        <p className="text-base text-slate-400 font-medium leading-relaxed mb-10">
                                            {product.description}
                                        </p>
                                    </Link>

                                    <div className="space-y-4 mb-10">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Termasuk dalam paket:</p>
                                        {product.items?.map((item) => (
                                            <div key={item.id} className="flex items-start gap-4">
                                                <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                                                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-white/5 mt-auto flex items-center justify-between">
                                        <Link href={route('product.detail', product.slug)} className="text-sm font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors active:scale-95 block">Detail Rincian</Link>
                                        <Link href={route('product.detail', product.slug)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg active:scale-90">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="alur" className="py-40 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div 
                        {...fadeIn}
                        className="text-center mb-28 max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8 tracking-tighter">Proses Tanpa Friksi.</h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">Empat tahap intuitif untuk mewujudkan platform digital kelas dunia milik Anda.</p>
                    </motion.div>

                    <motion.div 
                        variants={stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-4 gap-16 relative"
                    >
                        <div className="hidden md:block absolute top-[60px] left-0 right-0 h-px bg-white/5 -z-0"></div>
                        {steps.map((step, index) => (
                            <motion.div 
                                key={index}
                                variants={fadeIn}
                                className="relative text-center group"
                            >
                                <div className="w-28 h-28 mx-auto rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-500 mb-10 relative transition-all duration-500 group-hover:border-blue-500 group-hover:text-white shadow-2xl z-10">
                                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-600/20">{step.step}</span>
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.icon} /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-marquee {
                    animation: marquee 50s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 6s ease-in-out infinite;
                }
            ` }} />
        </div>
    );
}
