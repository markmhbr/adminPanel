import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { PremiumAlert } from '@/Utils/alert';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            school_name: user.school_name || '',
            npsn: user.npsn || '',
            phone_number: user.phone_number || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => PremiumAlert.success('Profil Diperbarui', 'Informasi profil Anda telah berhasil diperbarui dengan aman.')
        });
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Informasi Profil
                    </h2>
                </div>

                <p className="text-gray-400 font-medium ml-14">
                    Perbarui informasi profil akun dan alamat email sekolah Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-8 max-w-4xl ml-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap Koordinator" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full h-14"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                            placeholder="Contoh: Admin Utama"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full h-14"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="admin@sekolah.id"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="school_name" value="Nama Sekolah" />
                        <TextInput
                            id="school_name"
                            className="mt-1 block w-full h-14"
                            value={data.school_name}
                            onChange={(e) => setData('school_name', e.target.value)}
                            required
                            placeholder="Contoh: SMK Negeri 1 Jakarta"
                        />
                        <InputError className="mt-2" message={errors.school_name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="npsn" value="NPSN" />
                        <TextInput
                            id="npsn"
                            className="mt-1 block w-full h-14"
                            value={data.npsn}
                            onChange={(e) => setData('npsn', e.target.value)}
                            required
                            placeholder="Contoh: 12345678"
                        />
                        <InputError className="mt-2" message={errors.npsn} />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone_number" value="Nomor WhatsApp" />
                        <TextInput
                            id="phone_number"
                            className="mt-1 block w-full h-14"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            required
                            placeholder="Contoh: 081234567890"
                        />
                        <InputError className="mt-2" message={errors.phone_number} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <p className="text-sm font-bold text-amber-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Alamat email Anda belum diverifikasi.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 text-sm text-indigo-600 font-black hover:text-black transition-colors"
                        >
                            Klik di sini untuk mengirim ulang email verifikasi.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-green-600">
                                Link verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <PrimaryButton className="h-14 px-10" disabled={processing}>
                        SIMPAN PERUBAHAN
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-4"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0 -translate-x-4"
                    >
                        <p className="text-sm font-black text-green-600 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            BERHASIL DISIMPAN
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
