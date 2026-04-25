import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { PremiumAlert } from '@/Utils/alert';

export default function Index({ auth, profile }) {

    const { data: profileData, setData: setProfileData, post: postProfile, processing: profileProcessing } = useForm({
        store_name: profile?.store_name || '',
        landing_title: profile?.landing_title || '',
        landing_subtitle: profile?.landing_subtitle || '',
        address: profile?.address || '',
        google_maps_url: profile?.google_maps_url || '',
        social_links: profile?.social_links || [],
    });

    const getMapUrl = (input) => {
        if (!input) return null;
        
        // If it's an iframe embed code
        const match = input.match(/src="([^"]+)"/);
        if (match) return match[1];
        
        // If it's already a URL
        if (input.startsWith('http')) return input;
        
        // Treat as search query
        return `https://maps.google.com/maps?q=${encodeURIComponent(input)}&output=embed`;
    };

    const submitProfile = (e) => {
        e.preventDefault();
        postProfile(route('admin.interface.updateProfile'), {
            onSuccess: () => PremiumAlert.success('Berhasil', 'Pengaturan antarmuka berhasil diperbarui')
        });
    };

    const addSocialLink = () => {
        setProfileData('social_links', [...profileData.social_links, { platform: '', url: '' }]);
    };

    const removeSocialLink = (index) => {
        const newLinks = [...profileData.social_links];
        newLinks.splice(index, 1);
        setProfileData('social_links', newLinks);
    };

    const updateSocialLink = (index, field, value) => {
        const newLinks = [...profileData.social_links];
        newLinks[index][field] = value;
        setProfileData('social_links', newLinks);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black leading-tight text-slate-900 tracking-tight">Manajemen Antarmuka</h2>
                        <p className="text-slate-400 font-bold text-xs mt-1 tracking-widest">Kustomisasi tampilan dan informasi landing page Anda.</p>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Interface | Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                            <form onSubmit={submitProfile} className="p-10 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 tracking-widest mb-6 border-b border-slate-50 pb-2">Informasi Dasar</h3>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-widest mb-2">Nama Toko/Sekolah</label>
                                            <input 
                                                type="text" 
                                                value={profileData.store_name}
                                                onChange={e => setProfileData('store_name', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                                placeholder="Contoh: SMA Negeri 1 Jakarta atau Toko Berkah"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-widest mb-2">Judul Landing Page</label>
                                            <input 
                                                type="text" 
                                                value={profileData.landing_title}
                                                onChange={e => setProfileData('landing_title', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                                placeholder="Contoh: Solusi Digital Terbaik untuk Masa Depan Sekolah"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-widest mb-2">Subjudul Landing Page</label>
                                            <textarea 
                                                value={profileData.landing_subtitle}
                                                onChange={e => setProfileData('landing_subtitle', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all h-32"
                                                placeholder="Berikan deskripsi singkat tentang layanan atau value proposition Anda..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 tracking-widest mb-6 border-b border-slate-50 pb-2">Lokasi & Kontak</h3>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-widest mb-2">Alamat Lengkap</label>
                                            <textarea 
                                                value={profileData.address}
                                                onChange={e => setProfileData('address', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all h-32"
                                                placeholder="Jl. Merdeka No. 123, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 tracking-widest mb-2">Cari Lokasi / Google Maps</label>
                                            <input 
                                                type="text" 
                                                value={profileData.google_maps_url}
                                                onChange={e => setProfileData('google_maps_url', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                                placeholder="Ketik nama daerah atau tempel kode embed/link Google Maps"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Integrated Maps Preview */}
                                {profileData.google_maps_url && (
                                    <div className="mt-4 rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white shadow-2xl shadow-slate-200/30 h-[350px] relative group border-8 border-white">
                                        <iframe 
                                            src={getMapUrl(profileData.google_maps_url)} 
                                            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000" 
                                            allowFullScreen="" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                        <div className="absolute top-6 left-6 py-2.5 px-5 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-200/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                                                <p className="text-[10px] font-black text-slate-900 tracking-widest">Pratinjau Lokasi Langsung</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-black text-slate-400 tracking-widest">Media Sosial</h3>
                                        <button 
                                            type="button" 
                                            onClick={addSocialLink}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                                        >
                                            + Tambah Baris
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {profileData.social_links.map((link, index) => (
                                            <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-2xl group">
                                                <div className="flex-1 space-y-2">
                                                    <label className="block text-[9px] font-black text-slate-400 tracking-widest">Platform</label>
                                                    <select 
                                                        value={link.platform}
                                                        onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                                    >
                                                        <option value="">Pilih Platform</option>
                                                        <option value="whatsapp">WhatsApp</option>
                                                        <option value="instagram">Instagram</option>
                                                        <option value="facebook">Facebook</option>
                                                        <option value="twitter">Twitter</option>
                                                        <option value="tiktok">TikTok</option>
                                                        <option value="youtube">YouTube</option>
                                                        <option value="linkedin">LinkedIn</option>
                                                    </select>
                                                </div>
                                                <div className="flex-[2] space-y-2">
                                                    <label className="block text-[9px] font-black text-slate-400 tracking-widest">URL / Nomor</label>
                                                    <input 
                                                        type="text" 
                                                        value={link.url}
                                                        onChange={e => updateSocialLink(index, 'url', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                                        placeholder="Contoh: https://wa.me/628123456789 atau @username"
                                                    />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeSocialLink(index)}
                                                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8">
                                    <button 
                                        type="submit" 
                                        disabled={profileProcessing}
                                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            </div>
        </AuthenticatedLayout>
    );
}
