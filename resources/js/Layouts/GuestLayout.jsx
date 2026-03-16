import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full px-6">
                <div className="flex justify-center mb-10">
                    <Link href="/">
                        <div className="p-4 bg-white rounded-3xl shadow-xl shadow-indigo-100 hover:scale-110 transition-transform duration-300">
                            <ApplicationLogo className="h-16 w-16 fill-current text-indigo-600" />
                        </div>
                    </Link>
                </div>

                <div className="w-full sm:max-w-md mx-auto">
                    <div className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 relative overflow-hidden">
                        {/* Glass edge highlight */}
                        <div className="absolute inset-0 border border-white/50 rounded-[2.5rem] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} Admin Panel Core • Premium Experience
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
