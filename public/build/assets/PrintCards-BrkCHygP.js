import{r as l,j as e,H as c}from"./app-C_Tc48UX.js";function g({school:p,schoolBaseUrl:o,selectedRombel:r,members:t}){l.useEffect(()=>{const i=setTimeout(()=>{window.print()},1e3);return()=>clearTimeout(i)},[]);const n=[];for(let i=0;i<t.length;i+=9)n.push(t.slice(i,i+9));return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:`Cetak Kartu - ${r?.nama_rombel||"Massal"}`}),e.jsx("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex flex-col items-center screen-only",children:e.jsxs("div",{className:"max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 mb-8",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-center gap-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2",children:"Siap Mencetak"}),e.jsxs("p",{className:"text-gray-500 dark:text-gray-400 font-medium",children:["Total ",e.jsx("span",{className:"text-indigo-600 font-black",children:t.length})," kartu siap dicetak untuk kelas ",e.jsx("span",{className:"text-indigo-600 font-black",children:r?.nama_rombel}),"."]})]}),e.jsx("button",{onClick:()=>window.print(),className:"px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 dark:shadow-none",children:"Cetak Sekarang"})]}),e.jsxs("div",{className:"mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50",children:[e.jsx("h3",{className:"text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4",children:"Tips Pencetakan:"}),e.jsxs("ul",{className:"space-y-3 text-xs font-bold text-indigo-700 dark:text-indigo-400/80",children:[e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Gunakan Browser Google Chrome untuk hasil terbaik."]}),e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Atur Margin di pengaturan cetak menjadi ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"None"'})," atau ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"Tanpa Margin"'}),"."]}),e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Pastikan opsi ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"Background Graphics"'})," dicentang."]})]})]})]})}),e.jsx("div",{className:"print-area",children:n.map((i,d)=>e.jsx("div",{className:"a4-page",children:i.map(a=>e.jsxs("div",{className:"id-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"school-logo",children:e.jsx("span",{className:"logo-placeholder",children:"S"})}),e.jsxs("div",{className:"header-labels",children:[e.jsx("span",{className:"label-primary",children:"KARTU IDENTITAS"}),e.jsx("span",{className:"label-secondary",children:"PESERTA DIDIK"})]})]}),e.jsxs("div",{className:"card-body",children:[e.jsx("div",{className:"photo-container",children:a.foto?e.jsx("img",{src:`${o}?path=${a.foto}`,alt:a.display_name,className:"photo",onError:s=>{s.target.onerror=null,s.target.src="https://ui-avatars.com/api/?name="+encodeURIComponent(a.display_name)+"&background=random"}}):e.jsx("div",{className:"photo-placeholder",children:e.jsx("svg",{className:"w-12 h-12 text-gray-300",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"})})})}),e.jsxs("div",{className:"student-info",children:[e.jsx("h2",{className:"name",children:a.display_name}),e.jsxs("p",{className:"nisn",children:["NISN: ",a.nisn]})]}),e.jsx("div",{className:"qr-container",children:e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${a.nisn||a.username}`,alt:"QR code",className:"qr-code"})})]}),e.jsx("div",{className:"card-footer",children:r?.nama_rombel})]},a.id))},d))}),e.jsx("style",{children:`
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
            `})]})}export{g as default};
