import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login() {
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

            <div className="max-w-5xl w-full mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Sisi Kiri: Welcome Back & Info */}
                    <div className="lg:w-1/2 bg-slate-900 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-blue-500/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                            </div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tight mb-6 leading-tight">Selamat Datang <br/><span className="text-blue-500 text-6xl italic leading-[1]">Kembali!</span></h2>
                            <p className="text-slate-400 font-medium italic leading-relaxed mb-10">Masuk ke dashboard untuk mengelola website, memantau pesanan, atau berkonsultasi dengan tim teknis kami.</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest italic text-blue-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                    Pantau Progress Website
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest italic text-blue-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                    Akses Live Chat Support
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest italic text-blue-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                    Kelola Pembayaran Aman
                                </li>
                            </ul>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-slate-800">
                            <p className="text-[10px] font-bold italic uppercase tracking-[0.2em] text-slate-500">Simak Buy &bull; Profesional Digital Partner</p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Form Login */}
                    <div className="lg:w-1/2 p-12 lg:p-16 bg-white flex flex-col justify-center">
                        <div className="max-w-sm mx-auto w-full">
                            <div className="mb-10 text-center">
                                <h3 className="text-3xl font-black text-slate-900 italic uppercase mb-2 leading-tight">Login Akun</h3>
                                <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                                        </div>
                                        <input 
                                            id="email" 
                                            name="email" 
                                            type="email" 
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required 
                                            className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="email@sekolah.sch.id"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                                        {/* Adjusted Link for forgot password if needed */}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                        </div>
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type="password" 
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required 
                                            className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300 italic" 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase">{errors.password}</p>}
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-blue-200 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest italic disabled:opacity-50"
                                    >
                                        Masuk Ke Akun
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-xs text-slate-500 font-bold italic">Belum punya akun? <Link href={route('register')} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 ml-1">Daftar Akun Baru</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
