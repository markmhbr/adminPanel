import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('admin.profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-10">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mr-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Hapus Akun
                    </h2>
                </div>

                <p className="text-gray-400 font-medium ml-14">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                </p>
            </header>

            <div className="ml-14">
                <p className="mb-6 text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Tindakan ini tidak dapat dibatalkan. Harap unduh data atau informasi apa pun yang ingin Anda simpan sebelum menghapus akun.
                </p>

                <DangerButton onClick={confirmUserDeletion} className="px-10 h-14">
                    HAPUS AKUN SAYA
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10 bg-white/90 backdrop-blur-xl">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mr-4">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            Konfirmasi Penghapusan
                        </h2>
                    </div>

                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        Apakah Anda yakin ingin menghapus akun ini? Masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="mb-10">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi Konfirmasi"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full h-14"
                            isFocused
                            placeholder="Masukkan sandi Anda"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <SecondaryButton onClick={closeModal} className="h-14 px-8">
                            BATALKAN
                        </SecondaryButton>

                        <DangerButton className="h-14 px-8" disabled={processing}>
                            YA, HAPUS PERMANEN
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
