import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { storeProfile } = usePage().props;

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1 space-y-6">
                        <Link href={route('landing')} className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white uppercase">{storeProfile?.store_name ?? 'SIMAKBUY'}</span>
                        </Link>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{storeProfile?.description ?? 'Platform penyedia solusi website profesional terbaik. Transformasi digital bisnis Anda dimulai dari sini dengan proses yang mudah, cepat, dan transparan.'}</p>
                        <div className="flex flex-wrap gap-4 relative z-20">
                            {storeProfile?.social_links?.map((link, index) => (
                                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm group/social">
                                    {link.platform === 'whatsapp' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.385 1.44 5.215 1.441 5.485 0 9.95-4.466 9.952-9.952.001-2.657-1.032-5.155-2.908-7.034s-4.375-2.912-7.033-2.913c-5.483 0-9.949 4.465-9.951 9.95-.001 1.86.513 3.67 1.488 5.237l-.991 3.62 3.712-.974zm9.367-12.285c-.279-.621-.573-.634-.84-.645-.218-.01-.469-.01-.72-.01s-.656.094-1.001.469c-.344.375-1.312 1.281-1.312 3.125s1.344 3.625 1.531 3.875c.188.25 2.656 4.062 6.438 5.688 3.141 1.35 3.781 1.08 4.438.938.656-.143 2.112-.862 2.409-1.693s.297-1.547.209-1.693c-.088-.147-.324-.234-.653-.401-.328-.167-1.938-.956-2.235-1.066-.297-.109-.512-.164-.72.164-.207.328-.802 1.01-.973 1.203-.172.193-.344.217-.674.051s-1.391-.512-2.65-1.637c-.98-.874-1.642-1.954-1.834-2.282-.191-.328-.02-.505.146-.67.148-.148.328-.39.492-.584.164-.193.218-.328.328-.547s.055-.421-.027-.587c-.082-.166-.72-1.734-1.002-2.355z"/></svg>}
                                    {link.platform === 'facebook' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82V14.706H9.692V11.05h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.656h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>}
                                    {link.platform === 'instagram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                                    {!['whatsapp', 'facebook', 'instagram'].includes(link.platform) && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103"/></svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Layanan</h4>
                        <ul className="space-y-4">
                            <li><a href="#alur" className="text-base font-medium text-slate-400 hover:text-white transition-all">Cara Beli & Alur</a></li>
                            <li><Link href={route('pages.kontak')} className="text-base font-medium text-slate-400 hover:text-white transition-all">Konsultasi Gratis</Link></li>
                            <li><a href="#katalog" className="text-base font-medium text-slate-400 hover:text-white transition-all">Katalog Website</a></li>
                        </ul>
                    </div>
 
                    <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Legalitas</h4>
                        <ul className="space-y-4">
                            <li><Link href={route('pages.terms')} className="text-base font-medium text-slate-400 hover:text-white transition-all">Syarat & Ketentuan</Link></li>
                            <li><Link href={route('pages.privacy')} className="text-base font-medium text-slate-400 hover:text-white transition-all">Kebijakan Privasi</Link></li>
                        </ul>
                    </div>
 
                    <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Kontak</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {storeProfile?.google_maps_url ? (
                                    <a href={storeProfile.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-slate-400 hover:text-white transition-all leading-relaxed decoration-blue-500/30 hover:underline underline-offset-8">
                                        {storeProfile?.address ?? 'Cianjur, Jawa Barat, Indonesia'}
                                    </a>
                                ) : (
                                    <span className="text-base font-medium text-slate-400 leading-relaxed">{storeProfile?.address ?? 'Cianjur, Jawa Barat, Indonesia'}</span>
                                )}
                            </li>
                            <li className="flex items-center gap-4">
                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <span className="text-base font-medium text-slate-400">{storeProfile?.contact_email ?? 'halo@simakbuy.com'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} Simak Buy. Partner Digital Terpercaya.</p>
                    <div className="flex items-center gap-6 grayscale opacity-40">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Midtrans.png" className="h-5" alt="Midtrans" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
