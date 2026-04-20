import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-full mx-auto"
            >
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
                    
                    {/* Sisi Kiri: Petunjuk Alur & Branding */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:w-5/12 bg-blue-600 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8 leading-tight">Langkah Memulai <br/><span className="text-blue-200 text-6xl leading-[1]">Website Impian</span></h2>
                            
                            <div className="space-y-12 relative">
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-blue-400/30"></div>
                                
                                {[
                                    { step: 1, title: 'Identitas Sekolah', desc: 'Masukkan NPSN dan Nama Sekolah Anda untuk sinkronisasi data.' },
                                    { step: 2, title: 'Keamanan & Kontak', desc: 'Gunakan email aktif dan nomor WhatsApp untuk koordinasi teknis.', opacity: 'opacity-70' },
                                    { step: 3, title: 'Pilih Template', desc: 'Setelah verifikasi, Anda bisa langsung memilih katalog website terbaik.', opacity: 'opacity-70' }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={item.step}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className={`relative flex items-start gap-6 group ${item.opacity || ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg relative z-10 transition-transform ${item.step === 1 ? 'bg-white text-blue-600 group-hover:scale-110' : 'bg-blue-500 border-2 border-blue-400 text-white'}`}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className={`font-black uppercase text-sm mb-1 ${item.step === 1 ? '' : 'text-blue-200'}`}>{item.title}</h4>
                                            <p className={`text-xs font-medium leading-relaxed ${item.step === 1 ? 'text-blue-100' : 'text-blue-200/70'}`}>{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="relative z-10 pt-12"
                        >
                            <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <img className="w-8 h-8 rounded-full border-2 border-blue-600" src="https://ui-avatars.com/api/?name=U1" alt=""/>
                                        <img className="w-8 h-8 rounded-full border-2 border-blue-600" src="https://ui-avatars.com/api/?name=U2" alt=""/>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Bergabung dengan 500+ Sekolah lainnya.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Sisi Kanan: Form */}
                    <div className="lg:w-7/12 p-12 lg:p-16 bg-white flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-10 text-center lg:text-left"
                            >
                                <h3 className="text-3xl font-black text-slate-900 uppercase mb-2 leading-tight">Pendaftaran Akun</h3>
                                <p className="text-sm text-slate-500 font-medium">Silakan lengkapi data di bawah ini untuk memulai.</p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-2">
                                        <label htmlFor="npsn" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NPSN</label>
                                        <input 
                                            id="npsn" 
                                            name="npsn" 
                                            type="text" 
                                            value={data.npsn}
                                            onChange={(e) => setData('npsn', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                            placeholder="Masukkan NPSN"
                                        />
                                        {errors.npsn && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.npsn}</p>}
                                    </motion.div>

                                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }} className="space-y-2">
                                        <label htmlFor="school_name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Sekolah</label>
                                        <input 
                                            id="school_name" 
                                            name="school_name" 
                                            type="text" 
                                            value={data.school_name}
                                            onChange={(e) => setData('school_name', e.target.value)}
                                            required 
                                            className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                            placeholder="Nama Sekolah"
                                        />
                                        {errors.school_name && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.school_name}</p>}
                                    </motion.div>
                                </div>

                                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-2">
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</label>
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required 
                                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.email}</p>}
                                </motion.div>

                                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }} className="space-y-2">
                                    <label htmlFor="phone_number" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                    <input 
                                        id="phone_number" 
                                        name="phone_number" 
                                        type="text" 
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        required 
                                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                        placeholder="0812xxxx"
                                    />
                                    {errors.phone_number && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.phone_number}</p>}
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-2 group">
                                        <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                                        <div className="relative">
                                            <input 
                                                id="password" 
                                                name="password" 
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required 
                                                className="block w-full px-5 py-4 pr-12 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                                placeholder="••••••••"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors">
                                                {showPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password}</p>}
                                    </motion.div>
                                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.65 }} className="space-y-2 group">
                                        <label htmlFor="password_confirmation" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</label>
                                        <div className="relative">
                                            <input 
                                                id="password_confirmation" 
                                                name="password_confirmation" 
                                                type={showConfirm ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required 
                                                className="block w-full px-5 py-4 pr-12 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                                placeholder="••••••••"
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors">
                                                {showConfirm ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password_confirmation}</p>}
                                    </motion.div>
                                </div>

                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-blue-200 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Lanjutkan & Kirim OTP
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 text-center">
                                <p className="text-xs text-slate-500 font-bold">Sudah punya akun? <Link href={route('login')} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 ml-1">Masuk Sekarang</Link></p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
