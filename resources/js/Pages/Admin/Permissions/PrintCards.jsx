import { Head } from "@inertiajs/react";
import { useEffect } from "react";

export default function PrintCards({ school, remoteSchool, schoolBaseUrl, selectedRombel, members, activeTab }) {
    
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
                    setTimeout(() => window.print(), 1000);
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
        const timer = setTimeout(checkAllImagesLoaded, 3000);
        
        // Final fallback to ensure the print dialog opens eventually
        const fallback = setTimeout(() => {
            window.print();
        }, 15000);

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
            
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

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
                        {pageMembers.map((member) => {
                            const isGtk = activeTab === 'gtks';
                            const bgImage = isGtk 
                                ? remoteSchool?.background_kartu 
                                : remoteSchool?.background_kartu_siswa;
                            
                            return (
                                <div key={member.id} 
                                    className="id-card-container"
                                    style={{
                                        backgroundImage: bgImage 
                                            ? `url('${schoolBaseUrl}?path=${bgImage}')` 
                                            : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {/* HEADER */}
                                    <div className="header-section">
                                        {remoteSchool?.logo ? (
                                            <img src={`${schoolBaseUrl}?path=${remoteSchool.logo}`} className="header-logo" alt="Logo" />
                                        ) : (
                                            <div style={{ width: '30px', height: '30px', background: '#eee', borderRadius: '50%' }}></div>
                                        )}
                                        <div className="header-text">{isGtk ? 'KARTU IDENTITAS GTK' : 'KARTU PESERTA DIDIK'}</div>
                                    </div>

                                    <div className="content-wrapper">
                                        {/* PHOTO */}
                                        <div className="photo-frame">
                                            {member.foto ? (
                                                <img 
                                                    src={`${schoolBaseUrl}?path=${member.foto}`} 
                                                    className="profile-img" 
                                                    alt="Foto"
                                                    loading="eager"
                                                />
                                            ) : (
                                                <div className="profile-img-placeholder">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style={{ fill: '#ccc' }}>
                                                        <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* NAME */}
                                        <div className="user-name">{member.display_name}</div>

                                        {/* DETAIL (NISN or NIP) */}
                                        <div className="id-text">{isGtk ? 'NIP' : 'NISN'}: {member.sub_detail || '-'}</div>

                                        {/* QR CODE */}
                                        <div className="qr-box">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${member.qr_token || member.sub_detail || member.username || 'NA'}`} 
                                                alt="QR code"
                                                className="qr-img" 
                                                loading="eager"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <style>{`
                /* --- RESET & BASIC --- */
                * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                @media screen {
                    .print-area { 
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background-color: #555;
                        padding-top: 20px;
                        padding-bottom: 20px;
                    }
                }

                @media print {
                    .screen-only { display: none !important; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    .print-area { display: block !important; padding: 0 !important; }
                    @page { size: A4; margin: 0; }
                }

                /* --- A4 PAGE SETUP --- */
                .a4-page {
                    width: 200mm;
                    height: 300mm; /* Force A4 height */
                    background: white;
                    margin: 0 auto 10mm auto;
                    padding: 10mm;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); /* 3 Columns */
                    grid-template-rows: repeat(3, 1fr);    /* 3 Rows */
                    gap: 4mm;
                    align-content: start;
                    justify-content: center;
                    page-break-after: always;
                    position: relative;
                    font-family: 'Public Sans', sans-serif;
                }

                .a4-page:last-child {
                    page-break-after: auto;
                }

                @media print {
                    .a4-page {
                        margin: 0;
                        box-shadow: none;
                        height: 297mm;
                        overflow: hidden;
                    }
                }

                /* --- CONTAINER KARTU (UKURAN ID-1) --- */
                .id-card-container {
                    width: 58mm;
                    height: 91mm;
                    background-color: #fff;
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                    /* Default Pattern */
                    background-image: radial-gradient(#696cff 0.5px, transparent 0.5px), radial-gradient(#696cff 0.5px, #fff 0.5px);
                    background-size: 15px 15px;
                }

                /* --- HEADER --- */
                .header-section {
                    width: 100%; padding: 5px 8px; display: flex; align-items: center;
                    gap: 6px; background: rgba(255,255,255,0.95) !important;
                    border-bottom: 0.5px solid #eee; z-index: 5; height: 45px; flex-shrink: 0;
                }
                .header-logo { width: 35px; height: 35px; object-fit: contain; padding: 4px;}
                .header-text {
                    flex: 1; font-size: 12px; font-weight: 900; color: #002b5c;
                    text-transform: uppercase; line-height: 1; text-align: left;
                    padding: 4px;
                }

                /* --- CONTENT WRAPPER --- */
                .content-wrapper {
                    flex-grow: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; padding: 5px;
                    z-index: 2; margin-top: -2px;
                }

                /* PHOTO */
                .photo-frame {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    border: 4px solid #fff;
                    margin-bottom: 6px;
                    box-shadow: 0 4px 7px rgba(0,0,0,0.2);
                    background: #fff;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .profile-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 50% 20%;
                }
                .profile-img-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e0e0e0;
                }

                /* NAME */
                .user-name {
                    font-size: 12px; font-weight: 800; color: #ffffff;
                    text-transform: uppercase; margin-bottom: 2px; line-height: 1.1;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: center;
                    max-width: 100%; padding: 0 2px;
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }

                /* NISN */
                .id-text {
                    font-size: 10px; color: #ffffff; font-weight: 600;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.9); opacity: 0.9;
                    margin-bottom: 5px; text-align: center;
                }

                /* QR CODE */
                .qr-box {
                    padding: 3px; background: white; border-radius: 4px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: block; line-height: 0;
                }
                .qr-img {
                    width: 75px;
                    height: 75px;
                }
            `}</style>
        </>
    );
}
