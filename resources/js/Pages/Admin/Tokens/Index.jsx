import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PremiumAlert } from '@/Utils/alert';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, tokens }) {
    const [copying, setCopying] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('admin-panel');
    
    // Filter tokens based on active tab
    const filteredTokens = useMemo(() => {
        return tokens.data.filter(t => (t.type || 'admin-panel') === activeTab);
    }, [tokens.data, activeTab]);

    const activeToken = useMemo(() => {
        return filteredTokens.filter(t => t.is_active).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    }, [filteredTokens]);

    const hasToken = filteredTokens.length > 0;

    const handleGenerate = () => {
        if (hasToken) {
            PremiumAlert.error('Token sudah ada untuk kategori ini.');
            return;
        }

        setIsGenerating(true);
        fetch(route('admin.tokens.generate'))
            .then(res => res.json())
            .then(result => {
                router.post(route('admin.tokens.store'), {
                    token: result.token,
                    type: activeTab
                }, {
                    onSuccess: () => {
                        setIsGenerating(false);
                        PremiumAlert.success('Token Baru Berhasil Dibuat');
                    },
                    onError: () => setIsGenerating(false)
                });
            })
            .catch(() => setIsGenerating(false));
    };

    const handleDelete = (id) => {
        PremiumAlert.confirm(
            'Hapus Token?',
            'Akses menggunakan token ini tidak akan bisa terhubung lagi.',
            () => {
                router.delete(route('admin.tokens.destroy', id), {
                    onSuccess: () => PremiumAlert.success('Terhapus', 'Token telah dihapus.')
                });
            }
        );
    };

    const handleToggle = (id) => {
        router.post(route('admin.tokens.toggle', id), {}, {
            preserveScroll: true
        });
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopying(id);
        setTimeout(() => setCopying(null), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black leading-tight text-slate-900 italic uppercase tracking-tight">Access Tokens</h2>
                        <p className="text-slate-400 font-bold text-xs mt-1 italic uppercase tracking-widest">
                            {activeTab === 'admin-panel' 
                                ? 'Kelola kunci akses API untuk project sekolah.' 
                                : 'Kelola kunci akses untuk integrasi data eksternal.'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title='Access Tokens - Admin Panel' />

            <div className='py-12'>
                <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8'>
                    
                    {/* Tabs System */}
                    <div className='flex justify-center'>
                        <div className='inline-flex p-1 bg-gray-100 rounded-2xl'>
                            <button 
                                onClick={() => setActiveTab('admin-panel')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'admin-panel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Admin Panel
                            </button>
                            <button 
                                onClick={() => setActiveTab('external-api')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'external-api' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                External API
                            </button>
                        </div>
                    </div>

                    {/* Main Token Card */}
                    <div className='relative group'>
                        <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200'></div>
                        
                        <div className='relative bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl overflow-hidden'>
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12'>
                                <div>
                                    <h3 className='text-xl font-black text-gray-900 flex items-center gap-3'>
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${activeToken ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {activeTab === 'admin-panel' ? 'Primary Access Key' : 'Hexanusa Data Key'}
                                    </h3>
                                    <p className='text-gray-400 text-sm font-medium mt-1'>
                                        {activeTab === 'admin-panel' 
                                            ? 'Gunakan token ini untuk sinkronisasi database sekolah.' 
                                            : 'Gunakan header X-Admin-Hexanusa-Key untuk akses data.'}
                                    </p>
                                </div>
                                
                                {!hasToken && (
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className='group/btn relative inline-flex items-center justify-center gap-3 px-8 h-12 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all duration-500 active:scale-95 disabled:opacity-50'
                                    >
                                        {isGenerating ? (
                                            <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                        ) : (
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M12 4v16m8-8H4' />
                                            </svg>
                                        )}
                                        <span>{isGenerating ? 'Generating...' : 'Generate Baru'}</span>
                                    </button>
                                )}
                            </div>

                            <div className='bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-inner text-center relative'>
                                {activeToken ? (
                                    <>
                                        <div className='font-mono text-xl md:text-3xl font-black text-gray-900 break-all leading-tight mb-10 tracking-tight'>
                                            {activeToken.token}
                                        </div>
                                        
                                        <div className='flex justify-center'>
                                            <button 
                                                onClick={() => copyToClipboard(activeToken.token, 'main')}
                                                className='group/copy flex items-center justify-center gap-4 px-12 h-16 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 hover:border-indigo-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg shadow-indigo-100/50 active:scale-95'
                                            >
                                                {copying === 'main' ? (
                                                    <>
                                                        <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7' />
                                                        </svg>
                                                        Copied to Clipboard!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3' />
                                                        </svg>
                                                        Copy Access Key
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className='py-8'>
                                        <p className='text-gray-400 font-bold uppercase tracking-widest italic'>Belum ada token aktif</p>
                                        <p className='text-gray-400 text-xs mt-2'>Klik 'Generate Baru' untuk memulai</p>
                                    </div>
                                )}
                            </div>

                            <div className='mt-10 flex flex-wrap justify-center gap-8'>
                                <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400'>
                                    <span className='w-2 h-2 rounded-full bg-indigo-200'></span>
                                    Header Name: <code className='bg-gray-100 px-2 py-0.5 rounded text-indigo-600'>{activeTab === 'admin-panel' ? 'ADMIN_PANEL_ACCESS_KEY' : 'X-Admin-Hexanusa-Key'}</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History List */}
                    {filteredTokens.length > 0 && (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between px-4'>
                                <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-400'>Daftar Token ({activeTab})</h4>
                                <div className='h-px bg-gray-100 flex-grow ml-6'></div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {filteredTokens.map((token) => (
                                    <div key={token.id} className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex items-center gap-4 ${token.is_active ? 'border-indigo-100 shadow-sm' : 'border-gray-100 opacity-60 grayscale'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${token.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                                            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                                            </svg>
                                        </div>
                                        
                                        <div className='flex-grow min-w-0'>
                                            <div className='font-mono text-[10px] text-gray-400 truncate mb-1'>{token.token}</div>
                                            <div className='flex items-center gap-2'>
                                                <span className={`w-1.5 h-1.5 rounded-full ${token.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                <span className='text-[10px] font-black uppercase tracking-widest text-gray-400'>{token.is_active ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </div>

                                        <div className='flex gap-1'>
                                            <button onClick={() => copyToClipboard(token.token, token.id)} className='w-9 h-9 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all shadow-none border-none p-0' title='Salin'>
                                                {copying === token.id ? (
                                                    <svg className='w-4 h-4 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7' />
                                                    </svg>
                                                ) : (
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3' />
                                                    </svg>
                                                )}
                                            </button>
                                            <button onClick={() => handleToggle(token.id)} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all shadow-none border-none p-0 ${token.is_active ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`} title={token.is_active ? 'Matikan' : 'Aktifkan'}>
                                                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(token.id)} className='w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-none border-none p-0' title='Hapus'>
                                                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Pagination links={tokens.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
