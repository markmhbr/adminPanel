import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center space-x-2 mt-8 px-4 py-3 sm:px-6">
            <div className="flex bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 p-1.5 shadow-sm shadow-indigo-100/50">
                {links.map((link, key) => (
                    <div key={key}>
                        {link.url === null ? (
                            <div
                                className="inline-flex items-center justify-center w-10 h-10 text-slate-400 text-[10px] font-black uppercase tracking-tighter opacity-50 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <Link
                                href={link.url}
                                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
                                    link.active 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 rotate-3 scale-110 z-10' 
                                        : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}
