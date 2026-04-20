import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { PremiumAlert } from '@/Utils/alert';

export default function Index({ auth, banners }) {
    const deleteBanner = (id) => {
        PremiumAlert.confirm(
            'Hapus Banner',
            'Apakah Anda yakin ingin menghapus banner ini?'
        ).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.hero.destroy', id), {
                    onSuccess: () => PremiumAlert.success('Berhasil', 'Banner berhasil dihapus')
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black leading-tight text-slate-900 uppercase tracking-tight">Hero Banners</h2>
                        <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Kelola gambar promosi di halaman Landing Page.</p>
                    </div>
                    <Link
                        href={route('admin.hero.create')}
                        className="group relative flex items-center justify-center gap-3 px-8 h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all duration-500 shadow-xl shadow-indigo-100 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="relative z-10">Tambah Banner</span>
                    </Link>
                </div>
            }
        >
            <Head title="Hero Banners | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {banners.data.map((banner) => (
                            <div key={banner.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                                        <span className={`self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-2 ${banner.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {banner.status}
                                        </span>
                                        <h4 className="text-white font-black uppercase leading-none">{banner.title}</h4>
                                    </div>
                                </div>
                                <div className="p-6 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400">Order: {banner.order_index}</span>
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
                    <Pagination links={banners.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
