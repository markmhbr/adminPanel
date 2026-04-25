import { useState, useMemo, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PremiumAlert } from "@/Utils/alert";

export default function Manage({ school, schoolBaseUrl, roles, activeRole, groupedPermissions, activeRolePermissions, members, activeTab: serverTab }) {
    const [selectedPermissions, setSelectedPermissions] = useState(activeRolePermissions);
    const [restrictedPermissions, setRestrictedPermissions] = useState([]);
    const [searchRole, setSearchRole] = useState("");
    const [searchPermission, setSearchPermission] = useState("");
    const [searchStudent, setSearchStudent] = useState(new URLSearchParams(window.location.search).get('search') || "");
    const [processing, setProcessing] = useState(false);
    
    // Debounced Search Effect for Student Data
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = new URLSearchParams(window.location.search).get('search') || "";
            if (searchStudent !== currentSearch) {
                setProcessing(true);
                router.get(window.location.pathname, 
                    { 
                        tab: serverTab, 
                        search: searchStudent,
                        student_page: 1 // Reset to page 1 on search
                    }, 
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setProcessing(false)
                    }
                );
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchStudent, serverTab]);

    // Sync when props change or initial load
    useEffect(() => {
        setSelectedPermissions([...new Set(activeRolePermissions)]);
        
        // Extract restricted permissions from groupedPermissions
        const restrictedIds = [];
        Object.values(groupedPermissions).forEach(group => {
            group.forEach(p => {
                // Robust check for truthy value or string "1"
                if (p.is_restricted === true || p.is_restricted === 1 || p.is_restricted === "1") {
                    restrictedIds.push(p.id);
                }
            });
        });
        setRestrictedPermissions(restrictedIds);
    }, [activeRolePermissions, groupedPermissions]);

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
        setSelectedPermissions(prev => {
            const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
            return [...new Set(next)];
        });
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
            setSelectedPermissions([...new Set(allIds)]);
        } else {
            setSelectedPermissions([]);
        }
    };

    const toggleRestriction = (e, id) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setRestrictedPermissions(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleRestrictionGroup = (groupPermissions, checked) => {
        const ids = groupPermissions.map(p => p.id);
        if (checked) {
            setRestrictedPermissions(prev => [...new Set([...prev, ...ids])]);
        } else {
            setRestrictedPermissions(prev => prev.filter(p => !ids.includes(p)));
        }
    };

    const toggleRestrictionAll = (checked) => {
        if (checked) {
            const allIds = Object.values(groupedPermissions).flat().map(p => p.id);
            setRestrictedPermissions(allIds);
        } else {
            setRestrictedPermissions([]);
        }
    };

    const save = () => {
        setProcessing(true);
        router.post('/admin/permissions/save', {
            school_id: school.id,
            role_id: activeRole.id,
            data: selectedPermissions.map(id => ({ permission_id: id, role_id: activeRole.id })),
            restricted_permissions: restrictedPermissions
        }, {
            onSuccess: () => {
                setProcessing(false);
                PremiumAlert.success('Berhasil!', 'Izin akses dan status pembatasan telah berhasil disimpan.');
            },
            onError: (errors) => {
                setProcessing(false);
                const message = errors.connection || 'Terjadi kesalahan saat menyimpan perubahan.';
                PremiumAlert.error('Gagal', message);
            },
            onFinish: () => setProcessing(false)
        });
    };

    const switchTab = (tab) => {
        setProcessing(true);
        router.get(window.location.pathname, { tab: tab, search: searchStudent }, {
            onFinish: () => setProcessing(false),
            preserveState: true,
            preserveScroll: true
        });
    };

    const refreshData = () => {
        setProcessing(true);
        router.get(window.location.pathname, { refresh: 1, tab: serverTab, search: searchStudent }, {
            onSuccess: () => {
                setProcessing(false);
                PremiumAlert.success('Data Diperbarui', 'Data hak akses telah disinkronkan ulang dengan API sekolah.');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const goToPage = (page) => {
        setProcessing(true);
        router.get(window.location.pathname, 
            { 
                tab: serverTab, 
                search: searchStudent, 
                student_page: page 
            }, 
            {
                onFinish: () => setProcessing(false),
                preserveState: true,
                preserveScroll: true
            }
        );
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

    const isGroupRestrictionAllChecked = (groupPermissions) => {
        return groupPermissions.every(p => restrictedPermissions.includes(p.id));
    };

    const isAllChecked = useMemo(() => {
        const allPermissions = Object.values(groupedPermissions).flat();
        return allPermissions.length > 0 && allPermissions.every(p => selectedPermissions.includes(p.id));
    }, [groupedPermissions, selectedPermissions]);

    const isRestrictionAllChecked = useMemo(() => {
        const allPermissions = Object.values(groupedPermissions).flat();
        return allPermissions.length > 0 && allPermissions.every(p => restrictedPermissions.includes(p.id));
    }, [groupedPermissions, restrictedPermissions]);

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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={refreshData}
                            disabled={processing}
                            className={`flex items-center gap-2 px-6 py-4 bg-white text-indigo-600 border-2 border-indigo-50 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-gray-100 transition-all duration-300 group opacity-100 ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50 hover:border-indigo-100 hover:scale-105 active:scale-95'}`}
                            title="Bersihkan Cache & Refresh Data API"
                        >
                             <svg className={`h-4 w-4 ${processing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden sm:inline">Refresh Data</span>
                        </button>

                        {activeRole && (
                            <button
                                onClick={save}
                                disabled={processing}
                                className={`flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 transition-all duration-300 relative overflow-hidden group ${processing ? 'opacity-90 cursor-not-allowed px-10' : 'hover:scale-105 active:scale-95 hover:bg-indigo-700'}`}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span className="relative z-10">Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="relative z-10">Simpan Perubahan</span>
                                    </>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Permissions - ${school.nama_sekolah}`} />

            <div className="py-6 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Top Level Tabs - Premium Style from Index.jsx */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
                            <button
                                onClick={() => switchTab("permissions")}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${serverTab === 'permissions' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100 border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Hak Akses
                                </div>
                            </button>
                            <button
                                onClick={() => switchTab("students")}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${serverTab === 'students' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100 border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                    </svg>
                                    Data Siswa
                                </div>
                            </button>
                        </div>

                        {/* Search helper context */}
                        {serverTab === 'students' && (
                             <div className="text-right">
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global School Directory</p>
                                 <p className="text-xs font-bold text-gray-900">{members.total} Active Students Found</p>
                             </div>
                        )}
                    </div>

                    {serverTab === 'permissions' ? (
                        <div className="flex flex-col lg:flex-row gap-8 items-stretch h-[calc(100vh-22rem)] min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
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
                                                        data={{ tab: 'permissions' }}
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

                            {/* Center Panel: Grouped Permissions */}
                            <div className="flex-grow min-w-0 h-full">
                                <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] flex flex-col overflow-hidden h-full">
                                    {activeRole ? (
                                        <>
                                            <div className="p-8 lg:p-12 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{activeRole.name}</h3>
                                                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">Active</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 font-medium">Konfigurasi izin akses detail untuk role ini.</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 w-full xl:w-auto">
                                                    <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                                                        <input
                                                            type="text"
                                                            placeholder="Filter hak akses..."
                                                            className="w-full pl-10 pr-4 h-11 rounded-xl border-gray-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 text-sm shadow-sm"
                                                            value={searchPermission}
                                                            onChange={(e) => setSearchPermission(e.target.value)}
                                                        />
                                                        <div className="absolute left-3.5 top-3 text-gray-300">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-6.414-6.414A1 1 0 013 6.586V4z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm h-11 px-4 rounded-xl border border-gray-100 shadow-sm flex-shrink-0">
                                                        <label className="flex items-center cursor-pointer group whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-gray-200 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                                                                checked={isAllChecked}
                                                                onChange={(e) => toggleAll(e.target.checked)}
                                                            />
                                                            <span className="ml-2 text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:text-indigo-600">All</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer group whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-gray-200 text-red-600 focus:ring-red-600 transition-all cursor-pointer"
                                                                checked={isRestrictionAllChecked}
                                                                onChange={(e) => toggleRestrictionAll(e.target.checked)}
                                                            />
                                                            <span className="ml-2 text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:text-red-600">Restrict</span>
                                                        </label>
                                                    </div>
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
                                                                <div className="flex items-center gap-4">
                                                                    <label className="flex items-center cursor-pointer bg-gray-50/50 hover:bg-white px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-gray-100 group">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                                            checked={isGroupAllChecked(permissions)}
                                                                            onChange={(e) => toggleGroup(permissions, e.target.checked)}
                                                                        />
                                                                        <span className="ml-2 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-600">Pilih</span>
                                                                    </label>
                                                                    <label className="flex items-center cursor-pointer bg-gray-50/50 hover:bg-white px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-gray-100 group">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                                                                            checked={isGroupRestrictionAllChecked(permissions)}
                                                                            onChange={(e) => toggleRestrictionGroup(permissions, e.target.checked)}
                                                                        />
                                                                        <span className="ml-2 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-red-600">Batasi</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                                                {permissions.map(permission => (
                                                                    <div 
                                                                        key={permission.id}
                                                                        onClick={() => togglePermission(permission.id)}
                                                                        className={`flex items-start p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 ${
                                                                            selectedPermissions.includes(permission.id)
                                                                            ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 text-white'
                                                                            : 'bg-white border-gray-100 hover:border-indigo-100 hover:bg-indigo-50'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 transition-colors duration-300 ${
                                                                            selectedPermissions.includes(permission.id) ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm border border-gray-50'
                                                                        }`}>
                                                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="flex-grow min-w-0 pr-1">
                                                                            <p className={`text-[13px] font-bold leading-tight ${selectedPermissions.includes(permission.id) ? 'text-white' : 'text-gray-900 group-hover:text-indigo-900'}`}>
                                                                                {permission.name}
                                                                            </p>
                                                                            <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${selectedPermissions.includes(permission.id) ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                                                {group} / Module
                                                                            </p>
                                                                        </div>
                                                                        
                                                                        <div className="flex items-center gap-1.5 relative z-30" onClick={(e) => e.stopPropagation()}>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => toggleRestriction(e, permission.id)}
                                                                                className={`w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center border ${
                                                                                    restrictedPermissions.includes(permission.id) 
                                                                                    ? 'text-red-600 border-red-200 bg-red-50 animate-pulse' 
                                                                                    : 'text-gray-200 border-transparent hover:text-red-400 hover:border-red-100'
                                                                                }`}
                                                                                title={restrictedPermissions.includes(permission.id) ? "Akses Dibatasi" : "Batasi Akses"}
                                                                            >
                                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </button>
                                                                            <div 
                                                                                onClick={() => togglePermission(permission.id)}
                                                                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                                                                    selectedPermissions.includes(permission.id) 
                                                                                    ? 'bg-white border-white shadow-sm' 
                                                                                    : 'border-gray-200 group-hover:border-indigo-500'
                                                                                }`}
                                                                            >
                                                                                {selectedPermissions.includes(permission.id) && (
                                                                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
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

                                            {/* Member List for Active Role */}
                                            <div className="p-8 lg:p-12 border-t border-gray-100 bg-gray-50/20">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                                    <div>
                                                        <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase">Daftar Anggota</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Siswa dengan Role {activeRole.name}</p>
                                                    </div>
                                                    
                                                    <div className="relative w-full md:w-72">
                                                        <input
                                                            type="text"
                                                            placeholder="Cari anggota..."
                                                            className="w-full pl-10 pr-4 h-11 rounded-xl border-gray-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-300 text-xs shadow-sm"
                                                            value={searchStudent}
                                                            onChange={(e) => setSearchStudent(e.target.value)}
                                                        />
                                                        <div className="absolute left-3.5 top-3 text-gray-300">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {members.data.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                                        {members.data.map(student => (
                                                            <div key={student.id} className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center gap-5 group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 hover:-translate-y-0.5">
                                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white shadow-md flex-shrink-0">
                                                                    {student.foto ? (
                                                                        <img 
                                                                            src={`${schoolBaseUrl}/storage/${student.foto}`} 
                                                                            alt={student.display_name}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full translate-y-2 text-gray-200">
                                                                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow min-w-0">
                                                                    <p className="font-black text-gray-900 text-xs truncate uppercase tracking-tight">{student.display_name}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 truncate">{student.username}</p>
                                                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1">{student.nama_rombel || 'NO CLASS'}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-12 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                                                        <p className="text-gray-400 font-medium text-xs italic">Tidak ada anggota ditemukan.</p>
                                                    </div>
                                                )}

                                                {/* Mini Pagination for Members */}
                                                {members.last_page > 1 && (
                                                    <div className="flex justify-center items-center gap-2 mt-10">
                                                        <button
                                                            onClick={() => goToPage(members.current_page - 1)}
                                                            disabled={members.current_page === 1 || processing}
                                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                                                            {members.current_page} / {members.last_page}
                                                        </span>
                                                        <button
                                                            onClick={() => goToPage(members.current_page + 1)}
                                                            disabled={members.current_page === members.last_page || processing}
                                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center p-12 text-center animate-in fade-in duration-700">
                                            <div className="max-w-sm mx-auto">
                                                <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-100/50 shadow-xl shadow-indigo-100/50 animate-bounce">
                                                    <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Pilih Master Role</h4>
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                                                    Silakan pilih salah satu role di sebelah kiri untuk mulai mengatur hak akses spesifik.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* School-wide Student Card */}
                            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] flex flex-col overflow-hidden">
                                <div className="p-8 bg-gray-50/30 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Data Seluruh Siswa</h3>
                                            <span className="bg-indigo-100 text-indigo-600 text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">{members.total} Total</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">Daftar siswa yang terdaftar dalam unit sekolah ini.</p>
                                    </div>
                                    
                                    <div className="relative w-full md:w-80">
                                        <input
                                            type="text"
                                            placeholder="Cari nama, NISN, atau username..."
                                            className="w-full pl-11 pr-4 h-12 rounded-2xl border-gray-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-300 text-sm shadow-sm"
                                            value={searchStudent}
                                            onChange={(e) => setSearchStudent(e.target.value)}
                                        />
                                        <div className="absolute left-4 top-3.5 text-gray-300">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        {searchStudent && (
                                            <button 
                                                onClick={() => setSearchStudent("")}
                                                className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-500 bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-8 lg:p-10 min-h-[500px] relative">
                                    {/* Loading Overlay */}
                                    {processing && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-300 rounded-[2.5rem]">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Memproses Data...</p>
                                            </div>
                                        </div>
                                    )}

                                    {members.data.length > 0 ? (
                                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity duration-300 ${processing ? 'opacity-30' : 'opacity-100'}`}>
                                            {members.data.map(student => (
                                                <div key={student.id} className="bg-white border border-gray-50 rounded-[2rem] p-6 flex flex-col items-center text-center group hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 hover:-translate-y-1">
                                                    <div className="w-24 h-24 rounded-3xl overflow-hidden mb-5 bg-gray-50 border-4 border-white shadow-lg relative">
                                                        {student.foto ? (
                                                            <img 
                                                                src={`${schoolBaseUrl}?path=${student.foto}`} 
                                                                alt={student.display_name}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full translate-y-3 text-gray-200">
                                                                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl" />
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-sm leading-tight mb-3 uppercase tracking-tight line-clamp-2 px-2">{student.display_name}</h5>
                                                    <div className="space-y-2 w-full">
                                                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl inline-block border border-indigo-100/50">{student.nama_rombel || 'NO CLASS'}</p>
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{student.username}</p>
                                                            <p className="text-[10px] font-black text-slate-400">NISN: {student.nisn || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        !processing && (
                                            <div className="py-32 text-center animate-in fade-in duration-500">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                                     <svg className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <h5 className="text-xl font-black text-gray-900 tracking-tight">Siswa Tidak Ditemukan</h5>
                                                <p className="text-gray-400 font-medium italic mt-2">Coba kata kunci lain atau hapus pencarian.</p>
                                                <button 
                                                    onClick={() => setSearchStudent("")}
                                                    className="mt-6 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                                                >
                                                    Lihat Semua Siswa
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {/* Default Display when loading and no data yet */}
                                    {processing && members.data.length === 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="bg-white border border-gray-50 rounded-[2rem] p-6 flex flex-col items-center text-center animate-pulse">
                                                    <div className="w-24 h-24 rounded-3xl bg-gray-100 mb-5 shadow-inner" />
                                                    <div className="h-4 w-3/4 bg-gray-100 rounded-lg mb-3" />
                                                    <div className="h-3 w-1/2 bg-gray-50 rounded-lg mb-4" />
                                                    <div className="h-2 w-1/3 bg-gray-50 rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Premium Pagination */}
                                    {members.last_page > 1 && (
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-16 border-t border-gray-50 mt-12 px-2">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Halaman <span className="text-indigo-600">{members.current_page}</span> dari {members.last_page} — Total {members.total} Siswa
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => goToPage(members.current_page - 1)}
                                                    disabled={members.current_page === 1 || processing}
                                                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                                                >
                                                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                
                                                <div className="flex items-center gap-1.5 mx-2">
                                                    {[...Array(members.last_page)].map((_, i) => {
                                                        const p = i + 1;
                                                        // Only show first, last, current, and pages around current
                                                        if (p === 1 || p === members.last_page || (p >= members.current_page - 1 && p <= members.current_page + 1)) {
                                                            return (
                                                                <button
                                                                    key={p}
                                                                    onClick={() => goToPage(p)}
                                                                    disabled={processing}
                                                                    className={`w-11 h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all ${members.current_page === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110 z-10' : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-50 shadow-sm'}`}
                                                                >
                                                                    {p}
                                                                </button>
                                                            );
                                                        } else if (p === 2 || p === members.last_page - 1) {
                                                            return <span key={p} className="text-gray-300 mx-1">...</span>;
                                                        }
                                                        return null;
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => goToPage(members.current_page + 1)}
                                                    disabled={members.current_page === members.last_page || processing}
                                                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                                                >
                                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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