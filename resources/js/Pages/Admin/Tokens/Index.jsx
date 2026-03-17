import { useState, Fragment } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Dialog, Transition } from "@headlessui/react";
import { PremiumAlert } from "@/Utils/alert";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Index({ auth, tokens }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copying, setCopying] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        token: '',
    });

    const generateToken = async () => {
        try {
            const response = await fetch(route('admin.tokens.generate'));
            const result = await response.json();
            setData('token', result.token);
            PremiumAlert.success('Token Berhasil Dibuat', 'Silakan simpan token ini.');
        } catch (error) {
            PremiumAlert.error('Gagal', 'Gagal membuat token otomatis.');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tokens.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                PremiumAlert.success('Tersimpan', 'Access token baru telah berhasil ditambahkan.');
            },
        });
    };

    const handleDelete = (id) => {
        PremiumAlert.confirm(
            'Hapus Token?',
            'Sekolah yang menggunakan token ini tidak akan bisa terhubung lagi.',
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
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black leading-tight text-gray-900">
                            Access Tokens
                        </h2>
                        <p className="text-gray-400 font-medium mt-1">Kelola token keamanan untuk menghubungkan Admin Panel ke project sekolah.</p>
                    </div>
                    <button
                        onClick={() => {
                            clearErrors();
                            setIsModalOpen(true);
                        }}
                        className="group relative flex items-center justify-center gap-3 px-8 h-14 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-xs uppercase transition-all duration-500 shadow-xl shadow-indigo-100 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="relative z-10">Generate Token Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Access Tokens - Admin Panel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Setup Guide Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">Panduan Integrasi Project Sekolah</h3>
                                <p className="text-indigo-100 font-medium mb-4">Salin token yang sudah dibuat dan tempelkan di file <code className="bg-indigo-900/40 px-2 py-0.5 rounded font-mono text-white">.env</code> pada project sekolah Anda dengan kunci berikut:</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl font-mono text-sm border border-white/20 shadow-inner select-all flex-grow md:flex-grow-0">
                                        ADMIN_PANEL_ACCESS_KEY=<span className="text-indigo-300">(token_anda)</span>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard('ADMIN_PANEL_ACCESS_KEY=', 'env-key')}
                                        className="h-12 px-6 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg"
                                    >
                                        Copy Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Token List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tokens.map((token) => (
                            <div key={token.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${token.is_active ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-100 text-gray-400'}`}>
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleToggle(token.id)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${token.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                            title={token.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(token.id)}
                                            className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-gray-900 mb-1">{token.name}</h4>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className={`w-2 h-2 rounded-full ${token.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{token.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                                
                                <div className="relative mt-8">
                                    <div className="bg-gray-50 p-4 rounded-2xl font-mono text-xs text-gray-500 border border-gray-100 shadow-inner break-all pr-12">
                                        {token.token}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(token.token, token.id)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm border border-gray-100 transition-all"
                                    >
                                        {copying === token.id ? (
                                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {tokens.length === 0 && (
                            <div className="col-span-full py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h5 className="text-xl font-black text-gray-400 uppercase tracking-widest">Belum ada Access Token</h5>
                                <p className="text-gray-400 font-medium">Buat token pertama Anda untuk mulai menghubungkan sekolah.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Token Generate Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl transition-all border border-white">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <Dialog.Title as="h3" className="text-2xl font-black text-gray-900 leading-tight">Generate New Access Token</Dialog.Title>
                                            <p className="text-gray-400 font-medium mt-1">Buat token keamanan unik untuk project sekolah.</p>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="space-y-2">
                                            <InputLabel htmlFor="name" value="Nama / Label Token" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" />
                                            <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full !rounded-2xl" placeholder="Contoh: Token Sekolah SMK A" />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <InputLabel htmlFor="token" value="Security Token" className="text-[10px] font-black uppercase tracking-widest text-gray-400" />
                                                <button type="button" onClick={generateToken} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700 transition-colors">
                                                    Generate Random
                                                </button>
                                            </div>
                                            <div className="relative group/input">
                                                <TextInput id="token" value={data.token} onChange={(e) => setData('token', e.target.value)} className="w-full !rounded-2xl font-mono text-sm pr-12" placeholder="Klik generate atau isi manual..." />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <InputError message={errors.token} />
                                        </div>

                                        <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-gray-50">
                                            <SecondaryButton type="button" onClick={() => setIsModalOpen(false)} className="px-8 h-12">Batal</SecondaryButton>
                                            <PrimaryButton disabled={processing} className="px-8 h-12">Simpan Token</PrimaryButton>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AuthenticatedLayout>
    );
}
