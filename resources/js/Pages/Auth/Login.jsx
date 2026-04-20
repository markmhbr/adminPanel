import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Masuk Akun Sekolah | Simak Buy" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-w-5xl w-full mx-auto"
            >
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Sisi Kiri: Welcome Back & Info */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:w-1/2 bg-slate-900 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <motion.div 
                                initial={{ rotate: -15, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                                className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-blue-500/20"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                            </motion.div>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-6 leading-tight">Selamat Datang <br/><span className="text-blue-500 text-6xl leading-[1]">Kembali!</span></h2>
                            <p className="text-slate-400 font-medium leading-relaxed mb-10">Masuk ke dashboard untuk mengelola website, memantau pesanan, atau berkonsultasi dengan tim teknis kami.</p>
                            
                            <ul className="space-y-4">
                                {[
                                    'Pantau Progress Website',
                                    'Akses Live Chat Support',
                                    'Kelola Pembayaran Aman'
                                ].map((item, i) => (
                                    <motion.li 
                                        key={item}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                        className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-400"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-slate-800">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Simak Buy &bull; Profesional Digital Partner</p>
                        </div>
                    </motion.div>

                    {/* Sisi Kanan: Form Login */}
                    <div className="lg:w-1/2 p-12 lg:p-16 bg-white flex flex-col justify-center">
                        <div className="max-w-sm mx-auto w-full">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mb-10 text-center"
                            >
                                <h3 className="text-3xl font-black text-slate-900 uppercase mb-2 leading-tight">Login Akun</h3>
                                <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-6">
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="space-y-2"
                                >
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                                        </div>
                                        <input 
                                            id="email" 
                                            name="email" 
                                            type="email" 
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required 
                                            className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                            placeholder="email@sekolah.sch.id"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.email}</p>}
                                </motion.div>

                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="space-y-2"
                                >
                                    <div className="flex justify-between items-center px-1">
                                        <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                        </div>
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required 
                                            className="block w-full pl-12 pr-14 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300" 
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password}</p>}
                                </motion.div>

                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="pt-4"
                                >
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-blue-200 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Masuk Ke Akun
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 text-center"
                            >
                                <p className="text-xs text-slate-500 font-bold">Belum punya akun? <Link href={route('register')} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 ml-1">Daftar Akun Baru</Link></p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
