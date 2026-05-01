import { Head } from "@inertiajs/react";
import { useEffect } from "react";

export default function PrintCards({ school, schoolBaseUrl, selectedRombel, members }) {
    
    // Ensure all images are loaded before printing
    useEffect(() => {
        const checkAllImagesLoaded = () => {
            const images = document.querySelectorAll('.print-area img');
            const totalImages = images.length;
            let loadedCount = 0;

            if (totalImages === 0) {
                window.print();
                return;
            }

            const onImageLoaded = () => {
                loadedCount++;
                if (loadedCount >= totalImages) {
                    // Small additional delay to ensure layout is stable
                    setTimeout(() => window.print(), 500);
                }
            };

            images.forEach(img => {
                if (img.complete) {
                    onImageLoaded();
                } else {
                    img.addEventListener('load', onImageLoaded);
                    img.addEventListener('error', onImageLoaded); // Continue even if some images fail
                }
            });
        };

        // Give React a moment to render the DOM before checking images
        const timer = setTimeout(checkAllImagesLoaded, 2000);
        
        // Final fallback to ensure the print dialog opens eventually
        const fallback = setTimeout(() => {
            window.print();
        }, 10000);

        return () => {
            clearTimeout(timer);
            clearTimeout(fallback);
        };
    }, []);

    // Filter out invalid members and chunk into arrays of 9
    const validMembers = members.filter(m => m.display_name || m.username);
    const chunkedMembers = [];
    for (let i = 0; i < validMembers.length; i += 9) {
        chunkedMembers.push(validMembers.slice(i, i + 9));
    }

    return (
        <>
            <Head title={`Cetak Kartu - ${selectedRombel?.nama_rombel || 'Massal'}`} />
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex flex-col items-center screen-only">
                <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">
                                Siap Mencetak
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                Total <span className="text-indigo-600 font-black">{validMembers.length}</span> kartu siap dicetak untuk kelas <span className="text-indigo-600 font-black">{selectedRombel?.nama_rombel}</span>.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                             <button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
                            >
                                Refresh
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 dark:shadow-none"
                            >
                                Cetak Sekarang
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                        <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4">Tips Pencetakan:</h3>
                        <ul className="space-y-3 text-xs font-bold text-indigo-700 dark:text-indigo-400/80">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                Gunakan Browser Google Chrome untuk hasil terbaik.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                Atur Margin di pengaturan cetak menjadi <span className="text-indigo-900 dark:text-indigo-200">"None"</span> atau <span className="text-indigo-900 dark:text-indigo-200">"Tanpa Margin"</span>.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                Pastikan opsi <span className="text-indigo-900 dark:text-indigo-200">"Background Graphics"</span> dicentang.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="print-area">
                {chunkedMembers.map((pageMembers, pageIdx) => (
                    <div key={pageIdx} className="a4-page">
                        {pageMembers.map((student) => (
                            <div key={student.id} className="id-card">
                                <div className="card-header">
                                    <div className="school-logo">
                                        <span className="logo-placeholder">S</span>
                                    </div>
                                    <div className="header-labels">
                                        <span className="label-primary">KARTU IDENTITAS</span>
                                        <span className="label-secondary">PESERTA DIDIK</span>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <div className="photo-container">
                                        {student.foto ? (
                                            <img 
                                                src={`${schoolBaseUrl}?path=${student.foto}`} 
                                                alt={student.display_name}
                                                className="photo"
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className="photo-placeholder">
                                                <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="student-info">
                                        <h2 className="name">{student.display_name}</h2>
                                        <p className="nisn">NISN: {student.nisn || '-'}</p>
                                    </div>
                                    
                                    <div className="qr-container">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.nisn || student.username || 'NA'}`} 
                                            alt="QR code"
                                            className="qr-code" 
                                            loading="eager"
                                        />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    {selectedRombel?.nama_rombel}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <style>{`
                @media screen {
                    .print-area { display: none !important; }
                }
                @media print {
                    .screen-only { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .print-area { display: block !important; }
                    .a4-page {
                        width: 210mm;
                        height: 297mm;
                        padding: 10mm;
                        margin: 0;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: repeat(3, 1fr);
                        gap: 2mm;
                        page-break-after: always;
                        background: white !important;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }

                .id-card {
                    width: 58mm;
                    height: 91mm;
                    background: white;
                    border: 0.5px solid #eee;
                    border-radius: 8px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    background-image: radial-gradient(#4f46e5 0.5px, transparent 0.5px), radial-gradient(#4f46e5 0.5px, #fff 0.5px);
                    background-size: 15px 15px;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact;
                }

                .card-header {
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.95) !important;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-bottom: 0.5px solid #eee;
                    height: 48px;
                }

                .school-logo {
                    width: 32px;
                    height: 32px;
                    background: #4f46e5;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .logo-placeholder {
                    color: white;
                    font-weight: 900;
                    font-size: 16px;
                }

                .header-labels {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.1;
                }

                .label-primary {
                    font-size: 10px;
                    font-weight: 800;
                    color: #1e1b4b;
                    letter-spacing: 0.05em;
                }

                .label-secondary {
                    font-size: 8px;
                    font-weight: 700;
                    color: #4f46e5;
                }

                .card-body {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    z-index: 2;
                }

                .photo-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    overflow: hidden;
                    margin-bottom: 10px;
                    background: #f8fafc;
                    flex-shrink: 0;
                }

                .photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .photo-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                }

                .student-info {
                    text-align: center;
                    margin-bottom: 8px;
                    width: 100%;
                }

                .name {
                    font-size: 11px;
                    font-weight: 900;
                    color: #fff;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                    line-height: 1.2;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    padding: 0 4px;
                }

                .nisn {
                    font-size: 8px;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }

                .qr-container {
                    background: white;
                    padding: 4px;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .qr-code {
                    width: 60px;
                    height: 60px;
                    display: block;
                }

                .card-footer {
                    font-size: 8px;
                    font-weight: 800;
                    padding: 4px;
                    background: rgba(255, 255, 255, 0.9) !important;
                    text-align: center;
                    text-transform: uppercase;
                    color: #1e1b4b;
                    letter-spacing: 0.1em;
                    border-top: 0.5px solid #eee;
                }
            `}</style>
        </>
    );
}
