import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        npsn: '',
        school_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Daftar Akun Sekolah | Simak Buy" />

            <div className="max-w-6xl w-full mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
                    
                    {/* Sisi Kiri: Petunjuk Alur & Branding */}
                    <div className="lg:w-5/12 bg-blue-600 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8 leading-tight">Langkah Memulai <br/><span className="text-blue-200 text-6xl italic leading-[1]">Website Impian</span></h2>
                            
                            <div className="space-y-12 relative">
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-blue-400/30"></div>
                                
                                <div className="relative flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black italic shadow-lg relative z-10 group-hover:scale-110 transition-transform">1</div>
                                    <div>
                                        <h4 className="font-black italic uppercase text-sm mb-1">Identitas Sekolah</h4>
                                        <p className="text-xs text-blue-100 font-medium leading-relaxed italic">Masukkan NPSN dan Nama Sekolah Anda untuk sinkronisasi data.</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-6 group opacity-70">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500 border-2 border-blue-400 text-white flex items-center justify-center font-black italic shadow-lg relative z-10">2</div>
                                    <div>
                                        <h4 className="font-black italic uppercase text-sm mb-1 text-blue-200">Keamanan & Kontak</h4>
                                        <p className="text-xs text-blue-200/70 font-medium leading-relaxed italic">Gunakan email aktif dan nomor WhatsApp untuk koordinasi teknis.</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-6 group opacity-70">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500 border-2 border-blue-400 text-white flex items-center justify-center font-black italic shadow-lg relative z-10">3</div>
                                    <div>
                                        <h4 className="font-black italic uppercase text-sm mb-1 text-blue-200">Pilih Template</h4>
                                        <p className="text-xs text-blue-200/70 font-medium leading-relaxed italic">Setelah verifikasi, Anda bisa langsung memilih katalog website terbaik.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-12">
                            <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <img className="w-8 h-8 rounded-full border-2 border-blue-600" src="https://ui-avatars.com/api/?name=U1" alt=""/>
                                        <img className="w-8 h-8 rounded-full border-2 border-blue-600" src="https://ui-avatars.com/api/?name=U2" alt=""/>
                                    </div>
                                    <p className="text-[10px] font-bold italic uppercase tracking-wider text-blue-100">Bergabung dengan 500+ Sekolah lainnya.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Form */}
                    <div className="lg:w-7/12 p-12 lg:p-16 bg-white flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-10 text-center lg:text-left">
                                <h3 className="text-3xl font-black text-slate-900 italic uppercase mb-2 leading-tight">Pendaftaran Akun</h3>
                                <p className="text-sm text-slate-500 font-medium italic">Silakan lengkapi data di bawah ini untuk memulai.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="npsn" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NPSN</label>
                                        <input 
                                            id="npsn" 
                                            name="npsn" 
                                            type="text" 
                                            value={data.npsn}
                                            onChange={(e) => setData('npsn', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="Masukkan NPSN"
                                        />
                                        {errors.npsn && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.npsn}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="school_name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Sekolah</label>
                                        <input 
                                            id="school_name" 
                                            name="school_name" 
                                            type="text" 
                                            value={data.school_name}
                                            onChange={(e) => setData('school_name', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="Nama Sekolah"
                                        />
                                        {errors.school_name && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.school_name}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</label>
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required 
                                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone_number" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                    <input 
                                        id="phone_number" 
                                        name="phone_number" 
                                        type="text" 
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        required 
                                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                        placeholder="0812xxxx"
                                    />
                                    {errors.phone_number && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.phone_number}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type="password" 
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password_confirmation" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</label>
                                        <input 
                                            id="password_confirmation" 
                                            name="password_confirmation" 
                                            type="password" 
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="••••••••"
                                        />
                                        {errors.password_confirmation && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password_confirmation}</p>}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-blue-200 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest italic disabled:opacity-50"
                                    >
                                        Lanjutkan & Kirim OTP
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-xs text-slate-500 font-bold italic">Sudah punya akun? <Link href={route('login')} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 ml-1">Masuk Sekarang</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
