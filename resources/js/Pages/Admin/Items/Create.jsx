import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        description: '',
        status: 'active',
        billing_type: 'one_time',
        tiers: [],
    });

    const addTier = () => {
        setData('tiers', [...data.tiers, { level_name: `Level ${data.tiers.length + 1}`, max_students: '', price: '' }]);
    };

    const removeTier = (index) => {
        setData('tiers', data.tiers.filter((_, i) => i !== index));
    };

    const updateTier = (index, field, value) => {
        const newTiers = [...data.tiers];
        newTiers[index][field] = value;
        setData('tiers', newTiers);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.items.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Item Baru</h2>}
        >
            <Head title="Tambah Item | Admin" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nama Item</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                placeholder="Contoh: Web Profile Sekolah"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Harga Default (Rp)</label>
                                <input 
                                    type="number"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                    placeholder="500000"
                                />
                                {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.price}</p>}
                                <p className="text-[10px] text-slate-400 italic">Digunakan jika tidak ada level harga yang cocok.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Siklus Tagihan</label>
                                <select 
                                    value={data.billing_type}
                                    onChange={e => setData('billing_type', e.target.value)}
                                    className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic appearance-none"
                                >
                                    <option value="one_time">Sekali Beli (One-time)</option>
                                    <option value="annual">Per Tahun (Annual)</option>
                                    <option value="free">Gratis (Free)</option>
                                </select>
                                {errors.billing_type && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.billing_type}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Status</label>
                                <select 
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Tiers Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Pengaturan Level Harga (Berdasarkan Siswa)</label>
                                <button 
                                    type="button"
                                    onClick={addTier}
                                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic hover:text-indigo-700 transition-colors"
                                >
                                    + Tambah Level
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {data.tiers.map((tier, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="col-span-4 space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nama Level</label>
                                            <input 
                                                type="text"
                                                value={tier.level_name}
                                                onChange={e => updateTier(index, 'level_name', e.target.value)}
                                                className="block w-full px-4 py-2 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-xs italic"
                                                placeholder="Level 1"
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Maks Siswa</label>
                                            <input 
                                                type="number"
                                                value={tier.max_students}
                                                onChange={e => updateTier(index, 'max_students', e.target.value)}
                                                className="block w-full px-4 py-2 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-xs italic"
                                                placeholder="250"
                                            />
                                        </div>
                                        <div className="col-span-4 space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Harga (Rp)</label>
                                            <input 
                                                type="number"
                                                value={tier.price}
                                                onChange={e => updateTier(index, 'price', e.target.value)}
                                                className="block w-full px-4 py-2 bg-white border-none rounded-xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-xs italic"
                                                placeholder="100000"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center pb-2">
                                            <button 
                                                type="button"
                                                onClick={() => removeTier(index)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {data.tiers.length === 0 && (
                                    <p className="text-[10px] text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 italic">Belum ada level harga khusus. Klik "Tambah Level" untuk membuat harga dinamis.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Deskripsi</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="5"
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                placeholder="Jelaskan detail item ini..."
                            ></textarea>
                            {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.description}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Link href={route('admin.items.index')} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors italic">Batal</Link>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 italic"
                            >
                                Simpan Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
