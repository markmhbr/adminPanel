import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, profile }) {
    const { data, setData, post, processing, errors } = useForm({
        store_name: profile?.store_name || '',
        email: profile?.email || '',
        phone_number: profile?.phone_number || '',
        address: profile?.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.store-profile.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil Toko & Kontak</h2>}
        >
            <Head title="Profil Toko | Admin" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Toko</label>
                            <input 
                                type="text"
                                value={data.store_name}
                                onChange={e => setData('store_name', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                            />
                            {errors.store_name && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.store_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Kontak</label>
                                <input 
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                />
                                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                                <input 
                                    type="text"
                                    value={data.phone_number}
                                    onChange={e => setData('phone_number', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Kantor</label>
                            <textarea 
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows="4"
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-end gap-6 pt-8">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
