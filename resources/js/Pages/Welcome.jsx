import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

export default function Welcome({ products, heroBanners, storeProfile }) {
    const mainBanner = heroBanners?.length > 0 ? heroBanners[0] : null;

    const steps = [
        { step: '01', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'Eksplorasi', desc: 'Tentukan template/paket fitur yang paling relevan.' },
        { step: '02', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', title: 'Registrasi', desc: 'Buat akun dengan sistem OTP yang cepat dan aman.' },
        { step: '03', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Pembayaran', desc: 'Selesaikan administrasi via gateway terintegrasi.' },
        { step: '04', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Aktivasi', desc: 'Akses dashboard instan & sistem siap beroperasi.' },
    ];

    return (
        <div className="antialiased text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-700 font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Simak Buy | Solusi Website Profesional & Modern" />
            
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden bg-slate-950">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
                <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    {mainBanner && (
                        <div className="text-center max-w-5xl mx-auto">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-2xl shadow-blue-500/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                {storeProfile?.store_name ?? 'Simak Buy'} V2.0 Tersedia
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
                                {mainBanner.title} <br />
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 text-transparent bg-clip-text">Website Kelas Dunia.</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                                {mainBanner.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href={mainBanner.button_link ?? route('register')} className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 rounded-2xl font-black text-sm text-white uppercase tracking-widest overflow-hidden shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] transition-all duration-300 hover:-translate-y-1 text-center">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {mainBanner.button_text ?? 'Mulai Transformasi'}
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                </Link>
                                <a href="#katalog" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl font-bold text-sm text-white hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                    Eksplorasi Katalog
                                </a>
                            </div>

                            <div className="mt-24 relative max-w-6xl mx-auto perspective-1000">
                                <div className="relative rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 p-2 shadow-2xl flex justify-center items-center transform transition-transform duration-700 hover:rotate-x-2">
                                    <div className="absolute top-0 inset-x-0 h-12 bg-black/40 rounded-t-[2rem] flex items-center px-6 border-b border-white/5 backdrop-blur-md z-20">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                        </div>
                                    </div>
                                    <img src={mainBanner.image_url} alt="Web Preview" className="rounded-[1.5rem] w-full max-h-[700px] object-cover opacity-90 relative z-10 pt-10" />
                                    <div className="absolute -bottom-10 inset-x-10 h-10 bg-blue-500/30 blur-2xl rounded-full z-0"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
            </section>

            {/* Marquee Section */}
            <section className="py-12 bg-slate-50 border-b border-slate-200 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dipercayai oleh Institusi & Bisnis Modern</p>
                </div>
                <div className="flex gap-12 w-max animate-marquee opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-2xl font-black text-slate-800 shrink-0">ACME Corp</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">GlobalTech</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">EduSchool V</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">Nusantara Pos</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">Vertex AI</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">ACME Corp</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">GlobalTech</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">EduSchool V</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">Nusantara Pos</div>
                    <div className="text-2xl font-black text-slate-800 shrink-0">Vertex AI</div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Infrastruktur Premium,<br /><span className="text-blue-600">Tanpa Batasan.</span></h2>
                        <p className="text-lg text-slate-500 font-medium">Kami menghadirkan standar teknologi kelas atas ke dalam sistem Anda, memastikan website berjalan cepat dan elegan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                        <div className="md:col-span-2 group relative bg-white rounded-[2rem] p-10 border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors shadow-xl shadow-slate-200/50">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-0"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase">Performa Kilat (Light-speed)</h3>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-md">Dioptimasi hingga level kode terdalam. Kami menjamin kecepatan rendering halaman yang memukau, menurunkan bounce rate pelanggan Anda secara drastis.</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2rem] p-10 border border-slate-800 text-white relative overflow-hidden group hover:bg-slate-800 transition-colors shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                </div>
                                <h3 className="text-xl font-black mb-2 uppercase">Keamanan Solid</h3>
                                <p className="text-sm text-slate-400">Enkripsi data berlapis & mitigasi vulnerability standar modern.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Katalog Section */}
            <section id="katalog" className="py-32 bg-white border-t border-slate-100 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">Pilih Paket <span className="text-blue-600">Terbaik.</span></h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Kami mengemas solusi yang rumit menjadi paket sederhana yang siap membantu transformasi Anda.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products?.map((product) => (
                            <div key={product.id} className="group relative bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all text-blue-600 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                                    </div>
                                    <Link href={route('product.detail', product.slug)} className="flex-1 block">
                                        <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                                            {product.description?.substring(0, 100)}...
                                        </p>
                                        
                                        {/* Item List */}
                                        <div className="space-y-3 mb-8">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Fitur Utama:</p>
                                            {product.items?.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 group/item">
                                                    <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide group-hover/item:text-slate-900">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                    <div className="pt-8 border-t border-slate-100 mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-sm font-black text-blue-600 uppercase">Konfigurasi Siap</p>
                                        </div>
                                        <Link href={route('product.detail', product.slug)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="alur" className="py-32 bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 uppercase">Perjalanan Mudah Menuju <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">Digitalisasi.</span></h2>
                        <p className="text-lg text-slate-400 font-medium">Empat langkah transparan tanpa prosedur rumit.</p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="hidden md:block absolute top-[45px] left-[10%] w-[80%] h-0.5 bg-slate-800 z-0"></div>
                        <div className="grid md:grid-cols-4 gap-8 relative z-10">
                            {steps.map((step, index) => (
                                <div key={index} className="relative text-center group">
                                    <div className={`w-24 h-24 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-8 relative transition-all duration-500 ${index < 2 ? 'border-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] text-blue-400 bg-slate-800/50' : 'group-hover:border-slate-600 group-hover:text-slate-300'}`}>
                                        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black">{step.step}</span>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.icon}/></svg>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase">{step.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            ` }} />
        </div>
    );
}
