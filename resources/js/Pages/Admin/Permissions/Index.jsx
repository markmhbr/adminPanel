import { useState, useMemo, Fragment } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Dialog, Transition } from "@headlessui/react";
import { PremiumAlert } from "@/Utils/alert";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Index({ schools }) {
    const [selectedKabupaten, setSelectedKabupaten] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        db_host: '127.0.0.1',
        db_database: '',
        db_username: '',
        db_password: '',
    });

    // Get unique Kabupaten list
    const kabupatenList = useMemo(() => {
        return [...new Set(schools.map(s => s.kabupaten_kota))].sort();
    }, [schools]);

    // Get unique Kecamatan list based on selected Kabupaten
    const kecamatanList = useMemo(() => {
        if (!selectedKabupaten) return [];
        return [...new Set(
            schools
                .filter(s => s.kabupaten_kota === selectedKabupaten)
                .map(s => s.kecamatan)
        )].sort();
    }, [schools, selectedKabupaten]);

    // Get schools based on selected Kecamatan
    const filteredSchools = useMemo(() => {
        if (!selectedKecamatan) return [];
        return schools.filter(s => 
            s.kabupaten_kota === selectedKabupaten && 
            s.kecamatan === selectedKecamatan
        ).sort((a, b) => a.nama_sekolah.localeCompare(b.nama_sekolah));
    }, [schools, selectedKabupaten, selectedKecamatan]);

    const handleManage = (schoolId) => {
        router.get(`/admin/permissions/${schoolId}`);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                PremiumAlert.success('Tersimpan', 'Konfigurasi database sekolah baru telah berhasil ditambahkan.');
            },
            onError: (err) => {
                if (err.connection) {
                    PremiumAlert.error('Koneksi Gagal', err.connection);
                }
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black leading-tight text-gray-900">
                            Pilih Unit Sekolah
                        </h2>
                        <p className="text-gray-400 font-medium mt-1">Kelola hak akses dan konfigurasi role untuk setiap sekolah.</p>
                    </div>
                    <button
                        onClick={() => {
                            clearErrors();
                            setIsModalOpen(true);
                        }}
                        className="group relative flex items-center justify-center gap-3 px-8 h-14 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl font-black tracking-widest text-xs uppercase transition-all duration-500 shadow-xl shadow-indigo-100 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="relative z-10">Tambah Config Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Pilih Sekolah - Permissions" />

            {/* Premium Add Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl transition-all border border-white">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <Dialog.Title as="h3" className="text-2xl font-black text-gray-900 leading-tight">
                                                Konfigurasi Database Baru
                                            </Dialog.Title>
                                            <p className="text-gray-400 font-medium mt-1">Masukkan detail kredensial database sekolah.</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <InputLabel htmlFor="db_host" value="DB Host" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" />
                                                <TextInput
                                                    id="db_host"
                                                    value={data.db_host}
                                                    onChange={(e) => setData('db_host', e.target.value)}
                                                    className="w-full !rounded-2xl"
                                                />
                                                <InputError message={errors.db_host} />
                                            </div>
                                            <div className="space-y-2">
                                                <InputLabel htmlFor="db_database" value="DB Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" />
                                                <TextInput
                                                    id="db_database"
                                                    value={data.db_database}
                                                    onChange={(e) => setData('db_database', e.target.value)}
                                                    className="w-full !rounded-2xl"
                                                    placeholder="Contoh: db_sekolah_a"
                                                />
                                                <InputError message={errors.db_database} />
                                            </div>

                                            <div className="space-y-2">
                                                <InputLabel htmlFor="db_username" value="Username" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" />
                                                <TextInput
                                                    id="db_username"
                                                    value={data.db_username}
                                                    onChange={(e) => setData('db_username', e.target.value)}
                                                    className="w-full !rounded-2xl"
                                                />
                                                <InputError message={errors.db_username} />
                                            </div>

                                            <div className="space-y-2">
                                                <InputLabel htmlFor="db_password" value="Password" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" />
                                                <TextInput
                                                    id="db_password"
                                                    type="password"
                                                    value={data.db_password}
                                                    onChange={(e) => setData('db_password', e.target.value)}
                                                    className="w-full !rounded-2xl"
                                                />
                                                <InputError message={errors.db_password} />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-gray-50">
                                            <SecondaryButton 
                                                type="button" 
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-8 h-12"
                                            >
                                                Batal
                                            </SecondaryButton>
                                            <PrimaryButton 
                                                disabled={processing}
                                                className="px-8 h-12"
                                            >
                                                {processing ? 'Menghubungkan...' : 'Simpan Konfigurasi'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className="py-0 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Filter Card - Full Width Matching Header */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-100/30 overflow-hidden border border-white relative group transition-all duration-500 hover:shadow-indigo-200/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-30 -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="relative z-10 p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0 hidden lg:block">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 rotate-3 transition-transform duration-500 group-hover:rotate-0">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-6.414-6.414A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    {/* Kabupaten Select */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Wilayah Kabupaten / Kota</label>
                                        <div className="relative group/select">
                                            <select 
                                                className="w-full h-14 pl-6 pr-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 appearance-none !bg-none transition-all duration-300 text-gray-900 font-bold shadow-sm"
                                                value={selectedKabupaten}
                                                onChange={(e) => {
                                                    setSelectedKabupaten(e.target.value);
                                                    setSelectedKecamatan("");
                                                }}
                                            >
                                                <option value="">Semua Kabupaten</option>
                                                {kabupatenList.map(kab => (
                                                    <option key={kab} value={kab}>{kab}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-indigo-600 transition-colors">
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kecamatan Select */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kecamatan Unit</label>
                                        <div className="relative group/select">
                                            <select 
                                                className={`w-full h-14 pl-6 pr-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 appearance-none !bg-none transition-all duration-300 text-gray-900 font-bold shadow-sm ${!selectedKabupaten ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                value={selectedKecamatan}
                                                disabled={!selectedKabupaten}
                                                onChange={(e) => setSelectedKecamatan(e.target.value)}
                                            >
                                                <option value="">Pilih Kecamatan</option>
                                                {kecamatanList.map(kec => (
                                                    <option key={kec} value={kec}>{kec}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-indigo-600 transition-colors">
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* School Grid */}
                    {selectedKecamatan && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
                                    <span className="bg-indigo-600 w-2 h-8 rounded-full mr-4"></span>
                                    Daftar Sekolah di {selectedKecamatan}
                                    <span className="ml-4 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black border border-indigo-100">
                                        {filteredSchools.length} Sekolah
                                    </span>
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredSchools.map((school, idx) => (
                                    <div 
                                        key={school.id} 
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-xl shadow-gray-100 hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4"
                                    >
                                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        
                                        <h4 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                            {school.nama_sekolah}
                                        </h4>
                                        <div className="flex flex-col gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">
                                            <span className="flex items-center">
                                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {school.kabupaten_kota}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {school.kecamatan}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => handleManage(school.id)}
                                            className="w-full h-14 bg-gray-900 group-hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs transition-all duration-300 shadow-xl shadow-gray-100 group-hover:shadow-indigo-100 transform active:scale-95"
                                        >
                                            Kelola Izin Akses
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!selectedKecamatan && (
                        <div className="py-20 text-center animate-in fade-in duration-1000">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                 <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h5 className="text-xl font-black text-gray-300 tracking-tight uppercase tracking-widest">Silakan pilih wilayah sekolah</h5>
                            <p className="text-gray-300 font-medium mt-2">Daftar sekolah akan muncul secara otomatis setelah Kecamatan dipilih.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}