import{r as f,j as e,H as u}from"./app-CPl095Tb.js";function w({school:b,remoteSchool:n,schoolBaseUrl:s,selectedRombel:g,members:m,activeTab:p}){f.useEffect(()=>{const o=setTimeout(()=>{const i=document.querySelectorAll(".print-area img"),r=i.length;let h=0;if(r===0){window.print();return}const l=()=>{h++,h>=r&&setTimeout(()=>window.print(),1e3)};i.forEach(c=>{c.complete?l():(c.addEventListener("load",l),c.addEventListener("error",l))})},3e3),a=setTimeout(()=>{window.print()},15e3);return()=>{clearTimeout(o),clearTimeout(a)}},[]);const d=m.filter(t=>t.display_name||t.username),x=[];for(let t=0;t<d.length;t+=9)x.push(d.slice(t,t+9));return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:`Cetak Kartu - ${g?.nama_rombel||"Massal"}`}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap",rel:"stylesheet"}),e.jsx("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex flex-col items-center screen-only",children:e.jsxs("div",{className:"max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 mb-8",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-center gap-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2",children:"Siap Mencetak"}),e.jsxs("p",{className:"text-gray-500 dark:text-gray-400 font-medium",children:["Total ",e.jsx("span",{className:"text-indigo-600 font-black",children:d.length})," kartu siap dicetak untuk kelas ",e.jsx("span",{className:"text-indigo-600 font-black",children:g?.nama_rombel}),"."]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-gray-50 active:scale-95 shadow-sm",children:"Refresh"}),e.jsx("button",{onClick:()=>window.print(),className:"px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 dark:shadow-none",children:"Cetak Sekarang"})]})]}),e.jsxs("div",{className:"mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50",children:[e.jsx("h3",{className:"text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4",children:"Tips Pencetakan:"}),e.jsxs("ul",{className:"space-y-3 text-xs font-bold text-indigo-700 dark:text-indigo-400/80",children:[e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Gunakan Browser Google Chrome untuk hasil terbaik."]}),e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Atur Margin di pengaturan cetak menjadi ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"None"'})," atau ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"Tanpa Margin"'}),"."]}),e.jsxs("li",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-400"}),"Pastikan opsi ",e.jsx("span",{className:"text-indigo-900 dark:text-indigo-200",children:'"Background Graphics"'})," dicentang."]})]})]})]})}),e.jsx("div",{className:"print-area",children:x.map((t,o)=>e.jsx("div",{className:`a4-page ${p==="gtks"?"gtk-grid":""}`,children:t.map(a=>{const i=p==="gtks",r=i?n?.background_kartu:n?.background_kartu_siswa;return e.jsxs("div",{className:`id-card-container ${i?"gtk-card":""}`,style:{backgroundImage:r?`url('${s}?path=${r}')`:void 0,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsxs("div",{className:"header-section",children:[n?.logo?e.jsx("img",{src:`${s}?path=${n.logo}`,className:"header-logo",alt:"Logo"}):e.jsx("div",{className:"header-logo",style:{background:"#eee",borderRadius:"50%"}}),!i&&e.jsx("div",{className:"header-text",children:"KARTU PESERTA DIDIK"})]}),e.jsxs("div",{className:"content-wrapper",children:[e.jsx("div",{className:"photo-frame",children:a.foto?e.jsx("img",{src:`${s}?path=${a.foto}`,className:"profile-img",alt:"Foto",loading:"eager"}):e.jsx("div",{className:"profile-img-placeholder",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"40",height:"40",viewBox:"0 0 24 24",style:{fill:"#ccc"},children:e.jsx("path",{d:"M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"})})})}),e.jsx("div",{className:"user-name",children:a.display_name}),e.jsx("div",{className:"id-text",children:i?e.jsx(e.Fragment,{children:a.nip&&a.nip!=="-"?`NIP: ${a.nip}`:a.nuptk&&a.nuptk!=="-"?`NUPTK: ${a.nuptk}`:a.nik&&a.nik!=="-"?`NIK: ${a.nik}`:"-"}):`NISN: ${a.sub_detail||"-"}`}),e.jsx("div",{className:"qr-box",children:e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${a.qr_token||a.sub_detail||a.username||"NA"}`,alt:"QR code",className:"qr-img",loading:"eager"})})]})]},a.id)})},o))}),e.jsx("style",{children:`
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
                    height: 300mm; 
                    background: white;
                    margin: 0 auto 10mm auto;
                    padding: 10mm;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: repeat(3, 1fr);    
                    gap: 4mm;
                    align-content: start;
                    justify-content: center;
                    page-break-after: always;
                    position: relative;
                    font-family: 'Public Sans', sans-serif;
                }

                .a4-page.gtk-grid {
                    width: 210mm;
                    min-height: 300mm;
                    gap: 8mm;
                    grid-template-rows: auto;
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
                    .a4-page.gtk-grid {
                        height: auto;
                        min-height: auto;
                        overflow: visible;
                    }
                }

                /* --- CONTAINER KARTU --- */
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
                    background-image: radial-gradient(#696cff 0.5px, transparent 0.5px), radial-gradient(#696cff 0.5px, #fff 0.5px);
                    background-size: 15px 15px;
                }

                .id-card-container.gtk-card {
                    width: 56mm;
                    height: 88mm;
                    border: 1px dashed #ccc;
                }

                /* --- HEADER --- */
                .header-section {
                    width: 100%; padding: 5px 8px; display: flex; align-items: center;
                    gap: 6px; background: rgba(255,255,255,0.95) !important;
                    border-bottom: 0.5px solid #eee; z-index: 5; height: 45px; flex-shrink: 0;
                }
                .gtk-card .header-section {
                    background: transparent !important;
                    border-bottom: none;
                    height: auto;
                }
                .header-logo { width: 35px; height: 35px; object-fit: contain; padding: 4px;}
                .gtk-card .header-logo {
                    width: 40px;
                    height: 40px;
                    margin-top: 25px;
                    margin-left: 25px;
                }
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
                .gtk-card .user-name {
                    font-size: 13px;
                    margin-bottom: 3px;
                }

                /* ID TEXT */
                .id-text {
                    font-size: 10px; color: #ffffff; font-weight: 600;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.9); opacity: 0.9;
                    margin-bottom: 5px; text-align: center;
                }
                .gtk-card .id-text {
                    margin-bottom: 6px;
                }

                /* QR CODE */
                .qr-box {
                    padding: 3px; background: white; border-radius: 4px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: block; line-height: 0;
                }
                .gtk-card .qr-box {
                    padding: 4px;
                    box-shadow: 0 5px 8px rgba(0,0,0,0.5);
                }
                .qr-img {
                    width: 75px;
                    height: 75px;
                }
            `})]})}export{w as default};
