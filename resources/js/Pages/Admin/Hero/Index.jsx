import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, banners }) {
    const deleteBanner = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
            router.delete(route('admin.hero.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Hero Banners</h2>
                    <Link
                        href={route('admin.hero.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-xl font-bold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-black italic"
                    >
                        Tambah Banner
                    </Link>
                </div>
            }
        >
            <Head title="Hero Banners | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                                        <span className={`self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest italic mb-2 ${banner.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {banner.status}
                                        </span>
                                        <h4 className="text-white font-black italic uppercase leading-none">{banner.title}</h4>
                                    </div>
                                </div>
                                <div className="p-6 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 italic">Order: {banner.order_index}</span>
                                    <div className="flex gap-2">
                                        <Link href={route('admin.hero.edit', banner.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </Link>
                                        <button onClick={() => deleteBanner(banner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
