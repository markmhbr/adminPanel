import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create({ auth, items }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        demo_url: '',
        status: 'published',
        items: [], // [{ id: 1, is_optional: false }]
    });



    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    const toggleItem = (itemId) => {
        const index = data.items.findIndex(i => i.id === itemId);
        if (index === -1) {
            setData('items', [...data.items, { id: itemId, is_optional: false }]);
        } else {
            setData('items', data.items.filter(i => i.id !== itemId));
        }
    };

    const setOptional = (itemId, isOptional) => {
        setData('items', data.items.map(i => i.id === itemId ? { ...i, is_optional: isOptional } : i));
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Produk Baru</h2>}
        >
            <Head title="Tambah Produk | Admin" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nama Produk</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                placeholder="Contoh: Website Profile Sekolah Gold"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Status</label>
                                <select 
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic appearance-none"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Pilih Item dalam Produk ini</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map(item => {
                                    const selectedItem = data.items.find(i => i.id === item.id);
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => toggleItem(item.id)}
                                            className={`p-6 border-2 rounded-3xl transition-all cursor-pointer select-none ${selectedItem ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox"
                                                        checked={!!selectedItem}
                                                        onChange={() => {}} // Controlled by card click
                                                        className="w-5 h-5 text-indigo-600 border-none bg-white rounded-lg focus:ring-0 transition-all pointer-events-none"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-black text-slate-900 uppercase italic leading-none block mb-1">{item.name}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase italic ${item.billing_type === 'annual' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {item.billing_type === 'annual' ? 'Tagihan Tahunan' : 'Sekali Beli'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-black text-indigo-600 italic">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</span>
                                            </div>
                                            
                                            {selectedItem && (
                                                <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase italic">Sifat Item:</span>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setOptional(item.id, false)}
                                                                className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all italic ${!selectedItem.is_optional ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                                                            >
                                                                Wajib
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => setOptional(item.id, true)}
                                                                className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all italic ${selectedItem.is_optional ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                                                            >
                                                                Opsional
                                                            </button>
                                                        </div>
                                                    </div>


                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.items && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.items}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Link Demo</label>
                            <input 
                                type="url"
                                value={data.demo_url}
                                onChange={e => setData('demo_url', e.target.value)}
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                placeholder="https://demo-sekolah.com"
                            />
                            {errors.demo_url && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.demo_url}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Deskripsi</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="5"
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all font-bold text-slate-700 italic"
                                placeholder="Jelaskan fitur-fitur paket ini..."
                            ></textarea>
                            {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.description}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Link href={route('admin.products.index')} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors italic">Batal</Link>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 italic"
                            >
                                Simpan Produk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
