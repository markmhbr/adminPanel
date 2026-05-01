import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { motion } from 'framer-motion';

export default function Contact() {
    const { storeProfile } = usePage().props;

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div className="antialiased text-white bg-[#050505] selection:bg-blue-600 selection:text-white font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Kontak Kami | Simak Buy" />
            
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div 
                            {...fadeIn}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-semibold tracking-widest mb-10"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>
                            HUBUNGI KAMI
                        </motion.div>
                        <motion.h1 
                            {...fadeIn}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-8"
                        >
                            Konsultasikan Kebutuhan <br />Digital Anda Sekarang.
                        </motion.h1>
                        <motion.p 
                            {...fadeIn}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-lg text-slate-400 font-bold leading-relaxed"
                        >
                            Kami siap mendampingi perjalanan transformasi digital bisnis Anda dengan solusi yang tepat guna dan efisien.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-32">
                        <motion.div 
                            {...fadeIn}
                            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-blue-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Email Resmi</h3>
                            <p className="text-slate-400 font-bold mb-2">Tanggapan dalam 24 jam</p>
                            <a href={`mailto:${storeProfile?.email ?? 'halo@simakbuy.com'}`} className="text-blue-400 font-black tracking-tight hover:text-blue-300 transition-colors">
                                {storeProfile?.email ?? 'halo@simakbuy.com'}
                            </a>
                        </motion.div>

                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-blue-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Kantor Utama</h3>
                            <p className="text-slate-400 font-bold mb-2">Kunjungi workspace kami</p>
                            <span className="text-slate-200 font-bold tracking-tight">
                                {storeProfile?.address ?? 'Cianjur, Jawa Barat, Indonesia'}
                            </span>
                        </motion.div>

                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-blue-500/30 transition-all"
                        >
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">WhatsApp</h3>
                            <p className="text-slate-400 font-bold mb-2">Respon instan 24/7</p>
                            <a href={`https://wa.me/${storeProfile?.phone_number ?? '628123456789'}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-black tracking-tight hover:text-blue-300 transition-colors">
                                +{storeProfile?.phone_number ?? '628123456789'}
                            </a>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
                        <form className="space-y-8 relative z-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                    <input type="text" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-white placeholder:text-slate-600" placeholder="John Doe" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Aktif</label>
                                    <input type="email" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-white placeholder:text-slate-600" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subjek Proyek</label>
                                <input type="text" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-white placeholder:text-slate-600" placeholder="Website E-Commerce, Landing Page, dll." />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pesan / Detail Kebutuhan</label>
                                <textarea rows="6" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2.5rem] focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-white placeholder:text-slate-600" placeholder="Ceritakan sedikit tentang proyek Anda..."></textarea>
                            </div>
                            <button type="button" className="w-full py-6 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:translate-y-[-2px] transition-all duration-300">
                                Kirim Formulir Konsultasi
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
