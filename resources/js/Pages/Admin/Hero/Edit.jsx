import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, banner }) {
    const { data, setData, put, processing, errors } = useForm({
        title: banner.title,
        subtitle: banner.subtitle,
        image_url: banner.image_url,
        button_text: banner.button_text,
        button_link: banner.button_link,
        status: banner.status,
        order_index: banner.order_index,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.hero.update', banner.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight italic">Edit Hero Banner</h2>}
        >
            <Head title="Edit Banner | Admin" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Judul Banner</label>
                            <input 
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                            />
                            {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.title}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Sub Judul</label>
                            <input 
                                type="text"
                                value={data.subtitle}
                                onChange={e => setData('subtitle', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Image URL</label>
                            <input 
                                type="url"
                                value={data.image_url}
                                onChange={e => setData('image_url', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                            />
                            {errors.image_url && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.image_url}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Button Text</label>
                                <input 
                                    type="text"
                                    value={data.button_text}
                                    onChange={e => setData('button_text', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Button Link</label>
                                <input 
                                    type="text"
                                    value={data.button_link}
                                    onChange={e => setData('button_link', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Status</label>
                                <select 
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Order Index</label>
                                <input 
                                    type="number"
                                    value={data.order_index}
                                    onChange={e => setData('order_index', parseInt(e.target.value))}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold italic"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-6 pt-8">
                            <Link href={route('admin.hero.index')} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 italic">Batal</Link>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 italic"
                            >
                                Perbarui Banner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
