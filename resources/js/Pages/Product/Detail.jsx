import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { useState, useMemo, useEffect } from 'react';

export default function Detail({ product }) {
    // Initial selected items are the mandatory ones
    const mandatoryItems = product.items?.filter(item => Number(item.pivot.is_optional) === 0) || [];
    const optionalItems = product.items?.filter(item => Number(item.pivot.is_optional) === 1) || [];

    const [selectedItems, setSelectedItems] = useState([]);
    const [studentCount, setStudentCount] = useState(250);
    const [price, setPrice] = useState(0);

    // Get unique levels from all items to generate dynamic level buttons
    const availableLevels = useMemo(() => {
        const tiers = [];
        
        // We only show levels that are "allowed" across mandatory items
        // If an item has no allowed_tiers checked, we assume all are allowed
        mandatoryItems.forEach(item => {
            const allowedIds = item.pivot.allowed_tiers || [];
            item.tiers?.forEach(tier => {
                // If specific tiers are allowed, check if this tier is one of them
                // If no tiers are specific, all are allowed
                const isAllowed = allowedIds.length === 0 || allowedIds.includes(tier.id);
                
                if (isAllowed && !tiers.find(t => t.max_students === tier.max_students)) {
                    tiers.push({
                        name: tier.level_name,
                        max_students: tier.max_students
                    });
                }
            });
        });

        // If no mandatory items have tiers, then no dynamic levels
        return tiers.sort((a, b) => a.max_students - b.max_students);
    }, [product.items, mandatoryItems]);

    // Update studentCount default if levels exist
    useEffect(() => {
        if (availableLevels.length > 0 && studentCount === 250) {
            setStudentCount(availableLevels[0].max_students);
        }
    }, [availableLevels]);

    const getItemPrice = (item, count) => {
        // Jika admin sudah menentukan level (Tier) khusus untuk produk ini
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
        
        // Find tier where max_students >= count (sorted asc)
        const matchedTier = [...item.tiers]
            .sort((a, b) => a.max_students - b.max_students)
            .find(tier => tier.max_students >= count);
            
        if (matchedTier) {
            return parseFloat(matchedTier.price);
        }
        
        // If count exceeds all tiers, use the highest tier's price
        const highestTier = [...item.tiers].sort((a, b) => b.max_students - a.max_students)[0];
        return parseFloat(highestTier.price);
    };

    const totalPrice = useMemo(() => {
        let total = 0;
        
        // Add mandatory items with tiered pricing
        mandatoryItems.forEach(item => {
            total += getItemPrice(item, studentCount);
        });
        
        // Add selected optional items with tiered pricing
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
        <div className="antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-700 font-['Plus Jakarta Sans', sans-serif]">
            <Head title={`${product.name} | Simak Buy`} />
            
            <Navbar />

            <main className="pt-32 pb-20 mt-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Product Image / Visual */}
                        <div className="space-y-6 sticky top-32">
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
                        <div className="space-y-8">
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

                                {/* Student Count Selection */}
                                <div className="bg-indigo-600 rounded-[2rem] p-8 mb-10 text-white shadow-xl shadow-indigo-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest italic">Jumlah Siswa Sekolah</h3>
                                            <p className="text-[10px] font-bold text-indigo-100 italic">Harga item akan menyesuaikan tingkatan (level) siswa Anda.</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="1000" 
                                        step="1"
                                        value={studentCount}
                                        onChange={e => setStudentCount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-indigo-400 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs font-black italic">{studentCount} Siswa</span>
                                        <div className="flex flex-wrap gap-2">
                                            {availableLevels.map((level, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setStudentCount(level.max_students)} 
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic transition-all ${studentCount === level.max_students ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}
                                                >
                                                    {level.name} ({level.max_students})
                                                </button>
                                            ))}
                                            {availableLevels.length === 0 && (
                                                <span className="text-[10px] font-bold opacity-50 italic">Harga Tetap</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="space-y-6 mb-10">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Fitur & Item Produk</h3>
                                    
                                    <div className="space-y-3">
                                        {/* Mandatory Items */}
                                        {mandatoryItems.map(item => {
                                            const itemPrice = getItemPrice(item, studentCount);
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-75">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 uppercase italic">{item.name}</p>
                                                            <p className="text-[10px] text-slate-400 italic">
                                                                {item.billing_type === 'free' ? (
                                                                    <span className="text-green-600 font-black uppercase">Gratis</span>
                                                                ) : (
                                                                    <>
                                                                        Rp {new Intl.NumberFormat('id-ID').format(itemPrice)} 
                                                                        {item.billing_type === 'annual' ? ' / tahun' : ' (Sekali beli)'}
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-blue-600 italic uppercase">Paket Wajib</span>
                                                </div>
                                            );
                                        })}

                                        {/* Optional Items */}
                                        {optionalItems.map(item => {
                                            const itemPrice = getItemPrice(item, studentCount);
                                            return (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => toggleItem(item.id)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] ${selectedItems.includes(item.id) ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedItems.includes(item.id) ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                            {selectedItems.includes(item.id) && (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 uppercase italic">{item.name}</p>
                                                            <p className="text-[10px] text-slate-400 italic">
                                                                {item.billing_type === 'free' ? (
                                                                    <span className="text-green-600 font-black uppercase">Gratis</span>
                                                                ) : (
                                                                    <>
                                                                        + Rp {new Intl.NumberFormat('id-ID').format(itemPrice)}
                                                                        {item.billing_type === 'annual' ? ' / tahun' : ' (Sekali beli)'}
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-black italic uppercase ${selectedItems.includes(item.id) ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                        {selectedItems.includes(item.id) ? 'Terpilih' : 'Optional'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Total Investasi</p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tight italic transition-all duration-300">
                                                Rp {new Intl.NumberFormat('id-ID').format(price)}
                                            </p>
                                        </div>
                                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all text-center uppercase italic tracking-widest">Lihat Live Demo</a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Link 
                                        href={route('checkout', product.slug)} 
                                        data={{ 
                                            selected_items: selectedItems,
                                            student_count: studentCount 
                                        }}
                                        className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-center italic"
                                    >
                                        Lanjut ke Checkout
                                    </Link>
                                    <p className="text-[10px] text-center text-slate-400 font-bold italic uppercase tracking-widest">Transaksi Aman via Midtrans Payment Gateway</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
