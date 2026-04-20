import { Head, useForm } from '@inertiajs/react';

export default function VerifyOtp({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('user.verify'));
    };

    const handleResend = (e) => {
        e.preventDefault();
        // We use a simple post request for resending
        post(route('user.resend_otp'), {
            onSuccess: () => {
                // Success message is handled by flash messages or internal state
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Plus Jakarta Sans', sans-serif]">
            <Head title="Verifikasi Akun | Simak Buy" />

            <div className="max-w-5xl w-full mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[550px]">
                    
                    {/* Sisi Kiri: Ilustrasi & Status */}
                    <div className="lg:w-1/2 bg-blue-600 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-center items-center text-center">
                        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/20">
                                <svg className="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Cek Email Anda</h2>
                            <p className="text-blue-100 font-medium leading-relaxed max-w-xs mx-auto">
                                Kami telah mengirimkan kode OTP rahasia ke alamat email sekolah Anda untuk memastikan keamanan akun.
                            </p>

                            <div className="mt-10 p-4 bg-indigo-900/30 rounded-2xl border border-white/10 inline-block">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Email Tujuan:</p>
                                <p className="text-sm font-black text-white">{email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Input OTP */}
                    <div className="lg:w-1/2 p-12 lg:p-16 bg-white flex flex-col justify-center">
                        <div className="max-w-sm mx-auto w-full">
                            <div className="mb-10 text-center lg:text-left">
                                <h3 className="text-3xl font-black text-slate-900 uppercase mb-2">Verifikasi</h3>
                                <div className="w-12 h-1.5 bg-blue-600 rounded-full mb-6 lg:mx-0 mx-auto"></div>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                <div className="space-y-4">
                                    <label htmlFor="code" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center lg:text-left ml-1">Kode OTP (6 Digit)</label>
                                    <input 
                                        id="code" 
                                        name="code" 
                                        type="text" 
                                        maxLength="6" 
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        required 
                                        className="block w-full px-6 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-4xl font-black tracking-[0.5em] text-center text-slate-700 placeholder:text-slate-200 shadow-inner" 
                                        placeholder="000000"
                                    />
                                    {errors.code && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center mt-2">{errors.code}</p>}
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full flex justify-center items-center gap-3 py-5 px-4 rounded-2xl shadow-xl shadow-blue-200 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                                    >
                                        Verifikasi Sekarang
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Belum menerima kode? 
                                <button 
                                    onClick={handleResend}
                                    disabled={processing}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 transition-all ml-1 font-bold disabled:opacity-50"
                                >
                                    Kirim Ulang
                                </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
