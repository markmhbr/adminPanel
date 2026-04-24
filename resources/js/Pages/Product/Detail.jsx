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
        <div className="bg-[#050505] min-h-screen text-white antialiased selection:bg-blue-600 selection:text-white font-['Plus Jakarta Sans', sans-serif]">
            <Head title={`${product.name} | Simak Buy`} />
            
            <Navbar />

            <main className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_70%)] -z-10"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Product Image / Visual */}
                        <div className="space-y-8 sticky top-32">
                            <div className="group relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-[3rem] p-16 aspect-square flex flex-col justify-center items-center text-white overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/10">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] transition-opacity duration-700 group-hover:opacity-100 opacity-50"></div>
                                <svg className="w-40 h-40 opacity-20 mb-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <h2 className="text-5xl font-black text-center tracking-tighter leading-none uppercase z-10">{product.name}</h2>
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-125"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 text-center backdrop-blur-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Build Duration</p>
                                    <p className="text-lg font-bold text-white">3-7 Working Days</p>
                                </div>
                                <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 text-center backdrop-blur-xl">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tech Support</p>
                                    <p className="text-lg font-bold text-white">Priority 24/7</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-10">
                            <div className="bg-white/[0.02] rounded-[3rem] p-10 lg:p-14 border border-white/5 shadow-2xl backdrop-blur-3xl relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] -z-10"></div>
                                
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Enterprise Edition</span>
                                    <span className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Production Ready</span>
                                </div>

                                <h1 className="text-5xl font-black text-white leading-none mb-8 uppercase tracking-tighter">{product.name}</h1>
                                
                                <div className="mb-12">
                                    <p className="text-lg text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>


                                {/* Items Section */}
                                <div className="space-y-8 mb-12">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Components & Modules</h3>
                                    
                                    <div className="space-y-4">
                                        {/* Mandatory Items */}
                                        {mandatoryItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-6 bg-white/[0.05] rounded-3xl border border-white/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-600/10">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-white uppercase tracking-tight">{item.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Included in Package</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-md border border-blue-500/10">Paket Wajib</span>
                                            </div>
                                        ))}

                                        {/* Optional Items */}
                                        {optionalItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => toggleItem(item.id)}
                                                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer select-none active:scale-[0.98] group ${selectedItems.includes(item.id) ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-600/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${selectedItems.includes(item.id) ? 'bg-white text-indigo-600' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                                                        {selectedItems.includes(item.id) ? (
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full border-2 border-current"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-base font-bold uppercase tracking-tight ${selectedItems.includes(item.id) ? 'text-white' : 'text-slate-300'}`}>{item.name}</p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedItems.includes(item.id) ? 'text-indigo-200' : 'text-slate-500'}`}>Optional Module</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedItems.includes(item.id) ? 'text-white' : 'text-slate-400'}`}>
                                                    {selectedItems.includes(item.id) ? 'Addon Active' : 'Optional'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-[2.5rem] p-10 mb-12 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-4 h-full bg-blue-600 transition-all duration-700 group-hover:w-full -z-10 opacity-10"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10">
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Investment Summary</p>
                                            <p className="text-5xl font-bold text-white tracking-tighter transition-all duration-300">
                                                Rp {new Intl.NumberFormat('id-ID').format(price)}
                                            </p>
                                        </div>
                                        <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="px-10 py-4 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/5 transition-all text-center uppercase tracking-widest">Live Preview</a>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Link 
                                        href={route('checkout', product.slug)} 
                                        data={{ 
                                            selected_items: selectedItems,
                                            student_count: studentCount 
                                        }}
                                        className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-[0.1em] text-center block"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.397 9.267-6 11.588-3.603-2.321-6-6.642-6-11.587 0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                        Secured via Global Payment Gateway
                                    </div>
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
