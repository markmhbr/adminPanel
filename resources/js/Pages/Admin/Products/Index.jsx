import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, products }) {
    const deleteProduct = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black leading-tight text-slate-900 italic uppercase tracking-tight">Kelola Produk</h2>
                        <p className="text-slate-400 font-bold text-xs mt-1 italic uppercase tracking-widest">Daftar paket utama aplikasi yang ditawarkan.</p>
                    </div>
                    <Link
                        href={route('admin.products.create')}
                        className="group relative flex items-center justify-center gap-3 px-8 h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all duration-500 shadow-xl shadow-indigo-100 hover:-translate-y-1 overflow-hidden italic"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="relative z-10">Tambah Produk</span>
                    </Link>
                </div>
            }
        >
            <Head title="Kelola Produk | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl shadow-slate-200/40 sm:rounded-[2.5rem] border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Harga</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Demo</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                                                        {product.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{product.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-2 italic line-clamp-1">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-sm font-black text-indigo-600 italic">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <a href={product.demo_url} target="_blank" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors italic">Visit Demo &rarr;</a>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination links={products.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
