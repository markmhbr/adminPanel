import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const PremiumAlert = {
    success: (title, text) => {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'success',
            background: '#ffffff',
            confirmButtonText: 'OKAY',
            customClass: {
                popup: 'rounded-[2rem] border-none shadow-2xl p-10',
                title: 'text-3xl font-black text-gray-900 mb-2',
                htmlContainer: 'text-gray-500 font-medium',
                confirmButton: 'rounded-2xl px-10 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-200 shadow-lg shadow-indigo-100 bg-indigo-600 text-white font-sans'
            },
            buttonsStyling: false
        });
    },
    confirm: (title, text) => {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'YA, LANJUTKAN',
            cancelButtonText: 'BATALKAN',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[2rem] border-none shadow-2xl p-10 font-sans',
                title: 'text-3xl font-black text-gray-900 mb-2',
                htmlContainer: 'text-gray-500 font-medium',
                confirmButton: 'rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-sm mr-4 hover:scale-105 transition-transform duration-200 shadow-lg shadow-indigo-100 bg-indigo-600 text-white font-sans',
                cancelButton: 'rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-200 shadow-lg shadow-gray-100 bg-gray-100 text-gray-500 font-sans'
            },
            buttonsStyling: false
        });
    }
};
