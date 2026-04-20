import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';

export default function Checkout({ product, selectedItemIds = [], studentCount = 250 }) {
    const { auth } = usePage().props;
    
    const getItemPrice = (item, count) => {
        if (item.billing_type === 'free') {
            return 0;
        }

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
        const matchedTier = [...item.tiers]
            .sort((a, b) => a.max_students - b.max_students)
            .find(tier => tier.max_students >= count);
            
        if (matchedTier) {
            return parseFloat(matchedTier.price);
        }
        const highestTier = [...item.tiers].sort((a, b) => b.max_students - a.max_students)[0];
        return parseFloat(highestTier.price);
    };

    // Logic to calculate total price
    const mandatoryItems = product.items?.filter(item => Number(item.pivot.is_optional) === 0) || [];
    const optionalItems = product.items?.filter(item => {
        return Number(item.pivot.is_optional) === 1 && 
            selectedItemIds.some(id => Number(id) === Number(item.id));
    }) || [];
    
    const totalPrice = useMemo(() => {
        let total = 0;
        mandatoryItems.forEach(item => total += getItemPrice(item, studentCount));
        optionalItems.forEach(item => total += getItemPrice(item, studentCount));
        return total;
    }, [product.price, mandatoryItems, optionalItems, studentCount]);

    const { data, setData, post, processing } = useForm({
        notes: '',
        selected_items: selectedItemIds,
        student_count: studentCount,
        domain: '',
    });

    const [isChecking, setIsChecking] = useState(false);
    const [domainStatus, setDomainStatus] = useState(null);

    const checkDomain = async () => {
        if (!data.domain) {
            setDomainStatus({ available: false, message: 'Nama domain tidak boleh kosong' });
            return;
        }

        setIsChecking(true);
        setDomainStatus(null);
        try {
            const response = await axios.post(route('check-domain'), { domain: data.domain });
            setDomainStatus(response.data);
        } catch (error) {
            console.error('Domain Check Error:', error);
            setDomainStatus({ 
                available: false, 
                message: error.response?.data?.message || error.message || 'Gagal mengecek domain.' 
            });
        } finally {
            setIsChecking(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.domain) {
            alert('Silahkan masukkan nama domain sekolah Anda.');
            return;
        }

        if (domainStatus && !domainStatus.available) {
            alert('Domain yang Anda pilih tidak tersedia.');
            return;
        }

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
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Checkout Pesanan</h2>
                            <p className="text-slate-500 font-medium mt-2">Lengkapi data pendaftaran atau masuk untuk melanjutkan pembayaran.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-100">1</div>
                                <span className="text-[8px] font-bold text-blue-600 uppercase mt-2">Konfirmasi</span>
                            </div>
                            <div className="w-12 h-px bg-slate-200"></div>
                            <div className="flex flex-col items-center opacity-40">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">2</div>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Pembayaran</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Kiri: Produk Detail & Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 sticky top-32">
                                <div className="p-8 pb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest">Ringkasan Pesanan</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-4 mb-2 uppercase">{product.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-6">{product.description}</p>
                                </div>
                                
                                <div className="px-8 pb-8 space-y-4">
                                    <div className="space-y-3">

                                        
                                        
                                        {/* Mandatory Items Sumary */}
                                        {mandatoryItems.map(item => {
                                            const itemPrice = getItemPrice(item, studentCount);
                                            return (
                                                <div key={item.id} className="flex justify-between items-start text-[10px] font-bold text-slate-900">
                                                    <span>✓ {item.name}</span>
                                                    <div className="text-right">
                                                        {item.billing_type === 'free' && (
                                                            <p className="text-green-600">GRATIS</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Selected Optional Items Summary */}
                                        {optionalItems.map(item => {
                                            const itemPrice = getItemPrice(item, studentCount);
                                            return (
                                                <div key={item.id} className="flex justify-between items-start text-[10px] font-bold text-indigo-600">
                                                    <span>+ {item.name} (Opt)</span>
                                                    <div className="text-right">
                                                        {item.billing_type === 'free' && (
                                                            <p className="text-green-600">GRATIS</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                            <span>Subtotal:</span>
                                            <span>Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                            <span>Pajak (12%):</span>
                                            <span>Rp {new Intl.NumberFormat('id-ID').format(totalPrice * 0.12)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Total Investasi:</span>
                                            <span className="text-2xl font-black text-blue-600">Rp {new Intl.NumberFormat('id-ID').format(totalPrice * 1.12)}</span>
                                        </div>
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
                                        <h4 className="text-lg font-black text-slate-900 mb-2 uppercase">Belum Punya Akun?</h4>
                                        <p className="text-xs text-slate-400 font-medium mb-8">Daftarkan sekolah Anda untuk mulai kustomisasi website.</p>
                                        <Link href={route('register')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest mt-auto">Daftar Akun Sekolah</Link>
                                    </div>

                                    {/* Login */}
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2 uppercase">Sudah Punya Akun?</h4>
                                        <p className="text-xs text-slate-400 font-medium mb-8">Masuk untuk melanjutkan pesanan Anda yang tertunda.</p>
                                        <Link href={route('login')} className="w-full py-4 bg-white text-blue-600 border border-blue-100 rounded-2xl font-bold text-xs shadow-sm hover:bg-blue-50 transition-all uppercase tracking-widest mt-auto">Masuk Sekarang</Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Informasi Pembeli</h3>
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest">Terverifikasi</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 mb-10">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Sekolah</p>
                                                <p className="text-base font-bold text-slate-900">{auth.user.school_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NPSN</p>
                                                <p className="text-base font-bold text-slate-900">{auth.user.npsn}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Penanggung Jawab & Kontak</p>
                                                <p className="text-base font-bold text-slate-900">{auth.user.name} ({auth.user.email} / {auth.user.phone_number})</p>
                                            </div>
                                        </div>

                                        <hr className="border-slate-50 mb-10" />

                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Domain Sekolah (.sch.id)</h3>
                                        <div className="flex flex-col md:flex-row gap-4 mb-10">
                                            <div className="flex-1 relative">
                                                <div className="flex items-center bg-slate-50 rounded-[1.5rem] focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden border border-slate-100">
                                                    <input 
                                                        type="text"
                                                        value={data.domain.replace('.sch.id', '')}
                                                        onChange={e => {
                                                            // Only allow alphanumeric and hyphen
                                                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                            setData('domain', val);
                                                            setDomainStatus(null);
                                                        }}
                                                        className="flex-1 px-5 py-4 bg-transparent border-none focus:ring-0 text-sm font-bold" 
                                                        placeholder="sekolahanda"
                                                    />
                                                    <span className="px-5 py-4 bg-slate-100/50 text-slate-400 font-black text-sm">.sch.id</span>
                                                </div>
                                                {domainStatus && (
                                                    <p className={`absolute -bottom-6 left-2 text-[10px] font-black uppercase ${domainStatus.available ? 'text-green-600' : 'text-red-500'}`}>
                                                        {domainStatus.message}
                                                    </p>
                                                )}
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={checkDomain}
                                                disabled={isChecking || !data.domain}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                            >
                                                {isChecking ? 'Checking...' : 'Cek Ketersediaan'}
                                            </button>
                                        </div>

                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Catatan Tambahan</h3>
                                        <textarea 
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows="4" 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                                            placeholder="Ceritakan fitur khusus yang sekolah Anda butuhkan di sini..."
                                        />
                                        
                                        <div className="mt-10 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">Pesanan ini akan langsung diproses setelah konfirmasi pembayaran diterima. Anda dapat memantau status pengerjaan melalui dashboard sekolah.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-base shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-50"
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
