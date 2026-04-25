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
        <div className="bg-[#050505] min-h-screen text-white antialiased selection:bg-blue-600 selection:text-white font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Checkout | Simak Buy" />
            
            <Navbar />

            <main className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_70%)] -z-10"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16 px-4">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase mb-4">Gerbang <span className="text-blue-500">Pembayaran.</span></h1>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed">Konfirmasi pesanan Anda dan mulai transformasi digital sekolah hari ini.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-2xl shadow-blue-600/30">1</div>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-3">Registrasi</span>
                            </div>
                            <div className="w-16 h-px bg-white/5"></div>
                            <div className="flex flex-col items-center opacity-20">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-sm font-bold border border-white/10">2</div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-3">Pembayaran</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Kiri: Ringkasan Pesanan */}
                        <div className="lg:col-span-4 order-2 lg:order-1">
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 sticky top-32 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] -z-10"></div>
                                
                                <div className="mb-10">
                                    <div className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Identitas Paket</div>
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">{product.name}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{product.description}</p>
                                </div>
                                
                                <div className="space-y-6 mb-12">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Komponen Terpilih:</div>
                                    <div className="space-y-4">
                                        {mandatoryItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm font-semibold text-slate-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span className="text-[10px] text-green-500 font-bold uppercase">Termasuk</span>
                                            </div>
                                        ))}

                                        {optionalItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm font-semibold text-blue-400">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                                    <span>{item.name} (Tambahan)</span>
                                                </div>
                                                <span className="text-[10px] text-green-500 font-bold uppercase">Termasuk</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>PPN (12%)</span>
                                        <span>Rp {new Intl.NumberFormat('id-ID').format(totalPrice * 0.12)}</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Total Investasi</span>
                                        <div className="text-3xl font-bold tracking-tighter text-white">
                                            Rp {new Intl.NumberFormat('id-ID').format(totalPrice * 1.12)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Authentikasi & Form */}
                        <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
                            {!auth.user ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Register Card */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] transition-all group flex flex-col">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-600/20 group-hover:scale-105 transition-transform">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">Akun Baru</h4>
                                        <p className="text-base text-slate-400 font-medium mb-12 leading-relaxed">Belum memiliki akun? Daftarkan sekolah Anda sekarang untuk melanjutkan pemesanan.</p>
                                        <Link href={route('register')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-center mt-auto active:scale-95">Daftar Akun</Link>
                                    </div>

                                    {/* Login Card */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] transition-all group flex flex-col">
                                        <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:scale-105 transition-transform">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">Masuk</h4>
                                        <p className="text-base text-slate-400 font-medium mb-12 leading-relaxed">Sudah memiliki akun? Masuk untuk menggunakan profil sekolah yang telah terdaftar.</p>
                                        <Link href={route('login')} className="w-full py-5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/5 transition-all uppercase tracking-widest text-center mt-auto active:scale-95">Masuk Sekarang</Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-10">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 backdrop-blur-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                        
                                        <div className="flex items-center justify-between mb-12">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">Data Pendaftar</h3>
                                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Profil Sekolah Terverifikasi</p>
                                                </div>
                                            </div>
                                            <span className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-widest">Terverifikasi</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institusi</p>
                                                <p className="text-xl font-bold text-white">{auth.user.school_name}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nomor Identitas (NPSN)</p>
                                                <p className="text-xl font-bold text-white">{auth.user.npsn}</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Perwakilan Sekolah</p>
                                                <p className="text-lg font-bold text-slate-300">{auth.user.name} <span className="mx-3 text-slate-600">/</span> {auth.user.email} <span className="mx-3 text-slate-600">/</span> {auth.user.phone_number}</p>
                                            </div>
                                        </div>

                                        <hr className="border-white/5 mb-12" />

                                        <div className="space-y-8">
                                            <div>
                                                <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4 block">Konfigurasi Domain (.sch.id)</label>
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1 relative">
                                                        <div className="flex items-center bg-white/[0.04] rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden border border-white/5 group">
                                                            <input 
                                                                type="text"
                                                                value={data.domain.replace('.sch.id', '')}
                                                                onChange={e => {
                                                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                                    setData('domain', val);
                                                                    setDomainStatus(null);
                                                                }}
                                                                className="flex-1 px-6 py-5 bg-transparent border-none focus:ring-0 text-base font-bold text-white placeholder:text-slate-600" 
                                                                placeholder="namasekolahanda"
                                                            />
                                                            <span className="px-6 py-5 bg-white/5 text-slate-400 font-bold text-base border-l border-white/5">.sch.id</span>
                                                        </div>
                                                        {domainStatus && (
                                                            <p className={`absolute -bottom-6 left-2 text-[10px] font-bold tracking-widest uppercase ${domainStatus.available ? 'text-green-500' : 'text-red-500'}`}>
                                                                {domainStatus.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={checkDomain}
                                                        disabled={isChecking || !data.domain}
                                                        className="px-10 py-5 bg-white text-black active:scale-95 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30"
                                                    >
                                                        {isChecking ? 'Memproses...' : 'Verifikasi Domain'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">Catatan Operasional</label>
                                                <textarea 
                                                    value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    rows="4" 
                                                    className="w-full px-6 py-5 bg-white/[0.04] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base font-medium text-white placeholder:text-slate-600" 
                                                    placeholder="Contoh: Tambah fitur integrasi dapodik khusus..."
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-12 p-8 bg-blue-600/5 rounded-2xl border border-blue-600/10">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-blue-600/20 text-blue-500 rounded-xl">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-tight mb-1">Informasi Protokol</p>
                                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Domain .sch.id memerlukan verifikasi dokumen legal sekolah setelah pembayaran dikonfirmasi.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
 
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-[0.1em] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        Selesaikan Pesanan & Bayar
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
