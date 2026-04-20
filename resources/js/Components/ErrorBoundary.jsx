import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Core React Error caught by Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-12 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-4 leading-tight">Oh tidak! <br/>Terjadi Kesalahan Sitem</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10">Aplikasi mengalami kendala teknis saat memproses antarmuka. Silakan segarkan halaman untuk mencoba kembali.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-5 rounded-2xl shadow-xl shadow-indigo-100 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                        >
                            Refresh Halaman
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
