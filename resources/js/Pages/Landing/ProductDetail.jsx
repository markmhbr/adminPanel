import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { useState, useMemo, useEffect } from 'react';

export default function ProductDetail({ product }) {
    // Initial selected items are the mandatory ones
    const mandatoryItems = product.items?.filter(item => Number(item.pivot.is_optional) === 0) || [];
    const optionalItems = product.items?.filter(item => Number(item.pivot.is_optional) === 1) || [];

    const [selectedItems, setSelectedItems] = useState([]);
    const [studentCount, setStudentCount] = useState(250);
    const [price, setPrice] = useState(0);

    // Get unique levels from all items to generate dynamic level buttons
    const availableLevels = useMemo(() => {
        const tiers = [];
        
        mandatoryItems.forEach(item => {
            const allowedIds = item.pivot.allowed_tiers || [];
            item.tiers?.forEach(tier => {
                const isAllowed = allowedIds.length === 0 || allowedIds.includes(tier.id);
                
                if (isAllowed && !tiers.find(t => t.max_students === tier.max_students)) {
                    tiers.push({
                        name: tier.level_name,
                        max_students: tier.max_students
                    });
                }
            });
        });

        return tiers.sort((a, b) => a.max_students - b.max_students);
    }, [product.items, mandatoryItems]);

    // Update studentCount default if levels exist
    useEffect(() => {
        if (availableLevels.length > 0 && studentCount === 250) {
            setStudentCount(availableLevels[0].max_students);
        }
    }, [availableLevels]);

    const getItemPrice = (item, count) => {
        if (item.pivot?.allowed_tiers?.length > 0) {
            const fixedTierId = item.pivot.allowed_tiers[0];
            const fixedTier = item.tiers?.find(t => t.id === fixedTierId);
            if (fixedTier) {
                return parseFloat(fixedTier.price);
            }
        }

        if (!item.tiers || item.tiers.length === 0) {
            return parseFloat(item.price);
        }
        
        const matchedTier = [...item.tiers]
            .sort((a, b) => a.max_students - b.max_students)
            .find(tier => tier.max_students >= count);
            
        if (matchedTier) {
            return parseFloat(matchedTier.price);
        }
        
        const highestTier = [...item.tiers].sort((a, b) => b.max_students - a.max_students)[0];
        return parseFloat(highestTier.price);
    };

    const totalPrice = useMemo(() => {
        let total = 0;
        mandatoryItems.forEach(item => {
            total += getItemPrice(item, studentCount);
        });
        optionalItems.forEach(item => {
            if (selectedItems.includes(item.id)) {
                total += getItemPrice(item, studentCount);
            }
        });
        return total;
    }, [product.price, selectedItems, studentCount, mandatoryItems, optionalItems]);

    // Animate price counter
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPrice(totalPrice);
        }, 50);
        return () => clearTimeout(timeout);
    }, [totalPrice]);

    const toggleItem = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId) 
                : [...prev, itemId]
        );
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white antialiased selection:bg-blue-600 selection:text-white font-['Plus Jakarta Sans', sans-serif]">
            <Head title={`${product.name} | Simak Buy`} />
            
            <Navbar />

            <main className="pt-32 pb-24 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10 blur-[120px]"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Solusi Siap Pakai
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8 tracking-tighter uppercase">
                            {product.name}
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Configuration Column */}
                        <div className="lg:col-span-8 space-y-12">
                            
                            {/* Level Selection (if available) */}
                            {availableLevels.length > 0 && (
                                <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Kapasitas Pengguna</h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pilih Skala Sistem</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {availableLevels.map((level) => (
                                            <button
                                                key={level.max_students}
                                                onClick={() => setStudentCount(level.max_students)}
                                                className={`p-6 rounded-2xl border transition-all duration-300 text-center group ${studentCount === level.max_students ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${studentCount === level.max_students ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-300'}`}>{level.name}</p>
                                                <p className="text-xl font-black text-white leading-none tracking-tighter">{level.max_students}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${studentCount === level.max_students ? 'text-blue-200' : 'text-slate-600'}`}>Siswa</p>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Modules Section */}
                            <section className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Modul & Fitur</h3>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">Wajib: {mandatoryItems.length}</span>
                                        <span className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">Opsional: {optionalItems.length}</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Mandatory Items - Displayed as disabled cards or highlighted */}
                                    {mandatoryItems.map(item => (
                                        <div key={item.id} className="relative group bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/30 rounded-[2rem] p-8 overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -z-10"></div>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                                </div>
                                                <span className="text-[9px] font-black bg-blue-500 text-white px-3 py-1 rounded-full uppercase tracking-[0.2em]">Wajib</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{item.name}</h4>
                                            <p className="text-sm text-blue-200/60 font-medium leading-relaxed">Modul inti yang sudah termasuk dalam paket dasar aplikasi ini.</p>
                                        </div>
                                    ))}

                                    {/* Optional Items - Clickable cards */}
                                    {optionalItems.map(item => (
                                        <button 
                                            key={item.id} 
                                            onClick={() => toggleItem(item.id)}
                                            className={`relative text-left group rounded-[2rem] p-8 border transition-all duration-500 overflow-hidden active:scale-[0.98] ${selectedItems.includes(item.id) ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-600/30' : 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'}`}
                                        >
                                            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] -z-10 transition-opacity ${selectedItems.includes(item.id) ? 'bg-white/20 opacity-100' : 'bg-indigo-500/5 opacity-0 group-hover:opacity-100'}`}></div>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedItems.includes(item.id) ? 'bg-white text-indigo-600' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                                                    {selectedItems.includes(item.id) ? (
                                                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                                    )}
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border transition-colors ${selectedItems.includes(item.id) ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-slate-500 group-hover:text-slate-400'}`}>
                                                    {selectedItems.includes(item.id) ? 'Ditambahkan' : 'Opsional'}
                                                </span>
                                            </div>
                                            <h4 className={`text-xl font-bold mb-2 uppercase tracking-tight transition-colors ${selectedItems.includes(item.id) ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.name}</h4>
                                            <p className={`text-sm font-medium leading-relaxed transition-colors ${selectedItems.includes(item.id) ? 'text-indigo-100/70' : 'text-slate-500 group-hover:text-slate-400'}`}>Fitur tambahan untuk meningkatkan fungsionalitas sistem Anda.</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-400/30 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu Pengerjaan</p>
                                        <p className="text-sm font-bold text-white">3-7 Hari Kerja</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-green-400 group-hover:border-green-400/30 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dukungan</p>
                                        <p className="text-sm font-bold text-white">Prioritas 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group md:col-span-1 col-span-2">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 group-hover:border-purple-400/30 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pembayaran</p>
                                        <p className="text-sm font-bold text-white">Terintegrasi Snap</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sticky Column */}
                        <div className="lg:col-span-4 sticky top-32 space-y-6">
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
                                
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-6">Ringkasan Pesanan</h3>
                                
                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Produk Utama</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{product.name}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Skala</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{studentCount} Siswa</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tambahan</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{selectedItems.length} Terpilih</span>
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Total Investasi</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-slate-500">Rp</span>
                                        <span className="text-5xl font-black text-white tracking-tighter">
                                            {new Intl.NumberFormat('id-ID').format(price)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link 
                                        href={route('checkout', product.slug)} 
                                        data={{ 
                                            selected_items: selectedItems,
                                            student_count: studentCount 
                                        }}
                                        className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-widest text-center block"
                                    >
                                        Beli Sekarang
                                    </Link>
                                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="w-full py-4 border border-white/10 text-white rounded-2xl font-bold text-[10px] hover:bg-white/5 transition-all text-center uppercase tracking-widest block">
                                        Lihat Demo
                                    </a>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.397 9.267-6 11.588-3.603-2.321-6-6.642-6-11.587 0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                    Transaksi Terenkripsi
                                </div>
                            </div>

                            {/* Help Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/5 rounded-[2rem] p-8">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Butuh Bantuan?</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">Tim konsultan kami siap membantu Anda memilih konfigurasi terbaik untuk sekolah Anda.</p>
                                <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2">
                                    Hubungi WhatsApp
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
