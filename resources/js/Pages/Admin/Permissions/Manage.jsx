import { useState, useMemo, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PremiumAlert } from "@/Utils/alert";

export default function Manage({ school, roles, activeRole, groupedPermissions, activeRolePermissions }) {
    const [selectedPermissions, setSelectedPermissions] = useState(activeRolePermissions);
    const [searchRole, setSearchRole] = useState("");
    const [searchPermission, setSearchPermission] = useState("");

    // Sync selected permissions when activeRole change
    useEffect(() => {
        setSelectedPermissions(activeRolePermissions);
    }, [activeRolePermissions]);

    const filteredRoles = useMemo(() => {
        return roles.filter(role => 
            role.name.toLowerCase().includes(searchRole.toLowerCase())
        );
    }, [roles, searchRole]);

    const filteredGroupedPermissions = useMemo(() => {
        const result = {};
        Object.entries(groupedPermissions).forEach(([group, permissions]) => {
            const filtered = permissions.filter(p => 
                p.name.toLowerCase().includes(searchPermission.toLowerCase())
            );
            if (filtered.length > 0) {
                result[group] = filtered;
            }
        });
        return result;
    }, [groupedPermissions, searchPermission]);

    const togglePermission = (id) => {
        setSelectedPermissions(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleGroup = (groupPermissions, checked) => {
        const ids = groupPermissions.map(p => p.id);
        if (checked) {
            setSelectedPermissions(prev => [...new Set([...prev, ...ids])]);
        } else {
            setSelectedPermissions(prev => prev.filter(p => !ids.includes(p)));
        }
    };

    const toggleAll = (checked) => {
        if (checked) {
            const allIds = Object.values(groupedPermissions).flat().map(p => p.id);
            setSelectedPermissions(allIds);
        } else {
            setSelectedPermissions([]);
        }
    };

    const save = () => {
        router.post('/admin/permissions/save', {
            school_id: school.id,
            role_id: activeRole.id,
            data: selectedPermissions.map(id => ({ permission_id: id, role_id: activeRole.id }))
        }, {
            onSuccess: () => PremiumAlert.success('Berhasil!', 'Izin akses telah berhasil disimpan.')
        });
    };

    const syncRoles = async () => {
        const confirm = await PremiumAlert.confirm(
            'Sinkronisasi Role?',
            'Apakah Anda yakin ingin menyinkronkan role dari database sekolah? Ini akan menghapus role yang tidak valid lagi.'
        );
        
        if (confirm.isConfirmed) {
            router.post(route('admin.permissions.sync', [school.id]), {}, {
                onSuccess: () => PremiumAlert.success('Sinkronisasi Selesai', 'Role berhasil disinkronkan dari database sekolah.')
            });
        }
    };

    const isGroupAllChecked = (groupPermissions) => {
        return groupPermissions.every(p => selectedPermissions.includes(p.id));
    };

    const isAllChecked = useMemo(() => {
        const allPermissions = Object.values(groupedPermissions).flat();
        return allPermissions.length > 0 && allPermissions.every(p => selectedPermissions.includes(p.id));
    }, [groupedPermissions, selectedPermissions]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 mr-4">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black leading-tight text-gray-900">
                                Manajemen Hak Akses
                            </h2>
                            <p className="text-gray-400 font-medium text-sm flex items-center mt-0.5">
                                <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mr-2 border border-indigo-100">School</span>
                                {school.nama_sekolah}
                            </p>
                        </div>
                    </div>
                    {activeRole && (
                        <button
                            onClick={save}
                            className="bg-indigo-600 hover:bg-black text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            SIMPAN PERUBAHAN
                        </button>
                    )}
                </div>
            }
        >
            <Head title={`Permissions - ${school.nama_sekolah}`} />

            <div className="py-6 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch h-[calc(100vh-16rem)] min-h-[600px]">
                        
                        {/* Sidebar: Role List */}
                        <div className="lg:w-80 flex-shrink-0 h-full">
                            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] flex flex-col h-full overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-[2.5rem]">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Master Role</h3>
                                    <button
                                        onClick={syncRoles}
                                        className="w-10 h-10 bg-white hover:bg-indigo-600 hover:text-white text-gray-400 rounded-xl transition-all duration-300 shadow-sm border border-gray-100 flex items-center justify-center group"
                                        title="Sinkronkan Role dari Database Sekolah"
                                    >
                                        <svg className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Cari role..."
                                            className="w-full h-11 pl-11 pr-4 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 text-sm"
                                            value={searchRole}
                                            onChange={(e) => setSearchRole(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-3 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-3 pb-6 flex-grow overflow-y-auto scrollbar-thin">
                                    {filteredRoles.length > 0 ? (
                                        <div className="space-y-1">
                                            {filteredRoles.map(role => (
                                                <Link
                                                    key={role.id}
                                                    href={route('admin.permissions.show', [school.id, role.id])}
                                                    className={`flex items-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                                                        activeRole?.id === role.id 
                                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                                                        : 'hover:bg-indigo-50 text-gray-700'
                                                    }`}
                                                >
                                                    {activeRole?.id === role.id && (
                                                        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                                                    )}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300 ${
                                                        activeRole?.id === role.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-indigo-600'
                                                    }`}>
                                                        <span className="font-black text-sm uppercase">{role.name.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <p className="font-black text-sm truncate uppercase tracking-tight">{role.name}</p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${activeRole?.id === role.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                            Manage Access
                                                        </p>
                                                    </div>
                                                    <svg className={`h-4 w-4 ml-2 transition-all duration-300 ${activeRole?.id === role.id ? 'text-white translate-x-0 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-300">
                                            <p className="text-xs font-black uppercase tracking-widest">Role Kosong</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content: Grouped Permissions */}
                        <div className="flex-grow min-w-0 h-[calc(100vh-16rem)] min-h-[600px]">
                            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] flex flex-col overflow-hidden h-full">
                                {activeRole ? (
                                    <>
                                        <div className="p-8 bg-gray-50/30 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                     <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeRole.name}</h3>
                                                     <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">Active</span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-medium">Konfigurasi izin akses detail untuk role ini.</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="relative flex-grow">
                                                    <input
                                                        type="text"
                                                        placeholder="Filter hak akses..."
                                                        className="w-full pl-11 pr-4 h-12 rounded-2xl border-gray-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 text-sm"
                                                        value={searchPermission}
                                                        onChange={(e) => setSearchPermission(e.target.value)}
                                                    />
                                                    <div className="absolute left-4 top-3.5 text-gray-300">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-6.414-6.414A1 1 0 013 6.586V4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <label className="flex items-center cursor-pointer bg-white h-12 px-6 rounded-2xl border border-gray-100 hover:border-indigo-600 transition-all duration-300 group shadow-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                                                        checked={isAllChecked}
                                                        onChange={(e) => toggleAll(e.target.checked)}
                                                    />
                                                    <span className="ml-3 text-xs font-black text-gray-900 uppercase tracking-widest group-hover:text-indigo-600">Select All</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-8 lg:p-12 flex-grow overflow-y-auto space-y-16 scrollbar-thin">
                                            {Object.keys(filteredGroupedPermissions).length > 0 ? (
                                                Object.entries(filteredGroupedPermissions).map(([group, permissions]) => (
                                                    <div key={group} className="relative">
                                                        <div className="flex items-center justify-between mb-8">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 text-indigo-600 border border-indigo-100">
                                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 01-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase">{group}</h4>
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Section Settings</p>
                                                                </div>
                                                            </div>
                                                            <label className="flex items-center cursor-pointer bg-gray-50/50 hover:bg-white px-4 py-2 rounded-xl transition-all border border-transparent hover:border-gray-100">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                                    checked={isGroupAllChecked(permissions)}
                                                                    onChange={(e) => toggleGroup(permissions, e.target.checked)}
                                                                />
                                                                <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih Semua {group}</span>
                                                            </label>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                            {permissions.map(permission => (
                                                                <div 
                                                                    key={permission.id}
                                                                    onClick={() => togglePermission(permission.id)}
                                                                    className={`flex items-start p-5 rounded-3xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
                                                                        selectedPermissions.includes(permission.id)
                                                                        ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 text-white'
                                                                        : 'bg-white border-gray-100 hover:border-indigo-100 hover:bg-indigo-50'
                                                                    }`}
                                                                >
                                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300 ${
                                                                        selectedPermissions.includes(permission.id) ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'
                                                                    }`}>
                                                                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-grow min-w-0">
                                                                        <div className="flex justify-between items-start">
                                                                            <p className={`text-sm font-black leading-tight ${selectedPermissions.includes(permission.id) ? 'text-white' : 'text-gray-900 group-hover:text-indigo-900'}`}>
                                                                                {permission.name}
                                                                            </p>
                                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                                                                selectedPermissions.includes(permission.id) ? 'bg-white border-white' : 'border-gray-200 group-hover:border-indigo-500'
                                                                            }`}>
                                                                                {selectedPermissions.includes(permission.id) && (
                                                                                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${selectedPermissions.includes(permission.id) ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                                            {group} / Module
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center">
                                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                         <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    </div>
                                                    <h5 className="text-xl font-black text-gray-900 tracking-tight">Tidak Ada Hasil</h5>
                                                    <p className="text-gray-400 font-medium">Cari kata kunci lain untuk menemukan izin akses.</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                                        <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                                            <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-2xl opacity-10 animate-pulse"></div>
                                            <svg className="h-16 w-16 text-indigo-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Pilih Role Master</h4>
                                        <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                                            Silakan pilih salah satu role di sebelah kiri untuk mulai mengelola hak akses sistem dengan antarmuka premium.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 20px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}} />
        </AuthenticatedLayout>
    );
}